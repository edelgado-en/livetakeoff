

import { UsersIcon } from '@heroicons/react/outline'

const stats = [
  { id: 1, name: 'Total Jobs', stat: '71,897', icon: UsersIcon, change: '122', changeType: 'increase' },
  /* { id: 2, name: 'Avg. Open Rate', stat: '58.16%', icon: UsersIcon, change: '5.4%', changeType: 'increase' },
  { id: 3, name: 'Avg. Click Rate', stat: '24.57%', icon: UsersIcon, change: '3.2%', changeType: 'decrease' }, */
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const JobDashboard = () => {
  return (
    <div className="px-4 max-w-7xl m-auto">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Last 30 days</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-red-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-red-500 hover:text-red-500">
                    {' '}
                    View all
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default JobDashboard;