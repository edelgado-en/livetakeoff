import { useState, useEffect, Fragment } from "react";
import { PlusIcon, PaperClipIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

import { Switch } from "@headlessui/react";

import AddTailAlertModal from "./AddTailAlert";
import DeleteTailAlertModal from "./DeleteTailAlert";

import ReactTimeAgo from "react-time-ago";

import * as api from "./apiService";

import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MagnifyingGlassIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};

const TailAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddTailAlertModalOpen, setAddTailAlertModalOpen] = useState(false);
  const [isDeleteTailAlertModalOpen, setDeleteTailAlertModalOpen] =
    useState(false);

  const [tailAlertToDelete, setTailAlertToDelete] = useState(null);
  const [tailAlertMessageEdited, setTailAlertMessageEdited] = useState(null);
  const [tailNotesEdited, setTailNotesEdited] = useState(null);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAlerts();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText]);

  const searchAlerts = async () => {
    setLoading(true);

    const request = {
      searchText,
    };

    try {
      const { data } = await api.searchTailAlerts(request);

      setTotalAlerts(data.count);
      setAlerts(data.results);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchAlerts();
    }
  };

  const handleToggleAddTailAlertModal = () => {
    setAddTailAlertModalOpen(!isAddTailAlertModalOpen);
  };

  const handleToggleDeleteTailAlertModal = (tailAlert) => {
    setDeleteTailAlertModalOpen(!isDeleteTailAlertModalOpen);

    if (tailAlert) {
      setTailAlertToDelete(tailAlert);
    }
  };

  const handleAddTailDetails = (newTailDetails) => {
    setAlerts([newTailDetails, ...alerts]);
    setAddTailAlertModalOpen(false);
    setTotalAlerts(totalAlerts + 1);
  };

  const handleDeleteTailAlert = (tailAlert) => {
    setAlerts(alerts.filter((alert) => alert.id !== tailAlert.id));
    setTailAlertToDelete(null);
    setDeleteTailAlertModalOpen(false);
    setTotalAlerts(totalAlerts - 1);
  };

  const handleEdit = async (tailAlert) => {
    const newMessage = tailAlertMessageEdited;
    const newNotes = tailNotesEdited;

    const request = {
      message: newMessage,
      notes: newNotes,
    };

    try {
      const { data } = await api.updateTailAlert(tailAlert.id, request);

      setAlerts(alerts.map((alert) => (alert.id === data.id ? data : alert)));
      setTailAlertMessageEdited(null);
      setTailNotesEdited(null);

      toast.success("Tail details updated!");
    } catch (err) {
      toast.error("Unable to update tail details");
    }
  };

  const toggleTailAlertEditMode = (tailAlert) => {
    const updatedAlerts = alerts.map((alert) => {
      if (alert.id === tailAlert.id) {
        alert.editMode = !alert.editMode;

        if (alert.editMode) {
          setTailAlertMessageEdited(alert.message);
          setTailNotesEdited(alert.notes);
        }
      } else {
        alert.editMode = false;
      }

      return alert;
    });

    setAlerts(updatedAlerts);
  };

  const downloadFile = (file) => {
    const fileUrl =
      "https://res.cloudinary.com/datidxeqm/" + file.file + "?dl=true";
    window.open(fileUrl, "_blank");
  };

  const handleDeleteAlertFile = async (selectedAlert, file) => {
    try {
      await api.deleteAlertFile(file.id);

      const updatedAlerts = alerts.map((alert) => {
        if (alert.id === selectedAlert.id) {
          alert.files = alert.files.filter((f) => f.id !== file.id);
        }

        return alert;
      });

      setAlerts(updatedAlerts);
    } catch (err) {
      toast.error("Unable to delete file.");
    }
  };

  return (
    <AnimatedPage>
      <div className={`px-4 m-auto max-w-5xl -mt-3 flex flex-wrap`}>
        <div className="border-b border-gray-200 bg-white py-5 w-full">
          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="mt-4">
              <h3 className="text-3xl font-medium leading-6 text-gray-900">
                Tail Details
                <span
                  className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                          rounded-full text-sm font-medium md:inline-block"
                >
                  {totalAlerts}
                </span>
              </h3>
              <p className="mt-2 text-md text-gray-500">
                Alerts will be shown when creating a job and while viewing job
                details. Notes will be shown in the job details view.
              </p>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleToggleAddTailAlertModal}
                className="inline-flex items-center justify-center 
                          rounded-md border border-transparent bg-red-600 px-4 py-2
                          text-md font-medium text-white shadow-sm hover:bg-red-700
                          focus:outline-none focus:ring-2 focus:ring-red-500
                          focus:ring-offset-2 sm:w-auto"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                New Tail
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full my-2">
          <div className="w-full">
            <div className="relative border-b border-gray-200">
              <div
                onClick={() => searchAlerts()}
                className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              >
                <MagnifyingGlassIcon
                  className="h-4 w-4 text-gray-400 cursor-pointer"
                  aria-hidden="true"
                />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                            focus:ring-sky-500 text-md"
                placeholder="Search by tail, alert or notes"
              />
            </div>
          </div>
        </div>

        {!loading && alerts.length === 0 && (
          <div className="text-md text-gray-500 mt-20 m-auto w-11/12 text-center">
            No tail details found.
          </div>
        )}

        {loading && <Loader />}

        {!loading && (
          <div className="overflow-hidden bg-white  sm:rounded-md mt-2 mb-4 w-full">
            <ul className="divide-y divide-gray-200 pb-5">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-8"
                >
                  <article aria-labelledby={"question-title-" + alert.id}>
                    <div>
                      <div className="flex space-x-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xl font-medium text-gray-900">
                            {alert.tailNumber}
                          </p>
                          <p className="text-md text-gray-500">
                            Created{" "}
                            <ReactTimeAgo
                              date={new Date(alert.created_at)}
                              locale="en-US"
                              timeStyle="twitter"
                            />{" "}
                            by {alert.author}
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 self-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleDeleteTailAlertModal(alert)
                            }
                            className="inline-flex w-full justify-center rounded-md border
                                                        border-gray-300 bg-white px-2 py-1 text-base 
                                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                                        focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm relative bottom-2"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleTailAlertEditMode(alert)}
                            className="ml-4 inline-flex w-full justify-center rounded-md border
                                                        border-gray-300 bg-white px-2 py-1 text-base 
                                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                                        focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm relative bottom-2"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                    {!alert.editMode && (
                      <div className="mt-2 space-y-4 text-md text-gray-700">
                        <div className="px-4 mt-6 pb-6">
                          <div className="font-medium">Alert</div>
                          <div className="flex-1">
                            {alert.message ? alert.message : "None"}
                          </div>

                          <div className="font-medium mt-6">Notes</div>
                          <div className="flex-1">
                            {alert.notes ? alert.notes : "None"}
                          </div>

                          <div className="font-medium mt-8">Attachments</div>
                          {alert.files?.length === 0 && (
                            <div className="mt-2">None</div>
                          )}

                          {alert.files?.length > 0 && (
                            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 mt-4">
                              {alert.files?.map((file) => (
                                <li
                                  key={file.id}
                                  className="py-3 pl-3 pr-4 text-md"
                                >
                                  <div className="flex flex-wrap justify-between gap-4">
                                    <div className="flex gap-1">
                                      <PaperClipIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400 relative top-1"
                                        aria-hidden="true"
                                      />
                                      <div className="text-lg">{file.name}</div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteAlertFile(file)
                                        }
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
                                                                        text-blue-500 shadow-sm focus:outline-none focus:ring-2
                                                                        focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                      >
                                        Download
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap justify-between gap-4 mt-1">
                                    <div className="text-gray-500 relative top-2 text-md">
                                      Uploaded on: {file.created_at}
                                    </div>
                                    <div>
                                      {/*  <Switch.Group
                                        as="li"
                                        className="flex items-center justify-between py-2"
                                      >
                                        <div className="flex flex-col">
                                          <Switch.Label
                                            as="p"
                                            className="text-sm font-medium text-gray-900"
                                            passive
                                          >
                                            Public
                                          </Switch.Label>
                                        </div>
                                        <Switch
                                          checked={file.is_public}
                                          onChange={() =>
                                            handleToggleFilePublic(file)
                                            } 
                                          className={classNames(
                                            file.is_public
                                              ? "bg-red-500"
                                              : "bg-gray-200",
                                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                          )}
                                        >
                                          <span
                                            aria-hidden="true"
                                            className={classNames(
                                              file.is_public
                                                ? "translate-x-5"
                                                : "translate-x-0",
                                              "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                            )}
                                          />
                                        </Switch>
                                      </Switch.Group> */}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    {alert.editMode && (
                      <div>
                        <div className="font-medium mb-1">Alert</div>
                        <textarea
                          value={tailAlertMessageEdited}
                          onChange={(e) =>
                            setTailAlertMessageEdited(e.target.value)
                          }
                          name="editMessage"
                          id="editMessage"
                          style={{ minHeight: "100px" }}
                          className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-md"
                        />

                        <div className="font-medium mt-6 mb-1">Notes</div>
                        <textarea
                          value={tailNotesEdited}
                          onChange={(e) => setTailNotesEdited(e.target.value)}
                          name="editNotes"
                          id="editNotes"
                          style={{ minHeight: "100px" }}
                          className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-md"
                        />
                        <div className="flex justify-end gap-4 mt-8">
                          <button
                            type="button"
                            onClick={() => toggleTailAlertEditMode(alert)}
                            className="rounded-md border border-gray-300 bg-white
                                                    py-2 px-4 text-md font-medium text-gray-700 shadow-sm
                                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(alert)}
                            className="inline-flex justify-center rounded-md 
                                            border border-transparent bg-red-600 py-2 px-4
                                            text-md font-medium text-white shadow-sm hover:bg-red-600
                                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isAddTailAlertModalOpen && (
        <AddTailAlertModal
          isOpen={isAddTailAlertModalOpen}
          handleClose={handleToggleAddTailAlertModal}
          handleAddTailDetails={handleAddTailDetails}
        />
      )}

      {isDeleteTailAlertModalOpen && (
        <DeleteTailAlertModal
          isOpen={isDeleteTailAlertModalOpen}
          handleClose={handleToggleDeleteTailAlertModal}
          handleDeleteTailAlert={handleDeleteTailAlert}
          tailAlert={tailAlertToDelete}
        />
      )}

      <div className="pb-40"></div>
    </AnimatedPage>
  );
};

export default TailAlerts;
