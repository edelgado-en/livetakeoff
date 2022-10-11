import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { KeyIcon, UserCircleIcon, ViewBoardsIcon } from "@heroicons/react/outline"

const subNavigation = [
    { name: 'Profile', href: 'profile', icon: UserCircleIcon, current: true },
    { name: 'Password', href: 'password', icon: KeyIcon, current: false },
    { name: 'Work History', href: 'work-history', icon: ViewBoardsIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const UserSettings = () => {
    const location = useLocation();

    return (
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <aside className="py-6 lg:col-span-3">
                <nav className="space-y-1">
                    <Link
                      to={'profile'}
                      className={classNames(
                        location.pathname.includes("user-settings/profile")
                          ? 'bg-red-50 border-red-500 text-red-700 hover:bg-red-50 hover:text-red-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                      )}
                    >
                      <UserCircleIcon
                        className={classNames(
                            location.pathname.includes("user-settings/profile")
                            ? 'text-red-500 group-hover:text-red-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">Profile</span>
                    </Link>
                    <Link
                      to={'password'}
                      className={classNames(
                        location.pathname.includes("user-settings/password")
                          ? 'bg-red-50 border-red-500 text-red-700 hover:bg-red-50 hover:text-red-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                      )}
                    >
                      <KeyIcon
                        className={classNames(
                            location.pathname.includes("user-settings/password")
                            ? 'text-red-500 group-hover:text-red-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">Password</span>
                    </Link>
                   
                </nav>
              </aside>

              <Outlet />

            </div>
          </div>
        </div>
    )
}

export default UserSettings;