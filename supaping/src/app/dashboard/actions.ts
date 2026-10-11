"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AddDatabaseInput = {
  name: string;
  projectUrl: string;
  publishableKey: string;
  description: string;
};

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_URL_LENGTH = 255;
const MAX_KEY_LENGTH = 4096;

function requireText(
  value: unknown,
  field: string,
  maxLength: number,
  required: boolean
): string {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${field}.`);
  }

  const text = value.trim();

  if (required && !text) {
    throw new Error(`Enter ${field}.`);
  }

  if (text.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer.`);
  }

  // Reject control characters rather than storing them in user input.
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error(`${field} contains invalid characters.`);
  }

  return text;
}

function validateProjectUrl(value: unknown): string {
  const projectUrl = requireText(
    value,
    "a Supabase project URL",
    MAX_URL_LENGTH,
    true
  );

  let url: URL;

  try {
    url = new URL(projectUrl);
  } catch {
    throw new Error(
      "Enter a valid URL, such as https://your-project.supabase.co."
    );
  }

  // Accept only the project root. The ping endpoint is added by SupaPing.
  // A single trailing slash is accepted and removed by URL normalisation.
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    url.hostname !== url.hostname.toLowerCase() ||
    !/^[a-z0-9]{20}\.supabase\.co$/.test(url.hostname)
  ) {
    throw new Error(
      "Enter your Supabase project root URL only, e.g. https://abcdefghijklmnopqrst.supabase.co. Do not include /rest/v1 or another path."
    );
  }

  return `https://${url.hostname}`;
}

function validatePublishableKey(value: unknown): string {
  const key = requireText(
    value,
    "a publishable or anon key",
    MAX_KEY_LENGTH,
    true
  );

  if (/\s/.test(key)) {
    throw new Error("The key must not contain whitespace.");
  }

  // Reject Supabase secret-key formats. Also inspect legacy JWT anon keys
  // so a service_role JWT cannot be submitted in their place.
  if (/^sb_secret_/i.test(key)) {
    throw new Error(
      "Secret keys are not supported. Use a publishable key or legacy anon key."
    );
  }

  if (key.split(".").length === 3) {
    try {
      const payload = JSON.parse(
        Buffer.from(key.split(".")[1], "base64url").toString("utf8")
      ) as { role?: unknown };

      if (payload.role === "service_role") {
        throw new Error(
          "Service-role keys are not supported. Use a publishable key or legacy anon key."
        );
      }
    } catch (error) {
      // Preserve our explicit service-role rejection.
      if (
        error instanceof Error &&
        error.message.startsWith("Service-role keys")
      ) {
        throw error;
      }

      // Don't require every accepted key to be a decodable JWT:
      // current publishable keys are not JWTs.
    }
  }

  return key;
}

function validateDatabaseInput(values: unknown) {
  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error("Check your details and try again.");
  }

  const input = values as Record<string, unknown>;

  const name = requireText(
    input.name,
    "a database name",
    MAX_NAME_LENGTH,
    true
  );

  const description = requireText(
    input.description,
    "the description",
    MAX_DESCRIPTION_LENGTH,
    false
  );

  const projectUrl = validateProjectUrl(input.projectUrl);
  const publishableKey = validatePublishableKey(input.publishableKey);

  return {
    name,
    description,
    projectUrl,
    publishableKey,
  };
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export async function addDatabase(values: AddDatabaseInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to add a database.");
  }

  const input = validateDatabaseInput(values);

  const { data, error } = await supabase.rpc("register_database", {
    p_name: input.name,
    p_description: input.description,
    p_project_url: input.projectUrl,
    p_publishable_key: input.publishableKey,
  });

  if (error) {
    // Log only the error code; never log keys or project URLs.
    console.error("Failed to register SupaPing database:", error.code);

    if (error.code === "P0001") {
      switch (error.message) {
        case "DATABASE_LIMIT_REACHED":
          throw new Error(
            "You've reached your database limit. Upgrade to Pro to register up to 100 databases."
          );
        case "PROFILE_NOT_FOUND":
          throw new Error(
            "Your account profile could not be found. Please contact support."
          );
        case "AUTH_REQUIRED":
          throw new Error(
            "Your session has expired. Please sign in again."
          );
      }
    }

    if (error.code === "23505") {
      throw new Error("This database has already been registered.");
    }

    throw new Error("We couldn't save this database. Please try again.");
  }

  revalidatePath("/dashboard");

  return { id: data as string };
}

export async function deleteDatabase(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to delete a database.");
  }

  if (!isUuid(id)) {
    throw new Error("Invalid database ID.");
  }

  const { data, error } = await supabase
    .from("database_instances")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete SupaPing database:", error.code);
    throw new Error("Couldn't delete this database. Please try again.");
  }

  if (!data) {
    throw new Error(
      "Database not found or you don't have permission to delete it."
    );
  }

  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateDatabase(
  id: string,
  values: AddDatabaseInput
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("We couldn't update this database. Please try again.");
  }

  if (!isUuid(id)) {
    throw new Error("We couldn't update this database. Please try again.");
  }

  const input = validateDatabaseInput(values);

  const { data, error } = await supabase
    .from("database_instances")
    .update({
      name: input.name,
      description: input.description,
      project_url: input.projectUrl,
      publishable_key: input.publishableKey,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update SupaPing database:", error.code);
    throw new Error("We couldn't update this database. Please try again.");
  }

  if (!data) {
    throw new Error("We couldn't update this database. Please try again.");
  }

  revalidatePath("/dashboard");

  return { success: true };
}