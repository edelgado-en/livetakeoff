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
              We received your request!
            </p>

            <p className="mt-2 text-md text-gray-500">
              We will get back to you shortly with your new password.
            </p>
          </div>
          <div className=" mt-4 flex justify-center gap-6">
            <span
              onClick={() => backToSignIn()}
              className="text-blue-600 hover:text-blue-500 cursor-pointer text-lg"
            >
              sign in
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
                {/* <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-gray-500">
                  {showForgotPassword
                    ? "Forgot your Password?"
                    : "Sign in to your account"}
                </h2> */}
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
                      <div className="flex justify-end mt-2">
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
                          {loading ? "sigining in..." : "Sign in"}
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
            <div
              className="flex-1 h-64 w-full bg-blue-50"
              style={{ height: "475px" }}
            >
              <div className="mt-16 xl:mt-24 mx-auto text-center tracking-wider font-medium text-3xl xl:text-5xl lg:text-5xl">
                <div>Aircraft Detailing Nationwide</div>
                <div className="mt-4">Your One-Stop Solution</div>
                <div className="mt-4">Effortless, Reliable, Everywhere</div>
              </div>

              <div className="m-8 mb-7 mx-auto text-center text-xl text-red-500 font-bold">
                Call us anytime: +1 855-500-0538
              </div>
              <div className="mx-auto text-center">
                <Link
                  to="/shared/contact"
                  className="ml-8 inline-flex items-center justify-center whitespace-nowrap
                            rounded-md border border-transparent bg-red-600 px-4 py-3 text-xl
                            font-medium text-white shadow-sm hover:bg-red-700"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-12 px-4" style={{ maxWidth: "2000px" }}>
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
            <div className="mt-8 relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
              <div
                className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8
                             gap-y-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-6"
              >
                <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                  <div className="lg:pr-4">
                    <div className="lg:max-w-xl">
                      <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Ready for the Unexpected
                      </h1>
                      <p className="max-w-lg mt-6 text-lg text-gray-700 text-base/7">
                        Unexpected situations happen—like when your furry
                        passengers leave behind more than just good memories. At
                        LiveTakeoff, we’re designed to handle last-minute
                        cleaning requests and schedule jobs according to future
                        arrivals or planned departures.
                      </p>
                      <p className="max-w-lg mt-6 text-lg text-gray-700 text-base/7">
                        Whether it’s an unanticipated mess or routine
                        maintenance, our platform makes it effortless to submit,
                        track, and confirm jobs. Count on us to be ready
                        whenever you need us, so your aircraft is always
                        spotless and prepared for the next journey.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="-ml-12 -mt-12 p-12 pt-20 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                  <img
                    alt=""
                    src="https://res.cloudinary.com/datidxeqm/image/upload/v1739460998/dog_shzthc.jpg"
                    className="rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10  object-contain h-auto w-full max-w-full max-h-full"
                  />
                </div>
                <div
                  className="lg:col-span-2 lg:col-start-1 lg:row-start-2
                                 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
                >
                  <div className="lg:pr-4 lg:-mt-4">
                    <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg text-lg">
                      <ul role="list" className="space-y-6 text-gray-600">
                        <li className="flex gap-x-3">
                          <ShareIcon
                            aria-hidden="true"
                            className="mt-1 w-7 h-7 flex-none text-red-600"
                          />
                          <span>
                            <strong className="font-semibold text-gray-900">
                              Share your flight schedule.
                            </strong>{" "}
                            We’ll have a team ready and waiting for your
                            arrival.
                          </span>
                        </li>
                        <li className="flex gap-x-3">
                          <CloudUploadIcon
                            aria-hidden="true"
                            className="mt-1 w-7 h-7 flex-none text-red-600"
                          />
                          <span>
                            <strong className="font-semibold text-gray-900">
                              Submit a job.
                            </strong>{" "}
                            Submit a request through the LiveTakeoff platform,
                            or simply reach out via WhatsApp, text, or call.
                          </span>
                        </li>
                        <li className="flex gap-x-3">
                          <EmojiHappyIcon
                            aria-hidden="true"
                            className="mt-1 w-7 h-7 flex-none text-red-600"
                          />
                          <span>
                            <strong className="font-semibold text-gray-900">
                              Monitor your job.
                            </strong>{" "}
                            Enjoy peace of mind with our FlightAware
                            integration, enabling us to track your flights and
                            proactively prepare for your needs.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-24 w-1"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
