
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SupaPing",
  description:
    "Read the terms governing your use of SupaPing's Supabase keep-alive service.",
};

const sections = [
  {
    title: "1. About these terms",
    paragraphs: [
      "These Terms of Service govern your access to and use of SupaPing. By creating an account or using the service, you agree to these terms.",
      "SupaPing is operated by SupaPing. References to “we”, “us” and “our” mean the service operator. References to “you” mean the person or organisation using SupaPing.",
    ],
  },
  {
    title: "2. What SupaPing does",
    paragraphs: [
      "SupaPing is designed to send scheduled keep-alive requests to configured Supabase projects. It records the results of those requests and may provide status information and operational email alerts.",
      "The service is provided to help manage inactivity on eligible projects. We do not guarantee that any particular database will remain active, that a provider will avoid pausing a project, or that every scheduled request will succeed.",
    ],
  },
  {
    title: "3. Eligibility and accounts",
    paragraphs: [
      "You must be legally capable of entering into a binding agreement to use the service. If you use SupaPing on behalf of an organisation, you confirm that you have authority to bind that organisation to these terms.",
      "You are responsible for providing accurate account information, protecting your login credentials and notifying us if you suspect unauthorised access to your account.",
      "You must not share account access in a way that compromises security or use the service to impersonate another person.",
    ],
  },
  {
    title: "4. Connecting your Supabase projects",
    paragraphs: [
      "You must own, administer or otherwise have permission to configure every project you add to SupaPing.",
      "You are responsible for ensuring that the project URL and publishable API key you provide are correct and appropriate for the intended use. Do not submit Supabase service-role keys, database passwords or other privileged secrets.",
      "You remain responsible for your Supabase account, project settings, database security, backups, access policies, billing and compliance with Supabase's terms.",
    ],
  },
  {
    title: "5. Acceptable use",
    paragraphs: [
      "You must use SupaPing lawfully and only for its intended purpose. You must not:",
    ],
    bullets: [
      "Use the service to access or interfere with systems without permission.",
      "Attempt to bypass authentication, security controls, usage limits or service restrictions.",
      "Abuse the service through excessive requests, automated account creation or other activity that disrupts its operation.",
      "Use the service for unlawful activity, fraud or infringement of another person's rights.",
      "Reverse engineer, exploit or interfere with the service except where applicable law permits it.",
      "Use SupaPing in a manner that violates the terms or acceptable-use policies of Supabase or another relevant provider.",
    ],
  },
  {
    title: "6. Third-party services and limitations",
    paragraphs: [
      "SupaPing relies on third-party services, including Supabase, hosting infrastructure and email delivery providers. Their availability, policies, pricing and technical behaviour are outside our direct control.",
      "Supabase may change its inactivity rules, free-tier eligibility, API behaviour, quotas or other product features. A successful heartbeat is not a guarantee that a project will remain active or avoid charges.",
      "We do not control third-party outages, account suspensions, provider policy changes or changes to your project's configuration. You should monitor your projects independently where availability is important.",
    ],
  },
  {
    title: "7. Availability and changes",
    paragraphs: [
      "We aim to operate SupaPing reliably, but we do not guarantee uninterrupted, error-free or continuous availability. Scheduled jobs may be delayed, fail or be unavailable due to maintenance, infrastructure issues, provider limitations or circumstances outside our control.",
      "We may update, improve, suspend or discontinue features where reasonably necessary. Where appropriate, we will try to give advance notice of material changes or planned interruptions.",
    ],
  },
  {
    title: "8. Fees and future plans",
    paragraphs: [
      "Any fees, subscription terms, usage limits or payment obligations will be presented separately where applicable. If paid features are introduced, their specific pricing and billing terms will apply in addition to these terms.",
      "Nothing in this section creates a payment obligation where no fee has been agreed or displayed for the service you use.",
    ],
  },
  {
    title: "9. Data and privacy",
    paragraphs: [
      "Our collection and use of personal information are described in our Privacy Policy.",
      "You are responsible for ensuring that you have the necessary rights and permissions to provide any information or project configuration submitted to SupaPing.",
    ],
  },
  {
    title: "10. Intellectual property",
    paragraphs: [
      "Subject to your compliance with these terms, we permit you to use SupaPing for its intended purpose. The service, including its branding, design, software and associated materials, belongs to its respective rights holders.",
      "These terms do not transfer ownership of SupaPing or grant rights beyond those necessary to use the service. You retain your rights to your own projects and data.",
    ],
  },
  {
    title: "11. Suspension and termination",
    paragraphs: [
      "You may stop using SupaPing at any time. We may restrict, suspend or terminate access where reasonably necessary to protect the service, respond to suspected abuse, comply with law, address security risks or enforce these terms.",
      "Where reasonably practicable, we will provide notice and an opportunity to resolve a problem before taking action, unless immediate action is necessary.",
      "Stopping use of the service does not automatically establish that all associated data has been deleted. For information or requests concerning personal data, see our Privacy Policy or contact us.",
    ],
  },
  {
    title: "12. Disclaimers",
    paragraphs: [
      "To the extent permitted by law, SupaPing is provided on an “as is” and “as available” basis. We do not warrant that it will meet every requirement, prevent database inactivity, prevent data loss or guarantee the availability of third-party services.",
      "You should maintain appropriate backups and independent monitoring for projects where data integrity or availability matters. SupaPing is not a replacement for backups, disaster recovery or production monitoring.",
    ],
  },
  {
    title: "13. Limitation of liability",
    paragraphs: [
      "Nothing in these terms excludes or limits liability where doing so would be unlawful, including liability for fraud, fraudulent misrepresentation, or death or personal injury caused by negligence where the law prohibits such exclusion.",
      "To the extent permitted by law, we are not responsible for indirect or consequential losses, loss of profits, loss of business opportunities, or losses caused by third-party provider outages, policy changes, account restrictions or failures of configured projects.",
      "To the extent permitted by applicable law, we are responsible for losses you suffer that are a foreseeable result of our breach of these terms or our failure to exercise reasonable care and skill. We are not responsible for losses that could not reasonably have been foreseen or for losses caused by circumstances outside our reasonable control, including outages, failures or policy changes affecting third-party services such as Supabase. Nothing in these terms excludes or limits liability where it would be unlawful to do so, or affects any consumer rights that cannot legally be excluded or limited.",
      "Nothing in these terms removes any consumer rights that cannot legally be excluded or restricted.",
    ],
  },
  {
    title: "14. Changes to these terms",
    paragraphs: [
      "We may revise these terms to reflect changes to SupaPing, our operations or applicable law. The latest version will be published on this page with an updated effective date.",
      "Where a change materially affects your rights, we will take reasonable steps to notify you where appropriate. Continued use after revised terms take effect constitutes acceptance only to the extent permitted by applicable law.",
    ],
  },
  {
    title: "15. Governing law",
    paragraphs: [
      "These terms are governed by the laws of England and Wales. Any disputes will be handled by the courts with jurisdiction under applicable law.",
      "If you are a consumer, you may also benefit from mandatory protections and rights under the laws of the country where you live. Nothing in these terms removes rights that cannot legally be excluded.",
    ],
  },
  {
    title: "16. Contact",
    paragraphs: [
      "For questions about these terms, contact us at support@supaping.app.",
      "Operator: SupaPing.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#EEF2F6] px-5 py-16 text-[#334155] sm:px-8">
      <article className="mx-auto max-w-3xl">
        <a
          href="/"
          className="font-mono text-sm text-[#008756] hover:underline"
        >
          ← Back to SupaPing
        </a>

        <header className="mb-12 mt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#008756]">
            Legal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1E293B]">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-[#64748B]">
            Effective date: 11 October 2026
          </p>
          <p className="mt-5 leading-7">
            These terms explain the conditions for using SupaPing, including
            your responsibilities when configuring and monitoring Supabase
            projects.
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1E293B]">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-7 text-[#475569] [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
