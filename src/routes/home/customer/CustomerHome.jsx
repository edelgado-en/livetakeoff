import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
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

    return (
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
          {/* Left sidebar & main wrapper */}
          <div className="min-w-0 flex-1 bg-white xl:flex">
            {/* Account profile */}
            <div className="bg-white xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-gray-200">
              <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                      {/* Profile */}
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full"
                            src="https://res.cloudinary.com/datidxeqm/image/upload/v1666499214/media/profiles/20130914_203548000_iOS_ra4miq.jpg"
                            alt=""
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">Manny Rodriguez</div>
                          {/* <a href="#" className="group flex items-center space-x-2.5">
                            <svg
                              className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900">
                              debbielewis
                            </span>
                          </a> */}
                        </div>
                      </div>
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
                        {/* <CheckBadgeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                        <CheckBadge />
                        <span className="text-sm font-medium text-gray-500">Pro Member</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <RectangleStackIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                        <RectangleStack />
                        <span className="text-sm font-medium text-gray-500">48 Jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
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
                  <li
                    key={project.repo}
                    className="relative py-5 pl-4 pr-6 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
                  >
                    <div className="flex items-center justify-between space-x-4">
                      {/* Repo name and link */}
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-center space-x-3">
                          <span
                            className={classNames(
                              project.active ? 'bg-green-100' : 'bg-gray-100',
                              'h-4 w-4 rounded-full flex items-center justify-center'
                            )}
                            aria-hidden="true"
                          >
                            <span
                              className={classNames(
                                project.active ? 'bg-green-400' : 'bg-gray-400',
                                'h-2 w-2 rounded-full'
                              )}
                            />
                          </span>

                          <h2 className="text-sm font-medium">
                            <a href={project.href}>
                              <span className="absolute inset-0" aria-hidden="true" />
                              {project.name}{' '}
                              <span className="sr-only">{project.active ? 'Running' : 'Not running'}</span>
                            </a>
                          </h2>
                        </div>
                        <div href={project.repoHref} className="group relative flex items-center space-x-2.5">
                          {/* <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.99917 0C4.02996 0 0 4.02545 0 8.99143C0 12.9639 2.57853 16.3336 6.15489 17.5225C6.60518 17.6053 6.76927 17.3277 6.76927 17.0892C6.76927 16.8762 6.76153 16.3104 6.75711 15.5603C4.25372 16.1034 3.72553 14.3548 3.72553 14.3548C3.31612 13.316 2.72605 13.0395 2.72605 13.0395C1.9089 12.482 2.78793 12.4931 2.78793 12.4931C3.69127 12.5565 4.16643 13.4198 4.16643 13.4198C4.96921 14.7936 6.27312 14.3968 6.78584 14.1666C6.86761 13.5859 7.10022 13.1896 7.35713 12.965C5.35873 12.7381 3.25756 11.9665 3.25756 8.52116C3.25756 7.53978 3.6084 6.73667 4.18411 6.10854C4.09129 5.88114 3.78244 4.96654 4.27251 3.72904C4.27251 3.72904 5.02778 3.48728 6.74717 4.65082C7.46487 4.45101 8.23506 4.35165 9.00028 4.34779C9.76494 4.35165 10.5346 4.45101 11.2534 4.65082C12.9717 3.48728 13.7258 3.72904 13.7258 3.72904C14.217 4.96654 13.9082 5.88114 13.8159 6.10854C14.3927 6.73667 14.7408 7.53978 14.7408 8.52116C14.7408 11.9753 12.6363 12.7354 10.6318 12.9578C10.9545 13.2355 11.2423 13.7841 11.2423 14.6231C11.2423 15.8247 11.2313 16.7945 11.2313 17.0892C11.2313 17.3299 11.3937 17.6097 11.8501 17.522C15.4237 16.3303 18 12.9628 18 8.99143C18 4.02545 13.97 0 8.99917 0Z"
                              fill="currentcolor"
                            />
                          </svg> */}
                          <span className="truncate text-xs text-gray-500">
                            BCT - Atlantic Aviation BCT - BBJ - Boeing 737
                          </span>
                        </div>
                      </div>
                      <div className="sm:hidden">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      {/* Repo meta info */}
                      <div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
                        <p className="flex items-center space-x-4">
                          <a
                            href={project.siteHref}
                            className="relative text-sm font-medium text-gray-500 hover:text-gray-900"
                          >
                            20221108-1
                          </a>
                          <button
                            type="button"
                            className="relative rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">
                              {project.starred ? 'Add to favorites' : 'Remove from favorites'}
                            </span>
                            <StarIcon
                              className={classNames(
                                project.starred
                                  ? 'text-yellow-300 hover:text-yellow-400'
                                  : 'text-gray-300 hover:text-gray-400',
                                'h-5 w-5'
                              )}
                              aria-hidden="true"
                            />
                          </button>
                        </p>
                        <p className="flex space-x-2 text-xs text-gray-500">
                          <span>Complete by Nov-26 07:00 AM</span>
                          {/* <span aria-hidden="true">&middot;</span>
                          <span>Last deploy {project.lastDeploy}</span>
                          <span aria-hidden="true">&middot;</span>
                          <span>{project.location}</span> */}
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