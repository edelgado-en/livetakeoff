import { useEffect, useState, Fragment } from 'react'
import { ArrowLeftIcon, UsersIcon, CashIcon, BriefcaseIcon, ArrowSmRightIcon, CheckIcon, ChevronDownIcon} from '@heroicons/react/outline'
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

import ReactTimeAgo from 'react-time-ago'

import * as api from './apiService'
import AnimatedPage from '../../../components/animatedPage/AnimatedPage'
import Loader from '../../../components/loader/Loader'

const UserProductivity = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [productivityData, setProductivityData] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        getUserProductivityStats()
    }, [])

    const getUserProductivityStats = async () => {
        
        try {
            const { data } = await api.getUserProductivityStats(id)
            
            setProductivityData(data)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    }

    return (
        <AnimatedPage>
            <div className="px-4 max-w-7xl m-auto">
                <div className="w-full flex gap-2">
                    <button onClick={() => navigate(-1)} className="text-xs leading-5 font-semibold bg-slate-400/10
                                                        rounded-full p-2 text-slate-500
                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                        dark:highlight-white/5">
                            <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                    </button>
                    <h2 className="text-2xl font-bold tracking-tight">
                        User Productivity
                    </h2>
                </div>

                {loading && <Loader /> }

                {!loading && (
                    <div className="py-8">
                        <div className="flex items-center space-x-5">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img className="h-16 w-16 rounded-full" src={productivityData.user.avatar} alt="" />
                                    <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-700">
                                    {productivityData.user.first_name} {' '} {productivityData.user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">Member since
                                    <span className="text-gray-900 mx-1">
                                    <ReactTimeAgo date={new Date(productivityData.member_since)} locale="en-US" timeStyle="twitter" />
                                  </span>
                                  - works for 
                                  <span className="text-gray-900 mx-1">
                                    {productivityData.user.vendor}
                                  </span>
                                  </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AnimatedPage>
    )
}

export default UserProductivity