import { Link } from "react-router-dom"
import { useEffect, useState, Fragment } from "react";
import { ChevronRightIcon, PlusIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

import Pagination from "react-js-pagination";


const XMarkIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
  }
  
const MagnifyingGlassIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
  
    )
}

const availableStatuses = [
    {id: 'All', name: 'All'},
    {id: 'P', name: 'Pending'},
    {id: 'A', name: 'Accepted'},
    {id: 'R', name: 'Rejected'},
]

const Estimates = () => {
    const [loading, setLoading] = useState(true)
    const [estimates, setEstimates] = useState([])
    const [totalEstimates, setTotalEstimates] = useState(0)

    useEffect(() => {
        searchEstimates()
    }, [])

    const searchEstimates = async () => {
        setLoading(true)

        const request = {
            status: 'All',
            customer: 'All'
        }

        try {
            const { data } = await api.searchEstimates(request)

            console.log(data)

            setLoading(false)

        } catch (error) {
            setLoading(false)
        }

    }

    return (
        <AnimatedPage>
            <div>Estimates</div>
        </AnimatedPage>
    )

}

export default Estimates;
