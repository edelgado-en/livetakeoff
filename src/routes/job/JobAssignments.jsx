import { useEffect, useState, Fragment } from "react";
import Loader from "../../components/loader/Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

const people = [
    {
      id: 1,
      name: 'Belkis Grinan',
      availability: 'available',
      avatar:
        'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Juana Martinez',
      availability: 'available',
      avatar:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Leroy Hernandez',
      availability: 'available_soon',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    },
    {
      id: 4,
      name: 'Randy Fermin',
      availability: 'busy',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 5,
      name: 'Wilson Lizarazo',
      availability: 'busy',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 5,
        name: 'Unassign',
        availability: 'busy',
      },
  ]

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

const services = [
    { id: 1, name: 'Exterior detail (Full wet or dry wash)', status: 'A' },
    { id: 2, name: 'Basic Exterior (Exterior Takeoff Ready)', status: 'A' },
    { id: 3, name: 'Basic Interior (Interior Takeoff Ready)', status: 'A' },
    { id: 4, name: 'Interior Detail (Deep interior detailing with all seat cleaning, conditioning and protection)', status: 'A' },
    { id: 5, name: 'Carpet Extraction', status: 'W' },
    { id: 6, name: 'Electrostatic Disinfection', status: 'C' },
    { id: 7, name: 'Hand/Machine Wax', status: 'C' },
    { id: 8, name: 'Full wet wash and dry plus belly and landing gear degrease and wipe down', status: 'C' },
]

const JobAssignments = () => {
    const { jobId } = useParams();
    const [selected, setSelected] = useState(people[0])

    useEffect(() => {
        //fetch assignemnts for job id

    }, [])

    return (
        <AnimatedPage>
             <main className="mx-auto px-4 pb-16 lg:pb-12 max-w-6xl mt-8">
                <div>
                    <h1 className="text-xl font-semibold text-gray-600">Job Assignment</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        You can assign all services to one project manager or assign specific
                        managers to specific services.
                    </p>
                </div>
                <div className="mt-8 max-w-sm">
                    <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                        <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                     border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                       shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                        focus:ring-sky-500 sm:text-sm">
                                <span className="flex items-center">
                                    <img src={selected.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                    {selected.name !== 'Unassign' && (
                                        <span
                                            className={classNames(
                                                selected.availability === 'available' ? 'bg-green-400' 
                                                    : selected.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                            )}
                                        />
                                    )}
                                    
                                    <span className="ml-3 block truncate">{selected.name}</span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto
                                                      rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black
                                                       ring-opacity-5 focus:outline-none sm:text-sm">
                                {people.map((person) => (
                                <Listbox.Option
                                    key={person.id}
                                    className={({ active }) =>
                                    classNames(
                                        active ? 'text-white bg-red-600' : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                    )
                                    }
                                    value={person}
                                >
                                    {({ selected, active }) => (
                                    <>
                                        <div className="flex items-center">
                                            <img src={person.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                            {person.name !== 'Unassign' && (
                                                <span
                                                    className={classNames(
                                                        person.availability === 'available' ? 'bg-green-400' 
                                                            : person.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                        'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                    )}
                                                />
                                            )}
                                            
                                            <span
                                                className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                            >
                                                {person.name}
                                            </span>
                                        </div>

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
                <div className="mt-10">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        Services
                        <span className="bg-gray-100 text-gray-700 hidden ml-2 py-0.5 px-2.5
                                          rounded-full text-xs font-medium md:inline-block">{services.length}</span>
                    </div>
                    <div className="mt-1 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                        {services.length === 0 &&
                            <div className="text-sm text-gray-500">None</div>
                        }

                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="relative flex items-center space-x-3 rounded-lg
                                        border border-gray-300 bg-white px-6 py-5 shadow-sm
                                        hover:border-gray-400">
                                <div className="min-w-0 flex-1">
                                    <div className="focus:outline-none">
                                        <div className="grid grid-cols-3 text-sm pb-2">
                                            <div className="col-span-2 font-medium text-gray-900 relative top-1">{service.name}</div>
                                            <div className=" flex flex-col justify-end text-right">
                                                {service.status === 'A' && (
                                                    <div className="flex justify-end">
                                                        <img src={'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                    
                                                    </div>
                                                )}

                                                {service.status === 'W' && (
                                                    <>
                                                    <div className="flex justify-end">
                                                        <img src={'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                    </div>
                                                    <div className="text-xs font-semibold mt-2 text-green-500">
                                                        In Progress   
                                                    </div>
                                                    </>

                                                )}

                                                {service.status === 'C' && (
                                                    <div className="flex-shrink-0 flex justify-end">
                                                        <CheckCircleIcon className="h-6 w-6 text-red-400" />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        {service.status === 'A' && (
                                            <div className="mt-8">
                                                <Listbox value={selected} onChange={setSelected}>
                                                {({ open }) => (
                                                    <>
                                                    <Listbox.Label className="block text-sm text-gray-600">Assigned to</Listbox.Label>
                                                    <div className="relative mt-1">
                                                        <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                                shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                                                    focus:ring-sky-500 sm:text-sm">
                                                            <span className="flex items-center">
                                                                <img src={selected.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                                {selected.name !== 'Unassign' && (
                                                                    <span
                                                                        className={classNames(
                                                                            selected.availability === 'available' ? 'bg-green-400' 
                                                                                : selected.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                                            'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                                        )}
                                                                    />
                                                                )}
                                                                <span className="ml-3 block truncate">{selected.name}</span>
                                                            </span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto
                                                                                rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black
                                                                                ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {people.map((person) => (
                                                            <Listbox.Option
                                                                key={person.id}
                                                                className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                )
                                                                }
                                                                value={person}
                                                            >
                                                                {({ selected, active }) => (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <img src={person.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                                        {person.name !== 'Unassign' && (
                                                                            <span
                                                                            className={classNames(
                                                                                person.availability === 'available' ? 'bg-green-400' 
                                                                                    : person.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                                                'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                                            )}
                                                                            />
                                                                        )}
                                                                        
                                                                        <span
                                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                        >
                                                                            {person.name}
                                                                        </span>
                                                                    </div>

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
                                        )}
                                    </div>
                                </div>
                            
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row-reverse justify-end py-4 pb-20 gap-4 mt-8 max-w-md m-auto">
                    <Link to="/jobs" className="w-full">
                        <button
                            type="button"
                            className="nline-flex justify-center rounded-md w-full
                            border border-transparent bg-red-600 py-2 px-4
                            text-sm font-medium text-white shadow-sm hover:bg-red-600
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Assign
                        </button>
                    </Link>
                    <Link to="/jobs" className="w-full">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white w-full
                                    py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>  
                    </Link>
                </div>
            </main>
        </AnimatedPage>
    )
}

export default JobAssignments;