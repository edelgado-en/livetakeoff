import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import AnimatedPage from '../../components/animatedPage/AnimatedPage';
import * as api from './apiService'
import ReactTimeAgo from 'react-time-ago'
import { CheckIcon, UserIcon } from "@heroicons/react/outline";

const timeline = [
  {
    id: 1,
    content: 'Applied to',
    target: 'Front End Developer',
    href: '#',
    date: 'Sep 20',
    datetime: '2020-09-20',
    icon: UserIcon,
    iconBackground: 'bg-gray-400',
  },
  {
    id: 2,
    content: 'Advanced to phone screening by',
    target: 'Bethany Blake',
    href: '#',
    date: 'Sep 22',
    datetime: '2020-09-22',
    icon: CheckIcon,
    iconBackground: 'bg-blue-500',
  },
  {
    id: 3,
    content: 'Completed phone screening with',
    target: 'Martha Gardner',
    href: '#',
    date: 'Sep 28',
    datetime: '2020-09-28',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
  {
    id: 4,
    content: 'Advanced to interview by',
    target: 'Bethany Blake',
    href: '#',
    date: 'Sep 30',
    datetime: '2020-09-30',
    icon: CheckIcon,
    iconBackground: 'bg-blue-500',
  },
  {
    id: 5,
    content: 'Completed interview with',
    target: 'Katherine Snyder',
    href: '#',
    date: 'Oct 4',
    datetime: '2020-10-04',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const { jobId } = useParams()
    const [activities, setActivities] = useState([])

    useEffect(() => {
        getActivities()
    }, [])
    
    const getActivities = async () => {
        const { data } = await api.getJobActivities(jobId)
        
        setActivities(data.results)

        console.log(data.results)
    }
  
  
    return (
        <AnimatedPage>
        <div className="mt-6 max-w-3xl m-auto px-2">
            <div className="flex flex-row">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-600">Job Activity</h1>
                </div>
            </div>
            <div className="flow-root mt-6">
                <ul className="-mb-8">
                    {activities.map((activity, eventIdx) => (
                        <li key={activity.id}>
                            <div className="relative pb-8">
                            {eventIdx !== activities.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            
                            <div className="relative flex space-x-3">
                                <div>
                                <span
                                    className={`
                                    ${activity.status === 'A' && 'bg-sky-500 '}
                                    ${activity.status === 'S' && 'bg-yellow-500 '}
                                    ${activity.status === 'U' && 'bg-indigo-500 '}
                                    ${activity.status === 'W' && 'bg-green-500 '}
                                    ${activity.status === 'R' && 'bg-purple-500 '}
                                    ${activity.status === 'C' && 'bg-blue-500 '}
                                    ${activity.status === 'T' && 'bg-black '}
                                    ${activity.status === 'I' && 'bg-gray-400 '}
                                    ${activity.status === 'P' && 'bg-red-500 '}
                                    h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`
                                    }
                                >
                                     <span className="text-white">{activity.status}</span>
                                </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                    <p className="text-sm text-gray-500">
                                    {activity.status !== 'P' && (
                                        <>
                                        <span>Status changed to </span> 
                                        <span className="font-medium text-black">
                                            {activity.status === 'A' && 'Accepted'}
                                            {activity.status === 'S' && 'Assigned'}
                                            {activity.status === 'U' && 'Submitted'}
                                            {activity.status === 'W' && 'Work In Progress'}
                                            {activity.status === 'C' && 'Completed'}
                                            {activity.status === 'T' && 'Cancelled'}
                                            {activity.status === 'R' && 'Review'}
                                            {activity.status === 'I' && 'Invoiced'}
                                        </span>
                                        </>
                                    )}

                                    {activity.status === 'P' && (
                                        <>
                                        <span className="text-sm text-gray-500">
                                            Price changed to
                                        </span>
                                        <span className="font-medium text-black ml-1">${activity.price}</span>
                                        </>
                                    )}
                                    
                                    <span className="ml-1">by {activity.user.first_name} {activity.user.last_name}</span>
                                    </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    <ReactTimeAgo date={new Date(activity.timestamp)} locale="en-US" timeStyle="twitter" />
                                </div>
                                </div>
                            </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </AnimatedPage>
    
  )
}