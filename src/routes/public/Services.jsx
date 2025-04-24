import { useEffect, useState, useRef } from "react";

import { motion, useAnimation, useInView } from "framer-motion";

import { useNavigate, Link } from "react-router-dom";

import Topbar from "../public/Topbar";

const Services = () => {
  return (
    <>
      <Topbar />
      <div
        className="mx-auto mt-16 px-4 text-gray-600 text-lg"
        style={{ maxWidth: "2000px" }}
      >
        <h1
          className=" text-pretty text-6xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
          style={{ fontSize: "60px" }}
        >
          Services
        </h1>
        <div className="text-base/7 font-semibold mt-8 text-2xl">
          Aircraft Cleaning and Detailing, Simplified and Seamlessly Coordinated
        </div>
        <div className="mt-4">
          <p>
            At LiveTakeoff, we handle all aspects of aircraft cleaning and
            detailing, both Interior and Exterior. Whether you need a quick turn
            service, such as a Trip-Ready cleaning, or high-level detailing
            services like Ceramic Coating, Permagard Application, Brightwork
            Polishing, Disinfection, Paint Rejuvenation, or Interior
            Sanitization, we’ve got you covered.
          </p>
          <p className="mt-2">
            Our services are designed to cater to the unique needs of charter
            operators, aircraft owners, and detailing companies, ensuring
            exceptional results and unmatched convenience.
          </p>
        </div>

        <div className="text-base/7 font-semibold mt-10 text-2xl">
          What LiveTakeoff Does for You
        </div>
        <p className="mt-4">
          LiveTakeoff is your partner in seamless coordination and streamlined
          operations. We adapt to your needs with flexible service scenarios:
        </p>
        <div className="xl:mt-20 mt-4 grid xl:grid-cols-4 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto rounded-lg">
          <div className="xl:col-span-2 lg:col-span-2">
            <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Full-Service Coordination
            </h1>
            <p className="mt-4 font-medium text-xl">
              For customers who want the Full Power of LiveTakeoff.
            </p>
            <p className="mt-8 text-lg text-gray-700 text-base/7">
              Unexpected situations happen—like when your furry passengers leave
              behind more than just good memories. At LiveTakeoff, we’re
              designed to handle last-minute cleaning requests and schedule jobs
              according to future arrivals or planned departures.
            </p>

            <div className="mt-10 text-lg text-gray-700">
              <ul role="list" className="space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  Requests can be submitted directly by your crew (pilots,
                  flight attendants, etc.), and we handle them immediately
                  without additional steps.
                </li>
                <li className="flex gap-x-3">
                  Alternatively, if an Approval Process is required, requests
                  are automatically routed to your internal team (e.g.,
                  maintenance or operations) for review and approval before
                  processing.
                </li>
                <li className="flex gap-x-3">
                  Our team takes care of every detail, from confirming requests
                  with local detailing vendors to coordinating with FBOs and
                  Airports.
                </li>
                <li className="flex gap-x-3">
                  LiveTakeoff takes care of all the billing, ensuring seamless
                  and on-time payments to vendors. You can pay us Net30 or
                  Net60.
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
              src="https://res.cloudinary.com/datidxeqm/image/upload/v1745493273/service_1_j1j3lz.png"
              alt="service_1"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="xl:mt-20 mt-0 grid xl:grid-cols-4 xs:grid-cols-1 gap-x-14 gap-y-14 mx-auto rounded-lg">
          <div className="order-2 md:order-1 xl:col-span-2 lg:col-span-2 xl:w-full lg:w-full md:w-1/3">
            <img
              src="https://res.cloudinary.com/datidxeqm/image/upload/v1745493280/service_2_c4zst9.png"
              alt="service_2"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="order-1 md:order-2 xl:col-span-2 lg:col-span-2">
            <h1 className="mt-8 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Software-Only Solution
            </h1>
            <p className="mt-4 font-medium text-xl">
              For customers with an established vendor network.
            </p>

            <div className="mt-6 text-lg text-gray-700 px-4">
              <ul role="list" className="list-disc space-y-6 text-gray-600">
                <li>
                  Use LiveTakeoff independently to manage detailing requests.
                </li>
                <li>
                  Vendors are automatically assigned requests based on your
                  preferences, and communication stays centralized in one
                  platform.
                </li>
                <li>
                  You maintain control over pricing and invoicing with vendors
                  directly.
                </li>
                <li>
                  Easily track workflow and statistics across customers and
                  vendors.
                </li>
                <li>
                  Use automatated services that notify you of important events
                  and trends.
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
        </div>
      </div>
    </>
  );
};

export default Services;
