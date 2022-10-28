import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import logo from '../../images/logo_2618936_web.png'

import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchUser, selectUser } from "../../routes/userProfile/userSlice";

const navigation = [
  { name: 'Jobs', href: 'jobs', current: true },
  { name: 'Services', href: '#', current: false },
  { name: 'Price Listing', href: '#', current: false }, 
  { name: 'Customers', href: 'customers', current: false }, 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Bars3Icon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}


const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser)
  const location  = useLocation();

  useEffect(() => {
    dispatch(fetchUser());

  }, [])


  const handleLogout = () => {
    localStorage.clear();

    navigate('/login');

  }

  return (
    <Disclosure as="nav" className="bg-red-600">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2
                                            text-white hover:bg-red-700 hover:text-white focus:outline-none
                                              focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ">
                <Link to="jobs" 
                      className="flex flex-shrink-0 items-center rounded-full p-2 bg-white">
                   <img
                    className="block h-8 w-auto lg:hidden"
                    src={logo}
                    alt="Your Company"
                  /> 
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src={logo}
                    alt="Your Company"
                  />
                </Link>
                <div className="hidden sm:ml-6 sm:block relative" style={{ top: '6px' }}>
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname.includes(item.href) ? 'bg-red-700' : ' hover:bg-red-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium text-white'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
                      <Link 
                        to="completed"
                        className={classNames(
                          location.pathname.includes("completed") ? 'bg-red-700' : ' hover:bg-red-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium text-white'
                        )}>
                          Completed Jobs
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-red-600 text-sm focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      <div className="w-12 text-center">
                          {currentUser.avatar ? 
                            <img
                            className="h-10 w-10 rounded-full"
                            src={currentUser.avatar}
                            alt=""
                          />
                            :
                            <div className="w-10" style={{ lineHeight: '36px',borderRadius: '50%', fontSize: '15px', background: 'white', color: 'black' }}>
                              {currentUser.initials}
                            </div>
                          }
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="user-settings/profile"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={handleLogout}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Link key={item.name}
                     to={item.href}>
                  <Disclosure.Button
                    className={classNames(
                      location.pathname.includes(item.href) ? 'bg-red-700' : 'hover:bg-red-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left'
                    )}
                  >
                      {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
              {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
                    <Link 
                      to="completed"
                      >
                        <Disclosure.Button
                          className={classNames(
                            location.pathname.includes("completed") ? 'bg-red-700' : 'hover:bg-red-700 hover:text-white',
                            'block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left'
                          )}
                        >
                            Completed Jobs
                        </Disclosure.Button>
                    </Link>
                )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Topbar;
