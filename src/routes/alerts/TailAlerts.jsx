import { useState, useEffect, Fragment } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

import AddTailAlertModal from "./AddTailAlert";
import DeleteTailAlertModal from './DeleteTailAlert'

import ReactTimeAgo from 'react-time-ago'

import * as api from './apiService'


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
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddTailAlertModalOpen, setAddTailAlertModalOpen] = useState(false)
  const [isDeleteTailAlertModalOpen, setDeleteTailAlertModalOpen] = useState(false)
  const [tailAlertToDelete, setTailAlertToDelete] = useState(null)
  const [tailAlertMessageEdited, setTailAlertMessageEdited] = useState(null)

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAlerts()
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText]);

  const searchAlerts = async () => {
      setLoading(true);

      const request = {
        searchText,
      }

      try {
        const { data } = await api.searchTailAlerts(request)

        setTotalAlerts(data.count)
        setAlerts(data.results)

        setLoading(false)

      } catch (err) {
        setLoading(false)
      }

  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      
      searchAlerts();
    }
  }

  const handleToggleAddTailAlertModal = () => {
    setAddTailAlertModalOpen(!isAddTailAlertModalOpen)
  }

  const handleToggleDeleteTailAlertModal = (tailAlert) => {
    setDeleteTailAlertModalOpen(!isDeleteTailAlertModalOpen)

    if (tailAlert) {
      setTailAlertToDelete(tailAlert)
    }
  }

  const handleAddTailAlert = (newTailAlert) => {
    setAlerts([newTailAlert, ...alerts])
    setAddTailAlertModalOpen(false)
    setTotalAlerts(totalAlerts + 1)
  }

  const handleDeleteTailAlert = (tailAlert) => {
    setAlerts(alerts.filter(alert => alert.id !== tailAlert.id))
    setTailAlertToDelete(null)
    setDeleteTailAlertModalOpen(false)
    setTotalAlerts(totalAlerts - 1)
  } 

  const handleEdit = async (tailAlert) => {
    const newMessage = tailAlertMessageEdited;

    const request = {
      message: newMessage
    }

    try {
      const { data } = await api.updateTailAlert(tailAlert.id, request)

      setAlerts(alerts.map(alert => alert.id === data.id ? data : alert))
      setTailAlertMessageEdited(null)

    } catch (err) {

    }
  }

  const toggleTailAlertEditMode = (tailAlert) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === tailAlert.id) {
        alert.editMode = !alert.editMode

        if (alert.editMode) {
          setTailAlertMessageEdited(alert.message)
        }

      } else {
        alert.editMode = false
      }

      return alert
    })

    setAlerts(updatedAlerts)
  }

  const closeAllEditModes = () => {
    const updatedAlerts = alerts.map(alert => {
      alert.editMode = false
      return alert
    })

    setAlerts(updatedAlerts)
  }

  return (
    <AnimatedPage>
      <div className={`px-4 m-auto max-w-5xl -mt-3 flex flex-wrap`}>
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 w-full">
          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Tail Alerts
                <span className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                          rounded-full text-xs font-medium md:inline-block">{totalAlerts}</span>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Alerts will be shown when creating a job and while viewing job details.
              </p>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleToggleAddTailAlertModal}
                className="inline-flex items-center justify-center 
                          rounded-md border border-transparent bg-red-600 px-4 py-2
                          text-sm font-medium text-white shadow-sm hover:bg-red-700
                          focus:outline-none focus:ring-2 focus:ring-red-500
                          focus:ring-offset-2 sm:w-auto">
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                New Alert
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full my-2">
            <div className="w-full">
              <div className="relative border-b border-gray-200">
                  <div 
                    onClick={() => searchAlerts()}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                    <MagnifyingGlassIcon 
                        className="h-4 w-4 text-gray-400 cursor-pointer"
                        aria-hidden="true" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={searchText}
                    onChange={event => setSearchText(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                            focus:ring-sky-500 text-sm"
                    placeholder="search by tail or alert"
                  />
              </div>
            </div>
          </div>

          {!loading && alerts.length === 0 && (
              <div className="text-sm text-gray-500 mt-20 m-auto w-11/12 text-center">
                No tail alerts found.
              </div>
          )}

          {loading && <Loader />} 

          {!loading && (
            <div className="overflow-hidden bg-white  sm:rounded-md mt-2 mb-4 w-full">
              <ul className="divide-y divide-gray-200 pb-5">
                {alerts.map((alert) => (
                  <li key={alert.id} className="bg-white shadow rounded-lg p-6">
                    <article aria-labelledby={'question-title-' + alert.id}>
                      <div>
                        <div className="flex space-x-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-medium text-gray-900">
                              {alert.tailNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created <ReactTimeAgo date={new Date(alert.created_at)} locale="en-US" timeStyle="twitter" /> by {alert.author}
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 self-center">
                            <span
                              onClick={() => handleToggleDeleteTailAlertModal(alert)} 
                              className="rounded-lg inline-flex p-1.5 hover:bg-gray-200
                                        bg-gray-100 ring-4 ring-white relative bottom-2 cursor-pointer">
                              <TrashIcon className="h-4 w-4 text-gray-400"/>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className=" flex justify-between mt-2 space-y-4 text-sm text-gray-700">
                        {!alert.editMode && (
                          <div className="flex-1">
                            {alert.message}
                          </div>
                        )}

                        {alert.editMode && (
                          <textarea
                            value={tailAlertMessageEdited}
                            onChange={(e) => setTailAlertMessageEdited(e.target.value)}
                            name="editMessage"
                            id="editMessage"
                            style={{ minHeight: '100px' }}
                            className="block w-full rounded-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            />
                        )}

                        <div>
                          {!alert.editMode && (
                            <span 
                              onClick={() => toggleTailAlertEditMode(alert)}
                              className="rounded-lg inline-flex p-1.5 hover:bg-gray-200
                                          bg-gray-100 ring-4 ring-white relative bottom-3 cursor-pointer">
                              <PencilIcon 
                                className="h-4 w-4 text-gray-400" />
                            </span>
                          )}
                        </div>
                      </div>
                      {alert.editMode && (
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => toggleTailAlertEditMode(alert)}
                                className="rounded-md border border-gray-300 bg-white
                                        py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEdit(alert)}
                                className="inline-flex justify-center rounded-md 
                                border border-transparent bg-red-600 py-2 px-4
                                text-sm font-medium text-white shadow-sm hover:bg-red-600
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Save
                            </button>  
                        </div>
                      )}
                    </article>
                  </li>
                ))}

              </ul>
            </div>
          )}
      </div>

      {isAddTailAlertModalOpen && <AddTailAlertModal
                                            isOpen={isAddTailAlertModalOpen}
                                            handleClose={handleToggleAddTailAlertModal}
                                            handleAddTailAlert={handleAddTailAlert}
                                             />}

      {isDeleteTailAlertModalOpen && <DeleteTailAlertModal
                                            isOpen={isDeleteTailAlertModalOpen}
                                            handleClose={handleToggleDeleteTailAlertModal}
                                            handleDeleteTailAlert={handleDeleteTailAlert}
                                            tailAlert={tailAlertToDelete}
                                             />}

      <div className="pb-40"></div>
    </AnimatedPage>
  ) 
};

export default TailAlerts;
