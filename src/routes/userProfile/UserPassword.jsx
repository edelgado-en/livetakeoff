import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as api from './apiService'

const UserPassword = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ new_password: '', new_password_again: ''});
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data) => {
        handleUpdatePassword(data)
    })

    const handleUpdatePassword = async (data) => {
        try {
            await api.resetPassword(data);
            
            navigate(-1);

            toast.error('Password Updated!');

        } catch (error) {
            
        }
    }

    return (
        <form className="divide-y divide-gray-200 lg:col-span-9" onSubmit={onSubmit}>
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <h1 className="text-2xl font-medium leading-6 text-gray-900">Password</h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Reset your password.</p>
                <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                    <div className="space-y-6 sm:space-y-5">

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="password-n" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            New Password
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                            type="password"
                            name="password-n"
                            id="password-n"
                            {...register('new_password',
                                         { required: 'New password is required',
                                           minLength: {
                                                value: 8,
                                                message: "Password must have at least 8 characters"
                                           }
                                         }
                            )}
                            className="block w-full max-w-lg rounded-md border-gray-300
                                      shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                            />
                            { errors.new_password && <p className="text-red-500 text-xs mt-2">{errors.new_password.message}</p> }
                            <p className="text-xs text-gray-500 mt-2">Your password must contain at least 8 characters.</p>
                            <p className="text-xs text-gray-500 mt-2">Your password can’t be a commonly used password.</p>
                            <p className="text-xs text-gray-500 mt-2">Your password can’t be entirely numeric.</p>
                        </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="password-a" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Confirm Password
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                            type="password"
                            name="password-a"
                            id="password-a"
                            {...register('new_password_again',
                                             { required: 'Verification password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must have at least 8 characters"
                                                },
                                                validate: (value) => {
                                                    if (watch('new_password') != value) {
                                                        return "Passwords do not match";
                                                    }
                                                }  
                                             }
                            )}
                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                      focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                            />
                            { errors.new_password_again && <p className="text-red-500 text-xs mt-2">{errors.new_password_again.message}</p> }
                            <p className="text-xs text-gray-500 mt-2">Enter the same password as before, for verification.</p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                    <button
                        type="submit"
                        className="ml-5 inline-flex justify-center rounded-md border
                                    border-transparent bg-red-600 py-2 px-4 text-sm
                                    font-medium text-white  hover:bg-red-800 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2">
                        Change Password
                    </button>
                </div>
            </div>
        </form>
    )
}

export default UserPassword;