
import { useState } from 'react'
import banner from '../../../images/customer_premium.jpeg'
import { CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import { toast } from 'react-toastify'
import Loader from '../../../components/loader/Loader'
import { useNavigate } from 'react-router-dom'

import * as api from './apiService'

const features = [
    'Support 24/7/365',
    'Access to retainer services',
    'Fixed monthly cost for budget control',
    'Best price guaranteed for other services',
    'Zero blackout dates',
    'No fees for peak days or extra hours',
    'Monthly reports (if needed)',
    'Short notices - Accepted!',
    'Free access to customer portal to submit and follow your requests',
]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const CustomerPremium = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [isMessageSent, setIsMessageSent] = useState(false)

    const navigate = useNavigate()

    const sendPremiumRequest = async () => {
        setLoading(true)
        
        try {
            await api.sendPremiumRequest({ email })
            
            setLoading(false)
            setIsMessageSent(true)

        } catch (error) {
            setLoading(false)
            toast.error('Unable to send request')
        }
    }

    return (
        <main className="lg:relative -mt-8">
            {loading && <Loader />}

            {isMessageSent && (
                <div className="mx-auto max-w-lg px-4 pb-16 lg:pb-12 mt-40 text-center">
                    <div className=" flex justify-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="">
                        <p className="text-md font-medium text-gray-900 mt-2">Message Received!</p>
                        
                        <p className="mt-2 text-sm text-gray-500">
                            Our account managers have been notified of your request and will get back to you shortly. 
                        </p>
                    </div>
                    <div className=" mt-6 flex justify-center gap-6">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center rounded-md border
                                        border-gray-300 bg-white px-3 py-2 text-sm leading-4
                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2">
                            Back Home
                        </button>
                    </div>
                </div>
            )}

            {(!isMessageSent && !loading) && (
                <>
                <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-20 lg:text-left">
                    <div className="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                        <div className="block xl:inline">Premium Membership</div>
                        </h1>
                        <div className="block text-red-600 xl:inline text-3xl font-semibold">Enjoy the ultimate piece of mind</div>
                        <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                        The best customer experience while building long-term relationships and trust by providing the highest level of integrity and professionalism in the aviation industry.
                        </p>
                        <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                            <form action="#" className="sm:mx-auto sm:max-w-xl lg:mx-0">
                                <div className="sm:flex">
                                    <div className="min-w-0 flex-1">
                                        <label htmlFor="email" className="sr-only">
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="block w-full rounded-md 
                                                        px-4 py-3 text-base text-gray-900 placeholder-gray-500
                                                        border border-gray-200"
                                        />
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <button
                                        type="submit"
                                        onClick={() => sendPremiumRequest()}
                                        disabled={loading || email === ''}
                                        className="block w-full rounded-md bg-red-500 py-3 px-4
                                                    font-medium text-white shadow hover:bg-red-600
                                                    focus:outline-none focus:ring-2 focus:ring-red-300
                                                    focus:ring-offset-2"
                                    >
                                        Contact Us
                                    </button>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-500 sm:mt-4">
                                    We will get in touch with you shortly.
                                </p>
                            </form>
                        </div>
                        <div className="mt-4 grid md:grid-cols-1 md:gap-x-8">
                            <div className="py-6">What's included</div>

                            <ul className="divide-y divide-gray-200">
                                {features.map((feature, featureIdx) => (
                                <li key={feature} className={classNames(featureIdx === 0 ? 'md:py-0 md:pb-4' : '', 'py-4 flex')}>
                                    <CheckIcon className="h-6 w-6 flex-shrink-0 text-green-500" aria-hidden="true" />
                                    <span className="ml-3 text-base text-gray-500">{feature}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={banner}
                        alt=""
                    />
                </div>    
                </>
            )}
            
        </main>
    )
}

export default CustomerPremium;