import { useState } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateFBOModal = ({ isOpen, handleClose, addFBO }) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const createFBO = () => {
    if (name.length === 0) {
      alert("Enter a name");
    }

    addFBO({ name: name, public: isPublic });
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2 px-2">
        <div className="">
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-xl m-auto flex justify-center text-center font-medium leading-6 text-gray-900 relative top-1"
            >
              Create FBO
            </Dialog.Title>

            <div className="mt-8">
              <div>
                <label
                  htmlFor="locationName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name{" "}
                  <span className=" text-gray-400 text-sm">
                    (Must be unique)
                  </span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="locationName"
                    id="locationName"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <Switch.Group
              as="li"
              className="flex items-center justify-between py-4 mt-3"
            >
              <div className="flex flex-col">
                <Switch.Label
                  as="p"
                  className="text-md font-medium text-gray-700"
                  passive
                >
                  Public
                </Switch.Label>
                <Switch.Description className="text-md text-gray-500">
                  Customer users can only see public airports while creating a
                  job.
                </Switch.Description>
              </div>
              <Switch
                checked={isPublic}
                onChange={setIsPublic}
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
        <div className="mt-12 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => createFBO()}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Create
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

export default CreateFBOModal;
