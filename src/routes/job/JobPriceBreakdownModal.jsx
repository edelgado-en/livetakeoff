import { useEffect, useState } from 'react'
import ModalFrame from '../../components/modal/ModalFrame'
import { Dialog, Transition } from '@headlessui/react'
import Loader from '../../components/loader/Loader'
import * as api from './apiService'

const services = [
    {id: 1, name: 'Full wet wash and dry plus belly and landing gear degrease and wipe down', price: 100},
    {id: 2, name: 'Interior Detail (Deep interior detailing with all seat cleaning, conditioning and protection)', price: 200},
    {id: 3, name: 'Exterior detail (Full wet or dry wash)	', price: 300},
    {id: 4, name: 'Basic Exterior (Exterior Takeoff Ready)', price: 400},
    {id: 5, name: 'Basic Interior (Interior Takeoff Ready)', price: 500},
]

const JobPriceBreakdownModal = ({ isOpen, handleClose, jobDetails }) => {
    const [loading, setLoading] = useState(true)
    const [breakdown, setBreakdown] = useState({})

    useEffect(() => {
        getPriceBreakdown()
    }, [])

    const getPriceBreakdown = async () => {
        try {
            const { data } = await api.getJobPriceBreakdown(jobDetails.id)
            console.log(data)

            setBreakdown(data)

            setLoading(false)

        } catch (err) {
            setLoading(false)
        }
    }

    return (
        <ModalFrame isModalOpen={isOpen}>
            <div className="">    
                <div className="px-2">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleClose} 
                            className="z-50 flex h-8 w-8 items-center justify-center rounded-full cursor-pointer
                                    focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500 border-gray-500 border"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                  <div className="-mt-6">
                    <Dialog.Title as="h3" className="text-lg text-center font-medium leading-6 text-gray-900 relative top-1">
                      Price Breakdown <div className="text-gray-500 text-sm">{jobDetails.purchase_order}</div>
                    </Dialog.Title>
                    
                    {loading && <Loader />}

                    {!loading && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs">
                                <div className="text-sm text-gray-700">{breakdown.aircraftType}</div>
                                <div>
                                    <span className="relative bg-teal-50 text-teal-500 rounded-md p-1" style={{top:'2px'}}>{breakdown.priceListType}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-sm text-gray-700">Services</h3>
                                <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                    {breakdown.services?.map((service) => (
                                        <div key={service.id} className="flex justify-between py-2 text-xs">
                                            <dt className="text-gray-500 pr-2 truncate">{service.name}</dt>
                                            <dd className="whitespace-nowrap text-gray-900">${service.price}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <div className="flex justify-end py-2 text-xs mt-1">
                                        <dt className="text-gray-500 pr-2 text-right font-medium">Subtotal</dt>
                                        <dd className="whitespace-nowrap text-gray-900">{breakdown.servicesPrice}</dd>
                                </div>
                            </div>
                            
                            {breakdown.discounts?.length > 0 && (
                                <div className="mt-2">
                                    <h3 className="text-sm text-gray-700">Discounts Applied</h3>
                                    <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                        {breakdown.discounts.map((discount) => (
                                            <div key={discount.id} className="flex justify-between py-2 text-xs">
                                                <dt className="text-gray-500 pr-2 truncate">
                                                    {discount.name === 'S' ? 'By Service' : ''}
                                                    {discount.name === 'A' ? 'By Airport' : ''}
                                                    {discount.name === 'G' ? 'General' : ''}
                                                </dt>
                                                <dd className="whitespace-nowrap text-gray-900">
                                                    {!discount.isPercentage ? '$' : ''}
                                                    {discount.discount}
                                                    {discount.isPercentage ? '%' : ''}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <div className="flex justify-end py-2 text-xs mt-1">
                                        <dt className="text-gray-500 pr-2 text-right font-medium">Subtotal</dt>
                                        <dd className="whitespace-nowrap text-gray-900">{breakdown.discountedPrice}</dd>
                                    </div>
                                </div>  
                            )}
                            
                            
                            {breakdown.additionalFees?.length > 0 && (
                                <div className="mt-2">
                                    <h3 className="text-sm text-gray-700">Additional Fees Applied</h3>
                                    <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                        {breakdown.additionalFees.map((fee) => (
                                            <div key={fee.id} className="flex justify-between py-2 text-xs">
                                                <dt className="text-gray-500 pr-2 truncate">
                                                    {fee.name === 'A' ? 'By Airport' : ''}
                                                    {fee.name === 'F' ? 'By FBO' : ''}
                                                    {fee.name === 'G' ? 'General' : ''}
                                                </dt>
                                                <dd className="whitespace-nowrap text-gray-900">
                                                    {!fee.isPercentage ? '$' : ''}
                                                    {fee.fee}
                                                    {fee.isPercentage ? '%' : ''}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}

                            <div className="flex justify-end py-4 text-xs">
                                <dt className="text-gray-500 pr-2 text-right font-medium">Total</dt>
                                <dd className="whitespace-nowrap text-gray-900">{breakdown.totalPrice}</dd>
                            </div>
                        
                        </div>
                    )}
                    
                  </div>
                </div>
            </div>
            
        </ModalFrame>
    )
}

export default JobPriceBreakdownModal;