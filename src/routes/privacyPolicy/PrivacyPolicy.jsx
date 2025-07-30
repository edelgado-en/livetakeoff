import AnimatedPage from "../../components/animatedPage/AnimatedPage";

const PrivacyPolicy = () => {
  return (
    <AnimatedPage>
      <div className="xl:px-16 px-1 m-auto max-w-5xl pb-20">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 text-center mt-10">
          Terms & Conditions and Privacy Policy
        </h1>
        <p className="mt-4 leading-7 text-slate-600 text-center text-lg">
          Effective Date: November 1st, 2022
        </p>

        <div
          className="relative px-4 sm:px-6 lg:px-8 text-lg text-gray-500 mt-12"
          style={{ lineHeight: "1.7142857" }}
        >
          <div
            className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold
                       prose-a:text-sky-500 hover:prose-a:text-sky-600"
          >
            <p>
              These Terms and Conditions and Privacy Policy ("Agreement") govern
              the use of the LiveTakeoff mobile and web applications (the
              "App"), operated by Live Takeoff LLC. By downloading, installing,
              accessing, or using the App on iOS, Android, or Web, you agree to
              this Agreement in full. If you do not agree, you must not use the
              App.
            </p>

            <h2 className="text-lg font-medium text-black my-4">
              1. Parties Covered
            </h2>
            <p>These terms apply to:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Customer Users submitting service requests.</li>
              <li>
                Internal Project Managers (PMs) working under Clean Takeoff.
              </li>
              <li>
                External Project Managers (Vendor PMs) contracted by Live
                Takeoff LLC.
              </li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              2. User Consent
            </h2>
            <p>
              By creating an account, logging in, or submitting/accepting a job
              through the App, you:
            </p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Confirm that you are over 18 years old.</li>
              <li>Consent to these Terms and the Privacy Policy.</li>
              <li>
                Agree to receive notifications and communications related to job
                status, notes, and updates.
              </li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              3. Intellectual Property & Prohibited Use
            </h2>
            <p>
              All content in the App, including UI design, logic, code, images,
              documents, and trademarks, is owned by Live Takeoff LLC. You may
              not:
            </p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>
                Reverse engineer, copy, or replicate any part of the App for
                competitive purposes.
              </li>
              <li>
                Use the App to develop or enhance a competing product or
                service.
              </li>
              <li>
                Share screenshots, screen recordings, or internal app views
                externally, except to report issues by sending them to{" "}
                <a href="mailto:ops@livetakeoff.com">ops@livetakeoff.com</a>.
              </li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              4. Vendor PM Responsibilities & Insurance Requirements
            </h2>
            <p>By accepting a job request in the App, Vendor PMs agree to:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>
                Assume full responsibility for all services performed on the
                aircraft while under their care.
              </li>
              <li>
                Maintain a valid and current Certificate of Insurance listing
                Live Takeoff LLC as both the certificate holder and additional
                insured.
              </li>
              <li>
                Maintain workers compensation coverage for all personnel
                involved in servicing the aircraft.
              </li>
              <li>
                Provide proof of insurance and coverage upon request. Failure to
                comply may result in termination of access and liability for
                damages.
              </li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              5. Account and Access Rules
            </h2>
            <p>
              Users are responsible for keeping their account login secure. Any
              activity under your account is your responsibility. You may only
              use your own account.
            </p>
            <p>Access permissions:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>
                Customer Users may see jobs for their company, or only the jobs
                they submitted if "Submitter Only" access is enabled.
              </li>
              <li>
                PMs may only access assigned jobs and relevant operational
                details.
              </li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              6. Job Submission and Management
            </h2>
            <p>Customer Users may:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Submit jobs using the in-app request wizard.</li>
              <li>
                Edit, cancel, or update job requests (e.g., add/remove
                services).
              </li>
              <li>View submitted and completed jobs.</li>
              <li>Add/view comments and pictures.</li>
              <li>See invoiced history (limited by permissions).</li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              7. Messaging & Notifications
            </h2>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Monitor notes for job updates.</li>
              <li>Use comments only for operational purposes.</li>
              <li>Not share screenshots of notes outside the app.</li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              8. Privacy & Data Handling
            </h2>
            <p>We collect and store the following data:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Name, email, phone, and company.</li>
              <li>Pictures uploaded to jobs.</li>
              <li>Messages and activity logs related to job requests.</li>
            </ul>
            <p>
              Data is used only for internal coordination, recordkeeping,
              customer service, and to ensure job execution. We do not sell
              data.
            </p>
            <p>
              You may request deletion or modification of your personal data at{" "}
              <a href="mailto:support@livetakeoff.com">
                support@livetakeoff.com
              </a>
              .
            </p>

            <h2 className="text-lg font-medium text-black my-4">
              9. Cookies & App Analytics
            </h2>
            <p>
              We use analytical tools to monitor app usage, improve design, and
              troubleshoot. This may include session data, click events, and
              time spent per screen.
            </p>

            <h2 className="text-lg font-medium text-black my-4">
              10. Termination
            </h2>
            <p>We reserve the right to suspend or remove access if you:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Violate this Agreement.</li>
              <li>Fail to maintain valid insurance (for Vendor PMs).</li>
              <li>Abuse or misuse job data or customer information.</li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">
              11. Limitation of Liability
            </h2>
            <p>Live Takeoff LLC is not liable for:</p>
            <ul className="pl-5 py-4 list-disc list-inside space-y-4">
              <li>Damages arising from misuse of the App.</li>
              <li>
                Errors or omissions in job execution caused by user-provided
                data.
              </li>
              <li>Delays or downtime in App access.</li>
            </ul>

            <h2 className="text-lg font-medium text-black my-4">12. Updates</h2>
            <p>
              We may update this Agreement at any time. You will be notified
              through the App and must re-accept to continue using it.
            </p>

            <h2 className="text-lg font-medium text-black my-4">
              13. Governing Law
            </h2>
            <p>
              This Agreement is governed by the laws of the State of Florida.
            </p>

            <h2 className="font-bold mt-6 text-black">Contact Us</h2>
            <p>Live Takeoff LLC</p>
            <p>750 SW 34th St, Suite 209, Fort Lauderdale, FL 33315</p>
            <p>
              Email:{" "}
              <a
                href="mailto:support@livetakeoff.com"
                className="text-sky-500 font-medium"
              >
                support@livetakeoff.com
              </a>
            </p>
            <p>
              Phone: <a href="tel:+18555000538">+1 855-500-0538</a>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PrivacyPolicy;
