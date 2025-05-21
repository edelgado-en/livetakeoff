import { useEffect, useState, useRef } from "react";

import { motion, useAnimation, useInView } from "framer-motion";

import { useNavigate, Link } from "react-router-dom";

import Topbar from "../public/Topbar";

const Locations = () => {
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
          Locations
        </h1>
        <div className="mt-4">
          <div className="text-base/7 font-semibold mt-8 text-2xl">
            We serve over 548 airports across the United States and the Bahamas!
          </div>
        </div>
        <div className="mt-8" style={{ maxWidth: "100%", overflow: "hidden" }}>
          <iframe
            src="https://www.google.com/maps/d/u/0/embed?mid=1bOgZO8Hjp_rergUO6esFGy6lvhydtN4&ehbc=2E312F&noprof=1"
            width="100%"
            height="800"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Custom Google Map"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Locations;
