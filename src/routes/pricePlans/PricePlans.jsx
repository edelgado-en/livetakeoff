import { useState, useEffect } from 'react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";
import { ChevronLeftIcon, CheckIcon, PlusIcon, TrashIcon, PencilIcon, UserIcon, CalendarIcon, UsersIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom';

import * as api from './apiService'

const tiers = [
    {
      id: 1,
      name: 'Standard',
      href: '#',
      description: 'All the basics for starting a new client',
      createdBy: 'System',
      createdAt: '11/06/2022',
      customersUsingIt: 55
    },
    {
      id: 2,
      name: 'Global Appeareance',
      href: '#',
      description: '+15% for all services. Custom based.',
      createdBy: 'edelgado',
      createdAt: '11/06/2022',
      customersUsingIt: 1
    },
    {
      id: 3,
      name: 'Holiday Special',
      href: '#',
      description: '-10% for all services. Used this list in December',
      createdBy: 'System',
      createdAt: '11/06/2022',
      customersUsingIt: 10
    },
    {
      id: 4,
      name: 'Enterprise',
      href: '#',
      description: '+10% for all services for big clients',
      createdBy: 'System',
      createdAt: '11/06/2022',
      customersUsingIt: 1
    },
  ]

const PricePlans = () => {
    const [loading, setLoading] = useState(true);
    const [pricingPlans, setPricingPlans] = useState([]);

    useEffect(() => {

    }, [])

    const getPricingPlans = async () => {
        const { data } = await api.getPricingPlans()
        console.log(data)
        setPricingPlans(data)
    }

    return (
        <AnimatedPage>
            <article className="m-auto max-w-5xl px-2">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Pricing Plans</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Start by adding a new one, then add prices for all services.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="add"
                            className="inline-flex items-center justify-center rounded-md border border-transparent
                                     bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500
                                       focus:ring-offset-2 sm:w-auto"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                            Add Plan
                        </Link>
                    </div>
                </div>
                <div className="mt-10 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                    {tiers.map((tier) => (
                        <div key={tier.name} className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
                            <div className="p-6">
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-medium leading-6 text-gray-900">{tier.name}</h2>
                                    {tier.name !== 'Standard' && (
                                        <div className="flex gap-3">
                                            <PencilIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                                            <TrashIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                                        </div>
                                    )}
                                </div>
                                <p className="mt-4 text-sm text-gray-500" style={{ minHeight: '60px' }}>{tier.description}</p>
                                <Link
                                    to={`${tier.id}`}
                                    className="mt-8 block w-full rounded-md border border-transparent
                                            bg-red-600 py-2 text-center text-sm font-semibold
                                            text-white hover:bg-red-700"
                                >
                                    See prices
                                </Link>
                            </div>
                            <div className="px-6 pt-2 pb-8">
                                <ul role="list" className="mt-6 space-y-4">
                                    <li className="flex space-x-3">
                                        <UserIcon className="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
                                        <span className="text-xs text-gray-500">Created by {tier.createdBy}</span>
                                    </li>
                                    <li className="flex space-x-3">
                                        <CalendarIcon className="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
                                        <span className="text-xs text-gray-500">Created on {tier.createdAt}</span>
                                    </li>
                                    <li className="flex space-x-3">
                                        <UsersIcon className="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
                                        <span className="text-xs text-gray-500">{tier.customersUsingIt} customer(s) currently using it</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </article>
        </AnimatedPage>
    )
}

export default PricePlans;