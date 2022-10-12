import { useState, useEffect, Fragment } from "react"
import Loader from "../../components/loader/Loader"
import { Listbox, Transition } from '@headlessui/react'
import { PlusIcon, CheckIcon } from "@heroicons/react/outline"

const ChevronUpDownIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
    )
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const customers = [
    { id: 1, name: 'Aircharter Worldwide' },
    { id: 2, name: 'Delta Private Jets' },
    { id: 3, name: 'Eastern Airlines' },
    { id: 4, name: 'Executive jet Management' },
    { id: 5, name: 'Jet Edge' },
]

const aircraftTypes = [
    { id: 1, name: 'Citation CJ2' },
    { id: 2, name: 'Citaion CJ3' },
    { id: 3, name: 'Lear 35' },
    { id: 4, name: 'Citaion 560' },
    { id: 5, name: 'Hawker 400XP/Beechjet' },
]

const airports = [
    { id: 1, name: 'KBCT/BCT Boca Raton Airport' },
    { id: 2, name: 'KFLL/FLL Fort Lauderdale-Hollywood International Airport' },
    { id: 3, name: 'KFE/FXE Fort Lauderdale Executive Airport' },
    { id: 4, name: 'KHND/HND Henderson Executive Airport' },
    { id: 5, name: 'KLAS/LAS Harry Reid International Airport Las Vegas' },
]

const fbos = [
    { id: 1, name: 'Atlantic Aviation BCT' },
    { id: 2, name: 'Atlantic Aviation FXE' },
    { id: 3, name: 'Atlantic Aviation LAS' },
    { id: 4, name: 'Atlantic Aviation OPF' },
    { id: 5, name: 'Atlantic Aviation PBI' },
]

const team = [
    {
      name: 'Calvin Hawkins',
      email: 'calvin.hawkins@example.com',
      imageUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Bessie Richards',
      email: 'bessie.richards@example.com',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Floyd Black',
      email: 'floyd.black@example.com',
      imageUrl:
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ]

const people = [
    "Wade Cooper",
    "Arlene Mccoy",
    "Devon Webb",
    "Tom Cook",
    "Tanya Fox",
    "Hellen Schmidt",
    "Caroline Schultz",
    "Mason Heaney",
    "Claudie Smitham",
    "Emil Schaefer"
]

const CreateJob = () => {
    const [loading, setLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)
    const [customerSelected, setCustomerSelected] = useState(customers[0])
    const [aircraftTypeSelected, setAircraftTypeSelected] = useState(aircraftTypes[0])
    const [airportSelected, setAirportSelected] = useState(airports[0])
    const [fboSelected, setFboSelected] = useState(fbos[0])

    const [isServicesOpen, setIsServicesOpen] = useState(true);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {

    }, [])

    const isServiceSelected = (value) => {
        return selectedServices.find((el) => el === value) ? true : false;
    }
    
    const handleSelectService = (value) => {
        if (!isServiceSelected(value)) {
            const selectedPersonsUpdated = [
                ...selectedServices,
                people.find((el) => el === value)
            ]
            
            setSelectedServices(selectedPersonsUpdated);
        
        } else {
            handleDeselectService(value);
        }

        setIsServicesOpen(true);
    }
    
    const handleDeselectService = (value) => {
        const selectedServicesUpdated = selectedServices.filter((el) => el !== value);
        setSelectedServices(selectedServicesUpdated);
        setIsServicesOpen(true);
    }


    return (
        <div>
            <main className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
        <form>
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-medium leading-6 text-gray-900">Create Job</h1>
              <p className="mt-1 text-sm text-gray-500">
                Let’s get started by filling in the information below to create a new job.
              </p>
            </div>

            <div>
              <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700">
                Tail Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="tailNumber"
                  id="tailNumber"
                  className="block w-full rounded-md border-gray-300 shadow-sm
                           focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="mt-1">
                <Listbox value={customerSelected} onChange={setCustomerSelected}>
                    {({ open }) => (
                        <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700">Customer</Listbox.Label>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                     border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                       shadow-sm focus:border-sky-500 focus:outline-none
                                                       focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                <span className="block truncate">{customerSelected.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {customers.map((customer) => (
                                    <Listbox.Option
                                        key={customer.id}
                                        className={({ active }) =>
                                        classNames(
                                            active ? 'text-white bg-red-600' : 'text-gray-900',
                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                        }
                                        value={customer}
                                    >
                                        {({ selected, active }) => (
                                        <>
                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                {customer.name}
                                            </span>

                                            {selected ? (
                                                <span
                                                    className={classNames(
                                                    active ? 'text-white' : 'text-red-600',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                >
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
            <div>
            <Listbox
                    as="div"
                    className="space-y-1"
                    value={selectedServices}
                    onChange={(value) => handleSelectService(value)}
                    open={isServicesOpen}
                    >
                {() => (
            <>
              <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                Services
              </Listbox.Label>
              <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                  <Listbox.Button
                    className="cursor-default relative w-full rounded-md border border-gray-300
                             bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue
                              focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    open={isServicesOpen}
                  >
                    <span className="block truncate">
                      {selectedServices.length < 1
                        ? "Select services"
                        : `Selected services (${selectedServices.length})`}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Listbox.Button>
                </span>

                <Transition
                  unmount={false}
                  show={isServicesOpen}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                >
                  <Listbox.Options
                    static
                    className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs
                               overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                  >
                    {people.map((person) => {
                      const selected = isServiceSelected(person);
                      return (
                        <Listbox.Option key={person} value={person}>
                          {({ active }) => (
                            <div
                              className={`${
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900"
                              } cursor-default select-none relative py-2 pl-8 pr-4`}
                            >
                              <span
                                className={`${
                                  selected ? "font-semibold" : "font-normal"
                                } block truncate`}
                              >
                                {person}
                              </span>
                              {selected && (
                                <span
                                  className={`${
                                    active ? "text-white" : "text-red-600"
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="add-team-members" className="block text-sm font-medium text-gray-700">
                  Add Team Members
                </label>
                <p id="add-team-members-helper" className="sr-only">
                  Search by email address
                </p>
                <div className="flex">
                  <div className="flex-grow">
                    <input
                      type="text"
                      name="add-team-members"
                      id="add-team-members"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="Email address"
                      aria-describedby="add-team-members-helper"
                    />
                  </div>
                  <span className="ml-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="-ml-2 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span>Add</span>
                    </button>
                  </span>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                  {team.map((person) => (
                    <li key={person.email} className="flex py-4">
                      <img className="h-10 w-10 rounded-full" src={person.imageUrl} alt="" />
                      <div className="ml-3 flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{person.name}</span>
                        <span className="text-sm text-gray-500">{person.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md
                           border border-transparent bg-red-600 py-2 px-4
                           text-sm font-medium text-white shadow-sm hover:bg-red-600
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Continue with Assignment
              </button>
            </div>
          </div>
        </form>
      </main>
        </div>
    )
}

export default CreateJob;