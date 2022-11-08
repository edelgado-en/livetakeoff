import { useState, useEffect } from 'react'
import ModalFrame from '../../components/modal/ModalFrame'
import { Dialog, Transition } from '@headlessui/react'

const ExclamationTriangule = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>

    )
}

const PricePlanEditModal = ({ isOpen, handleClose, updatePriceList, priceList }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        setName(priceList.name)
        setDescription(priceList.description)

    }, [])

    return (
        <ModalFrame isModalOpen={isOpen}>
            <div className="pt-2">    
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 relative top-1">
                      Update Price List
                    </Dialog.Title>
                    
                    <div className="mt-4 pb-2">
                        <div className="text-gray-500 text-md font-semibold">{priceList?.name}</div>
                        <div className="mt-6">
                            <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700">
                                Name
                                <span className="text-sm ml-1 text-gray-500 font-normal">(must be unique)</span>
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                name="tailNumber"
                                id="tailNumber"
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                />
                                
                            </div>
                        </div>
                        <div className="mt-6 pb-6">
                            <label htmlFor="description" className="block text-sm text-gray-500">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                type="text"
                                value={description}
                                rows={3}
                                onChange={(e) => setDescription(e.target.value)}
                                name="description"
                                id="description"
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                />
                                <p className="mt-2 text-sm text-gray-500">Write a couple of sentences describing the purpose of this price list.</p>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={() => updatePriceList({id: priceList.id, name: name, description: description})}
                      className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Update
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
            </div>
            
        </ModalFrame>
    )
}

export default PricePlanEditModal;