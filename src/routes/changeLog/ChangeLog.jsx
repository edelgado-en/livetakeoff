import AnimatedPage from "../../components/animatedPage/AnimatedPage";

const ChangeLog = () => {
  return (
    <AnimatedPage>
      <div className="xl:px-16 px-1 m-auto max-w-5xl">
        <div className="relative mx-auto max-w-[37.5rem] text-center pb-20">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mt-10 text-center">
            Changelog
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 text-center">
            Stay up to date with all of the latest additions and improvements
            we've made to Livetakeoff.
          </p>
        </div>
      </div>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <section
          id="2022-09-07"
          aria-labelledby="2022-09-07-heading"
          className="md:flex"
        >
          <h2
            id="2022-09-07-heading"
            className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4
                                                     md:pl-0 md:pr-12 md:text-right"
          >
            <a href="#2022-09-07">November 3, 2022</a>
          </h2>
          <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
            <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-3 md:top-2.5"></div>
            <div
              className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem]
                                         rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"
            ></div>
            <div
              className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 leading-7 prose-sm
                                     prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600 text-gray-500 text-sm"
            >
              <h3 className="font-semibold text-black">
                New footer and changelog views
              </h3>
              <p>New views for privacy policy and changelog have been added.</p>
            </div>
          </div>
        </section>
        <section
          id="2022-08-12"
          aria-labelledby="2022-08-12-heading"
          className="md:flex"
        >
          <h2
            id="2022-08-12-heading"
            className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0 md:pr-12 md:text-right"
          >
            <a href="#2022-08-12">November 2, 2022</a>
          </h2>
          <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
            <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-6 md:top-0"></div>
            <div
              className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem]
                                     rounded-full border-2 border-slate-300 bg-white md:top-[0.4375rem]"
            ></div>
            <div
              className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 leading-7 prose-sm
                                     prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600 text-gray-500 text-sm"
            >
              <h3 className="font-semibold text-black">New additions</h3>
              <ul>
                <li>
                  Added price breakdown to job details view and job completed
                  list view.
                </li>
                <li>
                  Added functionality to export a csv file from the completed
                  job list view.
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section
          id="2022-06-23"
          aria-labelledby="2022-06-23-heading"
          className="md:flex"
        >
          <h2
            id="2022-06-23-heading"
            className="pl-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-0
                                                           md:pr-12 md:text-right"
          >
            <a href="#2022-06-23">November 1, 2022</a>
          </h2>
          <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16">
            <div className="absolute bottom-0 left-0 w-px bg-slate-200 -top-6 md:top-0"></div>
            <div
              className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2
                                     border-slate-300 bg-white md:top-[0.4375rem]"
            ></div>
            <div
              className="max-w-none prose-h3:mb-4 prose-h3:text-base prose-h3:leading-6 leading-7
                                    prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 text-gray-500 text-sm
                                     hover:prose-a:text-sky-600"
            >
              <p>
                Today we’re thrilled to announce the launch of job completed
                list view!
              </p>
              <p>
                Added functionality to search by date range by requested,
                arrival, departure, completed by, and completion dates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
};

export default ChangeLog;
