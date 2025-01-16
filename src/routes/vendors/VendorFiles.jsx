import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { PaperClipIcon } from "@heroicons/react/outline";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";

import * as api from "./apiService";

import VendorFileUploadModal from "./VendorFileUploadModal";

import { toast } from "react-toastify";

const VendorFiles = () => {
  const { vendorId } = useParams();
  const currentUser = useAppSelector(selectUser);
  const [vendorFiles, setVendorFiles] = useState([]);
  const [isVendorFileUploadModalOpen, setVendorFileUploadModalOpen] =
    useState(false);

  useEffect(() => {
    getVendorFiles();
  }, [vendorId]);

  const getVendorFiles = async () => {
    try {
      const { data } = await api.getVendorFiles(vendorId);

      setVendorFiles(data.results);
    } catch (err) {
      toast.error("Unable to fetch files.");
    }
  };

  const handleToggleVendorFileUploadModal = () => {
    setVendorFileUploadModalOpen(!isVendorFileUploadModalOpen);
  };

  const addVendorFile = (file) => {
    const updatedVendorFiles = [...vendorFiles, file];

    setVendorFiles(updatedVendorFiles);
    setVendorFileUploadModalOpen(false);
    toast.success("File uploaded successfully.");
  };

  const downloadFile = (file) => {
    const fileUrl =
      "https://res.cloudinary.com/datidxeqm/" + file.file + "?dl=true";
    window.open(fileUrl, "_blank");
  };

  const handleDeleteVendorFile = async (file) => {
    try {
      await api.deleteVendorFile(file.id);

      const updatedVendorFiles = vendorFiles.filter((f) => f.id !== file.id);

      setVendorFiles(updatedVendorFiles);

      toast.success("File deleted!.");
    } catch (err) {
      toast.error("Unable to delete file.");
    }
  };

  return (
    <AnimatedPage>
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
          <div className="px-4 py-3 bg-gray-100 flex justify-between border-b border-gray-200">
            <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
              Files
            </h3>
            <button
              type="button"
              onClick={handleToggleVendorFileUploadModal}
              className="inline-flex items-center rounded border
                        border-sky-400 bg-white px-2 py-1 text-sm
                        font-medium text-sky-500 shadow-sm hover:bg-gray-50
                        focus:outline-none cursor-pointer"
            >
              <span>Add</span>
            </button>
          </div>
          {vendorFiles.length === 0 && (
            <div className="flex justify-center text-center my-12 text-md">
              No files found.
            </div>
          )}

          {vendorFiles.length > 0 && (
            <ul className="divide-y divide-gray-200 rounded-md border-b border-gray-200">
              {vendorFiles.map((file) => (
                <li key={file.id} className="p-6 text-md">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex gap-2">
                      <p
                        className={`inline-flex text-sm text-white rounded-md py-1 px-2
                                    ${file.file_type === "I" && "bg-blue-400"}
                                    ${file.file_type === "W" && "bg-indigo-400"}
                                    ${
                                      file.file_type === "O" && "bg-gray-400"
                                    }        
                            `}
                      >
                        {file.file_type === "I" && "Insurance"}
                        {file.file_type === "W" && "W-9"}
                        {file.file_type === "O" && "Other"}
                      </p>
                      <div
                        className="text-lg truncate overflow-ellipsis"
                        style={{ maxWidth: "250px" }}
                      >
                        {file.name}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!currentUser.isProjectManager && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDeleteVendorFile(file)}
                            className="inline-flex w-full justify-center rounded-md border
                                                            border-gray-300 bg-white px-2 py-1 text-base 
                                                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                                            focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadFile(file)}
                            className="inline-flex w-full justify-center rounded-md border font-medium
                                                        border-gray-300 bg-white px-2 py-1 text-base 
                                                        text-sky-500 shadow-sm focus:outline-none focus:ring-2
                                                        focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Download
                          </button>
                          {file.is_approved ? (
                            <p
                              className={`inline-flex text-sm text-white rounded-md py-1 px-2
                                    bg-green-400`}
                            >
                              Approved
                            </p>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md border font-medium
                                                            border-gray-300 bg-white px-2 py-1 text-base 
                                                            text-green-500 shadow-sm focus:outline-none focus:ring-2
                                                            focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Approve
                            </button>
                          )}
                        </>
                      )}
                      {currentUser.isProjectManager && (
                        <>
                          <button
                            type="button"
                            onClick={() => downloadFile(file)}
                            className="inline-flex w-full justify-center rounded-md border font-medium
                                                        border-gray-300 bg-white px-2 py-1 text-base 
                                                        text-sky-500 shadow-sm focus:outline-none focus:ring-2
                                                        focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Download
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between gap-4 mt-1">
                    <div className="text-gray-500 relative top-2 text-md">
                      Uploaded on: {file.created_at}
                    </div>
                    {file.is_expired ? (
                      <p
                        className={`inline-flex text-sm text-white rounded-md py-1 px-2
                                  bg-red-400`}
                      >
                        Expired
                      </p>
                    ) : (
                      <div className="text-gray-500 relative top-2 text-md">
                        {file.expiration_date &&
                          "Expires on: " + file.expiration_date}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isVendorFileUploadModalOpen && (
        <VendorFileUploadModal
          isOpen={isVendorFileUploadModalOpen}
          handleClose={handleToggleVendorFileUploadModal}
          vendorId={vendorId}
          addVendorFile={addVendorFile}
        />
      )}
    </AnimatedPage>
  );
};

export default VendorFiles;
