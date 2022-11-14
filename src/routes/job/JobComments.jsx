
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactTimeAgo from 'react-time-ago'
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";

import { useAppDispatch } from "../../app/hooks";
import { resetCommentsCount } from "./jobStats/jobStatsSlice";

import * as api from './apiService'

const notificationMethods = [
  { id: 'email', title: 'No' },
  { id: 'sms', title: 'Yes' },
]

const JobComments = () => {
    const { jobId } = useParams();
    const bottomRef = useRef(null);
    const [comment, setComment] = useState('') 
    const [comments, setComments] = useState([]) 
    const [loading, setLoading] = useState(false)
    const [sendSMS, setSendSMS] = useState(false)

    const currentUser = useAppSelector(selectUser)

    const dispatch = useAppDispatch();

    useEffect(() => {
      getComments()
      dispatch(resetCommentsCount())

    }, [])

    const getComments = async () => {
      setLoading(true)

      try {
        const { data } = await api.getJobComments(jobId);
        
        setComments(data.results)

      } catch (error) {

      }

      setLoading(false)

    }

    const handleSetSendSMS = () => {
      setSendSMS(!sendSMS)
    }

    const createJobComment = async () => {
      const request = {
        comment,
        sendSMS
      }

      const { data } = await api.createJobComment(jobId, request);

      const updatedComments = [...comments, data]

      setComments(updatedComments)
      setComment('')
    }

    const handleCommentChange = (event) => [
        setComment(event.target.value)
    ]

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
                    <div className="mt-8 flex flex-col pr-1 pb-8" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                      {comments.length === 0 &&  (
                          <>
                            <div className="text-gray-700 font-medium text-sm flex justify-center mt-2">
                                  No comments found.
                            </div>
                            <p className="text-gray-500 text-sm flex justify-center">Be the first to comment!</p>
                            </>
                          )}
                      <ul className="space-y-8">
                        {comments.map((comment) => (
                          <li key={comment.id}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 text-center">
                                  {comment.author.profile.avatar ? 
                                    <img className="h-10 w-10 rounded-full" src={comment.author.profile.avatar } alt="" />
                                      :
                                      <div className="w-10" style={{ lineHeight: '36px', borderRadius: '50%',
                                                                fontSize: '15px', background: '#959aa1', color: '#fff' }}>
                                        {comment.author.username.slice(0,2).toUpperCase()}
                                    </div>
                                    }
                                </div>
                              </div>
                              <div>
                                <div className="text-sm">
                                  <div className="font-medium text-gray-700">
                                    {comment.author.first_name} {' '} {comment.author.last_name}
                                  </div>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                  <p>{comment.comment}</p>
                                </div>
                                <div className="mt-2 space-x-2 text-sm">
                                  <span className="font-medium text-gray-500">
                                    <ReactTimeAgo date={new Date(comment.created)} locale="en-US" timeStyle="twitter" />
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
                                          focus:border-blue-400 focus:ring-sky-400 sm:text-sm max-h-20"
                                placeholder="Add a comment..."
                              />
                            </div>

                            { comment.length > 0 && (
                              <div className="mt-3 flex items-center justify-between">
                                <div className="pr-8">
                                  {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
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
                                    <div className="ml-3 text-sm">
                                      <label htmlFor="sendSMS" className="font-medium text-gray-700">
                                        Send SMS
                                      </label>
                                      <p className="text-gray-500">Notified assigned project managers.</p>
                                    </div>
                                    </div>
                                  )}
                                  {/* <div className="flex">
                                    <div className="text-sm mb-1 mr-4 relative" style={{top: '1px' }}>Customer Visible:</div>
                                    <div className="flex items-center space-y-0 space-x-5">
                                      {notificationMethods.map((notificationMethod) => (
                                        <div key={notificationMethod.id} className="flex items-center">
                                          <input
                                            id={notificationMethod.id}
                                            name="notification-method"
                                            type="radio"
                                            defaultChecked={notificationMethod.id === 'email'}
                                            className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                                          />
                                          <label htmlFor={notificationMethod.id} className="ml-1 block text-sm text-gray-600">
                                            {notificationMethod.title}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex">
                                      
                                  </div> */}
                                  
                                </div>
                                <button
                                  type="submit"
                                  onClick={() => createJobComment()}
                                  className="inline-flex items-center justify-center rounded-md
                                            border border-transparent bg-red-600 px-2 py-1 text-sm
                                            text-white shadow-sm hover:bg-red-700 focus:outline-none
                                            focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                  Post
                                </button>
                              </div>
                            ) }
                            
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        )}

      </AnimatedPage>
    )
}

export default JobComments;