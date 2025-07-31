import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";
import ReactTimeAgo from "react-time-ago";
import { CheckIcon, UserIcon } from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

export default function Example() {
  const currentUser = useAppSelector(selectUser);
  const { jobId } = useParams();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivities();
  }, []);

  const getActivities = async () => {
    const { data } = await api.getJobActivities(jobId);

    //iterate through data.results and format the timestamp date
    data.results.forEach((activity) => {
      activity.timestamp = new Date(activity.timestamp);
      //use military time instead of am/pm
      activity.timestamp = activity.timestamp.toLocaleTimeString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });

    setActivities(data.results);
  };

  return (
    <AnimatedPage>
      <div className="mt-6 max-w-3xl m-auto px-2">
        <div className="flex flex-row">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-600">
              Job Activity
            </h1>
          </div>
        </div>
        <div className="flow-root mt-6">
          <ul className="-mb-8">
            {activities.map((activity, eventIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {eventIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}

                  <div className="relative flex space-x-3">
                    <div>
                      {activity.activity_type === "S" && (
                        <span
                          className={`
                                        ${
                                          activity.status === "A" &&
                                          "bg-sky-500 "
                                        }
                                        ${
                                          activity.status === "S" &&
                                          "bg-yellow-500 "
                                        }
                                        ${
                                          activity.status === "U" &&
                                          "bg-indigo-500 "
                                        }
                                        ${
                                          activity.status === "W" &&
                                          "bg-green-500 "
                                        }
                                        ${
                                          activity.status === "R" &&
                                          "bg-purple-500 "
                                        }
                                        ${
                                          activity.status === "C" &&
                                          "bg-blue-500 "
                                        }
                                        ${
                                          activity.status === "T" && "bg-black "
                                        }
                                        ${
                                          activity.status === "I" &&
                                          "bg-gray-400 "
                                        }
                                        ${
                                          activity.status === "N" &&
                                          "bg-gray-400 "
                                        }
                                        ${
                                          activity.status === "P" &&
                                          "bg-red-500 "
                                        }
                                        ${
                                          activity.status === "X" &&
                                          "bg-gray-500"
                                        }
                                        h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                        >
                          <span className="text-white">{activity.status}</span>
                        </span>
                      )}

                      {activity.activity_type !== "S" && (
                        <span
                          className={`bg-gray-400 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                        >
                          <span className="text-white">
                            <PencilIcon className="h-4 w-4" />
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      {activity.activity_type === "S" && (
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.status !== "P" && (
                              <>
                                <span>Status changed to </span>
                                <span className="font-medium text-black">
                                  {activity.status === "A" && "Confirmed"}
                                  {activity.status === "S" && "Assigned"}
                                  {activity.status === "U" && "Submitted"}
                                  {activity.status === "W" &&
                                    "Work In Progress"}
                                  {activity.status === "C" && "Completed"}
                                  {activity.status === "T" && "Canceled"}
                                  {activity.status === "R" && "Review"}
                                  {activity.status === "I" && "Invoiced"}
                                  {activity.status === "N" && "Not Invoiced"}
                                  {activity.status === "X" && "Unassign"}
                                </span>
                              </>
                            )}

                            {activity.status === "P" && (
                              <>
                                <span className="text-sm text-gray-500">
                                  Price changed to
                                </span>
                                <span className="font-medium text-black ml-1">
                                  ${activity.price}
                                </span>
                              </>
                            )}

                            <span className="ml-1">
                              by {activity.user_full_name}
                            </span>
                          </p>
                        </div>
                      )}

                      {activity.activity_type === "P" && (
                        <div>
                          <p className="text-sm text-left text-gray-500">
                            <span className="text-sm text-gray-500">
                              Price changed to
                            </span>
                            <span className="font-medium text-black ml-1">
                              ${activity.price}
                            </span>
                            <span className="ml-1">
                              by {activity.user?.first_name}{" "}
                              {activity.user?.last_name}
                            </span>
                          </p>
                        </div>
                      )}

                      {!currentUser?.isCustomer && (
                        <>
                          {activity.activity_type === "C" && (
                            <div>
                              <p className="text-sm text-left text-gray-500">
                                <span className="font-medium text-black">
                                  Service Added:
                                </span>{" "}
                                {activity.service_name} by{" "}
                                {activity.user_full_name}
                              </p>
                            </div>
                          )}

                          {activity.activity_type === "D" && (
                            <div>
                              <p className="text-sm text-left text-gray-500">
                                <span className="font-medium text-black">
                                  Service Removed:
                                </span>{" "}
                                {activity.service_name} by{" "}
                                {activity.user_full_name}
                              </p>
                            </div>
                          )}

                          {activity.activity_type === "X" && (
                            <div>
                              <p className="text-sm text-left text-gray-500">
                                <span className="font-medium text-black">
                                  Retainer Added:
                                </span>{" "}
                                {activity.service_name} by{" "}
                                {activity.user_full_name}
                              </p>
                            </div>
                          )}

                          {activity.activity_type === "Y" && (
                            <div>
                              <p className="text-sm text-left text-gray-500">
                                <span className="font-medium text-black">
                                  Retainer Removed:
                                </span>{" "}
                                {activity.service_name} by{" "}
                                {activity.user_full_name}
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {(activity.activity_type === "E" ||
                        activity.activity_type === "A" ||
                        activity.activity_type === "B" ||
                        activity.activity_type === "O" ||
                        activity.activity_type === "F" ||
                        activity.activity_type === "T" ||
                        activity.activity_type === "U" ||
                        activity.activity_type === "R" ||
                        activity.activity_type === "V") && (
                        <div>
                          <p className="text-sm text-left text-gray-500">
                            <span className="font-medium text-black">
                              {activity.activity_type === "E" && "Departure"}
                              {activity.activity_type === "A" && "Arrival"}
                              {activity.activity_type === "B" &&
                                "Complete Before"}
                              {activity.activity_type === "O" && "Airport"}
                              {activity.activity_type === "F" && "FBO"}
                              {activity.activity_type === "T" && "Tail Number"}
                              {activity.activity_type === "U" &&
                                "Photos Uploaded"}
                              {activity.activity_type === "R" && "Job Returned"}
                              {activity.activity_type === "V" &&
                                "Vendor Accepted"}
                            </span>

                            {activity.activity_type !== "U" &&
                              activity.activity_type !== "V" && (
                                <span> changed </span>
                              )}

                            <span className="ml-1">
                              by {activity.user_full_name}
                            </span>
                          </p>
                        </div>
                      )}

                      {!currentUser?.isCustomer && (
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {activity.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedPage>
  );
}
