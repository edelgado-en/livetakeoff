import { useEffect, useState, Fragment } from "react"
import { toast } from "react-toastify"
import AnimatedPage from "../../../components/animatedPage/AnimatedPage"
import Loader from "../../../components/loader/Loader";
import * as api from './apiService'

import Pagination from "react-js-pagination";

const MagnifyingGlassIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
  
    )
}

const RetainerCustomers = () => {
    const [customers, setCustomers] = useState([])
    const [totalCustomers, setTotalCustomers] = useState(0)
    const [customerSearchName, setCustomerSearchName] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    
    useEffect(() => {
        //Basic throttling
        let timeoutID = setTimeout(() => {
          searchCustomers()
        }, 500);
    
        return () => {
          clearTimeout(timeoutID);
        };
    
    }, [customerSearchName, currentPage])


    const searchCustomers = async () => {
        const request = {
            name: customerSearchName
        }

        try {
            const { data } = await api.searchRetainerCustomers(request, currentPage)

            setCustomers(data.results)
            setTotalCustomers(data.count)

            setLoading(false)

        } catch (error) {
            toast('Unable to get customers')
            setLoading(false)
        }
    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          
          searchCustomers();
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <AnimatedPage>
            <div className="xl:px-16 px-4 m-auto max-w-4xl -mt-3">
                <div className="">
                    <h1 className="text-2xl font-semibold text-gray-600">Retainer Customers</h1>
                </div>
                <div className="grid grid-cols-2 py-4 text-sm">
                    <div>
                        Total: <span className="text-gray-900 font-medium">{totalCustomers}</span>
                    </div>
                    <div>
                    </div>
                </div>
                
                {loading && <Loader />}  

                {!loading && totalCustomers === 0 && (
                    <div className="py-20 text-center m-auto text-sm">No retainer customers found.</div>   
                )}

                {!loading && totalCustomers > 0 && (
                    <div>
                        <div className="w-full">
                            <div className="relative border-b border-gray-200">
                        <div 
                            onClick={() => searchCustomers()}
                            className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                            <MagnifyingGlassIcon 
                                className="h-4 w-4 text-gray-400 cursor-pointer"
                                aria-hidden="true" />
                                </div>
                                <input
                                type="search"
                                name="search"
                                id="search"
                                value={customerSearchName}
                                onChange={event => setCustomerSearchName(event.target.value)}
                                onKeyDown={handleKeyDown}
                                className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                        focus:ring-sky-500 text-sm"
                                placeholder="search by name..."
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white xl:shadow sm:rounded-md mb-20">
                            <ul className="relative z-0 divide-y divide-gray-200">
                                {customers.map((customer) => (
                                <li key={customer.id}>
                                    <div className="relative flex items-center space-x-3 xl:px-6 lg:px-6 md:px-6 sm:px-1 xs:px-1
                                                     py-5 focus-within:ring-2 focus-within:ring-inset
                                                      focus-within:ring-red-500 hover:bg-gray-50">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full" src={customer.logo} alt="" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div  className="focus:outline-none">
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                <p className="text-sm  text-gray-900 truncate overflow-ellipsis xs:w-48">{customer.name}</p>
                                                <p className="truncate text-xs text-gray-500">{customer.emailAddress ? customer.emailAddress : 'No email specified'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-right">
                                                ${customer.retainer_amount.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-right text-gray-500">monthly</div>
                                        </div>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {!loading && totalCustomers > 100 && (
                    <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                        <div>
                            <Pagination
                            innerClass="pagination pagination-custom"
                            activePage={currentPage}
                            hideDisabled
                            itemClass="page-item page-item-custom"
                            linkClass="page-link page-link-custom"
                            itemsCountPerPage={100}
                            totalItemsCount={totalCustomers}
                            pageRangeDisplayed={3}
                            onChange={handlePageChange}
                        /> 
                        </div>
                    </div>
                )}

            </div>
        </AnimatedPage>
    )

}

export default RetainerCustomers;