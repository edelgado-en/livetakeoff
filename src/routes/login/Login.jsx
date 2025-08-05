import { useEffect, useState, useRef } from "react";
//import Logo from '../../components/topbar/livetakeoff-logo.png';
import Logo from "../../images/logo_2618936_web.png";
import {
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  GlobeIcon,
  ShareIcon,
  EmojiHappyIcon,
  CloudUploadIcon,
  TagIcon,
  ChatIcon,
  LocationMarkerIcon,
  BellIcon,
  BriefcaseIcon,
} from "@heroicons/react/outline";

import { motion, useAnimation, useInView } from "framer-motion";

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../services/httpService";
import { setApiAccessToken, setUserInfo } from "../../localstorage";

import Topbar from "../public/Topbar";

const primaryFeatures = [
  {
    name: "Real-Time Job Management",
    description:
      "Easily track and manage every cleaning and detailing job in real time. From job status updates to before-and-after photos, Livetakeoff gives you full visibility and control at your fingertips.",
    href: "#",
    icon: ClockIcon,
  },
  {
    name: "Nationwide Coverage",
    description:
      "With access to over 550 airports and a network of the best and most reliable Aircraft Detailing Partners. Livetakeoff ensures your aircraft are serviced wherever and whenever you need. Our reach is unmatched in the industry.",
    href: "#",
    icon: GlobeIcon,
  },
  {
    name: "Concierge-Level Support",
    description:
      "Our customers trust us to fully outsource their aircraft detailing coordination. Whether it's scheduling routine cleaning, managing unexpected needs, or handling high-level detailing, we ensure seamless service delivery with your peace of mind as our priority.",
    href: "#",
    icon: UserGroupIcon,
  },
];

const features = [
  {
    name: "Real-Time Job Statuses",
    description:
      "See which jobs are Submitted, Confirmed, Assigned, In Progress, or Completed at a glance.",
    icon: ClockIcon,
  },
  {
    name: "Arrival & Departure Times",
    description:
      "Stay updated with every aircraft’s ETA and departure schedules to avoid delays.",
    icon: LocationMarkerIcon,
  },
  {
    name: "Priority Tags & Vendor Status",
    description:
      "Instantly identify VIP aircraft, high-priority requests, and vendor-accepted jobs.",
    icon: TagIcon,
  },
  {
    name: "Manage jobs and schedules from anywhere",
    description:
      "Access LiveTakeoff from your desktop, tablet, or mobile device.",
    icon: BriefcaseIcon,
  },
  {
    name: "Receive notifications and alerts instantly",
    description: "Stay up to date real-time with notifications and alerts.",
    icon: BellIcon,
  },
];

