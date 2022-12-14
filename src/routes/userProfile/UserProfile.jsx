import { useState, useEffect } from "react"
import { KeyIcon, UserCircleIcon, ViewBoardsIcon } from "@heroicons/react/outline"
import { Disclosure, Menu, Switch, Transition } from '@headlessui/react'
import ImageUploading from 'react-images-uploading';
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";

import Input from 'react-phone-number-input/input'

import AnimatedPage from "../../components/animatedPage/AnimatedPage"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form";

import * as api from './apiService'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const UserProfile = () => {
    const [user, setUser] = useState({})
    const [phoneNumber, setPhoneNumber] = useState('');
    const [receiveSMSNotifications, setReceiveSMSNotifications] = useState(false)
    const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(false)
    const [images, setImages] = useState([]);

    const currentUser = useAppSelector(selectUser)

    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    useEffect(() => {
        getUserDetails()
    }, [])

    useEffect(() => {
        reset(user)
    }, [user])

    const getUserDetails = async () => {
        const { data } = await api.getUserDetails();

        setPhoneNumber(data.phone_number)
        setReceiveEmailNotifications(data.receive_email_notifications)
        setReceiveSMSNotifications(data.receive_sms_notifications)

        setUser(data);
    }


    const updateAvatar = async (imageList, addUpdateIndex) => {
        const formData = new FormData()
       
        formData.append("avatar", imageList[0].file);

        try {
            await api.uploadUserAvatar(formData);

            handleSubmit(onSubmit)();

            navigate(0)

        } catch (error) {
            toast.error('Unable to update avatar')
        } 
    }

    const onSubmit = handleSubmit((data) => {
        const request = {
            username: data.username,
            about: data.about,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: phoneNumber,
            email_notifications: receiveEmailNotifications,
            sms_notifications: receiveSMSNotifications
        }

        handleUpdateUser(request)

    })

    const handleUpdateUser = async (data) => {
        try {
            await api.updateUser(data)

            toast.success('Profile Updated!')

        } catch (error) {
            toast.error('Unable to update profile')
        }
    }

    return (
        <form className="divide-y divide-gray-200 lg:col-span-9" onSubmit={onSubmit}>
        
        <div className="py-6 px-4 sm:p-6 lg:pb-8">
            <div>
            <h1 className="text-2xl font-medium leading-6 text-gray-900">Profile</h1>
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
                    {...register('username', { required: 'Username is required' })}
                    className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300
                             focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                </div>
                    { errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p> }
                </div>

                <div>
                    <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-700">
                        Access Level
                    </label>
                    <div className="mt-1 flex rounded-md">
                        <input
                        type="text"
                        name="accessLevel"
                        readOnly
                        className="block w-full min-w-0 flex-grow rounded-md border-gray-300 bg-gray-50 text-gray-500
                                        sm:text-sm focus:border-gray-300 focus:ring-gray-500"
                        defaultValue={user.access_level_label}
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
                    maxLength={200}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    {...register('about')}
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
                    aria-hidden="true">
                    {user.avatar ? 
                        <img className="h-full w-full rounded-full" src={user.avatar} alt="" />
                        :
                        <span className="h-28 w-28 overflow-hidden rounded-full bg-gray-100">
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    }
                    </div>
                    <div className="ml-5 rounded-md shadow-sm">
                    <ImageUploading
                        value={images}
                        acceptType={['jpg', 'gif', 'png', 'jpeg']}
                        onChange={updateAvatar}
                        maxNumber={1}
                        dataURLKey="data_url">
                        {({
                        onImageUpload,
                        }) => (
                            <div onClick={onImageUpload} 
                                className="group relative flex items-center justify-center
                                            rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2
                                                focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50">
                                <label
                                    htmlFor="mobile-user-photo"
                                    className="pointer-events-none relative text-sm font-medium
                                                leading-4 text-gray-700"
                                >
                                    <span>Change</span>
                                    <span className="sr-only"> user photo</span>
                                </label>
                            </div>
                        )}
                    </ImageUploading>
                    
                    </div>
                </div>
                </div>

                <div className="relative hidden overflow-hidden rounded-full lg:block">
                <ImageUploading
                    value={images}
                    acceptType={['jpg', 'gif', 'png', 'jpeg']}
                    onChange={updateAvatar}
                    maxNumber={1}
                    dataURLKey="data_url">
                    {({
                    onImageUpload,
                    }) => (
                        <div onClick={onImageUpload}>
                            {user.avatar ? 
                                <img className="relative h-40 w-40 rounded-full" src={user.avatar} alt="" />
                                :
                                <span className="h-28 w-28 overflow-hidden rounded-full">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            }
                            <label
                                htmlFor="desktop-user-photo"
                                className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                            >
                                <span className="cursor-pointer">Change</span>
                                <span className="sr-only"> user photo</span>
                            </label>
                        </div>
                    )}
                </ImageUploading>
                
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
                        {...register('first_name', { required: 'First name is required' })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3
                                    shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    { errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p> }
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Last name
                    </label>
                    <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        {...register('last_name', { required: 'Last name is required' })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3
                                    shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    { errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p> }
                </div>

                <div className="col-span-12">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        name="url"
                        id="url"
                        {...register('email', { required: 'Email is required' })}
                        className="mt-1 block w-full rounded-md border border-gray-300
                                    py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    { errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p> }
                </div>

                <div className="col-span-12">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <Input
                          country="US"
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                          focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                          value={phoneNumber}
                          onChange={setPhoneNumber}
                    />
                </div>
            </div>
        </div>
        
        
            <div className="divide-y divide-gray-200 pt-6">
            {currentUser.isCustomer && (
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
                                    Receive email notifications
                                </Switch.Label>
                                <Switch.Description className="text-sm text-gray-500">
                                    Get emails when jobs are completed.
                                </Switch.Description>
                            </div>
                            <Switch
                                checked={receiveEmailNotifications}
                                onChange={setReceiveEmailNotifications}
                                className={classNames(
                                receiveEmailNotifications ? 'bg-red-500' : 'bg-gray-200',
                                'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                )}
                            >
                                <span
                                aria-hidden="true"
                                className={classNames(
                                    receiveEmailNotifications ? 'translate-x-5' : 'translate-x-0',
                                    'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                                />
                            </Switch>
                        </Switch.Group>
                        <Switch.Group as="li" className="flex items-center justify-between py-4">
                            <div className="flex flex-col">
                                <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                                    Receive SMS notifications
                                </Switch.Label>
                                <Switch.Description className="text-sm text-gray-500">
                                    Get text messages when jobs change status. <span className="text-xs">(Mobile messaging rates may apply)</span>
                                </Switch.Description>
                            </div>
                            <Switch
                                checked={receiveSMSNotifications}
                                onChange={setReceiveSMSNotifications}
                                className={classNames(
                                    receiveSMSNotifications ? 'bg-red-500' : 'bg-gray-200',
                                'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                )}
                            >
                                <span
                                aria-hidden="true"
                                className={classNames(
                                    receiveSMSNotifications ? 'translate-x-5' : 'translate-x-0',
                                    'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                                />
                            </Switch>
                        </Switch.Group>
                    </ul>
                </div>
            )}
                <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                    <button
                        type="submit"
                        className="ml-5 inline-flex justify-center rounded-md border
                                    border-transparent bg-red-600 py-2 px-4 text-sm
                                    font-medium text-white  hover:bg-red-800 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                </div>
            </div>
        
        </form> 
    )
}

export default UserProfile;