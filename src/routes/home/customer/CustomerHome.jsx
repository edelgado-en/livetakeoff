import { useState, useEffect, Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'

import { useAppSelector } from "../../../app/hooks";
import { selectUser } from '../../userProfile/userSlice';
import { useNavigate, Link } from 'react-router-dom';  

import {
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from '@heroicons/react/outline'

import { Bars3CenterLeftIcon, XMarkIcon } from '@heroicons/react/outline'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Domains', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]
const jobs = [
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  {
    name: 'N123BB',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  // More projects...
]
const activityItems = [
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  { project: 'N123BB', commit: '2d89f0c8', environment: 'production', time: '1h' },
  // More items...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const RectangleStack = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
             className="w-5 h-5 text-gray-400">
            <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
        </svg>
    )
}

const CheckBadge = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
             className="w-5 h-5 text-gray-400">
          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>

    )
}

const CustomerHome = () => {
    const currentUser = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [totalJobs, setTotalJobs] = useState(0);

    return (
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8 -mt-8 pb-32">
          {/* Left sidebar & main wrapper */}
          <div className="min-w-0 flex-1 bg-white xl:flex">
            {/* Account profile */}
            <div className="bg-white xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-gray-200">
              <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                      {/* Profile */}
                      <Link to="/user-settings/profile" className="flex items-center space-x-3 cursor-pointer">
                        {currentUser.avatar ? 
                            <img
                            className="h-10 w-10 rounded-full"
                            src={currentUser.avatar}
                            alt=""
                          />
                            :
                            <div className="flex">
                              <span className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </span>
                            </div>
                        }
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {currentUser.first_name} {' '} {currentUser.last_name}
                          </div>
                        </div>
                      </Link>
                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row xl:flex-col">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border
                                     border-transparent bg-red-600 px-4 py-2 text-sm font-medium
                                      text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                       focus:ring-red-500 focus:ring-offset-2 xl:w-full"
                        >
                          New Job
                        </button>
                      </div>
                    </div>
                    {/* Meta info */}
                    <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                      <div className="flex items-center space-x-2">
                        <CheckBadge />
                        <span className="text-sm font-medium text-gray-500">Basic Member</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RectangleStack />
                        <span className="text-sm font-medium text-gray-500">{totalJobs} Jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 
                              sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
                <div className="flex items-center">
                  <h1 className="flex-1 text-lg font-medium">Jobs</h1>
                  <Menu as="div" className="relative">
                    <Menu.Button className="inline-flex w-full justify-center rounded-md
                                             border border-gray-300 bg-white px-4 py-2 text-sm font-medium
                                              text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                               focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                      {/* <BarsArrowUpIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                      Sort
                      <ChevronDownIcon className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Name
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Date modified
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Date created
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
              <ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
                {jobs.map((project) => (
                  <li key={project.repo} className="relative py-5 pl-4 pr-6 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6 cursor-pointer">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-center space-x-3">
                          <h2 className="text-sm font-medium text-red-600">
                            {project.name}
                          </h2>
                          <div className="ml-2 text-sm text-gray-700 w-24">20221118-1</div>
                          <div className="lg:hidden md:hidden sm:hidden xs:flex relative text-sm text-gray-500">
                            <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                              bg-green-500
                                            `}>
                              In Progress
                            </p>
                          </div>
                        </div>
                        <div href={project.repoHref} className="group relative flex items-center space-x-2.5">
                          <span className="truncate text-xs text-gray-500">
                            BCT - Atlantic Aviation BCT - BBJ - Boeing 737
                          </span>
                        </div>
                      </div>

                      {/* The chevron right only shows in Mobile */}
                      <div className="sm:hidden">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>

                      {/* Right side of the card hidden in mobile due to space */}
                      <div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
                        <p className="flex items-center space-x-4">
                          <div className="relative text-sm text-gray-500">
                            <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                              bg-green-500
                                            `}>
                              In Progress
                            </p>
                          </div>
                        </p>
                        <p className="flex space-x-2 text-xs text-gray-500">
                          <span>Complete by Nov-26 07:00 AM</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 py-4 text-sm pl-8">
                  <a href="#" className="font-semibold text-red-600 hover:text-red-900">
                    View all jobs
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
            <div className="px-6 lg:w-80">
              <div className="pt-6 pb-2">
                <h2 className="text-sm font-semibold">Activity</h2>
              </div>
              <div>
                <ul role="list" className="divide-y divide-gray-200">
                  {activityItems.map((item) => (
                    <li key={item.commit} className="py-4">
                      <div className="flex space-x-3">
                        <img
                          className="h-6 w-6 rounded-full"
                          src="https://res.cloudinary.com/datidxeqm/image/upload/v1666499214/media/profiles/20130914_203548000_iOS_ra4miq.jpg"
                          alt=""
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">You</h3>
                            <p className="text-sm text-gray-500">{item.time}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Status changed to Accepted for tail N123BB
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 py-4 text-sm">
                  <a href="#" className="font-semibold text-red-600 hover:text-red-900">
                    View all activity
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default CustomerHome