import { useState, useEffect, Fragment } from "react"
import { ChevronLeftIcon, CheckIcon, PlusIcon, MinusIcon } from '@heroicons/react/outline'
import Loader from '../../components/loader/Loader'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { Link } from "react-router-dom"
import * as api from './apiService'
import { toast } from "react-toastify"


const XMarkIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

const MagnifyingGlassIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

    )
}


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const ServicePrices = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [totalAircraftTypes, setTotalAircraftTypes] = useState(0)
    const [aircraftTypes, setAircraftTypes] = useState([])
    const [aircraftTypeSelected, setAircraftTypeSelected] = useState(null)
    const [aircraftSearchName, setAircraftSearchName] = useState('')
    const [estimatedCompletionTime, setEstimatedCompletionTime] = useState('')
    const [pricePlans, setPricePlans] = useState([])
    const [priceListing, setPriceListing] = useState([])

    useEffect(() => {
        //Basic throttling
      let timeoutID = setTimeout(() => {
        searchAircrafts()
      }, 500);
  
      return () => {
        clearTimeout(timeoutID);
      };

    }, [aircraftSearchName])

    const searchAircrafts = async () => {
        setLoading(true)
        
        const request = {
            name: aircraftSearchName
        }

        const { data } = await api.getAircraftTypes(request)

        setTotalAircraftTypes(data.count)
        setAircraftTypes(data.results)

        setLoading(false)

    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          
          searchAircrafts();
        }
    }

    const getAircraftDetails = async (aircraftType) => {
        const newAircraftTypes = aircraftTypes.map((item) => {
            if (item.id === aircraftType.id) {
              item.showDetails = !item.showDetails
            
            } else {
              item.showDetails = false
            }

            return item
        })

        setAircraftTypes(newAircraftTypes)
        setAircraftTypeSelected(aircraftType)

        const response = await api.getPriceListing(aircraftType.id)

        setPriceListing(response.data)

        const response2 = await api.getPricingPlans()

        setPricePlans(response2.data.results)

    }

    const updateServicePrice = (serviceName, priceListName, updatedPrice) => {
        const price = updatedPrice.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

        const updatedPriceListing = priceListing.map(priceList => {
            if(priceList.service === serviceName) {
                const updatedPriceListEntries = priceList.price_list_entries.map(entry => {
                    if(entry.price_list === priceListName) {
                        return {
                            ...entry,
                            price: price
                        }
                    }

                    return entry
                })

                return {
                    ...priceList,
                    price_list_entries: updatedPriceListEntries
                }
            }

            return priceList
        })

        setPriceListing(updatedPriceListing)
    }

    const saveChangesForPricePlan = async (pricePlanName) => {
        const priceListEntries = priceListing.map(priceList => {
            const priceListEntry = priceList.price_list_entries.find(entry => entry.price_list === pricePlanName)

            return {
                service: priceList.service,
                price: priceListEntry.price
            }
        })

        const request = {
            name: pricePlanName,
            price_list_entries: priceListEntries,
            aircraft_type_id: aircraftTypeSelected?.id
        }

        try {
          await api.updatePricePlan(aircraftTypeSelected?.id, request)

          toast.success('Price list updated successfully')

        } catch (error) {

        } 

    }

    return (
        <div className="flex h-full -mt-8">
        {/* Side bar for mobile */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full
                                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white border-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  
                  <div className="flex-shrink-0 border-t border-gray-200 p-4">
                    <div className="flex justify-between">
                      <h2 className="text-2xl font-medium text-gray-900">Aircrafts</h2>
                      <div>
                          <Link to="/create-aircraft">
                          <button 
                              type="button" 
                              className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                    text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2">
                              <svg className="h-6 w-6" x-description="Heroicon name: outline/plus"
                                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                  stroke="currentColor" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                              </svg>
                          </button>
                          </Link>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Search list of {totalAircraftTypes} aircrafts types</p>
                    <form className="mt-6 flex space-x-4" action="#">
                      <div className="min-w-0 flex-1">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div 
                            onClick={() => searchAircrafts()}
                            className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                            <MagnifyingGlassIcon 
                                className="h-5 w-5 text-gray-400 cursor-pointer"
                                aria-hidden="true" />
                          </div>
                          <input
                            type="search"
                            name="search"
                            id="search"
                            value={aircraftSearchName}
                            onChange={event => setAircraftSearchName(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                    focus:ring-sky-500 sm:text-sm"
                            placeholder="Search name..."
                          />
                        </div>
                      </div>
                    </form>
                    {/* Directory list Mobile */}
                    <nav className="min-h-0 flex-1 overflow-y-auto mt-5">
                      {loading && <Loader /> }

                      {!loading && totalAircraftTypes === 0 && (
                        <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                          <p className="font-semibold">No aircrafts found.</p>
                          <p>You can add an aircraft by clicking on the plus icon.</p>
                        </div>
                      )}
                        <ul role="list" className="relative z-0 divide-y divide-gray-200">
                        {aircraftTypes.map((aircraft) => (
                            <li key={aircraft.id} onClick={() => getAircraftDetails(aircraft)}>
                              <div className={`${aircraft.showDetails ? ' border-2 border-red-500' : ''} cursor-pointer relative flex items-center space-x-3 px-6 py-5 hover:bg-gray-50`}>
                                  <div className="min-w-0 flex-1">
                                      <span className="absolute inset-0" aria-hidden="true" />
                                      <p className="text-sm font-medium text-gray-900">{aircraft.name}</p>
                                  </div>
                              </div>
                            </li>
                        ))}
                        </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
              {/* Mobile only */}
              <nav className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden" aria-label="Breadcrumb">
                <div onClick={() => setSidebarOpen(true)} className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
                  <ChevronLeftIcon className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span>Aircrafts</span>
                </div>
              </nav>

              <article className="m-auto max-w-5xl px-2">
                <div className="flex flex-wrap justify-between text-sm pt-6 pb-2">
                    <div className="pb-4">
                        <span className="text-2xl font-semibold text-gray-600">Prices</span>
                        <p className="text-gray-500">Prices are based on type of service and type of aircraft</p>
                    </div>
                </div>
                <div>
                  {/* Comparison table */}
                  <div className="mx-auto max-w-2xl bg-white pb-16 sm:pb-16 lg:max-w-7xl">
                    {/* xs to lg */}
                    {/* <div className="py-4 font-medium text-lg xl:hidden">{aircraftTypeSelected?.name}</div>
                    <div className="space-y-12 lg:hidden">
                      {pricePlans.map((pricePlan) => (
                        <section key={pricePlan.name}>
                          <div className="mb-8 px-4">
                            <h2 className="text-md font-medium leading-6 text-gray-900">{pricePlan.name}</h2>
                            <p className="mt-4 text-xs text-gray-500">{pricePlan.description}</p>
                          </div>
            
                          <table className="w-full">
                            <caption className="border-t border-gray-200 bg-gray-50 py-3 px-4 text-left text-sm font-medium text-gray-900">
                              Services
                            </caption>
                            <tbody className="divide-y divide-gray-200">
                              {priceListing.map((entry) => (
                                <tr key={entry.service} className="border-t border-gray-200">
                                  <th className="py-5 px-4 text-left text-xs font-normal text-gray-500" scope="row">
                                    {entry.service}
                                  </th>
                                  <td className="py-5 pr-4">
                                    <div className="flex gap-2">
                                     <input type="text" name="first-name" id="first-name"
                                        style={{ width: '60px' }}
                                        className="block rounded-md border-gray-300 py-1
                                                    shadow-sm focus:border-gray-500 focus:ring-gray-500
                                                  text-xs">
                                                
                                      </input>
                                      <span className="text-gray-500 relative top-1" style={{ fontSize: '10px' }}>USD</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
            
                          <div className="border-t border-gray-200 px-4 pt-5">
                            <button
                              className="block w-full rounded-md border border-transparent
                                       bg-red-500 py-2 text-center text-sm
                                         font-semibold text-white shadow hover:to-pink-600"
                            >
                              Save Changes
                            </button>
                          </div>
                        </section>
                      ))}
                    </div> */}
            
                    {/* lg+ */}
                    <div className="" style={{minWidth: '820px'}}>
                      {aircraftTypeSelected === null && (
                        <div className="text-sm text-gray-700 mt-16">Select an aircraft from the left.</div>
                      )}

                      {aircraftTypeSelected !== null && (
                          <table className="h-px w-full table-fixed">
                            <thead>
                              <tr>
                                <th className="pb-4 pl-6 pr-6 text-left text-md font-medium text-gray-900" scope="col">
                                    Aircraft
                                </th>
                                {pricePlans.map((pricePlan) => (
                                  <th
                                    key={pricePlan.name}
                                    className="w-1/4 px-6 pb-4 text-left text-md font-medium leading-6 text-gray-900"
                                    scope="col"
                                  >
                                    {pricePlan.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                              <tr>
                                <th className="py-5 pl-6 pr-6 text-left align-top text-sm font-medium text-gray-900" scope="row">
                                  <div className="text-red-500 font-semibold">{aircraftTypeSelected?.name}</div>
                                </th>
                                {pricePlans.map((pricePlan) => (
                                  <td key={pricePlan.name} className="h-full px-6 align-top">
                                    <div className="flex h-full flex-col justify-between">
                                      <div>
                                        <p className="mt-4 text-xs text-gray-500">{pricePlan.description}</p>
                                      </div>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                <th
                                  className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900"
                                  colSpan={pricePlans.length} /* This has to be tiers.length */
                                  scope="colgroup"
                                >
                                  Services
                                </th>
                              </tr>
                                {priceListing.map((entry) => (
                                  <tr key={entry.service}>
                                    <th className="py-5 pl-6 pr-6 text-left text-xs font-normal text-gray-500" scope="row">
                                      {entry.service}
                                    </th>
                                    {entry.price_list_entries.map((priceList) => (
                                      <td key={priceList.price_list} className="py-5 px-6">
                                        <div className="flex gap-2">
                                          <input 
                                              type="text"
                                              name="price"
                                              id="price"
                                              value={priceList.price}
                                              onChange={(e) => updateServicePrice(entry.service, priceList.price_list, e.target.value)}
                                              style={{ width: '80px' }}
                                              className="block rounded-md border-gray-300 py-1
                                                        shadow-sm focus:border-gray-500 focus:ring-gray-500
                                                      text-xs"></input>
                                          <span className="text-gray-500 relative top-1" style={{ fontSize: '10px' }}>USD</span>
                                        </div>
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t border-gray-200">
                                <th className="sr-only" scope="row">
                                
                                </th>
                                {pricePlans.map((pricePlan) => (
                                  <td key={pricePlan.name} className="px-6 pt-5">
                                    <button
                                      onClick={() => saveChangesForPricePlan(pricePlan.name)}
                                      className="block w-1/2 rounded-md border
                                                border-transparent bg-red-500
                                                  py-2 text-center text-xs font-semibold
                                                  text-white shadow hover:to-pink-600"
                                    >
                                      Save Changes
                                    </button>
                                  </td>
                                ))}
                              </tr>
                            </tfoot>
                          </table>
                      )}
                      
                    </div>
                  </div>
                </div>

                
              </article>
            </main>
            <aside className="hidden w-96 flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
              <div className="px-6 pt-6 pb-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-medium text-gray-900">Aircrafts</h2>
                  <div>
                      <Link to="/create-customer">
                        <button type="button" className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                    text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2">
                            <svg className="h-6 w-6" x-description="Heroicon name: outline/plus"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                            </svg>
                        </button>
                      </Link>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">Search list of {totalAircraftTypes} aircraft types</p>
                <form className="mt-6 flex space-x-4" action="#">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div 
                        onClick={() => searchAircrafts()}
                        className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                        <MagnifyingGlassIcon 
                            className="h-5 w-5 text-gray-400 cursor-pointer"
                            aria-hidden="true" />
                      </div>
                      <input
                        type="search"
                        name="search"
                        id="search"
                        value={aircraftSearchName}
                        onChange={event => setAircraftSearchName(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                 focus:ring-sky-500 sm:text-sm"
                        placeholder="Search name..."
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Aircraft list */}
              <nav className="min-h-0 flex-1 overflow-y-auto">
                {loading && (
                  <Loader />
                )}

                {!loading && totalAircraftTypes === 0 && (
                  <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                    <p className="font-semibold">No aircrafts found.</p>
                    <p>You can add an aircraft by clicking on the plus icon.</p>
                  </div>
                )}

                <ul role="list" className="relative z-0 divide-y divide-gray-200">
                    {aircraftTypes.map((aircraft) => (
                      <li key={aircraft.id} onClick={() => getAircraftDetails(aircraft)}>
                          <div className={`${aircraft.showDetails ? ' border-2 border-red-500' : ''} cursor-pointer relative flex items-center space-x-3 px-6 py-5
                                           hover:bg-gray-50`}>
                            <div className="min-w-0 flex-1">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm text-gray-900">{aircraft.name}</p>
                            </div>
                          </div>
                      </li>
                    ))}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </div>
    )
}

export default ServicePrices;