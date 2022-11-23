
import banner from '../../../images/customer_premium.jpeg'

import { CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"

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

    return (
        <main className="lg:relative -mt-8">
        <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
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
                                placeholder="Enter your email"
                                className="block w-full rounded-md border-0
                                            px-4 py-3 text-base text-gray-900 placeholder-gray-500
                                            focus:outline-none focus:ring-2 focus:ring-sky-500
                                            focus:ring-offset-2 "
                            />
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                        <button
                            type="submit"
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

                <ul role="list" className="divide-y divide-gray-200">
                    {features.slice(0, 5).map((feature, featureIdx) => (
                    <li key={feature} className={classNames(featureIdx === 0 ? 'md:py-0 md:pb-4' : '', 'py-4 flex')}>
                        <CheckIcon className="h-6 w-6 flex-shrink-0 text-green-500" aria-hidden="true" />
                        <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                    ))}
                </ul>
                <ul role="list" className="divide-y divide-gray-200 border-t border-gray-200 md:border-t-0">
                    {features.slice(5).map((feature, featureIdx) => (
                    <li
                        key={feature}
                        className={classNames(featureIdx === 0 ? 'md:border-t-0 md:py-0 md:pb-4' : '', 'py-4 flex')}
                    >
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
      </main>
    )
}

export default CustomerPremium;