const Counter = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    triggerOnce: false,
    margin: "0px 0px -50px 0px",
  }); // Adjust margin to trigger earlier

  useEffect(() => {
    if (!isInView) return; // Only run when in view

    const controls = {
      from: 0,
      to: value,
      duration: 2, // 2 seconds
      fps: 60, // Smooth animation
    };

    let frame = 0;
    const totalFrames = controls.duration * controls.fps;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easedValue = Math.round(
        controls.from + (controls.to - controls.from) * easeOutExpo(progress)
      );
      setCount(easedValue);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setCount(value); // Ensure exact value at the end
      }
    }, 1000 / controls.fps);

    return () => clearInterval(interval);
  }, [isInView, value]); // Restart animation when section appears

  // Easing function for smooth rolling effect
  const easeOutExpo = (t) => 1 - Math.pow(2, -10 * t);

  // Format number with commas
  const formattedCount = new Intl.NumberFormat("en-US").format(count);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold"
    >
      {formattedCount}
    </motion.span>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  const backToSignIn = () => {
    setMessageSent(false);
    setShowForgotPassword(false);
  };

  const onSubmit = handleSubmit((data) => {
    if (showForgotPassword) {
      handleForgotPassword(data);
    } else {
      handleLogin(data);
    }
  });

  const handleLogin = async (data) => {
    setLoading(true);

    const { userName, password } = data;

    try {
      const { data } = await api.post("/api/token/", {
        username: userName,
        password,
      });

      setApiAccessToken(data.access);

      setLoading(false);

      if (data.first_time_login) {
        navigate("/user-settings/password");
      } else {
        navigate("/");
      }
    } catch (e) {
      toast.error("Unable to login");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (data) => {
    setLoading(true);

    const { userName, email } = data;

    try {
      await api.post("/api/forgot-password", { userName, email });

      setMessageSent(true);

      setLoading(false);
    } catch (e) {
      toast.error("Unable to reset password");
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar />
      {messageSent && (
        <div className="mx-auto max-w-lg px-4 pb-16 lg:pb-12 mt-56 text-center">
          <div className=" flex justify-center">
            <CheckCircleIcon
              className="h-12 w-12 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="">
            <p className="text-lg font-medium text-gray-900 mt-2">
              Check your email
            </p>

            <p className="mt-2 text-md text-gray-500">
              If an account with that email exists, we've sent instructions to
              reset your password.
            </p>
          </div>
          <div className=" mt-4 flex justify-center gap-6">
            <span
              onClick={() => backToSignIn()}
              className="text-blue-600 hover:text-blue-500 cursor-pointer text-lg"
            >
              Back to Sign In
            </span>
          </div>
        </div>
      )}
      {!messageSent && (
        <>
          <div
            className="flex flex-wrap mx-auto"
            style={{ maxWidth: "2000px" }}
          >
            <div className="mt-5" style={{ minWidth: "400px" }}>
              <div className="">
                <img
                  className="mx-auto h-28 w-auto"
                  src={Logo}
                  alt="Your Company"
                />
                <p className="mt-2 text-center text-md text-gray-600"></p>
              </div>

              <div className="">
                <div className="bg-white py-6 px-6 pr-8 pt-4 shadow sm:px-10">
                  <form className="" onSubmit={onSubmit}>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-md text-gray-900"
                      >
                        Username
                      </label>
                      <div className="mt-1">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          {...register("userName", {
                            required: "Username is required",
                          })}
                          className="block w-full appearance-none rounded-md border
                                  border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm
                                    focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-md"
                        />
                        {errors.userName && (
                          <p className="text-red-500 text-md">
                            {errors.userName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {!showForgotPassword && (
                      <div className="mt-4">
                        <label
                          htmlFor="password"
                          className="block text-md text-gray-900"
                        >
                          Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            {...register("password", {
                              required: "Password is required",
                            })}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2
                                    placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                      focus:ring-blue-500 sm:text-md"
                          />
                          {errors.password && (
                            <p className="text-red-500 text-md">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {showForgotPassword && (
                      <div className="mt-4">
                        <label
                          htmlFor="email"
                          className="block text-md text-gray-900"
                        >
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            {...register("email", {
                              required: "Email is required",
                            })}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2
                                    placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                      focus:ring-blue-500 sm:text-md"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-md">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {!showForgotPassword && (
                      <div className="flex justify-end mt-3">
                        <div className="text-md">
                          <div
                            onClick={() => toggleForgotPassword()}
                            className=" text-blue-600 hover:text-blue-500 cursor-pointer"
                          >
                            Forgot your password?
                          </div>
                        </div>
                      </div>
                    )}

                    {!showForgotPassword && (
                      <div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex w-full justify-center rounded-md border border-transparent
                                    bg-red-600 py-2 px-4 text-lg font-medium text-white shadow-sm
                                      hover:bg-red-700 focus:outline-none focus:ring-2
                                      focus:ring-red-500 focus:ring-offset-2 mt-4"
                        >
                          {loading ? "signing in..." : "Sign in"}
                        </button>
                      </div>
                    )}

                    {showForgotPassword && (
                      <>
                        <div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md border border-transparent
                                    bg-red-600 py-2 px-4 text-md font-medium text-white shadow-sm
                                      hover:bg-red-700 focus:outline-none focus:ring-2
                                      focus:ring-red-500 focus:ring-offset-2 mt-8"
                          >
                            {loading ? "sending..." : "Reset password"}
                          </button>
                        </div>
                        <div className="relative flex flex-col justify-center text-center text-md mt-4">
                          <div>
                            <span className="px-1 text-gray-500">or</span>
                            <span
                              onClick={() => toggleForgotPassword()}
                              className="text-blue-600 hover:text-blue-500 cursor-pointer"
                            >
                              sign in
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="relative flex flex-col justify-center text-center text-md mt-6">
                      <div>
                        <span className="px-2 text-gray-500">
                          Don't have an account?
                        </span>
                        <Link
                          to="/signup"
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Sign up
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Side: Background Image */}
            <div
              className="flex flex-1 justify-center items-center  text-center px-8"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/datidxeqm/image/upload/v1740500918/website/AdobeStock_466127487_rucr48.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%",
                minHeight: "483px",
              }}
            >
              <div className=" p-8 rounded-lg">
                <h1 className="text-3xl xl:text-5xl font-bold">
                  Aircraft Detailing Nationwide
                </h1>
                <p className="mt-4 text-2xl font-bold">
                  Your One-Stop Solution
                </p>
                <p className="mt-4 text-2xl font-bold">
                  Effortless, Reliable, Everywhere
                </p>

                <div className="xs:grid xs:grid-cols-1 mt-6 text-red-500 text-2xl font-bold">
                  <div>Call us anytime:</div>
                  <div>
                    <a href="tel:+18555000538">+1 855-500-0538</a>
                  </div>
                </div>

                <Link
                  to="/shared/contact"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-xl font-medium text-white shadow-sm hover:bg-red-700"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 px-4" style={{ maxWidth: "2000px" }}>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {primaryFeatures.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-base/7 font-semibold">
                    <div className="mb-6 flex items-center justify-center rounded-lg bg-red-500 w-12 h-12">
                      <feature.icon
                        aria-hidden="true"
                        className="w-6 h-6 text-white"
                      />
                    </div>
                    <div className="text-2xl">{feature.name}</div>
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-gray-500 text-xl">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
            <dl
              className="mx-auto mt-16 xl:mt-32 grid grid-cols-1 gap-x-8 gap-y-10
                         sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-5"
            >
              <div className="flex flex-col gap-y-3 border-l border-gray-300 pl-6">
                <dt className="text-xl">Airports Served</dt>
                <dd className="order-first text-4xl font-semibold tracking-tight">
                  <Counter value={550} />+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-300 pl-6">
                <dt className="text-xl">One-Time Job Completion Rate</dt>
                <dd className="order-first text-4xl font-semibold tracking-tight">
                  <Counter value={99.3} />%
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-300 pl-6">
                <dt className="text-xl">Detailing Services Completed</dt>
                <dd className="order-first text-4xl font-semibold tracking-tight">
                  <Counter value={39888} />
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-300 pl-6">
                <dt className="text-xl">Tails Managed</dt>
                <dd className="order-first text-4xl font-semibold tracking-tight">
                  <Counter value={980} />
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-300 pl-6">
                <dt className="text-xl">Fullfilment Request Rate</dt>
                <dd className="order-first text-4xl font-semibold tracking-tight">
                  <Counter value={99.1} />%
                </dd>
              </div>
            </dl>
            <div className="xl:mt-20 mt-4 grid xl:grid-cols-4 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto p-6 rounded-lg">
              <div className="xl:col-span-2 lg:col-span-2">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Ready for the Unexpected
                </h1>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  Unexpected situations happen—like when your furry passengers
                  leave behind more than just good memories. At LiveTakeoff,
                  we’re designed to handle last-minute cleaning requests and
                  schedule jobs according to future arrivals or planned
                  departures.
                </p>
                <p className="mt-6 text-lg text-gray-700 text-base/7">
                  Whether it’s an unanticipated mess or routine maintenance, our
                  platform makes it effortless to submit, track, and confirm
                  jobs. Count on us to be ready whenever you need us, so your
                  aircraft is always spotless and prepared for the next journey.
                </p>
                <div className="mt-10 text-lg text-gray-700">
                  <ul role="list" className="space-y-8 text-gray-600">
                    <li className="flex gap-x-3">
                      <ShareIcon
                        aria-hidden="true"
                        className="w-7 h-7 flex-none text-red-600"
                      />
                      <span>
                        <strong className="font-semibold text-gray-900">
                          Share your flight schedule.
                        </strong>{" "}
                        We’ll have a team ready and waiting for your arrival.
                      </span>
                    </li>
                    <li className="flex gap-x-3">
                      <CloudUploadIcon
                        aria-hidden="true"
                        className="w-7 h-7 flex-none text-red-600"
                      />
                      <span>
                        <strong className="font-semibold text-gray-900">
                          Submit a job.
                        </strong>{" "}
                        Submit a request through the LiveTakeoff platform, or
                        simply reach out via WhatsApp, text, or call.
                      </span>
                    </li>
                    <li className="flex gap-x-3">
                      <EmojiHappyIcon
                        aria-hidden="true"
                        className="w-7 h-7 flex-none text-red-600"
                      />
                      <span>
                        <strong className="font-semibold text-gray-900">
                          Monitor your job.
                        </strong>{" "}
                        Enjoy peace of mind with our FlightAware integration,
                        enabling us to track your flights and proactively
                        prepare for your needs.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mx-auto text-center">
                  <Link
                    to="/shared/contact"
                    className="mt-6  inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-xl font-medium text-white shadow-sm hover:bg-red-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="xl:col-span-2 lg:col-span-2 xl:w-full lg:w-full md:w-1/3">
                <img
                  src="https://res.cloudinary.com/datidxeqm/image/upload/v1739460998/dog_shzthc.jpg"
                  alt="Dog"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="xl:mt-20 mt-0 grid xl:grid-cols-4 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto p-6 rounded-lg">
              <div className="order-2 md:order-1 xl:col-span-2 lg:col-span-2 xl:w-full lg:w-full md:w-1/3">
                <img
                  src="https://res.cloudinary.com/datidxeqm/image/upload/v1740401636/AdobeStock_232690415_j0sxrb.jpg"
                  alt="wheel"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="order-1 md:order-2 xl:col-span-2 lg:col-span-2">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Your One-Stop Solution for Aircraft Detailing
                </h1>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  At LiveTakeoff, we pride ourselves on being the true one-stop
                  solution for aircraft detailing nationwide. From the moment a
                  job request is submitted, our world-class concierge service
                  ensures seamless coordination at every step. We handle
                  everything—from communicating with detailing teams to working
                  with airports and FBOs—so you don’t have to.
                </p>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  Every airport and FBO operates differently, and we understand
                  the nuances:
                </p>
                <div className="mt-2 text-lg text-gray-700">
                  <ul role="list" className="list-disc space-y-2 text-gray-600">
                    <li>
                      Some FBOs require aircraft to be moved to a hangar before
                      cleaning can begin.
                    </li>
                    <li>
                      Other airports may have strict policies, such as requiring
                      aircraft to be relocated to a wash rack or submitting a
                      work order in advance.
                    </li>
                    <li>
                      Detailing teams often need precise notifications when the
                      aircraft is ready in the designated area, whether it’s a
                      hangar or wash rack.
                    </li>
                  </ul>
                </div>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  In addition, we make sure your aircraft crew always has the
                  right expectations by clearly communicating what is possible
                  and what is not. For example:
                </p>
                <div className="mt-2 text-lg text-gray-700">
                  <ul role="list" className="list-disc space-y-2 text-gray-600">
                    <li>
                      Some airports allow <strong>Wet Wash</strong>, while
                      others only permit <strong>Dry Wash</strong>—we’ll help
                      you identify the right service for your location.
                    </li>
                    <li>
                      We balance <strong>basic cleanings</strong> versus
                      <strong> high-level detailing</strong>, factoring in
                      ground time and the duration required for each service.
                    </li>
                    <li>
                      When a specific request cannot be completed at a given
                      location, we’ll suggest viable alternatives to ensure your
                      needs are met as efficiently as possible.
                    </li>
                  </ul>
                </div>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  Our team handles all of this communication and coordination,
                  ensuring that your aircraft cleaning is completed efficiently,
                  professionally, and without delays—no matter the location or
                  requirements.
                </p>
              </div>
            </div>

            <div className="xl:mt-20 mt-0 grid xl:grid-cols-2 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto p-6 rounded-lg items-start">
              <div className="xl:col-span-1 lg:col-span-1">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Transparency in Fees and Seamless Coordination
                </h1>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  At LiveTakeoff, transparency is at the core of everything we
                  do. More and more FBOs are requiring vendors to pay certain
                  fees to operate on their premises, and we make it our priority
                  to inform customers ahead of time if a location will charge
                  additional fees.
                </p>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  Some airports do not have a permanent presence of a cleaning
                  crew, meaning the closest detailing team may need to travel to
                  the airport, potentially incurring travel fees. We always
                  negotiate with on-site teams to minimize or avoid these fees
                  whenever possible, but when they are necessary, we ensure
                  complete transparency so there are no surprises.
                </p>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  Our system is also equipped to display FBO hours of operation.
                  This allows customers to see upfront if their requested
                  cleaning falls outside operational hours—for example, an
                  overnight cleaning request at a location where the FBO is
                  closed. In such cases, customers can view alternatives
                  directly in our platform. When possible, we’ll work with the
                  FBO to coordinate special access for our detailing teams to
                  complete the job during extra hours.
                </p>
                {/* <p className="mt-8 text-lg text-gray-700 text-base/7">
                  With LiveTakeoff, you can trust that every fee is clearly
                  communicated, every schedule is aligned, and every service is
                  tailored to your specific needs, no matter the location or
                  circumstances.
                </p> */}
              </div>
              <div className="xl:col-span-1 lg:col-span-1 flex">
                <img
                  src="https://res.cloudinary.com/datidxeqm/image/upload/v1740500893/website/Transparency_2_qzdtpo.jpg"
                  alt="wheel"
                  className="w-full object-cover rounded-lg"
                  style={{ maxHeight: "750px" }}
                />
              </div>
            </div>

            <div className="xl:mt-20 mt-0 grid xl:grid-cols-4 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto p-6 rounded-lg">
              <div className="order-2 md:order-1 xl:col-span-2 lg:col-span-2 xl:w-full lg:w-full md:w-1/3">
                <img
                  src="https://res.cloudinary.com/datidxeqm/image/upload/v1740500844/website/Trusted_Partners_1_ehhams.jpg"
                  alt="certificate"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="order-1 md:order-2 xl:col-span-2 lg:col-span-2">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Trusted Partners, Carefully Vetted
                </h1>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  At LiveTakeoff, our network of vendors is built on trust,
                  quality, and rigorous standards. Every partner is carefully
                  selected through a comprehensive vetting process where we
                  evaluate their aviation insurance, chemicals, processes, and
                  track record in the industry.
                </p>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  Our platform is configured to continuously monitor vendor
                  insurance certificates, ensuring they are always up to date.
                  Vendors are automatically notified to re-upload their renewals
                  or update their policies if they no longer meet our high
                  standards.
                </p>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  We go beyond compliance to build strong connections with our
                  partners, fostering close relationships and open
                  communication. Whether it’s guidance on a specific job or
                  support with operational challenges, our phone lines are
                  always open and ready to assist vendors every step of the way.
                </p>
                <p className="mt-8 text-lg text-gray-700 text-base/7">
                  By working with a network of carefully vetted and
                  well-supported vendors, we ensure that every service delivered
                  through LiveTakeoff meets the highest standards of quality,
                  safety, and professionalism.
                </p>
                <div className="mx-auto text-center">
                  <Link
                    to="/shared/contact"
                    className="mt-6  inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-xl font-medium text-white shadow-sm hover:bg-red-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative bg-white py-16 sm:py-24 lg:py-32">
              <div className="mx-auto  px-6 text-center lg:px-8">
                <h2 className="text-4xl font-semibold text-red-600">
                  LiveTakeoff
                </h2>
                <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Premium Concierge & World-Class Aircraft Detailing Management
                </p>
                <p className="mx-auto mt-5 max-w-prose text-2xl text-gray-700 leading-relaxed ">
                  LiveTakeoff is the only fully integrated aircraft cleaning and
                  detailing management platform that provides real-time
                  tracking, automated scheduling, and advanced flight
                  monitoring—all in one place. Whether you're using desktop,
                  tablet, or mobile, our system keeps your operations running
                  smoothly, ensuring every job is completed on time, every time.
                </p>
                <div className="mt-12">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                      <div key={feature.name} className="pt-6">
                        <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                          <div className="-mt-6">
                            <div>
                              <div className="mb-6 flex items-center justify-center rounded-lg bg-red-500 w-12 h-12 mx-auto">
                                <feature.icon
                                  aria-hidden="true"
                                  className="w-6 h-6 text-white"
                                />
                              </div>
                            </div>
                            <h3 className="mt-8 text-xl font-medium tracking-tight text-gray-900">
                              {feature.name}
                            </h3>
                            <p className="mt-5 text-lg text-gray-700">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    The Ultimate One-Stop Solution for Aircraft Detailing
                  </h1>
                  <p className="mx-auto mt-5 max-w-prose text-2xl text-gray-700 leading-relaxed ">
                    With LiveTakeoff, you’re not just managing jobs—you’re
                    running a smarter, more efficient operation that integrates
                    real-time flight tracking, job automation, and vendor
                    coordination into one seamless experience.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                      to="/signup"
                      className="rounded-md bg-red-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Get started
                    </Link>
                    <Link
                      to="/shared/contact"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Request Demo <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-16 flow-root sm:mt-24">
                  <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                    <img
                      alt="App screenshot"
                      src="https://res.cloudinary.com/datidxeqm/image/upload/v1740505532/website/image002_yaituf.png"
                      width={2432}
                      height={1442}
                      className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 grid xl:grid-cols-2 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto p-6 rounded-lg items-start">
              <div className="xl:col-span-1 lg:col-span-1 my-auto">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl text-center mx-auto">
                  <div>Live Flight Tracking</div>
                  <div>Powered by FlightAware</div>
                </h1>
                <p className="mt-8 text-xl text-gray-700">
                  Thanks to our FlightAware integration, LiveTakeoff now
                  provides:
                </p>
                <div className="mt-6 mx-auto text-xl text-gray-700">
                  <ul role="list" className="list-disc space-y-4 text-gray-600">
                    <li>
                      <strong>Live En Route Flight Tracking</strong> – See
                      aircraft in transit and prepare accordingly.
                    </li>
                    <li>
                      <strong>Previous Flights Visibility</strong> – Track past
                      flights for improved scheduling accuracy.
                    </li>
                    <li>
                      <strong>Scheduled Flights Monitoring</strong> – Anticipate
                      upcoming arrivals and avoid service conflicts.
                    </li>
                  </ul>
                </div>
                <div className="mx-auto text-center mt-8">
                  <Link
                    to="/shared/contact"
                    className="mt-6  inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-xl font-medium text-white shadow-sm hover:bg-red-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="xl:col-span-1 lg:col-span-1 flex">
                <img
                  src="https://res.cloudinary.com/datidxeqm/image/upload/v1740505556/website/image003_gt6igx.png"
                  alt="wheel"
                  className="w-full object-cover rounded-lg"
                  style={{ maxHeight: "750px" }}
                />
              </div>
            </div>
          </div>
          <div className="py-24"></div>
        </>
      )}
    </>
  );
};

export default Login;
