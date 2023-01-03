import { useEffect, useState, Fragment } from 'react'
import ModalFrame from '../../components/modal/ModalFrame'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline"
import { useLocation } from "react-router-dom"

import * as api from './apiService'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ChevronUpDownIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
    )
}

const AddTailAlertModal = ({ isOpen, handleClose, handleAddTailAlert }) => {
    const [tailNumber, setTailNumber] = useState('')
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const addTailAlert = async () => {
        
        // if tailNumber or message is empty, show error message
        if (!tailNumber || !message) {
            setErrorMessage('Please fill out all fields')
            return
        } else {
            setErrorMessage(null)
        }

        const request = {
            tailNumber,
            message
        }
        
        try {
            setLoading(true)
            const { data } = await api.addTailAlert(request)

            handleAddTailAlert(data)

        } catch (err) {
            setLoading(false)
            setErrorMessage('A Tail Alert with this tail number already exists')
        }

    }

    return (
        <ModalFrame isModalOpen={isOpen}>
            <div className='mb-10' style={{minWidth: '300px'}}>
                <div className="">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 relative top-1">
                        Add a Tail Alert
                    </Dialog.Title>
                </div>
            </div>
            <div>
                <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700">
                    Tail Number
                </label>
                <div className="mt-1">
                    <input
                    type="text"
                    value={tailNumber}
                    onChange={(e) => setTailNumber(e.target.value)}
                    name="tailNumber"
                    id="tailNumber"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Alert Message
                </label>
                <div className="mt-1">
                    <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name="message"
                    id="message"
                    style={{ minHeight: '100px' }}
                    className="block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                    {errorMessage && <p className="text-red-500 text-xs font-semibold mt-2">{errorMessage}</p>}
                </div>
            </div>
            <div className="mt-10 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    onClick={() => addTailAlert()}
                    disabled={loading}
                    className="inline-flex w-full justify-center rounded-md border border-transparent
                            bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    {loading ? 'adding...'
                         : <>
                                <PlusIcon className="-ml-2 mr-1 h-5 w-5 text-white" aria-hidden="true" />
                                <span>Add</span>
                            </>
                    }
                </button>
                <button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border
                                border-gray-300 bg-white px-4 py-2 text-base font-medium
                                text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Cancel
                </button>
            </div>
        </ModalFrame>
    )
}


export default AddTailAlertModal;