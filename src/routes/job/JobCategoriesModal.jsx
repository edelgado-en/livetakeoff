import { useEffect, useMemo, useState } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog } from "@headlessui/react";
import * as api from "./apiService";
import { toast } from "react-toastify";

function Spinner({ className = "h-4 w-4" }) {
  return (
    <svg
      className={`animate-spin ${className} text-white`}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

const JobCategoriesModal = ({
  isOpen,
  handleClose,
  handleUpdateCategories,
  existingJobCategories,
  customerId,
  jobId,
}) => {
  const [customerCategories, setCustomerCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    void getCustomerCategories();
  }, [isOpen]);

  async function getCustomerCategories() {
    try {
      setFetching(true);
      const { data } = await api.searchCustomerCategories();
      const categories = (data?.results ?? []).map((category) => {
        const isSelected = existingJobCategories.some(
          (jobCategory) => jobCategory.customer_category.id === category.id
        );
        return { ...category, selected: isSelected };
      });
      setCustomerCategories(categories);
    } catch {
      toast.error("Unable to fetch customer categories");
    } finally {
      setFetching(false);
    }
  }

  const toggleCategorySelected = (category) => {
    setCustomerCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? { ...c, selected: !c.selected } : c
      )
    );
  };

  const selectedCount = useMemo(
    () => customerCategories.filter((c) => c.selected).length,
    [customerCategories]
  );

  const saveJobCategories = async () => {
    try {
      setLoading(true);
      const selectedCategoryIds = customerCategories
        .filter((c) => c.selected)
        .map((c) => c.id);

      const { data } = await api.updateJobCategories({
        job_id: jobId,
        customer_category_ids: selectedCategoryIds,
      });

      handleUpdateCategories(data);
      toast.success("Categories updated");
      handleClose();
    } catch {
      toast.error("Unable to save job categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-4">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold text-gray-900"
          >
            Manage Job Categories
          </Dialog.Title>
          <p className="mt-1 text-sm text-gray-500">
            Select the categories to associate with this job.{" "}
            <span className="text-gray-700 font-medium">{selectedCount}</span>{" "}
            selected.
          </p>
        </div>

        {/* Category chips */}
        <div
          className="rounded-lg border border-gray-200 bg-white"
          style={{ maxHeight: 360 }}
        >
          {fetching ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-32 rounded bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : customerCategories.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No categories found.
            </div>
          ) : (
            <div className="p-3 overflow-auto">
              <div className="flex flex-wrap gap-2">
                {customerCategories.map((category) => {
                  const active = category.selected;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategorySelected(category)}
                      aria-pressed={active}
                      className={`
                        inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition
                        ring-1 ring-inset
                        ${
                          active
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
                            : "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50"
                        }
                      `}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          active ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex w-full sm:w-auto justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveJobCategories}
            disabled={loading}
            className="inline-flex w-full sm:w-auto items-center
                     justify-center gap-2 rounded-md border
                      border-transparent bg-red-500
                       px-4 py-2 text-sm font-semibold text-white
                        shadow-sm hover:bg-red-700
                         focus:outline-none focus:ring-2
                          focus:ring-red-500 focus:ring-offset-2
                           disabled:opacity-70"
          >
            {loading ? <Spinner /> : null}
            <span>{loading ? "Saving…" : "Save changes"}</span>
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default JobCategoriesModal;
