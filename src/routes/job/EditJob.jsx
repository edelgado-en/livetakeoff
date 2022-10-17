import { useState, useEffect, Fragment } from "react"
import Loader from "../../components/loader/Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from "@heroicons/react/outline"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css"
import * as api from './apiService'
import { toast } from "react-toastify"

const ChevronUpDownIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
    )
}

const availableStatuses = [
    {id: 'A', name: 'Accepted'},
    {id: 'T', name: 'Cancelled'},
    {id: 'R', name: 'Review'},
    {id: 'S', name: 'Assigned'},
    {id: 'W', name: 'Work In Progress'},
    {id: 'C', name: 'Complete'},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const EditJob = () => {
    const { jobId } = useParams();

    const [loading, setLoading] = useState(false)
    const [createJobMessage, setCreateJobMessage] = useState(null)
    const [jobDetails, setJobDetails] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)
    
    const [tailNumber, setTailNumber] = useState('')
    const [statuses, setStatuses] = useState(availableStatuses)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [tailNumberErrorMessage, setTailNumberErrorMessage] = useState(null)
    const [customers, setCustomers] = useState([])
    const [aircraftTypes, setAircraftTypes] = useState([])
    const [airports, setAirports] = useState([])
    const [fbos, setFbos] = useState([])
    const [services, setServices] = useState([])
    const [retainerServices, setRetainerServices] = useState([])
    const [servicesErrorMessage, setServicesErrorMessage] = useState(null)

    const [customerSelected, setCustomerSelected] = useState({})
    const [aircraftTypeSelected, setAircraftTypeSelected] = useState({})
    const [airportSelected, setAirportSelected] = useState({})
    const [fboSelected, setFboSelected] = useState({})

    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);

    const [isRetainerServicesOpen, setIsRetainerServicesOpen] = useState(false);
    const [selectedRetainerServices, setSelectedRetainerServices] = useState([]);

    const [estimatedArrivalDate, setEstimatedArrivalDate] = useState(null);
    const [estimatedDepartureDate, setEstimatedDepartureDate] = useState(null);
    const [completeByDate, setCompleteByDate] = useState(null);

    const [estimatedArrivalDateOpen, setEstimatedArrivalDateOpen] = useState(false)
    const [estimatedDepartureDateOpen, setEstimatedDepartureDateOpen] = useState(false)
    const [completeByDateOpen, setCompleteByDateOpen] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        getJobInfo()
    }, [])

    const getJobInfo = async () => {
        setLoading(true)
        
        try {
            const { data } = await api.getJobFormInfo()
            setCustomers(data.customers)
            setAircraftTypes(data.aircraft_types)
            setAirports(data.airports)
            setFbos(data.fbos)
            setServices(data.services)
            setRetainerServices(data.retainer_services)
            
            const response = await api.getJobDetails(jobId)

            console.log(response.data)
            
            setTailNumber(response.data.tailNumber);

            //TODO: need to show purchase order as read only

            setSelectedStatus(availableStatuses.find(a => a.id === response.data.status))
            setCustomerSelected(data.customers.find(c => c.id === response.data.customer.id))
            setAircraftTypeSelected(data.aircraft_types.find(a => a.id === response.data.aircraftType.id))
            setAirportSelected(data.airports.find(a => a.id === response.data.airport.id))
            setFboSelected(data.fbos.find(f => f.id === response.data.fbo.id))
           
            if (response.data.completeBy) {
                console.log(response.data.completeBy)
                setCompleteByDate(new Date(response.data.completeBy))
            }

            if (response.data.estimatedETA) {
                setEstimatedArrivalDate(new Date(response.data.estimatedETA))
            }

            if (response.data.estimatedETD) {
                setEstimatedDepartureDate(new Date(response.data.estimatedETD))
            }

            const selectedServices = []
            data.services.forEach(s => {
                const service = response.data.service_assignments.find(assignment => assignment.name === s.name)
                
                if (service) {
                    selectedServices.push(s)
                }
            })

            setSelectedServices(selectedServices)

            const selectedRetainerServices = []
            data.retainer_services.forEach(s => {
                const service = response.data.retainer_service_assignments.find(assignment => assignment.name === s.name)
                
                if (service) {
                    selectedRetainerServices.push(s)
                }
            })

            setSelectedRetainerServices(selectedRetainerServices)

            setLoading(false)

        } catch (error) {
            setLoading(false)
            setErrorMessage(error.message)
        }
    }

    const updateJob = async () => {
        // TODO: add validation 

        const selectedServiceIds = selectedServices.map(service => service.id)
        const selectedRetainerServiceIds = selectedRetainerServices.map(service => service.id)

        const request = {
            tailNumber,
            customer: customerSelected.id,
            aircraftType: aircraftTypeSelected.id,
            airport: airportSelected.id,
            fbo: fboSelected.id,
            status: selectedStatus.id,
            estimatedETA: estimatedArrivalDate,
            estimatedETD: estimatedDepartureDate,
            completeBy: completeByDate,
            services: selectedServiceIds,
            retainerServices: selectedRetainerServiceIds
        }

        console.log(request)

        try {
            await api.updateJob(jobId, request)

            toast.error('Job updated!')

            navigate(-1)

        } catch (e) {
        
        }
    }


    const handleToggleEstimatedArrivalDate = () => {
        setEstimatedArrivalDateOpen(!estimatedArrivalDateOpen)
    }

    const handleToggleEstimatedDepartureDate = () => {
        setEstimatedDepartureDateOpen(!estimatedDepartureDateOpen)
    }

    const handleToggleCompleteByDate = () => {
        setCompleteByDateOpen(!completeByDateOpen)
    }

    const handleEstimatedArrivalDateChange = (date, event) => {
        setEstimatedArrivalDate(date);
    }

    const handleEstimatedDepartureDateChange = (date, event) => {
        setEstimatedDepartureDate(date);
    }

    const handleCompleteByDateChange = (date, event) => {
        setCompleteByDate(date);
    }

    const isServiceSelected = (value) => {
        return selectedServices.find((el) => el === value) ? true : false;
    }
    
    const handleSelectService = (value) => {
        if (!isServiceSelected(value)) {
            const selectedServicesUpdated = [
                ...selectedServices,
                services.find((el) => el === value)
            ]
            
            setSelectedServices(selectedServicesUpdated);
        
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

    const isRetainerServiceSelected = (value) => {
        return selectedRetainerServices.find((el) => el === value) ? true : false;
    }

    const handleSelectRetainerService = (value) => {
        if (!isRetainerServiceSelected(value)) {
            const selectedRetainerServicesUpdated = [
                ...selectedRetainerServices,
                retainerServices.find((el) => el === value)
            ]
            
            setSelectedRetainerServices(selectedRetainerServicesUpdated);
        
        } else {
            handleDeselectRetainerService(value);
        }

        setIsRetainerServicesOpen(true);
    }

    const handleDeselectRetainerService = (value) => {
        const selectedRetainerServicesUpdated = selectedRetainerServices.filter((el) => el !== value);
        setSelectedRetainerServices(selectedRetainerServicesUpdated);
        setIsRetainerServicesOpen(true);
    }

    return (
        <AnimatedPage>
            {loading && (
                <>
                    <Loader />
                    {createJobMessage && (
                        <div className="text-gray-500 text-sm m-auto text-center">
                            {createJobMessage}
                        </div>
                    )}
                </>
            )}

            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
                <main className="mx-auto max-w-lg px-4 pb-16 lg:pb-12">
                <div>
                    <div className="space-y-6">
                        <div className="mt-6">
                            <h1 className="text-2xl font-semibold text-gray-600">Edit Job</h1>
                        </div>

                        <div>
                            <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700">
                                Tail Number
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                value={tailNumber}
                                onChange={(e) => setTailNumber(e.target.value)}
                                name="tailNumber"
                                id="tailNumber"
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                />
                                {tailNumberErrorMessage && <p className="text-red-500 text-xs mt-2">{tailNumberErrorMessage}</p>}
                            </div>
                        </div>

                        <div className="mt-1">
                            <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                                {({ open }) => (
                                    <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Status</Listbox.Label>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                            <span className="block truncate">{selectedStatus.name}</span>
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
                                                {availableStatuses.map((status) => (
                                                    <Listbox.Option
                                                        key={status.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={status}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    {status.name}
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
                                            leaveTo="opacity-0">
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {customers.map((customer) => (
                                                    <Listbox.Option
                                                        key={customer.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={customer}>
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

                        <div className="mt-1">
                            <Listbox value={aircraftTypeSelected} onChange={setAircraftTypeSelected}>
                                {({ open }) => (
                                    <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Aircraft Type</Listbox.Label>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                            <span className="block truncate">{aircraftTypeSelected.name}</span>
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
                                                {aircraftTypes.map((aircraftType) => (
                                                    <Listbox.Option
                                                        key={aircraftType.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={aircraftType}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    {aircraftType.name}
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

                        <div className="mt-1">
                            <Listbox value={airportSelected} onChange={setAirportSelected}>
                                {({ open }) => (
                                    <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">Airport</Listbox.Label>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                            <span className="block truncate">{airportSelected.name}</span>
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
                                                {airports.map((airport) => (
                                                    <Listbox.Option
                                                        key={airport.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={airport}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    {airport.name}
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

                        <div className="mt-1">
                            <Listbox value={fboSelected} onChange={setFboSelected}>
                                {({ open }) => (
                                    <>
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">FBO</Listbox.Label>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                            <span className="block truncate">{fboSelected.name}</span>
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
                                                {fbos.map((fbo) => (
                                                    <Listbox.Option
                                                        key={fbo.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={fbo}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    {fbo.name}
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
                        
                        <div>
                            <label className="block text-sm  text-gray-500 mb-1">
                                Estimated Arrival
                                {estimatedArrivalDate && (
                                    <span 
                                        onClick={() => setEstimatedArrivalDate(null)}
                                        className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                )}
                            </label>
                            <button
                                type="button"
                                onClick={handleToggleEstimatedArrivalDate}
                                className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50">
                                {estimatedArrivalDate?.toLocaleString()}
                            </button>
                            {estimatedArrivalDateOpen && (
                                <DatePicker
                                selected={estimatedArrivalDate}
                                onChange={(date) => handleEstimatedArrivalDateChange(date)}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeInput
                                inline
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Estimated Departure
                                {estimatedDepartureDate && (
                                    <span 
                                        onClick={() => setEstimatedDepartureDate(null)}
                                        className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                )}
                            </label>
                            <button
                                type="button"
                                onClick={handleToggleEstimatedDepartureDate}
                                className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50">
                                {estimatedDepartureDate?.toLocaleString()}
                            </button>
                            {estimatedDepartureDateOpen && (
                                <DatePicker
                                    selected={estimatedDepartureDate}
                                    onChange={(date) => handleEstimatedDepartureDateChange(date)}
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    showTimeInput
                                    inline
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm  text-gray-500 mb-1">
                                Complete By
                                {completeByDate && (
                                    <span 
                                        onClick={() => setCompleteByDate(null)}
                                        className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                )}
                            </label>
                            <button
                                type="button"
                                onClick={handleToggleCompleteByDate}
                                className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50">
                                {completeByDate?.toLocaleString()}
                            </button>
                            {completeByDateOpen && (
                                <DatePicker
                                    selected={completeByDate}
                                    onChange={(date) => handleCompleteByDateChange(date)}
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    showTimeInput
                                    inline
                                />
                            )}
                        </div>

                        <div>
                            <Listbox
                                as="div"
                                className="space-y-1"
                                value={selectedServices}
                                onChange={(value) => handleSelectService(value)}
                                open={isServicesOpen}>
                                {() => (
                                <>
                                    <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                                        Services
                                    </Listbox.Label>
                                    <div className="relative">
                                        <span className="inline-block w-full rounded-md shadow-sm">
                                            <Listbox.Button
                                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                                open={isServicesOpen}
                                                className="cursor-default relative w-full rounded-md border border-gray-300
                                                        bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue
                                                        focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
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
                                                        stroke="currentColor">
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
                                            className="absolute mt-1 z-50 w-full rounded-md bg-white shadow-lg">
                                            <Listbox.Options
                                                static
                                                className="max-h-70 rounded-md py-1 text-base leading-6 shadow-xs
                                                        overflow-auto focus:outline-none sm:text-sm sm:leading-5 z-50">
                                                {services.map((service) => {
                                                    const selected = isServiceSelected(service);
                                                    return (
                                                        <Listbox.Option key={service.id} value={service}>
                                                        {({ active }) => (
                                                            <div className={`${ active ? "text-white bg-red-600": "text-gray-900"}
                                                                            cursor-default select-none relative py-2 pl-8 pr-4`}>
                                                                <span className={`${selected ? "font-semibold" : "font-normal"} block truncate`}>
                                                                    {service.name}
                                                                </span>
                                                                {selected && (
                                                                    <span
                                                                    className={`${
                                                                        active ? "text-white" : "text-red-600"
                                                                    } absolute inset-y-0 left-0 flex items-center pl-1.5`}>
                                                                        <svg
                                                                            className="h-5 w-5"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor">
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
                       
                        {servicesErrorMessage && <p className="text-red-500 text-xs mt-2">{servicesErrorMessage}</p>}
                       
                        <div>
                            <Listbox
                                as="div"
                                className="space-y-1"
                                value={selectedRetainerServices}
                                onChange={(value) => handleSelectRetainerService(value)}
                                open={isRetainerServicesOpen}>
                                {() => (
                                <>
                                    <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                                        Retainer Services
                                    </Listbox.Label>
                                    <div className="relative">
                                        <span className="inline-block w-full rounded-md shadow-sm">
                                            <Listbox.Button
                                                onClick={() => setIsRetainerServicesOpen(!isRetainerServicesOpen)}
                                                open={isRetainerServicesOpen}
                                                className="cursor-default relative w-full rounded-md border border-gray-300
                                                        bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue
                                                        focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                                <span className="block truncate">
                                                    {selectedRetainerServices.length < 1
                                                            ? "Select retainer services"
                                                            : `Selected retainer services (${selectedRetainerServices.length})`}
                                                </span>
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                    <svg
                                                        className="h-5 w-5 text-gray-400"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="currentColor">
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
                                            show={isRetainerServicesOpen}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                            className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                                            <Listbox.Options
                                                static
                                                className="max-h-70 rounded-md py-1 text-base leading-6 shadow-xs
                                                        overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                                                {retainerServices.map((service) => {
                                                    const selected = isRetainerServiceSelected(service);
                                                    return (
                                                        <Listbox.Option key={service.id} value={service}>
                                                        {({ active }) => (
                                                            <div className={`${ active ? "text-white bg-red-600": "text-gray-900"}
                                                                            cursor-default select-none relative py-2 pl-8 pr-4`}>
                                                                <span className={`${selected ? "font-semibold" : "font-normal"} block truncate`}>
                                                                    {service.name}
                                                                </span>
                                                                {selected && (
                                                                    <span
                                                                    className={`${
                                                                        active ? "text-white" : "text-red-600"
                                                                    } absolute inset-y-0 left-0 flex items-center pl-1.5`}>
                                                                        <svg
                                                                            className="h-5 w-5"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor">
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

                        <div className="flex flex-col py-4 pb-20 gap-4">
                            
                            <button
                                type="button"
                                onClick={() => updateJob()}
                                className="inline-flex justify-center rounded-md
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="rounded-md border border-gray-300 bg-white w-full
                                        py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                        hover:bg-gray-50 focus:outline-none focus:ring-2
                                            focus:ring-red-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>  
                        </div>

                        <div className="h-28"></div>
                    </div>
                </div>
            </main>
            )}
            
        </AnimatedPage>
    )
}

export default EditJob;