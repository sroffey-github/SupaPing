
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatabaseToolbar from "@/components/dashboard/DatabaseToolbar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ConnectedDatabaseFleet from "@/components/dashboard/ConnectedDatabaseFleet";
import AddDatabaseModal from "@/components/dashboard/AddDatabaseModal";
import { addDatabase } from "@/app/dashboard/actions";
import type {
  DatabaseInstance,
  HeartbeatState,
} from "@/app/dashboard/page";

type DashboardContentProps = {
  instances: DatabaseInstance[];
  heartbeatStates: HeartbeatState[];
  loadError: boolean;
};

export default function DashboardContent({
  instances,
  heartbeatStates,
  loadError,
}: DashboardContentProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  async function handleAddDatabase(
    values: Parameters<typeof addDatabase>[0]
  ) {
    await addDatabase(values);
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <DatabaseToolbar
        search={search}
        onSearchChange={setSearch}
        onAddDatabase={() => setAddModalOpen(true)}
      />

      <div className="mt-8">
        <DashboardStats registeredInstances={instances.length} />
      </div>

      <ConnectedDatabaseFleet
        instances={instances}
        heartbeatStates={heartbeatStates ?? []}
        search={search}
        loadError={loadError}
      />

      <AddDatabaseModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddDatabase}
      />
    </main>
  );
}