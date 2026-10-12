
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SupaPing",
  description:
    "Learn how SupaPing collects, uses, and protects your information.",
};

const sections = [
  {
    title: "1. Who we are",
    content: (
      <>
        <p>
          SupaPing is a service designed to send scheduled keep-alive
          requests to supported Supabase projects to help reduce inactivity
          on eligible database plans.
        </p>
        <p>
          Service operator: <strong>SupaPing</strong>
        </p>
        <p>
          Privacy enquiries:{" "}
          <a href="mailto:support@supaping.app">
            support@supaping.app
          </a>
        </p>
      </>
    ),
  },
  {
    title: "2. Information we collect",
    content: (
      <>
        <p>Depending on how you use SupaPing, we may process:</p>
        <ul>
          <li>
            <strong>Account information:</strong> information associated with
            your authentication account, such as your email address and user
            identifier.
          </li>
          <li>
            <strong>Project configuration:</strong> the project name,
            optional description, Supabase project URL and publishable API key
            you provide.
          </li>
          <li>
            <strong>Heartbeat records:</strong> request timestamps, response
            status, latency, error information and whether a request was
            recorded as successful.
          </li>
          <li>
            <strong>Operational records:</strong> scheduled job execution
            status, execution duration, failure counts and alert delivery
            attempts.
          </li>
          <li>
            <strong>Technical information:</strong> information that may be
            included in application, security or hosting logs.
          </li>
          <li>
            <strong>Usage analytics:</strong> website usage information
            processed through Vercel Web Analytics, if enabled.
          </li>
        </ul>
        <p>
          Please do not submit passwords, service-role keys, database
          passwords or other secrets as project configuration.
        </p>
      </>
    ),
  },
  {
    title: "3. How we use your information",
    content: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>Provide and maintain the SupaPing service.</li>
          <li>Authenticate users and protect accounts.</li>
          <li>Run scheduled keep-alive requests for configured projects.</li>
          <li>Display heartbeat history, status and performance information.</li>
          <li>Investigate failures, troubleshoot problems and protect security.</li>
          <li>
            Send operational alert emails to the configured service operator
            when scheduled checks encounter certain failures.
          </li>
          <li>Understand website usage and improve the service.</li>
          <li>Meet applicable legal obligations.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Legal bases for processing",
    content: (
      <>
        <p>
          Where UK data protection law applies, we rely on an appropriate
          legal basis for each processing activity. Depending on the
          circumstances, this may include performing a contract with you,
          pursuing legitimate interests such as service security and
          reliability, complying with legal obligations, or consent where
          required.
        </p>
        <p>
          Where we rely on legitimate interests, those interests are balanced
          against your rights and freedoms.
        </p>
      </>
    ),
  },
  {
    title: "5. How heartbeat requests work",
    content: (
      <>
        <p>
          When you configure a project, SupaPing uses the project URL and
          publishable key you provide to make scheduled requests to the
          configured Supabase endpoint.
        </p>
        <p>
          The service records operational results so it can report whether
          requests succeeded and how long they took. The configured endpoint
          must be valid and accessible for the request to work.
        </p>
        <p>
          You are responsible for ensuring you are authorised to configure
          and monitor each project you add.
        </p>
      </>
    ),
  },
  {
    title: "6. Service providers and sharing",
    content: (
      <>
        <p>
          We use third-party providers to operate SupaPing. Depending on the
          feature, these may include:
        </p>
        <ul>
          <li>
            <strong>Supabase:</strong> authentication, database storage and
            related infrastructure.
          </li>
          <li>
            <strong>Vercel:</strong> application hosting and, where enabled,
            website analytics.
          </li>
          <li>
            <strong>Resend:</strong> delivery of authentication or operational
            emails, depending on the email being sent.
          </li>
        </ul>
        <p>
          These providers may process information on our behalf to provide
          their services. Their own terms and privacy policies also apply to
          their services.
        </p>
        <p>
          We do not sell your personal information. We may disclose
          information where required by law, to protect rights and security,
          or as part of a business transfer where legally permitted.
        </p>
      </>
    ),
  },
  {
    title: "7. International transfers",
    content: (
      <p>
        Our service providers may process information in countries outside
        the United Kingdom. Where a restricted international transfer takes
        place, we will use an appropriate transfer mechanism and safeguards
        where required by applicable data protection law.
      </p>
    ),
  },
  {
    title: "8. Data retention",
    content: (
      <p>
        We retain information for as long as reasonably necessary to provide
        the service, maintain operational history, protect security, resolve
        disputes and meet legal obligations. Actual retention periods may
        vary by data type and provider. We will update this policy if we
        establish specific retention periods or change our retention
        practices.
      </p>
    ),
  },
  {
    title: "9. Security",
    content: (
      <p>
        We use technical and organisational measures intended to protect
        information against unauthorised access, loss and misuse. No online
        service can guarantee absolute security. You should protect your
        account credentials and never submit secrets that the service does
        not require.
      </p>
    ),
  },
  {
    title: "10. Your rights",
    content: (
      <>
        <p>
          Depending on your circumstances and applicable law, you may have
          the right to request access to your personal information, correct
          inaccurate information, request erasure or restriction, object to
          certain processing, or receive a portable copy of information.
          Where processing is based on consent, you may be able to withdraw
          it.
        </p>
        <p>
          To make a request, contact{" "}
          <a href="mailto:support@supaping.app">
            support@supaping.app
          </a>
          . You may also complain to the UK Information Commissioner&apos;s
          Office (ICO) at{" "}
          <a
            href="https://ico.org.uk/make-a-complaint/"
            target="_blank"
            rel="noreferrer"
          >
            ico.org.uk
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "11. Cookies and analytics",
    content: (
      <p>
        SupaPing uses authentication-related technologies needed to operate
        accounts. Vercel Web Analytics may also be used to understand visits
        and usage. Whether additional consent or controls are required
        depends on the technologies enabled and how they operate. We will
        provide any notices or choices required by applicable law.
      </p>
    ),
  },
  {
    title: "12. Children",
    content: (
      <p>
        SupaPing is intended for people who are legally able to use the
        service and is not designed for children. Please contact us if you
        believe a child has provided personal information inappropriately.
      </p>
    ),
  },
  {
    title: "13. Changes to this policy",
    content: (
      <p>
        We may update this policy as the service changes or legal
        requirements evolve. We will publish the updated version on this
        page and revise the effective date.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#EEF2F6] px-5 py-16 text-[#334155] sm:px-8">
      <article className="mx-auto max-w-3xl">
        <a
          href="/"
          className="font-mono text-sm text-primary-strong hover:underline"
        >
          ← Back to SupaPing
        </a>

        <header className="mb-12 mt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-strong">
            Legal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1E293B]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">
            Effective date: 11 October 2026
          </p>
          <p className="mt-5 leading-7">
            This policy explains how SupaPing collects, uses, stores and
            shares information when you visit or use our service.
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1E293B]">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-7 text-[#475569] [&_a]:text-primary-strong [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
