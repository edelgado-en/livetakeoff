import { useEffect, useState } from 'react';
import Logo from '../../images/logo_2618936_web.png'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/outline';

import Input from 'react-phone-number-input/input'

import * as api from './apiService'

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [vendorName, setVendorName] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [agreement, setAgreement] = useState(false)

    const onSubmit = async () => {
        if (firstName === '') {
            alert('First name is required');
            return;
        }
        if (lastName === '') {
            alert('Last name is required');
            return;
        }
        if (email === '') {
            alert('Email is required');
            return;
        }
        if (phoneNumber === '') {
            alert('Phone number is required');
            return;
        }
        if (selectedRole === null) {
            alert('Role is required');
            return;
        }

        if (!agreement) {
            alert('Agreement of Terms and Conditions is required');
            return
        }


        //build the data object with all the fields
        const data = {
            firstName,
            lastName,
            email,
            phoneNumber,
            selectedRole,
            customerName,
            vendorName
        }

        setLoading(true);

        try {
            await api.signup(data);

            setLoading(false);

            setSuccessMessage('Your request has been submitted. You will receive an email with further instructions shortly.');

        } catch (e) {
          toast.error('Unable to process your request. Ensure your email address is valid and try again.');
          setLoading(false);
        } 
    }

    const handleRoleChange = e => {
        setSelectedRole(e.target.value)
    };

    return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-28 w-auto"
              src={Logo}
              alt="Your Company"
            />
          </div>
          {successMessage && 
            <div className="mt-16 text-center">
                <div className=" flex justify-center">
                    <CheckCircleIcon className="h-10 w-10 text-green-400" aria-hidden="true" />
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-md font-medium text-gray-900 mt-2">Your request has been submitted!</div>
                    <p className="mt-2 text-sm text-gray-500">You will receive an email with further instructions shortly.</p>
                    <div className="mt-2 text-sm text-gray-500">Go Back to the <Link to="/login" className="text-blue-600 font-medium cursor-pointer">Login</Link> screen</div>
                </div>
            </div>
              
          }
          
          {!successMessage && (
            <>
                <div className="mx-auto w-full max-w-md">
                <h2 className="mt-6 text-center text-2xl font-semibold  tracking-tight text-gray-500">Register your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                We will review your request and get back to you shortly.
                </p>
                </div>
                <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6">
                        <div>
                        <label htmlFor="firstName" className="block text-sm text-gray-900">
                            First Name
                        </label>
                        <div className="mt-1">
                            <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="block w-full appearance-none rounded-md border
                                        border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm
                                        focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        </div>
        
                        <div>
                        <label htmlFor="lastName" className="block text-sm text-gray-900">
                            Last Name
                        </label>
                        <div className="mt-1">
                            <input
                            id="lastName"
                            name="lastName"
                            type="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="block w-full appearance-none rounded-md border
                            border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm
                            focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        </div>
                        <div>
                        <label htmlFor="email" className="block text-sm text-gray-900">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2
                                        placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                        focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        </div>
                        <div>
                        <label htmlFor="phone" className="block text-sm text-gray-900">
                            Phone
                        </label>
                        <div className="mt-1">
                            <Input
                                id="phone"
                                name="phone"
                                country="US"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-blue-500 focus:ring-blue-500 sm:max-w-xs sm:text-sm"
                            />
                        </div>
                        </div>
                        <div>
                        <div>
                            <div
                            className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700 mt-8"
                            id="label-notifications"
                            >
                            Specify your Role
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <div className="max-w-lg">
                            <p className="text-sm text-gray-500 mt-1">Are you a customer or a vendor?</p>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center">
                                <input
                                    id="customerRole"
                                    name="role"
                                    type="radio"
                                    value="customer"
                                    checked={selectedRole === 'customer'}
                                    onChange={handleRoleChange}
                                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                    <label htmlFor="customerRole" className="ml-3 block text-sm font-medium text-gray-500">
                                        I am a customer
                                    </label>
                                </div>
                                {selectedRole === 'customer' && (
                                    <div>
                                        <p className="text-sm text-gray-500 mt-1">If you don't work for a company, you can leave this blank.</p>
                                        <input
                                        name="customerName"
                                        type="customerName"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder='Company Name'
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 mt-2 mb-10
                                                    placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                                    focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>    
                                )}
                                
                                <div className="flex items-center">
                                <input
                                    id="vendorRole"
                                    name="role"
                                    type="radio"
                                    value="vendor"
                                    checked={selectedRole === 'vendor'}
                                    onChange={handleRoleChange}
                                    className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <label htmlFor="vendorRole" className="ml-3 block text-sm font-medium text-gray-500">
                                    I am a vendor
                                </label>
                                </div>
                                {selectedRole === 'vendor' && (
                                    <div>
                                        <p className="text-sm text-gray-500 mt-1">If you don't work for a company, you can leave this blank.</p>
                                        <input
                                        name="vendorName"
                                        type="vendorName"
                                        value={vendorName}
                                        onChange={e => setVendorName(e.target.value)}
                                        placeholder='Vendor Name'
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 mt-2
                                                    placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                                    focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>    
                                )}
                                
                            </div>
                            </div>
                        </div>
                        </div>
        
                        <div>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="flex w-full justify-center rounded-md border border-transparent mt-12
                                        bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm
                                        hover:bg-red-700 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2"
                        >
                            {loading ? 'sending...' : 'Sign up'}
                        </button>
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex h-5 items-center">
                            <input
                                id="agreement" 
                                name="agreement"
                                value={agreement}
                                onChange={setAgreement}       
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            </div>
                            <div className="ml-3 text-sm">
                            <label htmlFor="agreement"  className="text-gray-500 text-sm">
                                By signing up, you agree to our Terms and Conditions and <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                            </label>
                            </div>
                        </div> 
                        <div className="relative flex flex-col justify-center text-center text-sm">
                            <div>
                                <span className="px-2 text-gray-500">Already have an account?</span>
                                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                                Log in
                                </Link>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </>
          )}
          
        </div>
      </>
    )
  }

export default Signup;