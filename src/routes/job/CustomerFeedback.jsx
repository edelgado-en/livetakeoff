import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactTimeAgo from "react-time-ago";

import * as api from "./apiService";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function Star({ filled, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-8 w-8 transition-transform ${className}`}
      aria-hidden="true"
    >
      {filled ? (
        <path
          fill="currentColor"
          d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
        />
      )}
    </svg>
  );
}

function StarRating({ value, onChange, label = "Rate your service" }) {
  const [hover, setHover] = useState(null);
  const current = hover ?? value;

  return (
    <div
      aria-label={label}
      role="radiogroup"
      className="flex items-center justify-center gap-2"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const ratingValue = i + 1;
        const filled = ratingValue <= current;
        const ariaChecked = value === ratingValue;
        return (
          <button
            key={ratingValue}
            type="button"
            role="radio"
            aria-checked={ariaChecked}
            aria-label={`${ratingValue} out of 5`}
            className="text-yellow-500 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 rounded"
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(ratingValue)}
            onBlur={() => setHover(null)}
            onClick={() => onChange(ratingValue)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") onChange(clamp(value + 1, 1, 5));
              if (e.key === "ArrowLeft") onChange(clamp(value - 1, 1, 5));
            }}
          >
            <Star filled={filled} />
          </button>
        );
      })}
    </div>
  );
}

export default function CustomerFeedbackCard({
  jobId,
  feedback_rating,
  noFeedbackSubmittedYet,
  currentUser,
  feedback_author,
}) {
  const [rating, setRating] = useState(feedback_rating || 0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [noFeedbackYet, setNoFeedbackYet] = useState(noFeedbackSubmittedYet);
  const [feedbacks, setFeedbacks] = useState([]);

  const [mandatoryMessage, setMandatoryMessage] = useState("");

  const canSubmit = rating >= 1 && !submitting;

  useEffect(() => {
    getJobFeedback();
  }, []);

  const getJobFeedback = async () => {
    try {
      const { data } = await api.getJobFeedback(jobId);

      setFeedbacks(data);
    } catch (error) {
      toast.error("Error fetching job feedback.");
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating < 1) {
      toast.error("Please provide a rating before submitting.");
      return;
    }

    //show alert if rating is between 1 and 3 inclusive
    if (rating >= 1 && rating <= 3) {
      setMandatoryMessage(
        "We're sorry to hear that your experience wasn't great. Please let us know how we can improve in a comment below."
      );
    } else {
      setMandatoryMessage("");
    }

    // if rating is 3 or below, comment is mandatory
    if (rating <= 3 && comment.trim().length === 0) {
      toast.error("Please provide a comment for ratings 3 or below.");
      return;
    }

    setSubmitting(true);

    try {
      await api.submitJobFeedback({ job_id: jobId, rating, comment });
      setNoFeedbackYet(false);
      toast.success("Thank you for your feedback!");
      getJobFeedback();
    } catch (error) {
      toast.error("Error submitting feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!noFeedbackYet) {
    return (
      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Customer feedback
            </h2>
            {currentUser.isCustomer && (
              <p className="mt-1 text-md text-gray-500">
                Thank you! Your feedback was submitted.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < rating} className="text-yellow-500" />
          ))}
          <span className="ml-2 text-sm text-gray-700">{rating}/5</span>
        </div>

        {feedbacks.length > 0 && (
          <div className="mt-4">
            {feedbacks.map((fb, index) => (
              <div key={index} className="mb-4 border-b pb-2">
                <div className="mt-3 text-gray-500">
                  {fb.author?.first_name} {fb.author?.last_name} -{" "}
                  <ReactTimeAgo
                    date={new Date(fb.created)}
                    locale="en-US"
                    timeStyle="twitter"
                  />
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {fb.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (
    currentUser.isAdmin ||
    currentUser.isSuperUser ||
    currentUser.isAccountManager ||
    currentUser.isInternalCoordinator ||
    currentUser.isCustomer
  ) {
    return (
      <section className="mt-6 rounded-2xl border border-gray-300 bg-white shadow-sm p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Customer feedback
            </h2>
            <p className="mt-1 text-md text-gray-500">
              How did we do on this job? Your feedback helps us improve.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <StarRating value={rating} onChange={setRating} />
          <p className="mt-2 text-center text-xs text-gray-500">
            1 = Poor • 5 = Excellent
          </p>
        </div>

        <div className="mt-5">
          {mandatoryMessage.length > 0 && (
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {mandatoryMessage}
            </div>
          )}
          <label
            htmlFor="feedback-comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comments (optional)
          </label>
          <div className="mt-2">
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Share details (optional)…"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                            focus:border-sky-500 focus:ring-sky-500"
            />
            <div className="mt-1 text-right text-xs text-gray-500">
              {comment.length}/{500}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmitFeedback}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm
                                font-semibold text-white shadow-sm
                ${
                  canSubmit
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-400 cursor-not-allowed"
                }`}
          >
            {submitting ? "Submitting…" : "Submit feedback"}
          </button>
        </div>
      </section>
    );
  }
}
