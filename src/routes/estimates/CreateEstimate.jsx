import { useState, useEffect, Fragment, useRef } from "react"
import Loader from "../../components/loader/Loader"
import { Link, useNavigate } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
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

const CreateEstimate = () => {
    const [loading, setLoading] = useState(false)
    
    const [tailNumber, setTailNumber] = useState('')
    const [aircraftTypes, setAircraftTypes] = useState([])
    const [customers, setCustomers] = useState([])
    const [airports, setAirports] = useState([])
    const [fbos, setFbos] = useState([])
    const [services, setServices] = useState([])
    const [servicesErrorMessage, setServicesErrorMessage] = useState(null)

    const [customerSelected, setCustomerSelected] = useState(null)
    const [aircraftTypeSelected, setAircraftTypeSelected] = useState(null)
    const [airportSelected, setAirportSelected] = useState(null)
    const [fboSelected, setFboSelected] = useState(null)

    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);

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


    const getJobInfo = async () => {
        setLoading(true)
        
        try {
            const { data } = await api.getJobEstimateFormInfo()
            setAircraftTypes(data.aircraft_types)
            setServices(data.services)
            setAirports(data.airports)
            setFbos(data.fbos)
            setCustomers(data.customers)

            setLoading(false)

        } catch (error) {
            toast.error('Unable to load form data')
            setLoading(false)
        }

    }

    const createEstimate = async () => {

        if (!aircraftTypeSelected) {
            alert('Please select an aircrat type')
            return
        }

        if (!airportSelected) {
            alert('Please select an airport')
            return
        }

        if (!fboSelected) {
            alert('Please select an FBO')
            return
        }

        if (selectedServices.length === 0) {
            alert('Please select at least one service')
            return
        }

        setLoading(true)

        const request = {
            tail_number: tailNumber,
            aircraft_type_id: aircraftTypeSelected.id,
            services: selectedServices.map(service => service.id),
            fbo_id: fboSelected.id,
            airport_id: airportSelected.id,
            customer_id: customerSelected ? customerSelected.id : null,
        }


        try {
            const { data } = await api.createEstimate(request)

            setLoading(false)
            
            navigate(`/estimates/${data.id}`)

        } catch (error) {
            setLoading(false)
            toast.error('Unable to create estimate')
        }
    }


    const isServiceSelected = (value) => {
        return selectedServices.find((el) => el.id === value.id) ? true : false;
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
        const selectedServicesUpdated = selectedServices.filter((el) => el.id !== value.id);
        setSelectedServices(selectedServicesUpdated);
        setIsServicesOpen(true);
    }

 
    return (
        <AnimatedPage>
            {loading && ( <Loader />)}


            {!loading && (
                <main className="mx-auto max-w-lg px-4 pb-16 lg:pb-12">
                <div>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-600">Create Estimate</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Let’s get started by filling in the information below to create a new estimate.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="tailNumber" className="block text-sm text-gray-500">
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
                            </div>
                        </div>

                        {currentUser.isCustomer && (
                            <p className="text-xs text-gray-500">Is your aircraft, airport, FBO or service not listed?<Link to="/contact" className="ml-2 text-blue-500">Let us know</Link></p>
                        )}
                        
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
                                    <Listbox.Label className="block text-sm font-medium text-gray-700">
                                        Aircraft Type
                                    </Listbox.Label>
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
                        
                        <div className="flex flex-col py-4 pb-20 gap-4">
                            <button
                                type="button"
                                onClick={() => createEstimate()}
                                className="inline-flex justify-center rounded-md
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Create Estimate
                            </button>
                            <button
                                onClick={() => navigate(-1)}
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

export default CreateEstimate;