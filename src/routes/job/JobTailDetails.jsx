import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import { PaperClipIcon } from "@heroicons/react/outline";

import { toast } from "react-toastify";

const JobTailDetails = () => {
  const [loading, setLoading] = useState(true);
  const [tailDetails, setTailDetails] = useState({});

  const { jobId } = useParams();

  useEffect(() => {
    getTailDetails();
  }, []);

  const getTailDetails = async () => {
    try {
      const { data } = await api.getTailDetails(jobId);

      setTailDetails(data);
    } catch (error) {
      toast.error("Unable to load tail details");
    }

    setLoading(false);
  };

  const downloadFile = (file) => {
    const fileUrl =
      "https://res.cloudinary.com/datidxeqm/" + file.file + "?dl=true";
    window.open(fileUrl, "_blank");
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="mt-6 max-w-5xl px-2 pb-10">
          <div className="flex flex-row">
            <div className="flex-1">
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-700">
                Tail Details
              </h1>
            </div>
          </div>

          <h2 className="text-md xl:text-2xl font-bold text-gray-700 uppercase tracking-wide mt-8">
            Notes
          </h2>
          <div className="text-xl">
            {tailDetails.notes ? tailDetails.notes : "Not Specified"}
          </div>

          <h2 className="text-md xl:text-2xl font-bold text-gray-700 uppercase tracking-wide mt-8">
            Attachments
          </h2>

          {tailDetails.files?.length === 0 && (
            <div className="flex justify-center text-center mt-8">
              No file attachments found.
            </div>
          )}

          <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 mt-4">
            {tailDetails.files?.map((file) => (
              <li key={file.id} className="py-3 pl-3 pr-4 text-md">
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex gap-1">
                    <PaperClipIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400 relative top-1"
                      aria-hidden="true"
                    />
                    <div
                      className="text-lg truncate overflow-ellipsis"
                      style={{ maxWidth: "250px" }}
                    >
                      {file.name}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => downloadFile(file)}
                      className="inline-flex w-full justify-center rounded-md border font-medium
                                                border-gray-300 bg-white px-2 py-1 text-base 
                                                text-blue-500 shadow-sm focus:outline-none focus:ring-2
                                                focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto text-md"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between gap-4 mt-1">
                  <div className="text-gray-500 relative top-2 text-lg">
                    Uploaded on: {file.created_at}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AnimatedPage>
  );
};

export default JobTailDetails;
