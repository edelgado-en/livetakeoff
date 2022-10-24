
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TrashIcon, PencilIcon, TagIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

const CustomerDiscounts = () => {
    const { customerId } = useParams();
    const [discounts, setDiscounts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getDiscounts()
    }, [customerId])

    const getDiscounts = async () => {
        setLoading(true)
        const { data } = await api.getCustomerDiscounts(customerId)

        setLoading(false)

        setDiscounts(data)
    }

    return (
        <AnimatedPage>
            <div className="mx-auto mt-2 max-w-5xl px-4 sm:px-6 lg:px-8 lg:pr-52">
                <div className="py-2 mb-4">
                    <div className="flex flex-wrap items-center justify-end sm:flex-nowrap">
                        <div className="flex-shrink-0">
                            <button type="button" className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                    text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2">
                                <svg className="h-6 w-6" x-description="Heroicon name: outline/plus"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {!loading && discounts.length === 0 && (
                   <div className="text-sm mt-10 flex flex-col items-center">
                        <div className="font-semibold text-gray-600 mt-4">
                            No discounts found
                        </div>
                        <span className="text-gray-500">Click on the plus icon to add a discount.</span>                            
                    </div>
                )}

                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {discounts.map((discount) => (
                        <li key={discount.id}>
                            <div className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium text-red-600">
                                    {discount.type === 'S' ? 'By Service' : ''}
                                    {discount.type === 'A' ? 'By Airport' : ''}
                                    {discount.type === 'G' ? 'General' : ''}
                                </p>
                                <div className="ml-2 flex flex-shrink-0">
                                    <span className="inline-flex rounded-ful text-md font-semibold leading-5">
                                        {!discount.is_percentage ? '$' : ''}
                                        {discount.discount}
                                        {discount.is_percentage ? '%' : ''}
                                    </span>
                                </div>
                                </div>
                                <div className="mt-5 sm:flex sm:justify-between">
                                <div className="text-sm text-gray-500">
                                    {discount.airports.map((airport, index) => (
                                        <div key={index} className="mb-2">{index + 1 + '. '}{airport.name}</div>
                                    ))}

                                    {discount.services.map((service, index) => (
                                        <div key={index} className="mb-2">{index + 1 + '. '}{service.name}</div>
                                    ))}
                                </div>
                                <div className="mt-5 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <PencilIcon className="flex-shrink-0 h-4 w-4 mr-6 cursor-pointer" />
                                    <TrashIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                                </div>
                                </div>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>


            </div>
        </AnimatedPage>
    )
}

export default CustomerDiscounts;