import { useEffect, useState, Fragment } from "react";
import Loader from "../../components/loader/Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import { TrashIcon } from "@heroicons/react/solid"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import AddServiceModal from './AddServiceModal';
import DeleteServiceModal from './DeleteServiceModal'

import * as api from './apiService'

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

const JobAssignments = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(false)
    const [projectManagers, setProjectManagers] = useState([])
    const [selectedProjectManager, setSelectedProjectManager] = useState(null)
    const [services, setServices] = useState([])
    // TODO: need to add retainer services


    const [isAddServiceModalOpen, setAddServiceModalOpen] = useState(false)
    const [isDeleteServiceModalOpen, setDeleteServiceModalOpen] = useState(false)

    const [serviceToBeDeleted, setServiceToBeDeleted] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        getFormInfo()
    }, [])

    const getFormInfo = async () => {
        setLoading(true)

        try {
            const { data } = await api.getAssignmentsFormInfo(jobId)

            data.project_managers.push({
                id: 999,
                first_name: 'Unassign',
                last_name: '',
                availability: 'busy',
                profile: {
                    'avatar': 'https://res.cloudinary.com/datidxeqm/image/upload/v1666103235/media/profiles/unassign_fgdefu.png'
                }
            })
            
            // append data.project_managers to each service
            const updatedServices = data.services.map((s) => {
                s = {...s, projectManagers: data.project_managers}

                if (s.project_manager) {
                    //set selected
                    s.selectedProjectManager = data.project_managers.find(p => p.id === s.project_manager.id)

                } else {
                    //set selected as unassign
                    s.selectedProjectManager = data.project_managers.find(p => p.id === 999)
                }

                return s;
            })
    
            setServices(updatedServices)

            //TODO: add retainer services
    
            setProjectManagers(data.project_managers)

            setLoading(false)

        } catch (err) {
            setLoading(false)
        }

    }

    const handleAssignment = async () => {

        const updatedServices = services.map((s) => {
            const user = s.selectedProjectManager.id === 999 ? null : s.selectedProjectManager.id;

            return {
                'assignment_id': s.id, 
                'user_id': user
            }
        })


        const request = {
            'services': updatedServices
        }

        console.log(request)

        //TODO: add loading

        try {
            await api.assignServices(jobId, request);

            navigate('/jobs/' + jobId + '/details')

        } catch (error) {

        }
      
    }

    const handleToggleAddServiceModal = () => {
        //TODO: make the API call here to get the available services to pass to the modal window
        // ONLY WHEN OPENING MODAL

        setAddServiceModalOpen(!isAddServiceModalOpen)
    }

    const handleToggleDeleteServiceModal = (service) => {
        if (service) {
            setServiceToBeDeleted(service)
        }
        setDeleteServiceModalOpen(!isDeleteServiceModalOpen)
    }

    const setSelectedServiceProjectManager = (selectedPerson, serviceId) => {

        const updatedServices = services.map((s) => {
            if (s.id === serviceId) {
                s = {...s, selectedProjectManager: selectedPerson}
            }

            return s
        })

        setServices(updatedServices) 

    }

    const deleteService = () => {

    }

    const setMainProjectManager = (selectedPerson) => {
        setSelectedProjectManager(selectedPerson)

        const updatedServices = services.map((s) => {
            s = {...s, selectedProjectManager: selectedPerson}

            return s
        })

        setServices(updatedServices) 

    }

    return (
        <AnimatedPage>
             <main className="mx-auto px-4 pb-16 lg:pb-12 max-w-6xl mt-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-600">Service Assignment</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        You can assign all services to one project manager or assign specific
                        managers to specific services.
                    </p>
                </div>

                {loading && <Loader />}  

                {!loading && (
                    <>
                    <div className="mt-8 max-w-sm">
                        <Listbox value={selectedProjectManager} onChange={(person) => setMainProjectManager(person)}>
                        {({ open }) => (
                            <>
                            <Listbox.Label className="block text-sm font-medium text-gray-700">Assigned to</Listbox.Label>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                        shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                            focus:ring-sky-500 sm:text-sm">
                                    <span className="flex items-center">
                                        {selectedProjectManager && (
                                            <>
                                                <img src={selectedProjectManager.profile?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                <span
                                                    className={classNames(
                                                        selectedProjectManager.availability === 'available' ? 'bg-green-400' 
                                                            : selectedProjectManager.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                        'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                    )}
                                                />
                                            </>
                                        )}
                                        
                                        <span className="ml-3 block truncate">
                                            {selectedProjectManager ? selectedProjectManager.first_name + ' ' + selectedProjectManager.last_name : 'Applies to all services'}
                                        </span>
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
                                    {projectManagers.map((projectManager) => (
                                    <Listbox.Option
                                        key={projectManager.id}
                                        className={({ active }) =>
                                        classNames(
                                            active ? 'text-white bg-red-600' : 'text-gray-900',
                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                        }
                                        value={projectManager}
                                    >
                                        {({ selected, active }) => (
                                        <>
                                            <div className="flex items-center">
                                                <img src={projectManager.profile?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                {projectManager.first_name !== 'Unassign' && (
                                                    <span
                                                        className={classNames(
                                                            projectManager.availability === 'available' ? 'bg-green-400' 
                                                                : projectManager.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                            'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                        )}
                                                    />
                                                )}
                                                
                                                <span
                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                >
                                                    {projectManager.first_name + ' ' + projectManager.last_name}
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
                        <div className="text-sm font-medium text-gray-700 mb-2 flex justify-between">
                            <div className="relative top-3">
                                Services
                                <span className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                rounded-full text-xs font-medium md:inline-block">
                                                    {services.length}
                                </span>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={handleToggleAddServiceModal}
                                    className="inline-flex items-center rounded-md border border-gray-300
                                            bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                    <PlusIcon className="-ml-2 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            
                        </div>
                        <div className="mt-1 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                            {services.length === 0 &&
                                <div className="text-sm text-gray-500">None</div>
                            }
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="relative flex  space-x-3 rounded-lg
                                            border border-gray-300 bg-white px-6 py-5 shadow-sm
                                            hover:border-gray-400">
                                    <div className="min-w-0 flex-1">
                                        <div className="focus:outline-none">
                                            <div className="flex justify-between text-sm">
                                                <div className="font-medium text-gray-900 relative top-1 flex-1 truncate overflow-hidden w-8 pr-1">{service.service_name}</div>
                                                <div className="justify-end text-right">
                                                    {services.length > 1 && (
                                                        <div className="flex justify-end">
                                                        <TrashIcon 
                                                            onClick={() => handleToggleDeleteServiceModal(service)}
                                                            className="h-5 w-5 text-gray-400 cursor-pointer" />
                                                        </div>
                                                    )}
                                                    

                                                    {service.status === 'W' && (
                                                        <div className="text-xs font-semibold  text-green-500 mt-6">
                                                            In Progress   
                                                        </div>
                                                    )}

                                                    {service.status === 'C' && (
                                                        <div className="flex-shrink-0 flex justify-end mt-6">
                                                            <CheckCircleIcon className="h-6 w-6 text-green-400" />
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            {(service.status === 'A' || service.status === 'U') && (
                                                <div className="mt-8">
                                                    <Listbox value={service.selectedProjectManager} onChange={(person) => setSelectedServiceProjectManager(person, service.id)}>
                                                    {({ open }) => (
                                                        <>
                                                        <Listbox.Label className="block text-sm text-gray-600">Assigned to</Listbox.Label>
                                                        <div className="relative mt-1">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                                    shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                                                        focus:ring-sky-500 sm:text-sm">
                                                                <span className="flex items-center">
                                                                    <img src={service.selectedProjectManager.profile?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                                    <span
                                                                        className={classNames(
                                                                            service.selectedProjectManager.availability === 'available' ? 'bg-green-400' 
                                                                                : service.selectedProjectManager.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                                            'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                                        )}
                                                                    />
                                                                    
                                                                    <span className="ml-3 block truncate">
                                                                        {service.selectedProjectManager ? service.selectedProjectManager.first_name + ' ' + service.selectedProjectManager.last_name : '------------'}
                                                                    </span>
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
                                                                {service.projectManagers.map((projectManager) => (
                                                                <Listbox.Option
                                                                    key={projectManager.id}
                                                                    className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                    )
                                                                    }
                                                                    value={projectManager}
                                                                >
                                                                    {({ selected, active }) => (
                                                                    <>
                                                                        <div className="flex items-center">
                                                                            <img src={projectManager.profile?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                                            <span
                                                                            className={classNames(
                                                                                projectManager.availability === 'available' ? 'bg-green-400' 
                                                                                    : projectManager.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                                                'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                                            )}
                                                                            />
                                                                            
                                                                            <span
                                                                                className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                            >
                                                                                {projectManager.first_name + ' ' + projectManager.last_name }
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

                    {/* ADD RETAINER SERVICES */}

                    <div className="flex flex-col xl:flex-row-reverse justify-end py-4 pb-20 gap-4 mt-8 max-w-md m-auto">
                        <button
                            type="button"
                            onClick={() => handleAssignment()}
                            className="nline-flex justify-center rounded-md w-full
                            border border-transparent bg-red-600 py-2 px-4
                            text-sm font-medium text-white shadow-sm hover:bg-red-600
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Assign
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-md border border-gray-300 bg-white w-full
                                    py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>  
                    </div>                    
                    </>
                )}


                {isAddServiceModalOpen && <AddServiceModal
                                            isOpen={isAddServiceModalOpen}
                                            handleClose={handleToggleAddServiceModal}
                                            availableServices={services}
                                            projectManagers={projectManagers}
                                             />}

                {isDeleteServiceModalOpen && <DeleteServiceModal 
                                                isOpen={isDeleteServiceModalOpen}
                                                handleClose={handleToggleDeleteServiceModal}
                                                deleteService={deleteService}
                                                service={serviceToBeDeleted}
                                            />}

            </main>
        </AnimatedPage>
    )
}

export default JobAssignments;