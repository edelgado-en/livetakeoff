import { useState, useEffect, Fragment, useRef } from "react"
import Loader from "../../components/loader/Loader"
import { Link, useNavigate } from "react-router-dom"
import { Listbox, Transition } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon, MinusIcon } from "@heroicons/react/outline"
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
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

const operators = [
    {id: 'minus', icon: MinusIcon},
    {id: 'plus', icon: PlusIcon},
]

const plans = [
    {id: 1, name: 'Standard', description: 'All the basics for starting a new client', createdBy: 'System', createdAt: '11/06/2022'},
    {id: 2, name: 'Global Appeareance', description: '+15% for all services. Custom based.', createdBy: 'edelgado', createdAt: '11/06/2022'},
    {id: 3, name: 'Holiday Special', description: '-10% for all services. Used this list in December', createdBy: 'System', createdAt: '11/06/2022'},
]

const CreatePricePlan = () => {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [pricingPlanSelected, setPricingPlanSelected] = useState(plans[0])
    const [pricingPlans, setPricingPlans] = useState(plans)
    const [percentageAdjusted, setPercentageAdjusted] = useState(0)
    const [operatorSelected, setOperatorSelected] = useState(operators[0])
    //TODO: name must be unique. Show an error message if not

    const navigate = useNavigate()

    useEffect(() => {
        //getPricingPlans()
    }, [])

    const getPricingPlans = async () => {
        try {
            const { data } = await api.getPricingPlans()
            console.log(data)
            setLoading(false)
            setPricingPlans(data)

        } catch (error) {
            setLoading(false)
        }
    }

    const createPricePlan = () => {

    }

    return (
        <AnimatedPage>
            {loading && <Loader />}

            {!loading && (
                <main className="mx-auto max-w-lg px-4 pb-16 lg:pb-12">
                    <div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-600">Create Price Plan</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Let’s get started by filling in the information below to create a new price plan.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <div className="mt-1">
                            <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="tailNumber"
                            id="tailNumber"
                            className="block w-full rounded-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="comment" className="block text-sm text-gray-500">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                name="comment"
                                id="comment"
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                />
                            <p className="mt-2 text-sm text-gray-500">Write a couple of sentences describing the purpose of this price plan.</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <div className="text-md font-semibold text-gray-600">Based off Another Price Plan</div>
                        <p className="mt-2 text-sm text-gray-500">
                            All new price plans are based off an existing price plan. You can optionality add or subtract
                             a percentage from that list that will affect the price of all services for the new list.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Listbox value={pricingPlanSelected} onChange={setPricingPlanSelected}>
                            {({ open }) => (
                                <>
                                <Listbox.Label className="block font-medium text-sm text-gray-700">Pricing Plan</Listbox.Label>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                shadow-sm focus:border-sky-500 focus:outline-none
                                                                focus:ring-1 focus:ring-sky-500 sm:text-sm ">
                                        <span className="block truncate">
                                            {pricingPlanSelected?.name}
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
                                            {pricingPlans.map((pricingPlan) => (
                                                <Listbox.Option
                                                    key={pricingPlan.id}
                                                    className={({ active }) =>
                                                            classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                    value={pricingPlan}>
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                {pricingPlan.name}
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
                    <div className="flex mt-4">
                        <div>
                            <Listbox value={operatorSelected} onChange={setOperatorSelected}>
                                {({ open }) => (
                                    <>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-default rounded-l-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-8 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                            <span className="block truncate">
                                                <operatorSelected.icon className="h-4 w-4" />
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
                                                {operators.map((operator) => (
                                                    <Listbox.Option
                                                        key={operator.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                        value={operator}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                    <operator.icon className="h-4 w-4" />
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
                        <div className="flex">
                            <input
                                type="text"
                                value={percentageAdjusted}
                                onChange={(e) => setPercentageAdjusted(e.target.value)}
                                name="amount"
                                style={{ borderLeft: '0px' }}
                                className="block w-12 rounded-r-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 text-xs"
                            />
                        </div>
                        <div className="relative top-2 ml-2">
                            %
                        </div>
                        
                    </div>
                    <div className="flex flex-col py-4 pb-20 gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => createPricePlan()}
                                className="inline-flex justify-center rounded-md
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Create Price Plan
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
                </main>
            )}


        </AnimatedPage>
    )
}

export default CreatePricePlan;