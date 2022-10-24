import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import BannerPlaceholder from '../../images/banner-placeholder.svg'
import ProfilePlaceholder from '../../images/user-placeholder.jpg'

import * as api from './apiService'

const tabs = [
    { name: 'Profile', href: 'details', current: true },
    { name: 'Discounts', href: 'discounts', current: false },
    { name: 'Fees', href: 'fees', current: false },
    { name: 'Jobs', href: 'jobs', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const CustomerProfile = () => {
    const { customerId } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null)
    const location  = useLocation();

    useEffect(() => {
        getCustomerDetails()
    }, [customerId])

    const getCustomerDetails = async () => {
        
        try {
            // TODO: you should be calling getCustomerDetails here. You should be calling customer stats
            // which gives you the name, logo, banner, discounts count, additional fees count, and jobs count
            // You call getCustomerDetails when you load the CustomerDetails component
            const { data } = await api.getCustomerDetails(customerId)
    
            console.log(data)
    
            setCustomerDetails(data)
    
        } catch (err) {
    
        }
      }

    return (
        <>
        <div>
            <div>
                <img className="h-32 w-full object-cover lg:h-48" src={customerDetails?.banner ? customerDetails.banner : BannerPlaceholder} alt="" />
            </div>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                    <div className="flex">
                        <img
                            className="h-24 w-24 rounded-full ring-4
                                    ring-white sm:h-32 sm:w-32 bg-white border-black"
                            src={customerDetails?.logo ? customerDetails.logo : ProfilePlaceholder}
                            alt=""
                        />
                    </div>
                    <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                            <h1 className="truncate text-2xl font-bold text-gray-900">{customerDetails?.name}</h1>
                        </div>
                        <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                            
                        </div>
                    </div>
                </div>
                <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                    <h1 className="truncate text-2xl font-bold text-gray-900">{customerDetails?.name}</h1>
                </div>
            </div>
        </div>
        <div className="mt-0 sm:mt-0 2xl:mt-5">
            <div className="border-b border-gray-200">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                    key={tab.name}
                    to={tab.href}
                    className={classNames(
                        location.pathname.includes(tab.href) 
                        ? 'border-red-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    >
                    {tab.name}
                    </Link>
                ))}
                </div>
            </div>
            </div>
        </div>
        
        <div className="overflow-x-hidden">
            <Outlet />
        </div>
        </>
    )

}

export default CustomerProfile