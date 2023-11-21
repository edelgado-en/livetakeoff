import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Switch } from "@headlessui/react";

import { DocumentIcon } from "@heroicons/react/outline";

import * as api from "./apiService";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const JobFileUploadModal = ({
  isOpen,
  handleClose,
  isAdmin,
  addJobFile,
  jobDetails,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("is_public", isPublic);

      try {
        const { data } = await api.uploadFile(jobDetails.id, formData);

        addJobFile(data);
      } catch (err) {
        toast.error("Unable to upload file");
      }
    }
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2 px-4">
        <div className="">
          <div className="mt-3 text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 relative top-1"
            >
              Document Upload
            </Dialog.Title>
          </div>

          <div className="mt-6 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" />
              <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white text-center 
                             font-semibold text-blue-600 focus-within:outline-none
                                hover:text-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                Excel, PDF, Word, txt{" "}
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-6">
              <div>
                <div className="text-sm font-medium text-gray-900">File</div>
                {selectedFile.name}
              </div>

              {isAdmin && (
                <div>
                  <Switch.Group
                    as="li"
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex flex-col">
                      <Switch.Label
                        as="p"
                        className="text-sm font-medium text-gray-900"
                        passive
                      >
                        Set as Public
                      </Switch.Label>
                      <Switch.Description className="text-sm text-gray-500">
                        Controls whether customer users can see this attachment.
                      </Switch.Description>
                    </div>
                    <Switch
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                      className={classNames(
                        isPublic ? "bg-red-500" : "bg-gray-200",
                        "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          isPublic ? "translate-x-5" : "translate-x-0",
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={!selectedFile}
            onClick={handleUpload}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Upload
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border
                                 border-gray-300 bg-white px-4 py-2 text-base font-medium
                                  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default JobFileUploadModal;
