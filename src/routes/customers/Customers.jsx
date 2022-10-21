import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, Switch, Menu } from '@headlessui/react'
import { ChevronLeftIcon } from '@heroicons/react/outline'

import * as api from './apiService'

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

const user = {
  name: 'Tom Cook',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const tabs = [
  { name: 'Profile', href: '#', current: true },
  { name: 'Discounts', href: '#', current: false },
  { name: 'Additional Fees', href: '#', current: false },
  { name: 'Jobs', href: '#', current: false },
]
const profile = {
  name: 'Wheels Up',
  imageUrl:
    'https://res.cloudinary.com/datidxeqm/image/upload/v1666296592/wheelsUpLogo_dsc6uu.svg',
  coverImageUrl:
    'https://res.cloudinary.com/datidxeqm/image/upload/v1666296586/wheelpsUpBanner_r1rshh.jpg',
  about: `
  <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
    <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
  `,
  fields: {
    Phone: '(555) 123-4567',
    Email: 'wheelsup@example.com',
    BillingAddress: '5678 NW 104th drive Coral Springs FL 33076',
    BillingInfo: 'All invoices must be sent also to thisemail@jetedge.com',
    Active: 'Yes',
    Instructions: 'The plane is locked and the key is in the lock box in the nose gear storage unit. The code is 251. Clean cupholders, sink, lav, carpet, and microwave.'
  },
}

/* const directory = {
  A: [
    {
      id: 1,
      name: 'Aircharter Worldwide',
      role: 'aircharterworldwide@gmail.com',
      imageUrl:
        'https://res.cloudinary.com/datidxeqm/image/upload/v1666296592/wheelsUpLogo_dsc6uu.svg',
    },
    {
      id: 2,
      name: 'Aircraft Service Providers',
      role: 'info@aircraftserviceproviders.com',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Aircraft Services',
      role: 'marcosbarreirajr@hotmail.com',
      imageUrl:
        'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 4,
      name: 'AirFlight Charters',
      role: 'bill@airflightcharters.com',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  B: [
    {
      id: 5,
      name: 'Banker Aviation LLC',
      role: 'victorbori@gmail.com',
      imageUrl:
        'https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 6,
      name: 'Banyan Air Service',
      role: 'corrego@banyanair.com',
      imageUrl:
        'https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 7,
      name: 'Barry Henson',
      role: 'barry.ttds@gmail.com',
      imageUrl:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  C: [
    {
      id: 8,
      name: 'Captain Chas Melichar',
      role: 'captainchas@gmail.com',
      imageUrl:
        'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 9,
      name: 'Captain Kurt',
      role: 'FalconJetCaptain@gmail.com',
      imageUrl:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  E: [
    {
      id: 10,
      name: 'Eagle Creek Logistics LLC',
      role: 'accounting@progressivejet.com',
      imageUrl:
        'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 11,
      name: 'Eastern Airlines, LLC',
      role: 'Muriah.Jenkins@signatureflight.com',
      imageUrl:
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 12,
      name: 'EC Flights Inc',
      role: 'matt@jmajets.com',
      imageUrl:
        'https://images.unsplash.com/photo-1504703395950-b89145a5425b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 13,
      name: 'Eduardo Gomez',
      role: 'egomez@myjetsaver.com',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
  S: [
    {
      id: 14,
      name: 'Stars de Mexico SA de CV',
      role: 'chavacom2001@yahoo.com.mx',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 15,
      name: 'State of Florida',
      role: 'raymondulrich@fdle.state.fl.us',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
} */


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Customers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [availableToHire, setAvailableToHire] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)
  const [allowCommenting, setAllowCommenting] = useState(true)
  const [allowMentions, setAllowMentions] = useState(true)
  const [loading, setLoading] = useState(false)
  const [customerDirectory, setCustomerDirectory] = useState([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [customerSearchName, setCustomerSearchName] = useState('')

  useEffect(() => {
      searchCustomers()
  }, [])

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchCustomers()
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };

  }, [customerSearchName])

  const searchCustomers = async () => {
    setLoading(true)

    const request = {
      name: customerSearchName,
    }

    try {
      
      const { data} = await api.getCustomers(request)
      
      setTotalCustomers(data.count)
      const directory = groupByFirstLetter(data.results)
      setCustomerDirectory(directory)
      setLoading(false)

    } catch (err) {
      setLoading(false)
    }
  }

  const handleKeyDown = event => {
    console.log(event.key);

    if (event.key === 'Enter') {
      event.preventDefault();
      
      searchCustomers();
    }
  };

  const groupByFirstLetter = (array) => {
    let resultObj = {};
    
    for (let i = 0; i < array.length; i++) {
      let currentWord = array[i].name;
      let firstChar = currentWord[0].toUpperCase();
      let innerArr = [];
      
      if (resultObj[firstChar] === undefined) {
          innerArr.push(array[i]);
          resultObj[firstChar] = innerArr
      
      } else {
          resultObj[firstChar].push(array[i])
      }
    }

    return resultObj
  }

  return (
    <>
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
                      <h2 className="text-2xl font-medium text-gray-900">Customers</h2>
                      <div>
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
                    <p className="mt-1 text-sm text-gray-600">Search directory of {totalCustomers} customers</p>
                    <form className="mt-6 flex space-x-4" action="#">
                      <div className="min-w-0 flex-1">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div 
                            onClick={() => searchCustomers()}
                            className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                            <MagnifyingGlassIcon 
                                className="h-5 w-5 text-gray-400 cursor-pointer"
                                aria-hidden="true" />
                          </div>
                          <input
                            type="search"
                            name="search"
                            id="search"
                            value={customerSearchName}
                            onChange={event => setCustomerSearchName(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                    focus:ring-sky-500 sm:text-sm"
                            placeholder="Search name..."
                          />
                        </div>
                      </div>
                    </form>
                    {/* Directory list */}
                    <nav className="min-h-0 flex-1 overflow-y-auto mt-5" aria-label="Directory">
                      {totalCustomers === 0 && (
                        <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                          <p className="font-semibold">No customers found.</p>
                          <p>You can add a customer by clicking on the plus icon.</p>
                        </div>
                      )}
                      {Object.keys(customerDirectory)?.map((letter) => (
                        <div key={letter} className="relative">
                          <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
                            <h3>{letter}</h3>
                          </div>
                          <ul role="list" className="relative z-0 divide-y divide-gray-200">
                            {customerDirectory[letter]?.map((customer) => (
                              <li key={customer.id}>
                                <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50">
                                  <div className="flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full" src={customer.logo} alt="" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <a href="#" className="focus:outline-none">
                                      {/* Extend touch target to entire panel */}
                                      <span className="absolute inset-0" aria-hidden="true" />
                                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                      <p className="truncate text-sm text-gray-500">{customer.emailAddress ? customer.emailAddress : 'No email specified'}</p>
                                    </a>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
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
              {/* Breadcrumb */}
              <nav className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden" aria-label="Breadcrumb">
                <div onClick={() => setSidebarOpen(true)} className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
                  <ChevronLeftIcon className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span>Customers</span>
                </div>
              </nav>

              <article>
                {/* Profile header */}
                <div>
                  <div>
                    <img className="h-32 w-full object-cover lg:h-48" src={profile.coverImageUrl} alt="" />
                  </div>
                  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                      <div className="flex">
                        <img
                          className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 bg-white border-black"
                          src={profile.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                          <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                        </div>
                        <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                          
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                      <h1 className="truncate text-2xl font-bold text-gray-900">{profile.name}</h1>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-0 sm:mt-0 2xl:mt-5">
                  <div className="border-b border-gray-200">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                              tab.current
                                ? 'border-red-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                            aria-current={tab.current ? 'page' : undefined}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                {/* Description list */}
                <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    {Object.keys(profile.fields).map((field) => (
                      <div key={field} className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">{field}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.fields[field]}</dd>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">About</dt>
                      <dd
                        className="mt-1 max-w-prose space-y-5 text-sm text-gray-900"
                        dangerouslySetInnerHTML={{ __html: profile.about }}
                      />
                    </div>
                  </dl>
                </div>

                {/* Settings list */}
                <div className="mx-auto mt-8 max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
                  <div className="divide-y divide-gray-200 pt-6">
                  <div className="">
                    <div>
                      <h2 className="text-lg font-medium leading-6 text-gray-900">Settings</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Ornare eu a volutpat eget vulputate. Fringilla commodo amet.
                      </p>
                    </div>
                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                            Show Spending Info
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={availableToHire}
                          onChange={setAvailableToHire}
                          className={classNames(
                            availableToHire ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              availableToHire ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                            Allow Cancel Job
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Pharetra morbi dui mi mattis tellus sollicitudin cursus pharetra.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={privateAccount}
                          onChange={setPrivateAccount}
                          className={classNames(
                            privateAccount ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              privateAccount ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                            Show Job Price
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Integer amet, nunc hendrerit adipiscing nam. Elementum ame
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={allowCommenting}
                          onChange={setAllowCommenting}
                          className={classNames(
                            allowCommenting ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              allowCommenting ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </ul>
                  </div>
                </div>
                </div>
              </article>
            </main>
            <aside className="hidden w-96 flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
              <div className="px-6 pt-6 pb-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-medium text-gray-900">Customers</h2>
                  <div>
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
                <p className="mt-1 text-sm text-gray-600">Search directory of {totalCustomers} customers</p>
                <form className="mt-6 flex space-x-4" action="#">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div 
                        onClick={() => searchCustomers()}
                        className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                        <MagnifyingGlassIcon 
                            className="h-5 w-5 text-gray-400 cursor-pointer"
                            aria-hidden="true" />
                      </div>
                      <input
                        type="search"
                        name="search"
                        id="search"
                        value={customerSearchName}
                        onChange={event => setCustomerSearchName(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                 focus:ring-sky-500 sm:text-sm"
                        placeholder="Search name..."
                      />
                    </div>
                  </div>
                </form>
              </div>
              {/* Directory list */}
              <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Directory">
                {totalCustomers === 0 && (
                  <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                    <p className="font-semibold">No customers found.</p>
                    <p>You can add a customer by clicking on the plus icon.</p>
                  </div>
                )}
                {Object.keys(customerDirectory)?.map((letter) => (
                  <div key={letter} className="relative">
                    <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
                      <h3>{letter}</h3>
                    </div>
                    <ul role="list" className="relative z-0 divide-y divide-gray-200">
                      {customerDirectory[letter]?.map((customer) => (
                        <li key={customer.id}>
                          <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              <img className="h-10 w-10 rounded-full" src={customer.logo} alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <a href="#" className="focus:outline-none">
                                {/* Extend touch target to entire panel */}
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                <p className="truncate text-sm text-gray-500">{customer.emailAddress ? customer.emailAddress : 'No email specified'}</p>
                              </a>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default Customers;