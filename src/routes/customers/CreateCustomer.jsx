import { useState, useEffect, Fragment } from "react"
import Loader from "../../components/loader/Loader"
import { Link, useNavigate } from "react-router-dom"
import { Listbox, Transition, Switch } from '@headlessui/react'
import { PlusIcon, CheckIcon } from "@heroicons/react/outline"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import ImageUploading from 'react-images-uploading';
import * as api from './apiService'
import { toast } from "react-toastify"

import Input from 'react-phone-number-input/input'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ChevronUpDownIcon = () => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
  )
}


const CreateCustomer = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [about, setAbout] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [billingAddress, setBillingAddress] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    
    const [contacts, setContacts] = useState([]);
    const [contactSelected, setContactSelected] = useState(null);

    const [billingInfo, setBillingInfo] = useState(null);
    const [specialInstructions, setSpecialInstructions] = useState(null);

    const [priceList, setPriceList] = useState([])
    const [priceListSelected, setPriceListSelected] = useState(null);

    const [retainerAmount, setRetainerAmount] = useState(null);

    const [showSpendingInfo, setShowSpendingInfo] = useState(false)
    const [allowCancelJob, setAllowCancelJob] = useState(false)
    const [showJobPrice, setShowJobPrice] = useState(false)

    const [discounts, setDiscounts] = useState([])
    const [fees, setFees] = useState([])


    useEffect(() => {
      //get contact list

      // get price list
      getPriceList()

      //only get these when clicking on Add and cache it
          // get airports
          // get fbos
          //get services

    }, [])

    const getPriceList = async () => {
        const { data } = await api.getPriceList();

        setPriceList(data.results);
        setPriceListSelected(data.results[0])
    }

    return (
        <AnimatedPage>
        <div className="mx-auto max-w-6xl px-8 pb-16 lg:pb-12 antialiased overflow-hidden border py-4 rounded-lg mb-20">
        <div>
            <h1 className="text-xl font-semibold text-gray-600">Add a new customer</h1>
            <p className="mt-1 text-sm text-gray-500">
                Let’s get started by filling in the information below to create a new customer.
            </p>
        </div>
        <form className="space-y-8 divide-y divide-gray-200 mt-6">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>
  
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
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
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  About
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="about"
                    name="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={3}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                  <p className="mt-2 text-sm text-gray-500">Write a few sentences about this customer.</p>
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center">
                    <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Cover photo
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium
                                 text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500
                                  focus-within:ring-offset-2 hover:text-red-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Detailed Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Billing and contact information.</p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Phone Number
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <Input
                    country="US"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                    focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                    value={phoneNumber}
                    onChange={setPhoneNumber}/>
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Email address
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    id="email"
                    name="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    type="email"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                             focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Contact
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                             focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                  >
                    <option>user 1</option>
                    <option>user 2</option>
                    <option>user 3</option>
                  </select>
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="billingInfo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Billing Info
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    value={billingInfo}
                    onChange={(e) => setBillingInfo(e.target.value)}
                    name="billingInfo"
                    id="billingInfo"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                             focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Special Instructions
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    id="instructions"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                             focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                  />
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Price List
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Listbox value={priceListSelected} onChange={setPriceListSelected}>
                      {({ open }) => (
                          <>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full max-w-lg sm:max-w-xs sm:text-sm
                                                           cursor-default rounded-md border
                                                          border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                          shadow-sm focus:border-sky-500 focus:outline-none
                                                          focus:ring-1 focus:ring-sky-500">
                                  <span className="block truncate">
                                      {priceListSelected ? priceListSelected.name : 'Select price list'}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                  </span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0">
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-80 overflow-auto
                                                                rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {priceList.map((price) => (
                                            <Listbox.Option
                                                key={price.id}
                                                className={({ active }) =>
                                                        classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                value={price}>
                                                {({ selected, active }) => (
                                                    <>
                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                            {price.name}
                                                        </span>
                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                active ? 'text-white' : 'text-red-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                )}>
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                            </>
                        )}
                    </Listbox>
                </div>
              </div>
  
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="retainerAmount" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Retainer Amount (monthly)
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    value={retainerAmount}
                    onChange={(e) => setRetainerAmount(e.target.value)}
                    name="retainerAmount"
                    id="retainerAmount"
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                             focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Settings</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information is only visible to admins and account managers.
              </p>
            </div>
            <div className="divide-y divide-gray-200">
                  <div className="">
                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-700" passive>
                            Show Spending Info
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Controls whether to show the "Spending Info" in the customer dashboard for this customer.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={showSpendingInfo}
                          onChange={setShowSpendingInfo}
                          className={classNames(
                            showSpendingInfo ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              showSpendingInfo ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-700" passive>
                            Allow Cancel Job
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Controls whether this customer can cancel a job while the status is "submitted" or "accepted"
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={allowCancelJob}
                          onChange={setAllowCancelJob}
                          className={classNames(
                            allowCancelJob ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              allowCancelJob ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-700" passive>
                            Show Job Price
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Controls whether the customer can see the job price across different screens in the app.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={showJobPrice}
                          onChange={setShowJobPrice}
                          className={classNames(
                            showJobPrice ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              showJobPrice ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </ul>
                  </div>
                  </div>
          </div>

            <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
                <div className="flex justify-between">
                    <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Discounts</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        This information is only visible to admins and account managers.
                    </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300
                                    bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                            <PlusIcon className="-ml-2 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Additional Fees</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            This information is only visible to admins and account managers.
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300
                                    bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                            <PlusIcon className="-ml-2 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                            <span>Add</span>
                        </button>
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
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border
                         border-transparent bg-red-600 py-2 px-4 text-sm font-medium
                          text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                           focus:ring-red-500 focus:ring-offset-2"
            >
              Create Customer
            </button>
          </div>
        </div>
        </form>
        </div>
        </AnimatedPage>
    )
}

export default CreateCustomer;