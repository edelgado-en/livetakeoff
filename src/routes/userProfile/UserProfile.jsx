import { useState, useEffect } from "react"
import { KeyIcon, UserCircleIcon, ViewBoardsIcon } from "@heroicons/react/outline"
import { Disclosure, Menu, Switch, Transition } from '@headlessui/react'

import { getUserInfo } from "../../localstorage"

import AnimatedPage from "../../components/animatedPage/AnimatedPage"

const subNavigation = [
    { name: 'Profile', href: '#', icon: UserCircleIcon, current: true },
    { name: 'Password', href: '#', icon: KeyIcon, current: false },
    { name: 'Work History', href: '#', icon: ViewBoardsIcon, current: false },
  ]

const user = {
    name: 'Debbie Lewis',
    handle: 'edelgado',
    email: 'enriquedelgado806@gmail.com',
    about: 'I specialized in big airplanes interior cleaning only. I prefer to work on the weekends.',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1/media/profiles/avatar_csbht6',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const UserProfile = () => {
    const [availableToHire, setAvailableToHire] = useState(true)
    const [privateAccount, setPrivateAccount] = useState(false)
    const [receiveWhatsappNotifications, setReceiveWhatsappNotifications] = useState(false)

    return (
        <AnimatedPage>
        <main className="">
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <aside className="py-6 lg:col-span-3">
                <nav className="space-y-1">
                  {subNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-red-50 border-red-500 text-red-700 hover:bg-teal-50 hover:text-red-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-red-500 group-hover:text-red-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </aside>
              {/* ADD VALIDATION, MAX LENGTH, MIN HEIGHT, MAX HEIGHT, MANDATORY FIELDS, ETC */}
              <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
                
                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                  <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      This information will be displayed to other users of the app.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="flex-grow space-y-6">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            defaultValue={user.handle}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                          About 
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            defaultValue={''}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description for your profile. You can mention availability, specialties, and preferences.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                      <p className="text-sm font-medium text-gray-700" aria-hidden="true">
                        Photo
                      </p>
                      <div className="mt-1 lg:hidden">
                        <div className="flex items-center">
                          <div
                            className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                            aria-hidden="true"
                          >
                            <img className="h-full w-full rounded-full" src={getUserInfo().avatar} alt="" />
                          </div>
                          <div className="ml-5 rounded-md shadow-sm">
                            <div className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50">
                              <label
                                htmlFor="mobile-user-photo"
                                className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                              >
                                <span>Change</span>
                                <span className="sr-only"> user photo</span>
                              </label>
                              <input
                                id="mobile-user-photo"
                                name="user-photo"
                                type="file"
                                className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative hidden overflow-hidden rounded-full lg:block">
                        <img className="relative h-40 w-40 rounded-full" src={getUserInfo().avatar} alt="" />
                        <label
                          htmlFor="desktop-user-photo"
                          className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                        >
                          <span>Change</span>
                          <span className="sr-only"> user photo</span>
                          <input
                            type="file"
                            id="desktop-user-photo"
                            name="user-photo"
                            className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-12">
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="url"
                        id="url"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 pt-6">
                  <div className="px-4 sm:px-6">
                    <div>
                      <h2 className="text-lg font-medium leading-6 text-gray-900">Privacy</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Your privacy settings. Only visible to you and account managers.
                      </p>
                    </div>
                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                      <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                            Set yourself as busy
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Enable this when you in vacations or unavailable.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={availableToHire}
                          onChange={setAvailableToHire}
                          className={classNames(
                            availableToHire ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
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
                            Receive email notifications
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Send emails when assigning or completing jobs.
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
                            Receive Whatsapp notifications
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Send text messages when assigning or completing jobs.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={receiveWhatsappNotifications}
                          onChange={setReceiveWhatsappNotifications}
                          className={classNames(
                            receiveWhatsappNotifications ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                               receiveWhatsappNotifications ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-5 inline-flex justify-center rounded-md border
                                 border-transparent bg-red-700 py-2 px-4 text-sm
                                 font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form> 
            </div>
          </div>
        </div>
      </main>
      </AnimatedPage>
    )
}

export default UserProfile;