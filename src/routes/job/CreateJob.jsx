import { useState, useEffect, Fragment, useRef } from "react"
import Loader from "../../components/loader/Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import ImageUploading from 'react-images-uploading';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css"
import * as api from './apiService'
import { toast } from "react-toastify"

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

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

const CreateJob = () => {
    const { estimateId } = useParams();

    const [loading, setLoading] = useState(false)
    const [createJobMessage, setCreateJobMessage] = useState(null)
    const [jobDetails, setJobDetails] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)
    
    const [tailNumber, setTailNumber] = useState('')
    const [tailNumberErrorMessage, setTailNumberErrorMessage] = useState(null)
    const [customers, setCustomers] = useState([])
    const [aircraftTypes, setAircraftTypes] = useState([])
    const [airports, setAirports] = useState([])
    const [fbos, setFbos] = useState([])
    const [services, setServices] = useState([])
    const [retainerServices, setRetainerServices] = useState([])
    const [servicesErrorMessage, setServicesErrorMessage] = useState(null)

    const [tags, setTags] = useState([])

    const [customerSelected, setCustomerSelected] = useState(null)
    const [aircraftTypeSelected, setAircraftTypeSelected] = useState(null)
    const [airportSelected, setAirportSelected] = useState(null)
    const [fboSelected, setFboSelected] = useState(null)

    const [estimatedArrivalDate, setEstimatedArrivalDate] = useState(null);
    const [estimatedDepartureDate, setEstimatedDepartureDate] = useState(null);
    const [completeByDate, setCompleteByDate] = useState(null);
    const [comment, setComment] = useState('');

    const [requestedBy, setRequestedBy] = useState('')

    const [images, setImages] = useState([]);

    const [estimatedArrivalDateOpen, setEstimatedArrivalDateOpen] = useState(false)
    const [estimatedDepartureDateOpen, setEstimatedDepartureDateOpen] = useState(false)
    const [completeByDateOpen, setCompleteByDateOpen] = useState(false)

    const [onSite, setOnSite] = useState(false)

    const [customerSearchTerm, setCustomerSearchTerm] = useState('')
    const [aircraftSearchTerm, setAircraftSearchTerm] = useState('')
    const [airportSearchTerm, setAirportSearchTerm] = useState('')
    const [fboSearchTerm, setFboSearchTerm] = useState('')

    const currentUser = useAppSelector(selectUser)

    const navigate = useNavigate();

    const filteredAircraftTypes = aircraftSearchTerm
    ? aircraftTypes.filter((item) => item.name.toLowerCase().includes(aircraftSearchTerm.toLowerCase()))
    : aircraftTypes;

    const filteredCustomers = customerSearchTerm
    ? customers.filter((item) => item.name.toLowerCase().includes(customerSearchTerm.toLowerCase()))
    : customers;

    const filteredAirports = airportSearchTerm
    ? airports.filter((item) => item.name.toLowerCase().includes(airportSearchTerm.toLowerCase()))
    : airports;

    const filteredFbos = fboSearchTerm
    ? fbos.filter((item) => item.name.toLowerCase().includes(fboSearchTerm.toLowerCase()))
    : fbos;


    useEffect(() => {
        getJobInfo()
    }, [])

    useEffect(() => {
        //Basic throttling
        let timeoutID = setTimeout(() => {
            getTailAircraftLookup()
        }, 300);
    
        return () => {
          clearTimeout(timeoutID);
        };
    
    }, [tailNumber])

    
    const getTailAircraftLookup = async () => {
        if (tailNumber?.length > 2 && !estimateId) {
            const { data } = await api.getTailAircraftLookup(tailNumber)
            
            if (data) {
                setAircraftTypeSelected({id: data.aircraft_id, name: data.aircraft_name})
                setAircraftSearchTerm(data.aircraft_name)

                setCustomerSelected({id: data.customer_id, name: data.customer_name})
                setCustomerSearchTerm(data.customer_name)

                //Do not update services if there there is an estimate id, just respect the services used in the estimate id
                if (data.services.length > 0 && estimateId === undefined) {

                    //update the services array and set the field as selected if the ids match
                    const updatedServices = services.map(service => {
                        const foundService = data.services.find(s => s.id === service.id)
                        if (foundService) {
                            return {...service, selected: true}
                        } else {
                            return {...service, selected: false}
                        }
                    })

                    setServices(updatedServices)

                }

                if (data.retainer_services.length > 0) {
                    //update the retainer services array and set the field as selected if the ids match
                    const updatedRetainerServices = retainerServices.map(service => {
                        const foundService = data.retainer_services.find(s => s.id === service.id)
                        if (foundService) {
                            return {...service, selected: true}
                        } else {
                            return {...service, selected: false}
                        }
                    })

                    setRetainerServices(updatedRetainerServices)
                }
            }
        }
    }


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
            setTags(data.tags)

            // if estimateId is passed in, get the estimate info and pre-populate the form
            if (estimateId) {
                const response = await api.getEstimateDetail(estimateId)
                setTailNumber(response.data.tailNumber)
                setCustomerSelected(response.data.customer)
                setAircraftTypeSelected(response.data.aircraftType)
                setAirportSelected(response.data.airport)
                setFboSelected(response.data.fbo)
                
                // the lookup has to be done by name because the ids are different in services vs estimate services
                const updatedServices = data.services.map(service => {
                    const foundService = response.data.services.find(s => s.name === service.name)
                    if (foundService) {
                        return {...service, selected: true}
                    } else {
                        return {...service, selected: false}
                    }
                })

                setServices(updatedServices)
            }

            setLoading(false)

        } catch (error) {
            setLoading(false)
            setErrorMessage(error.message)
        }

    }

    const createJob = async (routeName) => {
        const selectedServices = services.filter(service => service.selected === true)
        const selectedRetainerServices = retainerServices.filter(retainerService => retainerService.selected === true)
        const selectedTags = tags.filter(tag => tag.selected === true)

        setTailNumberErrorMessage(null)
        setServicesErrorMessage(null)

        if (tailNumber.length === 0) {
            setTailNumberErrorMessage('Tail number is required')
            return
        }

        if (selectedServices.length === 0 && selectedRetainerServices.length === 0) {
            setServicesErrorMessage('Please select at least one service')
            return
        }

        if (!customerSelected || !aircraftTypeSelected || !airportSelected || !fboSelected) {
            setTailNumberErrorMessage('Missing required fields')
            return
        }

        const selectedServiceIds = selectedServices.map(service => service.id)
        const selectedRetainerServiceIds = selectedRetainerServices.map(service => service.id)
        const selectedTagIds = selectedTags.map(tag => tag.id)

        const formData = new FormData()
        
        formData.append("tail_number", tailNumber);
        formData.append("customer_id", customerSelected.id);
        formData.append("aircraft_type_id", aircraftTypeSelected.id);
        formData.append("airport_id", airportSelected.id);
        formData.append("fbo_id", fboSelected.id);
        formData.append("estimated_arrival_date", estimatedArrivalDate);
        formData.append("estimated_departure_date", estimatedDepartureDate);
        formData.append("complete_by_date", completeByDate);
        formData.append("services", selectedServiceIds);
        formData.append("retainer_services", selectedRetainerServiceIds);
        formData.append("tags", selectedTagIds);
        formData.append("comment", comment);
        formData.append("on_site", onSite);
        formData.append("requested_by", requestedBy)

        if (estimateId) {
            formData.append("estimate_id", estimateId);
        }


        images.forEach(image => {
            if (image.file.size < 10000000) { // less than 10MB
                formData.append("image", image.file)
            }
        });

        setLoading(true)
        setCreateJobMessage('Creating job. Please wait...')
        
        try {
            const { data } = await api.createJob(formData)

            setLoading(false)
            setCreateJobMessage(`A new job with purchase order ${data.purchase_order} has been added to the queue.`)

            if (routeName === 'assignments') {
                navigate('/jobs/' + data.id + '/assignments')
            } 

        } catch (error) {
            setLoading(false)
            setCreateJobMessage(null)
            toast.error('Unable to create job')
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
        setOnSite(false)
        setEstimatedArrivalDate(date);
    }

    const handleEstimatedDepartureDateChange = (date, event) => {
        setEstimatedDepartureDate(date);
    }

    const handleCompleteByDateChange = (date, event) => {
        setCompleteByDate(date);
    }


    const onChangePhoto = (imageList, addUpdateIndex) => {
        setImages(imageList)
    }

    const handleSetOnSite = () => {
        setOnSite(!onSite)
        setEstimatedArrivalDate(null)
    }

    const handleServiceChange = (service) => {
        const servicesUpdated = services.map((el) => {
            if (el.id === service.id) {
                el.selected = !el.selected
            }
            return el
        })

        setServices(servicesUpdated)
    }

    const handleRetainerServiceChange = (retainerService) => {
        const retainerServicesUpdated = retainerServices.map((el) => {
            if (el.id === retainerService.id) {
                el.selected = !el.selected
            }
            return el
        })

        setRetainerServices(retainerServicesUpdated)
    }

    const handleTagChange = (tag) => {
        const tagsUpdated = tags.map((el) => {
            if (el.id === tag.id) {
                el.selected = !el.selected
            }
            return el
        })

        setTags(tagsUpdated)
    }

    const addAnotherJob = () => {
        setCreateJobMessage(null)
        setTailNumber('')

        window.location.reload()
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

            {!loading && createJobMessage && (
                <div className="mx-auto max-w-lg px-4 pb-16 lg:pb-12 mt-40 text-center">
                    <div className=" flex justify-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="">
                        <p className="text-md font-medium text-gray-900 mt-2">Job created!</p>
                        <p className="mt-2 text-sm text-gray-500">{createJobMessage}</p>
                        
                        {currentUser.isCustomer && (
                            <>
                            <p className="mt-2 text-sm text-gray-500">
                                Our account managers have been notified of your request. 
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                If you want to receive updates on your job, you can enable SMS notifications in your profile settings <Link to="/user-settings/profile" className="text-blue-500 hover:text-blue-600">here</Link>.
                            </p>
                            </>
                        )}
                    </div>
                    <div className=" mt-6 flex justify-center gap-6">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center rounded-md border
                                         border-gray-300 bg-white px-3 py-2 text-sm leading-4
                                          text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                           focus:ring-red-500 focus:ring-offset-2">
                            Back to Home
                        </button>
                        <button
                            type="button"
                            onClick={() => addAnotherJob()}
                            className="inline-flex justify-center rounded-md
                                    border border-transparent bg-red-600 py-2 px-4
                                    text-sm font-medium text-white shadow-sm hover:bg-red-600
                                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Add another Job
                        </button>
                    </div>
                    
                </div>
            )}


            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && (errorMessage == null && createJobMessage == null) && (
                <main className="mx-auto max-w-lg px-4 pb-16 lg:pb-12">
                <div>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-600">Create Job</h1>
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
                                value={tailNumber}
                                onChange={(e) => setTailNumber(e.target.value)}
                                name="tailNumber"
                                id="tailNumber"
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                />
                                {tailNumberErrorMessage && <p className="text-red-500 text-xs font-semibold mt-2">{tailNumberErrorMessage}</p>}
                            </div>
                        </div>

                        {!currentUser.isCustomer && (
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
                                                <span className="block truncate">
                                                    {customerSelected ? customerSelected.name : 'Select customer'}
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
                                                    <div className="relative">
                                                        <div className="sticky top-0 z-20  px-1">
                                                            <div className="mt-1 block  items-center">
                                                                <input
                                                                    type="text"
                                                                    name="search"
                                                                    id="search"
                                                                    value={customerSearchTerm}
                                                                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                                                    className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                            border-gray-300 rounded-md"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                    {customerSearchTerm && (
                                                                        <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6 text-blue-500 font-bold mr-1"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                        onClick={() => {
                                                                            setCustomerSearchTerm("");
                                                                        }}
                                                                        >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                        </svg>
                                                                    )}
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6 text-gray-500 mr-1"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {filteredCustomers.map((customer) => (
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
                        )}

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
                                            <span className="block truncate">
                                                {aircraftTypeSelected ? aircraftTypeSelected.name: 'Select aircraft type'}
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
                                                <div className="relative">
                                                    <div className="sticky top-0 z-20  px-1">
                                                        <div className="mt-1 block  items-center">
                                                            <input
                                                                type="text"
                                                                name="search"
                                                                id="search"
                                                                value={aircraftSearchTerm}
                                                                onChange={(e) => setAircraftSearchTerm(e.target.value)}
                                                                className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                        border-gray-300 rounded-md"
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                {aircraftSearchTerm && (
                                                                    <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-blue-500 font-bold mr-1"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    onClick={() => {
                                                                        setAircraftSearchTerm("");
                                                                    }}
                                                                    >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                    </svg>
                                                                )}
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-gray-500 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {filteredAircraftTypes.map((aircraftType) => (
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
                                            <span className="block truncate">
                                                {airportSelected ? airportSelected.name : 'Select airport'}
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
                                                <div className="relative">
                                                    <div className="sticky top-0 z-20  px-1">
                                                        <div className="mt-1 block  items-center">
                                                            <input
                                                                type="text"
                                                                name="search"
                                                                id="search"
                                                                value={airportSearchTerm}
                                                                onChange={(e) => setAirportSearchTerm(e.target.value)}
                                                                className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                        border-gray-300 rounded-md"
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                {airportSearchTerm && (
                                                                    <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-blue-500 font-bold mr-1"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    onClick={() => {
                                                                        setAirportSearchTerm("");
                                                                    }}
                                                                    >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                    </svg>
                                                                )}
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-gray-500 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {filteredAirports.map((airport) => (
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
                                            <span className="block truncate">
                                                {fboSelected ? fboSelected.name : 'Select FBO'}
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
                                                <div className="relative">
                                                    <div className="sticky top-0 z-20  px-1">
                                                        <div className="mt-1 block  items-center">
                                                            <input
                                                                type="text"
                                                                name="search"
                                                                id="search"
                                                                value={fboSearchTerm}
                                                                onChange={(e) => setFboSearchTerm(e.target.value)}
                                                                className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                        border-gray-300 rounded-md"
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                {fboSearchTerm && (
                                                                    <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-blue-500 font-bold mr-1"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    onClick={() => {
                                                                        setFboSearchTerm("");
                                                                    }}
                                                                    >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                    </svg>
                                                                )}
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-gray-500 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {filteredFbos.map((fbo) => (
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
                            <div className="text-sm  text-gray-500 mb-1 flex justify-between">
                                Estimated Arrival
                                <div className="flex gap-2">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="onSite"
                                            value={onSite}
                                            onClick={handleSetOnSite}
                                            name="onSite"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                    </div>
                                    <label htmlFor="onSite" className=" text-gray-500">
                                        On site
                                    </label>
                                </div>
                                {estimatedArrivalDate && (
                                    <span 
                                        onClick={() => setEstimatedArrivalDate(null)}
                                        className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleEstimatedArrivalDate}
                                className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50">
                                {estimatedArrivalDate?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                            </button>
                            {estimatedArrivalDateOpen && (
                                <DatePicker
                                selected={estimatedArrivalDate}
                                onChange={(date) => handleEstimatedArrivalDateChange(date)}
                                locale="pt-BR"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={5}
                                dateFormat="Pp"
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
                                {estimatedDepartureDate ? estimatedDepartureDate.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'No ETD yet'}
                            </button>
                            {estimatedDepartureDateOpen && (
                                <DatePicker
                                    selected={estimatedDepartureDate}
                                    onChange={(date) => handleEstimatedDepartureDateChange(date)}
                                    locale="pt-BR"
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={5}
                                    dateFormat="Pp"
                                    inline
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm  text-gray-500 mb-1">
                                Complete Before
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
                                {completeByDate?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                            </button>
                            {completeByDateOpen && (
                                <DatePicker
                                    selected={completeByDate}
                                    onChange={(date) => handleCompleteByDateChange(date)}
                                    locale="pt-BR"
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={5}
                                    dateFormat="Pp"
                                    inline
                                />
                            )}
                        </div>
                        
                        {!currentUser.isCustomer && (
                            <div>
                                <label htmlFor="tailNumber" className="block text-sm text-gray-500">
                                    Requested By
                                </label>
                                <span className="text-xs text-gray-500">Enter a name when creating a job on behalf of someone else</span>
                                <div className="mt-1">
                                    <input
                                    type="text"
                                    value={requestedBy}
                                    onChange={(e) => setRequestedBy(e.target.value)}
                                    name="requestedBy"
                                    id="requestedBy"
                                    className="block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="text-sm leading-5 font-medium text-gray-700">Services</div>

                        {services.map((service, index) => (
                            <div key={index} className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                <input
                                    id={'service' + service.id} 
                                    name={service.name}
                                    checked={service.selected}
                                    onChange={() => handleServiceChange(service)}       
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                </div>
                                <div className="ml-3 text-sm">
                                <label htmlFor={'service' + service.id}  className="text-gray-700">
                                    {service.name}
                                </label>
                                </div>
                            </div>   
                        ))}


                        {servicesErrorMessage && <p className="text-red-500 text-xs font-semibold mt-2">{servicesErrorMessage}</p>}
                       
                       
                       {(currentUser.isAdmin
                             || currentUser.isSuperUser
                             || currentUser.isAccountManager
                             || (currentUser.isCustomer && currentUser.isPremiumMember)) && (
                            <>
                                <div className="py-1"></div>
                                <div className="text-sm leading-5 font-medium text-gray-700">Retainer Services</div>
                                {retainerServices.map((retainerService) => (
                                    <div key={retainerService.id} className="relative flex items-start">
                                        <div className="flex h-5 items-center">
                                        <input
                                            id={'retainer' + retainerService.id} 
                                            name={retainerService.name}
                                            checked={retainerService.selected}
                                            onChange={() => handleRetainerServiceChange(retainerService)}       
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                        </div>
                                        <div className="ml-3 text-sm">
                                        <label htmlFor={'retainer' + retainerService.id}  className="text-gray-700">
                                            {retainerService.name}
                                        </label>
                                        </div>
                                    </div>   
                                ))}
                            </>
                       )}

                       {(currentUser.isAdmin
                             || currentUser.isSuperUser
                             || currentUser.isAccountManager) && (
                            <>
                                <div className="py-1"></div>
                                <div className="text-sm leading-5 font-medium text-gray-700">Tags</div>
                                {tags.map((tag) => (
                                    <div key={tag.id} className="relative flex items-start">
                                        <div className="flex h-5 items-center">
                                        <input
                                            id={'tag' + tag.id} 
                                            name={tag.name}
                                            checked={tag.selected}
                                            onChange={() => handleTagChange(tag)}       
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                        </div>
                                        <div className="ml-3 text-sm">
                                        <label htmlFor={'tag' + tag.id}  className="text-gray-700">
                                            {tag.name}
                                        </label>
                                        </div>
                                    </div>   
                                ))}
                            </>
                        )}
                        
                        <div className="py-1"></div>
                        <div>
                            <label htmlFor="comment" className="block text-sm text-gray-500">
                                Add a comment
                            </label>
                            <div className="mt-1">
                                <textarea
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    name="comment"
                                    id="comment"
                                    className="block w-full rounded-md border-gray-300 shadow-sm
                                             focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                    />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Photos
                            </label>
                            <ImageUploading
                                multiple
                                acceptType={['jpg', 'gif', 'png', 'jpeg']}
                                value={images}
                                onChange={onChangePhoto}
                                maxNumber={10}
                                dataURLKey="data_url">
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                    errors
                                }) => (
                                <>
                                    <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed
                                        border-gray-300 px-6 pt-5 pb-6 m-auto" {...dragProps}>
                                        <div className="space-y-1 text-center">
                                            <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true">
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4
                                                4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            </svg>
                                            <div className="flex text-sm text-gray-600" onClick={onImageUpload} >
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-red-600
                                                            focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500
                                                            focus-within:ring-offset-2 hover:text-red-500"
                                                >
                                                    <span>Upload a file</span>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB. 10 photos max</p>
                                        </div>
                                    </div>

                                    {errors && <div className="text-red-500 font-medium mt-6 m-auto text-center text-sm">
                                        {errors.maxNumber && <span>You can only upload up to 10 photos</span>}
                                        {errors.acceptType && <span>Your selected file type is not allow</span>}
                                        </div>
                                    }

                                    <div className="w-full">
                                        {imageList.map((image, index) => (
                                            <div key={index} className="py-4 flex flex-col items-center">
                                                <div className="flex-shrink-0 cursor-pointer">
                                                    <img className="h-60 w-72 rounded-lg" src={image['data_url']} alt="" />
                                                </div>
                                                <div className="flex text-gray-500 text-sm pt-2">
                                                    <PencilIcon 
                                                        onClick={() => onImageUpdate(index)}
                                                        className="flex-shrink-0 h-4 w-4 mr-3 cursor-pointer" />
                                                    <TrashIcon 
                                                        onClick={() => onImageRemove(index)} 
                                                        className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                                )}
                            </ImageUploading>
                        </div>

                        <div className="flex flex-col py-4 pb-20 gap-4">
                            {!currentUser.isCustomer && (
                                <button
                                    type="button"
                                    onClick={() => createJob('assignments')}
                                    className="inline-flex justify-center rounded-md
                                            border border-transparent bg-red-600 py-2 px-4
                                            text-sm font-medium text-white shadow-sm hover:bg-red-600
                                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                    Continue with Assignment
                                </button>
                            )}
                            
                            <button
                                type="button"
                                onClick={() => createJob('jobs')}
                                className="inline-flex justify-center rounded-md
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Create Job
                            </button>
                            <button onClick={() => navigate(-1)}
                                    type="button"
                                    className="rounded-md border border-gray-300 bg-white w-full
                                            py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

export default CreateJob;