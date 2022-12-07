

import { UsersIcon, CashIcon, BriefcaseIcon, ArrowSmRightIcon  } from '@heroicons/react/outline'

const WrenchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-sky-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>

  )
}

const Wrench2Icon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>

  )
}

const topServices = [
  {name: 'Basic Exterior (Exterior Level 1 / Exterior Takeoff Ready)', count: 215, percent: 40.57},
  {name: 'Basic Interior (Interior Level 1 / Interior Takeoff Ready)', count: 199, percent: 37.03},
  {name: 'Exterior detail (Exterior Levels 2 or 3 / Full wet or dry wash)', count: 150, percent: 28.07},
  {name: 'Carpet Extraction (Carpet shampoo)', count: 98, percent: 18.39},
  {name: 'Full wet wash and dry plus belly and landing gear degrease and wipe down', count: 52, percent: 9.8},
]

const topRetainers = [
  {name: 'Basic Exterior (Exterior Level 1 / Exterior Takeoff Ready)', count: 215, percent: 70.57},
  {name: 'Basic Interior (Interior Level 1 / Interior Takeoff Ready)', count: 199, percent: 20.03},
  {name: 'Exterior detail (Exterior Levels 2 or 3 / Full wet or dry wash)', count: 150, percent: 15.07},
  {name: 'Carpet Extraction (Carpet shampoo)', count: 98, percent: 5.39},
  {name: 'Full wet wash and dry plus belly and landing gear degrease and wipe down', count: 52, percent: 2.8},
]

const people = [
  {
    name: 'Wilson Lazarazo',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668096959/media/profiles/Wilson_jsuh5z.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Randy Fermin',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668096644/media/profiles/Randy_rgjxsz.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Leroy Hernandez',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668096362/media/profiles/Leroy_yfe3cg.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Belkis Grinan',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668096086/media/profiles/Belkis_h5uel9.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Adolfo Blanco',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668098128/media/profiles/Adolfo_veriir.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Luis Betancourt',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668097426/media/profiles/Luis_pb787q.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Ricardo Cueto',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668097182/media/profiles/Ricardo_u4cg5p.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Luis Torres',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668098528/media/profiles/Luis_Torres_qirq0h.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
  {
    name: 'Antonio Carmona',
    imageUrl:
      'https://res.cloudinary.com/datidxeqm/image/upload/v1668099311/media/profiles/Antonio_bqdxpx.jpg',
    bio: 'Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const TeamProductivity = () => {
  return (
    <div className="px-4 max-w-7xl m-auto">
      <h2 className="text-3xl font-bold tracking-tight sm:text-3xl">Team Productivity</h2>

      <h3 className="text-lg font-medium leading-6 text-gray-900 pt-8">Last 30 days</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md p-3 border-blue-400 border-2">
                <BriefcaseIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-600">Jobs Completed</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">252</p>
            </dd>
          </div>
          <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md p-3 border-sky-400 border-2">
                <WrenchIcon  />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-600">Services Completed</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">451</p>
            </dd>
          </div>
          <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md p-3 border-indigo-400 border-2">
                <Wrench2Icon  />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-600">Retainers Completed</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">451</p>
            </dd>
          </div>
          <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md p-3 border-green-400 border-2">
                <CashIcon className="h-6 w-6 text-green-500"  />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-600">Revenue<span className="text-xs ml-2 text-gray-400">(services only)</span></p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">$98,756</p>
            </dd>
          </div>
      </dl>

      <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1
                      gap-8 gap-y-8 gap-x-28 my-8">
        <div className="">
          <div className="text-lg font-medium tracking-tight">Top 5 Services</div>
            <div className="pr-2 text-gray-500">
              {topServices.map((service, index) => (
                <div key={index}>
                  <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                    <div className="truncate overflow-ellipsis w-64" >{service.name}</div>
                    <div className="text-right">
                      <div>
                        {service.count} <span className="text-xs">times</span>
                      </div>
                      <div>{service.percent + '%'}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{width: service.percent + '%'}}></div>
                  </div>
                </div>
              ))}
              
            </div>
        </div>

        <div className="">
          <div className="text-lg font-medium tracking-tight">Top 5 Retainers</div>
          <div className="pr-2 text-gray-500">
            {topRetainers.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                  <div className="truncate overflow-ellipsis w-64" >{service.name}</div>
                  <div className="text-right">
                    <div>
                      {service.count} <span className="text-xs">times</span>
                    </div>
                    <div>{service.percent + '%'}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{width: service.percent + '%'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-8">
          <h2 className="text-lg font-medium tracking-tight">Project Managers</h2>

          <ul className="space-y-12 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-12 lg:gap-y-12 lg:space-y-0">
            {people.map((person) => (
              <li key={person.name}>
                <div className="flex gap-4 flex-start">
                  <div className="flex-shrink-0">
                    <img className="rounded-lg h-32 w-32" src={person.imageUrl} alt="" />
                  </div>
                  <div className="w-full">
                    <div className="space-y-2">
                      <div className="space-y-1 text-md font-medium leading-6">
                        <h3>{person.name}</h3>
                      </div>
                      <div className="flex justify-between text-gray-500 text-sm">
                        <div className="flex-1">Services Completed</div>
                        <div className="text-right">156</div>
                      </div>
                      <div className="flex justify-between text-gray-500 text-sm">
                        <div className="flex-1">Retainers Completed</div>
                        <div className="text-right">234</div>
                      </div>
                      <div className="flex justify-between text-gray-500 text-sm">
                        <div className="flex-1">Revenue<span className="text-xs ml-1 text-gray-500">(services only)</span></div>
                        <div className="text-right font-medium">$12,345</div>
                      </div>
                      <div className="w-full text-right text-sm text-blue-500">
                        <span className="cursor-pointer">more <ArrowSmRightIcon className="h-4 w-4 inline-block"/></span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </div>
  )
}

export default TeamProductivity;