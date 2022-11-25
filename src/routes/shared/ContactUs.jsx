import { useState, Fragment, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form';
import Loader from '../../components/loader/Loader';
import AnimatedPage from '../../components/animatedPage/AnimatedPage';

import * as api from './apiService'

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PhoneIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
</svg>

  )
}

const EnvelopeIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>

  )
}


const locations = [
  { id: 1,
    name: 'South Florida',
    airports: [
       {initials: 'KBCT', name: 'Boca Raton Airport'},
       {initials: 'KFLL', name: 'Fort Lauderdale Hollywood International Airport (Headquarters!)'},
       {initials: 'KFXE', name: 'Florida Lauderdale Executive Airport'},
       {initials: 'KMIA', name: 'Miami International Airport'},
       {initials: 'KOPF', name: 'Miami-Opa Locka Executive Airport'},
       {initials: 'KPBI', name: 'Palm Beach International Airport'},
       {initials: 'KSUA', name: 'Stuart Witham Field'},
      ]
  },
  { id: 2,
    name: 'Florida West Coast',
    airports: [
      {initials: 'KAPF', name: 'Naples Municipal Airport'},
       {initials: 'KRSW', name: 'Southwest Florida International Airport'},
       {initials: 'KSRQ', name: 'Sarasota Bradenton International Airport'},
       {initials: 'KTPA', name: 'Tampa International Airport'},
       {initials: 'KTPF', name: 'Peter O. Knight Airport'},
       {initials: 'KVDF', name: 'Tampa Executive Airport'},
    ]
  },
  { id: 3,
    name: 'Central Florida',
    airports: [
      {initials: 'KDAB', name: 'Daytona Beach International Airport'},
       {initials: 'KMLB', name: 'Melbourne Orlando International Airport'},
       {initials: 'KORL', name: 'Orlando Executive Airport'},
       {initials: 'KMCO', name: 'Orlando International Airport'},
       {initials: 'KSFB', name: 'Orlando Sanford International Airport'},
    ]
  },
  { id: 4,
    name: 'Nevada',
    airports: [
      {initials: 'KLAS', name: 'Harry Reid International Airport'},
       {initials: 'KHND', name: 'Henderson Executive Airport'},
    ]
  },
  { id: 5,
    name: 'California',
    airports: [
      {initials: 'KBUR', name: 'Burbank Bob Hope Airport'},
       {initials: 'VNY', name: 'Van Nuys Airport'},
    ]
  },
  { id: 6,
    name: 'Arizona',
    airports: [
      {initials: 'KSDL', name: 'Scottsdale Airport'},
       {initials: 'KPHX', name: 'Phoenix Sky Harbor Airport'},
       {initials: 'KTUS', name: 'Tucson International Airport'},
    ]
  },
  { id: 7,
    name: 'Washington',
    airports: [
      {initials: 'KIAD', name: 'Washington Dulles International Airport'},
       {initials: 'KBWI', name: 'Baltimore/Washington International Airport'},
       {initials: 'KJYO', name: 'Leesburg Executive Airport'},
       {initials: 'KHEF', name: 'Manassas Regional Airport'},
       {initials: 'KGAI', name: 'Montgomery County Airport'},
       {initials: 'KDCA', name: 'Ronald Reagan National Airport'},
       {initials: 'KRIC', name: 'Richmond International Airport'},
    ]
  },
  { id: 8,
    name: 'Boston – Connecticut - New Hampshire - Rhode Island - Oregon',
    airports: [
      {initials: 'KBDL', name: 'Bradley International Airport'},
      {initials: 'KALB', name: 'Albany International Airport'},
      {initials: 'KEEN', name: 'Dillant–Hopkins Airport'},
      {initials: 'KASH', name: 'Nashua Airport'},
      {initials: 'KLWM', name: 'Lawrence Municipal Airport'},
      {initials: 'KHYA', name: 'Barnstable Municipal Airport'},
      {initials: 'KORE', name: 'Orange Municipal Airport'},
      {initials: 'KBED', name: 'Hanscom Field Airport'},
      {initials: 'KGON', name: 'Groton–New London Airport'},
      {initials: 'KHFD', name: 'Hartford–Brainard Airport'},
      {initials: 'KBAF', name: 'Westfield-Barnes Regional Airport'},
      {initials: 'KBVY', name: 'Beverly Regional Airport'},
      {initials: 'KBOS', name: 'Logan International Airport'},
      {initials: 'KPSM', name: 'Portsmouth International Airport'},
      {initials: 'KLCI', name: 'Laconia Municipal Airport'},
      {initials: 'KSFZ', name: 'North Central State Airport'},
      {initials: 'KCQX', name: 'Chatham Municipal Airport'},
      {initials: 'KHYA', name: 'Barnstable Municipal Airport'},
      {initials: 'KORH', name: 'Worcester Regional Airport'},
      {initials: 'K3B0', name: 'Southbridge Municipal Airport'},
      {initials: 'KFIT', name: 'Fitchburg Municipal Airport'},
      {initials: 'KLCI', name: 'Laconia Municipal Airport'},
    ]
  },
]

