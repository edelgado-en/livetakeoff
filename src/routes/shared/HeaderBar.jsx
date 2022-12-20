import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';

import logo from '../../images/logo_red-no-text.png';


const Bars3Icon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    )
}

const XMarkIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

const HeaderBar = () => {
  return (
    <Popover className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b-2
                         border-gray-100 py-3 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <span className="sr-only">Livetakeoff</span>
            <img
                className="h-8 w-auto sm:h-10"
                src={logo}
                alt="livetakeoff"
            />
            <div className="font-bold text-xl relative top-1 ml-1">LiveTakeoff</div>
          </div>

          <div className="hidden md:flex">
            <Link to="/shared/contact" className="text-base font-medium text-gray-700 hover:text-gray-900">
                  Contact us
            </Link>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md
                                     bg-white p-2 text-gray-400 hover:bg-gray-100
                                      hover:text-gray-500 focus:outline-none focus:ring-2
                                       focus:ring-inset focus:ring-gray-500">
              <Bars3Icon  aria-hidden="true" />
            </Popover.Button>
          </div>
         
          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <Link to="/login" className="whitespace-nowrap font-medium text-sm
                                       text-gray-500 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="ml-8 inline-flex items-center justify-center whitespace-nowrap
                         rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm
                          font-medium text-white shadow-sm hover:bg-red-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition md:hidden">
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src={logo}
                    alt="Livetakeoff"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md 
                                           bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-500
                                            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
              </div>
            </div>
            <div className="space-y-6 py-6 px-5">
              <Link to="/shared/contact" className="text-base font-medium text-gray-700 hover:text-gray-900">
                Contact us
              </Link>
              <div>
                <Link
                  to="/signup"
                  className="flex w-full items-center justify-center rounded-md
                             border border-transparent bg-red-600 px-4 py-2 text-base font-medium
                              text-white shadow-sm hover:bg-red-700"
                >
                  Sign up
                </Link>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?{' '}
                  <Link to="/login" className="text-red-600 hover:text-red-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default HeaderBar;