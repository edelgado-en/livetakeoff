import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { PlusIcon, CheckIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import ImageUploading from "react-images-uploading";
import * as api from "./apiService";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const CreateVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createVendorMessage, setCreateVendorMessage] = useState(null);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [emails, setEmails] = useState("");

  const [avatarImages, setAvatarImages] = useState([]);

  const addVendor = async () => {
    if (name.length === 0) {
      alert("Please enter a name");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("notes", notes);
    formData.append("phoneNumbers", phoneNumbers);
    formData.append("billingAddress", billingAddress);
    formData.append("emails", emails);

    avatarImages.forEach((image) => {
      if (image.file.size < 10000000) {
        // less than 10MB
        formData.append("logo", image.file);
      }
    });

    setLoading(true);
    setCreateVendorMessage("Creating vendor. Please wait...");

    try {
      const { data } = await api.createVendor(formData);

      setLoading(false);
      setCreateVendorMessage(null);

      navigate("/vendors/" + data.id + "/profile/details");
    } catch (error) {
      toast.error("Unable to create vendor. Name might be taken.");
      setLoading(false);
      setCreateVendorMessage(null);
    }
  };

  const onChangeAvatarPhoto = (imageList, addUpdateIndex) => {
    setAvatarImages(imageList);
  };

  return (
    <AnimatedPage>
      {loading && (
        <>
          <Loader />
          {createVendorMessage && (
            <div className="text-gray-500 text-md m-auto text-center">
              {createVendorMessage}
            </div>
          )}
        </>
      )}

      {!loading && (
        <div className="mx-auto max-w-6xl px-8 pb-16 lg:pb-12 antialiased overflow-hidden border py-4 rounded-lg mb-20">
          <div>
            <h1 className="text-xl font-semibold text-gray-600">
              Add a new vendor
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Let’s get started by filling in the information below to create a
              new vendor.
            </p>
          </div>
          <form className="space-y-8 divide-y divide-gray-200 mt-6">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Name *
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                      <span className="text-sm text-gray-500">
                        Must be unique. Different vendors cannot share the same
                        name.
                      </span>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Notes
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        id="about"
                        name="about"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                      focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Write a few sentences about this vendor.
                      </p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Photo
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="flex items-center">
                        <ImageUploading
                          acceptType={["jpg", "svg", "png", "jpeg"]}
                          value={avatarImages}
                          onChange={onChangeAvatarPhoto}
                          maxNumber={1}
                          dataURLKey="data_url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                            errors,
                          }) => (
                            <>
                              {avatarImages.length === 0 && (
                                <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                  <svg
                                    className="h-full w-full text-gray-300"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                </span>
                              )}

                              {avatarImages.length > 0 &&
                                avatarImages.map((image, index) => (
                                  <>
                                    <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                      <img
                                        className="h-12 w-12 rounded-full ring-4
                                                          ring-white sm:h-32 sm:w-32 bg-white border-black"
                                        src={image["data_url"]}
                                        alt=""
                                      />
                                    </span>
                                    <span
                                      onClick={() => onImageRemove(index)}
                                      className="cursor-pointer text-xs text-gray-500 ml-4 underline"
                                    >
                                      remove
                                    </span>
                                  </>
                                ))}

                              <button
                                {...dragProps}
                                type="button"
                                onClick={onImageUpload}
                                className="ml-5 rounded-md border border-gray-300
                                             bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-70
                                              shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                               focus:ring-sky-500 focus:ring-offset-2"
                              >
                                Change
                              </button>

                              {errors && (
                                <div className="text-gray-500 mt-6 m-auto text-center text-sm">
                                  {errors.acceptType && (
                                    <span>
                                      Your selected file type is not allow
                                    </span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </ImageUploading>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Detailed Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Billing and contact information.
                  </p>
                </div>
                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Phone Numbers
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="phoneNumbers"
                        id="phoneNumbers"
                        placeholder="comma separated"
                        value={phoneNumbers}
                        onChange={(e) => setPhoneNumbers(e.target.value)}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Billing Address
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="billingAddress"
                        id="billingAddress"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Emails
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        id="email"
                        name="email"
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                        type="email"
                        placeholder="comma separated"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <div className="flex justify-end">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium
                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                              focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => addVendor()}
                  className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-sm font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
                >
                  Add Vendor
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </AnimatedPage>
  );
};

export default CreateVendor;
