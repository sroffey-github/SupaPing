
import type { Metadata } from "next";
import BlogArticle from "@/components/blog/BlogArticle";

export const metadata: Metadata = {
  title: "Supabase Keep-Alive with Scheduled Cron Jobs",
  description:
    "Learn how scheduled keep-alive requests work with Supabase, including the scheduler, API endpoint, database update, and reliability considerations.",
  alternates: {
    canonical: "/blog/supabase-keep-alive-cron",
  },
  openGraph: {
    type: "article",
    title: "Supabase Keep-Alive with Scheduled Cron Jobs",
    description:
      "Understand the architecture behind scheduled Supabase database activity and the checks needed for a reliable implementation.",
    url: "/blog/supabase-keep-alive-cron",
  },
};

export default function Page() {
  return (
    <BlogArticle
      category="Technical deep dive"
      title="Supabase Keep-Alive with Scheduled Cron Jobs"
      description="A practical look at how a scheduled job can trigger a database update, why the components are separated, and how to validate the result."
      publishedLabel="Technical guide"
      readTime="8 min read"
    >
      <p>
        A scheduled keep-alive system is made up of more than a timer. It
        needs a scheduler to initiate work, an endpoint to handle the request,
        and a database operation that produces the intended result.
      </p>

      <p>
        For developers using Supabase's Free Plan, this architecture can be
        useful when exploring ways to generate database activity for projects
        that receive little natural traffic. It is important to verify that
        the operation satisfies the platform's current requirements rather
        than assuming every scheduled request will prevent pausing.
      </p>

      <h2>The architecture at a glance</h2>

      <div className="my-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
          <p className="font-bold text-emerald-950">Vercel Cron Job</p>
          <p className="mt-1 text-sm text-emerald-800">
            Triggers the scheduled request
          </p>
        </div>
        <div className="text-center text-2xl text-slate-400" aria-hidden="true">
          ↓
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="font-bold text-slate-900">SupaPing API endpoint</p>
          <p className="mt-1 text-sm text-slate-600">
            Handles the request and initiates the update
          </p>
        </div>
        <div className="text-center text-2xl text-slate-400" aria-hidden="true">
          ↓
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="font-bold text-slate-900">User's Supabase instance</p>
          <p className="mt-1 text-sm text-slate-600">
            The keep-alive table is updated
          </p>
        </div>
      </div>

      <h2>1. The scheduler initiates the work</h2>

      <p>
        A cron job runs according to a configured schedule. Instead of
        requiring a developer to open the application manually, the scheduler
        initiates the keep-alive workflow automatically.
      </p>

      <p>
        Scheduling configuration should be treated as production configuration.
        Confirm the intended cadence, review the platform's cron behaviour,
        and make sure the job is deployed in the environment where you expect
        it to run.
      </p>

      <h2>2. The API endpoint handles the request</h2>

      <p>
        The scheduled job calls an API endpoint. The endpoint provides a
        controlled place for the server-side operation to happen.
      </p>

      <p>
        The endpoint should not blindly trust incoming requests. Depending on
        your implementation, you should authenticate the scheduler, validate
        the target project, and restrict which database operation can be
        performed.
      </p>

      <p>
        Avoid putting service-role credentials or other privileged secrets
        in client-side code. Protect secrets using server-side environment
        variables and follow the current Supabase guidance for handling
        project credentials.
      </p>

      <h2>3. The keep-alive table is updated</h2>

      <p>
        SupaPing's described workflow updates a dedicated keep-alive table
        in the user's Supabase instance. The write is the database operation
        intended to generate activity.
      </p>

      <p>
        A dedicated table keeps the operation separate from your application's
        business data. The exact schema and update strategy should be chosen
        to suit the implementation, including the permissions and credentials
        required to write to it.
      </p>

      <p>
        Do not assume that a successful HTTP response alone proves that the
        database write happened. A reliable implementation should verify the
        result of the database operation and return an appropriate response
        when the write fails.
      </p>

      <h2>4. Verify each stage independently</h2>

      <p>
        When troubleshooting a scheduled workflow, separate the stages instead
        of treating the entire system as a single black box.
      </p>

      <ol>
        <li>
          <strong>Scheduler:</strong> Did the cron job execute at the expected
          time?
        </li>
        <li>
          <strong>HTTP request:</strong> Did the request reach the API endpoint
          and receive the expected response?
        </li>
        <li>
          <strong>Database operation:</strong> Did the endpoint successfully
          update the intended table?
        </li>
        <li>
          <strong>Observability:</strong> Can you find enough logs to diagnose
          a failed run without exposing secrets?
        </li>
      </ol>

      <h2>Does a keep-alive request prevent Supabase from pausing?</h2>

      <p>
        Supabase's{" "}
        <a
          href="https://supabase.com/docs/guides/platform/free-project-pausing"
          target="_blank"
          rel="noreferrer"
        >
          official project-pausing documentation
        </a>{" "}
        describes pausing Free Plan projects that receive insufficient user
        database activity over a period of time.
      </p>

      <p>
        A scheduled database update is intended to generate activity, but
        developers should not infer a guarantee from the fact that a request
        succeeded. Validate the behaviour against the current Supabase policy,
        and monitor the project for the result.
      </p>

      <p>
        Also distinguish a project pausing due to inactivity from an
        application outage. A successful write does not prove that every
        frontend route, API endpoint, authentication flow or third-party
        dependency is healthy.
      </p>

      <h2>Keep-alive versus uptime monitoring</h2>

      <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Keep-alive operation</th>
              <th>Uptime monitoring</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Primary goal</td>
              <td>Generate a database operation on a schedule</td>
              <td>Check whether a service responds as expected</td>
            </tr>
            <tr>
              <td>Database write</td>
              <td>Typically part of the workflow</td>
              <td>Not necessarily required</td>
            </tr>
            <tr>
              <td>Checks application routes</td>
              <td>Not inherently</td>
              <td>Can be configured to do so</td>
            </tr>
            <tr>
              <td>Guarantees no downtime</td>
              <td>No</td>
              <td>No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Checklist for a reliable scheduled workflow</h2>

      <ul>
        <li>Document the schedule and expected behaviour.</li>
        <li>Authenticate requests to the API endpoint.</li>
        <li>Keep database credentials out of client-side code.</li>
        <li>Confirm the write succeeded rather than only checking the HTTP status.</li>
        <li>Log failures in a way that is useful but does not leak secrets.</li>
        <li>Test temporary database or network failures.</li>
        <li>Review the current Supabase project-pausing policy.</li>
      </ul>

      <h2>Conclusion</h2>

      <p>
        Separating the scheduler, API endpoint and database operation makes
        a keep-alive workflow easier to understand and troubleshoot. The
        important part is not just that the job runs, but that the intended
        database operation succeeds and the approach is suitable for the
        platform's current rules.
      </p>

      <p>
        SupaPing packages this scheduled workflow for developers who want
        to manage keep-alive updates without building the whole mechanism
        themselves. Visit <a href="/">SupaPing</a> to learn more.
      </p>
    </BlogArticle>
  );
}
