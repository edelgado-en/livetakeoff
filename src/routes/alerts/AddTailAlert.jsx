import { useEffect, useState, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Switch } from "@headlessui/react";
import { PlusIcon, DocumentIcon } from "@heroicons/react/outline";

import * as api from "./apiService";

import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AddTailAlertModal = ({ isOpen, handleClose, handleAddTailDetails }) => {
  const [tailNumber, setTailNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  const addTailDetails = async () => {
    // if tailNumber or message is empty, show error message
    if (!tailNumber || (!message && !notes)) {
      alert("You must have a tail number and message or notes");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("isPublic", isPublic);
    formData.append("tailNumber", tailNumber);
    formData.append("message", message);
    formData.append("notes", notes);

    try {
      setLoading(true);

      const { data } = await api.addTailAlert(formData);

      toast.success("Tail details added!");

      handleAddTailDetails(data);
    } catch (err) {
      setLoading(false);
      toast.error("Unable to add tail details");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    //this allows me to re-upload the same file name
    event.target.value = "";
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="mb-6" style={{ minWidth: "300px" }}>
        <div className="">
          <Dialog.Title
            as="h3"
            className="text-xl font-medium leading-6 text-gray-900 relative top-1"
          >
            Create Tail Details
          </Dialog.Title>
        </div>
      </div>
      <div>
        <label
          htmlFor="tailNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Tail Number
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={tailNumber}
            onChange={(e) => setTailNumber(e.target.value)}
            name="tailNumber"
            id="tailNumber"
            className="block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Alert
        </label>
        <div className="mt-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            name="message"
            id="message"
            style={{ minHeight: "100px" }}
            className="block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <div className="mt-1">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            name="notes"
            id="notes"
            style={{ minHeight: "100px" }}
            className="block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
      </div>

      <label
        htmlFor="message"
        className="mt-6 block text-sm font-medium text-gray-700"
      >
        Attachment
      </label>

      <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
        <div className="text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" />
          <div className="mt-2 flex justify-center text-sm leading-6 text-gray-600">
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
          <div className="flex justify-between gap-2">
            <div>
              <div className="text-sm font-medium text-gray-900">File</div>
              {selectedFile.name}
            </div>
            <div>
              <div
                onClick={() => removeSelectedFile()}
                className="flex items-center justify-center rounded-full p-1 px-2 hover:bg-gray-100 cursor-pointer"
              >
                X
              </div>
            </div>
          </div>

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
        </div>
      )}

      <div className="mt-10 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={() => addTailDetails()}
          disabled={loading}
          className="inline-flex w-full justify-center rounded-md border border-transparent
                            bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {loading ? (
            "adding..."
          ) : (
            <>
              <PlusIcon
                className="-ml-2 mr-1 h-5 w-5 text-white"
                aria-hidden="true"
              />
              <span>Add</span>
            </>
          )}
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
    </ModalFrame>
  );
};

export default AddTailAlertModal;