const ContactUs = () => {
  const currentUser = useAppSelector(selectUser)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: currentUser?.first_name,
      lastName: currentUser?.last_name,
      email: currentUser?.email
    }
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    reset({
      firstName: currentUser?.first_name,
      lastName: currentUser?.last_name,
      email: currentUser?.email
      })

  }, [currentUser])


  const onSubmit = handleSubmit((data) => {
    handleSendMessage(data)
  })

  const handleSendMessage = async (data) => {
    setLoading(true)
    
    try {
      await api.sendMessage(data);

      setSuccessMessage('success')
      setLoading(false)

    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && successMessage && (
        <div className="m-auto max-w-2xl text-center mt-44 px-4">
          <div className="font-medium text-lg mb-4">
            Thank you for getting in touch!
          </div>
          <div className="text-gray-500">We appreciate you contacting us.</div>
          <div className="text-gray-500 mt-1">
            One of our team members will get in contact with you soon. Have a great day!
          </div>
        </div>
      )}

      {!loading && !successMessage && (
        <div className="bg-white">
           <main className="overflow-hidden">
             <div className="bg-warm-gray-50">
               <div className="py-24 lg:py-32">
                 <div className="relative mx-auto max-w-7xl pl-4 pr-8 sm:px-6 lg:px-8">
                   <h1 className="text-4xl font-bold tracking-tight text-warm-gray-900 sm:text-5xl lg:text-6xl">
                     Get in touch
                   </h1>
                   <p className="mt-6 max-w-3xl text-xl text-warm-gray-500">
                     We'd love to hear from you. Let's start a conversation.
                   </p>
                 </div>
               </div>
             </div>
   
             <section className="relative bg-white" aria-labelledby="contact-heading">
               <div className="absolute h-1/2 w-full bg-warm-gray-50" aria-hidden="true" />
               <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 <svg
                   className="absolute top-0 right-0 z-0 -translate-y-16 translate-x-1/2 transform sm:translate-x-1/4 md:-translate-y-24 lg:-translate-y-72"
                   width={404}
                   height={384}
                   fill="none"
                   viewBox="0 0 404 384"
                   aria-hidden="true"
                 >
                   <defs>
                     <pattern
                       id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                       x={0}
                       y={0}
                       width={20}
                       height={20}
                       patternUnits="userSpaceOnUse"
                     >
                       <rect x={0} y={0} width={4} height={4} className="text-warm-gray-200" fill="currentColor" />
                     </pattern>
                   </defs>
                   <rect width={404} height={384} fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
                 </svg>
               </div>
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 <div className="relative bg-white shadow-xl">
                   <div className="grid grid-cols-1 lg:grid-cols-3">
                     <div className="relative overflow-hidden bg-gradient-to-b from-red-500 to-red-600 py-10 px-6 sm:px-10 xl:p-12">
                       <div className="pointer-events-none absolute inset-0 sm:hidden" aria-hidden="true">
                         <svg
                           className="absolute inset-0 h-full w-full"
                           width={343}
                           height={388}
                           viewBox="0 0 343 388"
                           fill="none"
                           preserveAspectRatio="xMidYMid slice"
                           xmlns="http://www.w3.org/2000/svg"
                         >
                           <path
                             d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                             fill="url(#linear1)"
                             fillOpacity=".1"
                           />
                           <defs>
                             <linearGradient
                               id="linear1"
                               x1="254.553"
                               y1="107.554"
                               x2="961.66"
                               y2="814.66"
                               gradientUnits="userSpaceOnUse"
                             >
                               <stop stopColor="#fff" />
                               <stop offset={1} stopColor="#fff" stopOpacity={0} />
                             </linearGradient>
                           </defs>
                         </svg>
                       </div>
                       <div
                         className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/2 sm:block lg:hidden"
                         aria-hidden="true"
                       >
                         <svg
                           className="absolute inset-0 h-full w-full"
                           width={359}
                           height={339}
                           viewBox="0 0 359 339"
                           fill="none"
                           preserveAspectRatio="xMidYMid slice"
                           xmlns="http://www.w3.org/2000/svg"
                         >
                           <path
                             d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                             fill="url(#linear2)"
                             fillOpacity=".1"
                           />
                           <defs>
                             <linearGradient
                               id="linear2"
                               x1="192.553"
                               y1="28.553"
                               x2="899.66"
                               y2="735.66"
                               gradientUnits="userSpaceOnUse"
                             >
                               <stop stopColor="#fff" />
                               <stop offset={1} stopColor="#fff" stopOpacity={0} />
                             </linearGradient>
                           </defs>
                         </svg>
                       </div>
                       <div
                         className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/2 lg:block"
                         aria-hidden="true"
                       >
                         <svg
                           className="absolute inset-0 h-full w-full"
                           width={160}
                           height={678}
                           viewBox="0 0 160 678"
                           fill="none"
                           preserveAspectRatio="xMidYMid slice"
                           xmlns="http://www.w3.org/2000/svg"
                         >
                           <path
                             d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                             fill="url(#linear3)"
                             fillOpacity=".1"
                           />
                           <defs>
                             <linearGradient
                               id="linear3"
                               x1="192.553"
                               y1="325.553"
                               x2="899.66"
                               y2="1032.66"
                               gradientUnits="userSpaceOnUse"
                             >
                               <stop stopColor="#fff" />
                               <stop offset={1} stopColor="#fff" stopOpacity={0} />
                             </linearGradient>
                           </defs>
                         </svg>
                       </div>
                       <h3 className="text-lg font-medium text-white">Contact information</h3>
                       <p className="mt-6 max-w-3xl text-base text-sky-50">
                         Please fill out the quick form and we will be in touch with lighting speed.
                       </p>
                       <dl className="mt-8 space-y-6">
                         <dt>
                           <span className="sr-only">Phone number</span>
                         </dt>
                         <dd className="flex text-base text-sky-50">
                           <PhoneIcon className="h-6 w-6 flex-shrink-0 text-sky-200" aria-hidden="true" />
                           <span className="ml-3">+1 (786) 975-6255</span>
                         </dd>
                         <dt>
                           <span className="sr-only">Email</span>
                         </dt>
                         <dd className="flex text-base text-sky-50">
                           <EnvelopeIcon className="h-6 w-6 flex-shrink-0 text-sky-200" aria-hidden="true" />
                           <span className="ml-3">support@livetakeoff.com</span>
                         </dd>
                       </dl>
                       <ul role="list" className="mt-8 flex space-x-12">
                         <li>
                           <a href="https://www.facebook.com/cleantakeoff/" className="text-sky-200 hover:text-sky-100">
                             <span className="sr-only">Facebook</span>
                             <svg className="h-7 w-7" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                               <path
                                 fillRule="evenodd"
                                 d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                 clipRule="evenodd"
                               />
                             </svg>
                           </a>
                         </li>
                         <li>
                           <a className="text-sky-200 hover:text-sky-100" href="#">
                             <span className="sr-only">Instagram</span>
                             <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                               <path
                                 fillRule="evenodd"
                                 d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                 clipRule="evenodd"
                               />
                             </svg>
                           </a>
                         </li>
                         
                       </ul>
                     </div>
   
                     <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12 text-sm">
                       <h3 className="text-lg font-medium text-warm-gray-900">Send us a message</h3>
                       <form onSubmit={onSubmit} 
                           className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                         <div>
                           <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                             First name
                           </label>
                           <div className="mt-1">
                             <input
                               type="text"
                               name="first-name"
                               id="first-name"
                               {...register('firstName', { required: 'Please provide your first name' })}
                               className="block w-full rounded-md border-gray-400 py-3
                                       px-4 text-gray-700 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                             />
                             { errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p> }
                           </div>
                         </div>
                         <div>
                           <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                             Last name
                           </label>
                           <div className="mt-1">
                             <input
                               type="text"
                               name="last-name"
                               id="last-name"
                               {...register('lastName', { required: 'Please provide your last name' })}
                               className="block w-full rounded-md border-gray-400 py-3 px-4 text-gray-700
                                         shadow-sm focus:border-sky-500 focus:ring-sky-500"
                             />
                             { errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p> }
                           </div>
                         </div>
                         <div>
                           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                             Email
                           </label>
                           <div className="mt-1">
                             <input
                               id="email"
                               name="email"
                               type="email"
                               {...register('email', { required: 'Please provide an email' })}
                               className="block w-full rounded-md border-gray-400 py-3 px-4 text-gray-700
                                         shadow-sm focus:border-sky-500 focus:ring-sky-500"
                             />
                             { errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p> }
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between">
                             <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                               Phone
                             </label>
                             <span id="phone-optional" className="text-sm text-gray-500">
                               Optional
                             </span>
                           </div>
                           <div className="mt-1">
                             <input
                               type="text"
                               name="phone"
                               id="phone"
                               {...register('phone')}
                               className="block w-full rounded-md border-gray-400 py-3 px-4
                                         text-gray-700 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                               aria-describedby="phone-optional"
                             />
                           </div>
                         </div>
                         <div className="sm:col-span-2">
                           <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                             Subject
                           </label>
                           <div className="mt-1">
                             <input
                               type="text"
                               name="subject"
                               id="subject"
                               {...register('subject', { required: 'Please provide a subject' })}
                               className="block w-full rounded-md border-gray-400 py-3 px-4 text-gray-700 shadow-sm
                                     focus:border-sky-500 focus:ring-sky-500"
                             />
                             { errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p> }
                           </div>
                         </div>
                         <div className="sm:col-span-2">
                           <div className="flex justify-between">
                             <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                               Message
                             </label>
                             <span id="message-max" className="text-sm text-gray-500">
                               Max. 500 characters
                             </span>
                           </div>
                           <div className="mt-1">
                             <textarea
                               id="message"
                               name="message"
                               rows={4}
                               {...register('message', { required: 'Please provide a message' })}
                               className="block w-full rounded-md border-gray-400 py-3 px-4 text-gray-700 shadow-sm
                                     focus:border-sky-500 focus:ring-sky-500 resize-none"
                               aria-describedby="message-max"
                             />
                             { errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p> }
                           </div>
                         </div>
                         <div className="sm:col-span-2 sm:flex sm:justify-end">
                           <button
                             disabled={loading}
                             type="submit"
                             className="mt-2 inline-flex w-full items-center justify-center
                                       rounded-md border border-transparent bg-red-500 px-6 py-3 text-base
                                         font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none
                                         focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                           >
                             Submit
                           </button>
                         </div>
                       </form>
                     </div>
                   </div>
                 </div>
               </div>
             </section>
   
             <section>
               <div className="mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                 <h2 id="offices-heading" className="text-3xl font-bold tracking-tight text-warm-gray-900">
                   Our Locations
                 </h2>
                 <p className="mt-6 max-w-3xl text-lg text-warm-gray-500">
                   Find us at the following airports.
                 </p>
                 <div className="divide-y divide-gray-200 overflow-hidden rounded-lg mt-4
                               bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                  {locations.map((location, actionIdx) => (
                    <div
                      key={location.id}
                      className={classNames(
                        actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                        actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                        actionIdx === locations.length - 2 ? 'sm:rounded-bl-lg' : '',
                        actionIdx === locations.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
                        'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                      )}
                    >
                      <div>
                      </div>
                      <div className="">
                        <h3 className="text-lg font-medium">
                          <a href={location.href} className="focus:outline-none">
                            {/* Extend touch target to entire panel */}
                            <span className="absolute inset-0" aria-hidden="true" />
                            {location.name}
                          </a>
                        </h3>
                        {location.airports.map((airport, index) => (
                            <div key={index} className=" flex gap-2 mt-2 text-sm text-gray-500">
                              <span className="w-4">{index + 1}. </span>
                              <div className="font-semibold text-gray-500 w-10">{airport.initials}</div>
                              <div>{airport.name}</div>
                            </div>
                        ))}
                        
                      </div>
                    </div>
                  ))}
                </div>
               </div>
             </section>
           </main>
        </div>
      )}

   
    </AnimatedPage>
  )
}

export default ContactUs;