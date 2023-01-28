import { useEffect, useState, Fragment } from 'react'
import ModalFrame from '../../components/modal/ModalFrame'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import { useLocation } from "react-router-dom"

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

const AddRetainerServiceModal = ({ isOpen, handleClose, existingServices, projectManagers, handleAddService, jobId }) => {
    const [selectedProjectManager, setSelectedProjectManager] = useState(null)
    const [selectedRetainerService, setSelectedRetainerService] = useState(null)
    const [availableServices, setAvailableServices] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [missingServiceMessage, setMissingServiceMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const location = useLocation()

    useEffect(() => {
        getRetainerServices()
    }, [])
        
    const getRetainerServices = async () => {
        //set loading

        try {
            const { data } = await api.getRetainerServices()

            const available = []

            for (let j = 0; j < data.results.length; j++) {
                let serviceRepeated = false;

                for (let i = 0; i < existingServices.length; i++) {
                    if (existingServices[i].service_name === data.results[j].name) {
                        serviceRepeated = true;
                    }
                }

                if (!serviceRepeated) {
                    available.push(data.results[j])
                }
            }

            if (available.length === 0) {
                setErrorMessage('All retainer services are already assigned.')

            } else {
                setAvailableServices(available)
            }


        } catch (err) {

        }

    }

    const addRetainerService = async () => {
        setMissingServiceMessage(null)

        let user = null

        if (!selectedRetainerService) {
            setMissingServiceMessage('Retainer Service is required')
            return
        } 

        if (selectedProjectManager) {
            user = selectedProjectManager.id === 999 ? null : selectedProjectManager.id;
        }
        
        const request = {
            'retainer_service_id': selectedRetainerService.id,
            'user_id': user
        }

        setLoading(true)

        try {
            await api.addRetainerService(jobId, request)

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
            
            const updatedRetainerServices = data.retainer_services.map((s) => {
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

            setLoading(false)
            handleAddService(updatedRetainerServices)
        
        } catch (error) {
            setLoading(false)
        }

    }


    return (
        <ModalFrame isModalOpen={isOpen}>
            <div className={`${errorMessage ? 'mb-10' : 'mb-48'}`} style={{minWidth: '300px'}}>
                <div className="">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 relative top-1">
                        Add a Retainer Service 
                    </Dialog.Title>
                    
                    {errorMessage ? <div className="m-auto mt-9 text-gray-500 w-11/12 text-center justify-center flex">{errorMessage}</div> : (
                        <>
                        <div className="mt-6">
                            <Listbox value={selectedRetainerService} onChange={setSelectedRetainerService}>
                                {({ open }) => (
                                    <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Service</Listbox.Label>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                            <span className="block truncate">
                                                {selectedRetainerService ? selectedRetainerService.name : 'Select retainer service'}
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
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {availableServices.map((service) => (
                                                    <Listbox.Option
                                                        key={service.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={service}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    {service.name}
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
                            
                            {missingServiceMessage && (
                                <div className="text-xs text-red-500 mt-2 ml-1">{missingServiceMessage}</div>
                            )}
                        </div>

                        {(!location.pathname.includes('review') && !location.pathname.includes('details')) && (
                            <div className="mt-6">
                                <Listbox value={selectedProjectManager} onChange={setSelectedProjectManager}>
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
                                                    <img src={selectedProjectManager?.profile?.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                    <span
                                                        className={classNames(
                                                            selectedProjectManager?.availability === 'available' ? 'bg-green-400' 
                                                                : selectedProjectManager?.availability === 'available_soon' ? 'bg-yellow-400':'bg-red-400',
                                                            'inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2'
                                                        )}
                                                    />
                                                </>
                                            )}
                                            
                                            <span className="ml-3 block truncate">
                                                {selectedProjectManager ? selectedProjectManager.first_name + ' ' + selectedProjectManager.last_name : 'Select project manager'}
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
                                                    {projectManager.name !== 'Unassign' && (
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
                        )}
                        
                        </>
                    )}
                    
                </div>
            </div>
            <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    onClick={() => addRetainerService()}
                    disabled={errorMessage || loading}
                    className="inline-flex w-full justify-center rounded-md border border-transparent
                            bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    {loading ? 'calculating...'
                         : <>
                                <PlusIcon className="-ml-2 mr-1 h-5 w-5 text-white" aria-hidden="true" />
                                <span>Add</span>
                            </>
                    }

                </button>
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="mt-3 inline-flex w-full justify-center rounded-md border
                                border-gray-300 bg-white px-4 py-2 text-base font-medium
                                text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Cancel
                </button>
            </div>
            
        </ModalFrame>
    )
}

export default AddRetainerServiceModal;