import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import { TrashIcon } from "@heroicons/react/outline";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";

import { useAppDispatch } from "../../app/hooks";
import { resetCommentsCount } from "./jobStats/jobStatsSlice";

import * as api from "./apiService";
import { toast } from "react-toastify";

import DeleteCommentModal from "./DeleteJobCommentModal";

const JobComments = () => {
  const { jobId } = useParams();
  const bottomRef = useRef(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createCommentLoading, setCreateCommentLoading] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [sendEmailToProjectManager, setSendEmailToProjectManager] =
    useState(false);

  const [isDeleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [commentToBeDeleted, setCommentToBeDeleted] = useState(null);

  const currentUser = useAppSelector(selectUser);

  const [userEmails, setUserEmails] = useState([]);
  const [projectManagerEmails, setProjectManagerEmails] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    getComments();
    dispatch(resetCommentsCount());
  }, []);

  const getUserEmails = async () => {
    try {
      const { data } = await api.getUserJobEmails(Number(jobId));

      //keep the existing structure, just add selected: true to each object in data.emails
      data.emails = data.emails.map((el) => {
        return { ...el, selected: true };
      });

      data.project_manager_emails = data.project_manager_emails.map((el) => {
        return { ...el, selected: true };
      });

      setUserEmails(data.emails);
      setProjectManagerEmails(data.project_manager_emails);
    } catch (err) {
      toast.error("Unable to fetch user info");
    }
  };

  const getComments = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobComments(jobId);

      setComments(data.results);
    } catch (error) {}

    setLoading(false);
  };

  const handleToggleDeleteCommentModal = (comment) => {
    if (comment) {
      setCommentToBeDeleted(comment);
    } else {
      setCommentToBeDeleted(null);
    }

    setDeleteCommentModalOpen(!isDeleteCommentModalOpen);
  };

  const deleteComment = async () => {
    await api.deleteComment(commentToBeDeleted.id);

    setDeleteCommentModalOpen(false);

    const updatedComments = comments.filter(
      (s) => s.id !== commentToBeDeleted.id
    );

    setComments(updatedComments);

    setCommentToBeDeleted(null);
  };

  const handleSetSendSMS = () => {
    setSendSMS(!sendSMS);
  };

  const handleSetIsPublic = () => {
    setIsPublic(!isPublic);
  };

  const handleSetSendEmail = () => {
    let fethEmails = !sendEmail;
    setSendEmail(!sendEmail);

    if (fethEmails) {
      getUserEmails();
    }
  };

  const handleSetSendEmailToProjectManager = () => {
    let fetchEmails = !sendEmailToProjectManager;
    setSendEmailToProjectManager(!sendEmailToProjectManager);

    if (fetchEmails) {
      getUserEmails();
    }
  };

  const handleUserEmailChange = (email) => {
    const tagsUpdated = userEmails.map((el) => {
      if (el.email === email) {
        el.selected = !el.selected;
      }
      return el;
    });

    setUserEmails(tagsUpdated);
  };

  const handleProjectManagerEmailChange = (email) => {
    const tagsUpdated = projectManagerEmails.map((el) => {
      if (el.email === email) {
        el.selected = !el.selected;
      }
      return el;
    });

    setProjectManagerEmails(tagsUpdated);
  };

  const createJobComment = async () => {
    const selectedEmails = userEmails.filter((el) => el.selected);
    const selectedProjectManagerEmails = projectManagerEmails.filter(
      (el) => el.selected
    );

    if (sendEmail && selectedEmails.length === 0) {
      alert("Select at least one email to send the email to.");
      return;
    }

    if (
      sendEmailToProjectManager &&
      selectedProjectManagerEmails.length === 0
    ) {
      alert("Select at least one project manager email to send the email to.");
      return;
    }

    const request = {
      comment,
      sendSMS,
      isPublic,
      sendEmail,
      sendEmailToProjectManager,
      emails: selectedEmails.map((el) => el.email),
      projectManagerEmails: selectedProjectManagerEmails.map((el) => el.email),
    };

    setCreateCommentLoading(true);

    try {
      const { data } = await api.createJobComment(jobId, request);

      const updatedComments = [...comments, data];

      setComments(updatedComments);
      setComment("");

      setCreateCommentLoading(false);

      setSendEmail(false);
      setSendEmailToProjectManager(false);

      toast.success("Comment created!");
    } catch (error) {
      setCreateCommentLoading(false);

      if (error.response?.status === 403) {
        alert("You do not have permission to create a comment for this job.");
      } else {
        alert("Unable to create comment.");
      }
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const toggleCommentVisibility = async (comment) => {
    try {
      await api.updateComment(comment.id);

      const updatedComments = comments.map((c) => {
        if (c.id === comment.id) {
          return { ...c, is_public: !c.is_public };
        }

        return c;
      });

      setComments(updatedComments);
    } catch (error) {
      alert("Unable to update comment");
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="mt-8 m-auto max-w-2xl">
          <div className="flex flex-row">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-600">Comments</h1>
            </div>
          </div>
          <div className="my-4">
            <div
              className="mt-8 flex flex-col pr-1 pb-8"
              style={{ maxHeight: "450px", overflowY: "auto" }}
            >
              {comments.length === 0 && (
                <>
                  <div className="text-gray-700 font-medium text-md flex justify-center mt-2">
                    No comments found.
                  </div>
                  <p className="text-gray-500 text-md flex justify-center">
                    Be the first to comment!
                  </p>
                </>
              )}
              <ul className="space-y-8">
                {comments.map((comment) => (
                  <li key={comment.id} className="hover:bg-gray-50 pt-1">
                    <div className="flex space-x-3">
                      <div className="flex">
                        <div className="w-12 text-center">
                          {comment.author.profile.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={comment.author.profile.avatar}
                              alt=""
                            />
                          ) : (
                            <div
                              className="w-10"
                              style={{
                                lineHeight: "36px",
                                borderRadius: "50%",
                                fontSize: "15px",
                                background: "#959aa1",
                                color: "#fff",
                              }}
                            >
                              {comment.author.username
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full pr-4">
                        <div className="text-sm flex justify-between">
                          <div className="font-medium text-gray-700">
                            {comment.author.first_name}{" "}
                            {comment.author.last_name}
                          </div>

                          {(currentUser.isAdmin ||
                            currentUser.isSuperUser ||
                            currentUser.isAccountManager) && (
                            <div className="flex gap-x-4">
                              <div
                                className="ml-4 cursor-pointer"
                                onClick={() => toggleCommentVisibility(comment)}
                              >
                                <span
                                  className="relative inline-flex items-center
                                                    rounded-full border border-gray-300 px-2 py-0.5 ml-2"
                                >
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        comment.is_public
                                          ? "bg-green-500"
                                          : "bg-rose-500"
                                      }`}
                                    />
                                  </div>
                                  <div className="ml-3 text-xs text-gray-700">
                                    {comment.is_public ? "Public" : "Internal"}
                                  </div>
                                </span>
                              </div>
                              <div>
                                <TrashIcon
                                  onClick={() =>
                                    handleToggleDeleteCommentModal(comment)
                                  }
                                  className="h-4 w-4 cursor-pointer text-gray-500 relative"
                                  style={{ top: "2px" }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          <p>{comment.comment}</p>
                        </div>
                        <div className="mt-2 space-x-2 text-sm">
                          <span className="font-medium text-gray-500">
                            <ReactTimeAgo
                              date={new Date(comment.created)}
                              locale="en-US"
                              timeStyle="twitter"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div ref={bottomRef} />
            </div>
            <div className="bg-gray-50 px-2 py-6 xs:px-2">
              <div className="flex space-x-3">
                <div className="min-w-0 flex-1">
                  <div className="flex">
                    <textarea
                      id="comment"
                      name="comment"
                      rows={2}
                      value={comment}
                      onChange={handleCommentChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm
                                          focus:border-blue-400 focus:ring-sky-400 text-md max-h-20"
                      placeholder="Add a comment..."
                    />
                  </div>

                  {comment.length > 0 && (
                    <>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="pr-8">
                          {(currentUser.isAdmin ||
                            currentUser.isSuperUser ||
                            currentUser.isAccountManager ||
                            currentUser.isInternalCoordinator) && (
                            <div className="flex">
                              <div className="flex h-5 items-center">
                                <input
                                  id="sendSMS"
                                  name="sendSMS"
                                  value={sendSMS}
                                  onClick={handleSetSendSMS}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-red-600
                                                  focus:ring-red-500"
                                />
                              </div>
                              <div className="ml-3">
                                <label
                                  htmlFor="sendSMS"
                                  className="font-medium text-gray-700 text-md"
                                >
                                  Send SMS
                                </label>
                                <p className="text-gray-500 text-sm">
                                  Notify assigned project managers.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={createCommentLoading}
                          onClick={() => createJobComment()}
                          className="inline-flex items-center justify-center rounded-md
                                              border border-transparent bg-red-600 px-2 py-1 text-md
                                              text-white shadow-sm hover:bg-red-700 focus:outline-none
                                              focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          {createCommentLoading ? "....." : "Post"}
                        </button>
                      </div>
                      {(currentUser.isAdmin ||
                        currentUser.isSuperUser ||
                        currentUser.isAccountManager) && (
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex">
                            <div className="flex h-5 items-center">
                              <input
                                id="public"
                                name="public"
                                value={isPublic}
                                onClick={handleSetIsPublic}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-red-600
                                                  focus:ring-red-500"
                              />
                            </div>
                            <div className="ml-3 text-md">
                              <label
                                htmlFor="public"
                                className="font-medium text-gray-700"
                              >
                                Public
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                      {(currentUser.isAdmin ||
                        currentUser.isSuperUser ||
                        currentUser.isAccountManager) && (
                        <>
                          <div className="mt-5 flex items-center justify-between">
                            <div className="flex">
                              <div className="flex h-5 items-center">
                                <input
                                  id="email"
                                  name="email"
                                  value={sendEmail}
                                  onClick={handleSetSendEmail}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-red-600
                                                    focus:ring-red-500"
                                />
                              </div>
                              <div className="ml-3">
                                <label
                                  htmlFor="email"
                                  className="font-medium text-gray-700 text-md"
                                >
                                  Send Email to Job Creator
                                </label>
                                <p className="text-gray-500 text-sm">
                                  Send an email notification to the user that
                                  created this job.
                                </p>
                              </div>
                            </div>
                          </div>

                          {sendEmail && userEmails.length === 0 && (
                            <div className="mt-3">
                              <p className="text-gray-500 text-center m-auto text-sm">
                                No emails specified for the user that created
                                this job. You can add emails in the Team view.
                              </p>
                            </div>
                          )}

                          {sendEmail && userEmails.length > 0 && (
                            <div className="ml-6 mt-4 px-7">
                              <div className="mb-3 text-md">
                                Select which emails you want to use:
                              </div>
                              {userEmails.map((userEmail, index) => (
                                <div
                                  key={index}
                                  className="relative flex items-start mb-3"
                                >
                                  <div className="flex h-5 items-center">
                                    <input
                                      id={"email" + index}
                                      checked={userEmail.selected}
                                      onChange={() =>
                                        handleUserEmailChange(userEmail.email)
                                      }
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm cursor-pointer">
                                    <label
                                      htmlFor={"email" + index}
                                      className="text-gray-700"
                                    >
                                      {userEmail.email}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-5 flex items-center justify-between">
                            <div className="flex">
                              <div className="flex h-5 items-center">
                                <input
                                  id="emailProjectManager"
                                  name="emailProjectManager"
                                  value={sendEmailToProjectManager}
                                  onClick={handleSetSendEmailToProjectManager}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-red-600
                                                        focus:ring-red-500"
                                />
                              </div>
                              <div className="ml-3">
                                <label
                                  htmlFor="emailProjectManager"
                                  className="font-medium text-gray-700 text-md"
                                >
                                  Send Email to Assigned Project Managers
                                </label>
                                <p className="text-gray-500 text-sm">
                                  Send an email notification to the PMs assigned
                                  to this job.
                                </p>
                              </div>
                            </div>
                          </div>

                          {sendEmailToProjectManager &&
                            projectManagerEmails.length === 0 && (
                              <div className="mt-3">
                                <p className="text-gray-500 text-center m-auto text-sm">
                                  No emails specified for assigned project
                                  managers. You can add emails in the Team view.
                                </p>
                              </div>
                            )}

                          {sendEmailToProjectManager &&
                            projectManagerEmails.length > 0 && (
                              <div className="ml-6 mt-4 px-7">
                                <div className="mb-3 text-md">
                                  Select which emails you want to use:
                                </div>
                                {projectManagerEmails.map(
                                  (userEmail, index) => (
                                    <div
                                      key={index}
                                      className="relative flex items-start mb-3"
                                    >
                                      <div className="flex h-5 items-center">
                                        <input
                                          id={"emailProjectManager" + index}
                                          checked={userEmail.selected}
                                          onChange={() =>
                                            handleProjectManagerEmailChange(
                                              userEmail.email
                                            )
                                          }
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                      </div>
                                      <div className="ml-3 text-sm cursor-pointer">
                                        <label
                                          htmlFor={
                                            "emailProjectManager" + index
                                          }
                                          className="text-gray-700"
                                        >
                                          {userEmail.email}
                                        </label>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteCommentModalOpen && (
        <DeleteCommentModal
          isOpen={isDeleteCommentModalOpen}
          handleClose={handleToggleDeleteCommentModal}
          deleteComment={deleteComment}
          comment={commentToBeDeleted}
        />
      )}
    </AnimatedPage>
  );
};

export default JobComments;
