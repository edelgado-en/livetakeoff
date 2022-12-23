
import { useEffect, useState } from 'react';
//import Logo from '../../components/topbar/livetakeoff-logo.png';
import Logo from '../../images/logo_2618936_web.png'
import { CheckCircleIcon } from "@heroicons/react/outline"

import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/httpService'
import { setApiAccessToken, setUserInfo } from '../../localstorage';

const Login = () => {
    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [messageSent, setMessageSent] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
      localStorage.clear();
    }, [])

    const toggleForgotPassword = () => {
      setShowForgotPassword(!showForgotPassword);
    }

    const backToSignIn = () => {
      setMessageSent(false)
      setShowForgotPassword(false)
    }

    const onSubmit = handleSubmit((data) => {
      if (showForgotPassword) {
        handleForgotPassword(data)
      } else {
        handleLogin(data)
      }

    })

    const handleLogin = async (data) => {
        setLoading(true);

        const { userName, password } = data;

        try {
            const { data } = await api.post('/api/token/', { username: userName, password });

            setApiAccessToken(data.access)

            setLoading(false);

            navigate('/');

        } catch (e) {
          toast.error('Unable to login');
          setLoading(false);
        }
    }

    const handleForgotPassword = async (data) => {
      setLoading(true);

      const { userName, email } = data;

      try {
        console.log('sending request')
          await api.post('/api/forgot-password', { userName, email });

          setMessageSent(true)

          setLoading(false);


      } catch (e) {
        toast.error('Unable to reset password');
        setLoading(false);
      }
    }

    return (
      <>
        {messageSent && (
          <div className="mx-auto max-w-lg px-4 pb-16 lg:pb-12 mt-56 text-center">
              <div className=" flex justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" aria-hidden="true" />
              </div>
              <div className="">
                  <p className="text-md font-medium text-gray-900 mt-2">We received your request!</p>
                  
                  <p className="mt-2 text-sm text-gray-500">
                      We will get back to you shortly with your new password.
                  </p>
              </div>
              <div className=" mt-4 flex justify-center gap-6">
                  <span onClick={() => backToSignIn()} className="text-blue-600 hover:text-blue-500 cursor-pointer">
                    sign in
                  </span>
              </div>
              
          </div>
        )}
        {!messageSent && (
          <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mt-24">
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-28 w-auto"
                src={Logo}
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-2xl font-semibold tracking-tight text-gray-500">
                {showForgotPassword ? 'Forgot your Password?' : 'Sign in to your account'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
            </p>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-900">
                      Username
                    </label>
                    <div className="mt-1">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        {...register('userName', { required: 'Username is required' })}
                        className="block w-full appearance-none rounded-md border
                                  border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm
                                    focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                      { errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p> }
                    </div>
                  </div>

                  {!showForgotPassword && (
                    <div className="mt-4">
                      <label htmlFor="password" className="block text-sm text-gray-900">
                        Password
                      </label>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          {...register('password', { required: 'Password is required' })}
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2
                                    placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                      focus:ring-blue-500 sm:text-sm"
                        />
                        { errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p> }
                      </div>
                    </div>
                  )}

                  {showForgotPassword && (
                    <div className="mt-4">
                      <label htmlFor="email" className="block text-sm text-gray-900">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          {...register('email', { required: 'Email is required' })}
                          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2
                                    placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none
                                      focus:ring-blue-500 sm:text-sm"
                        />
                        { errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p> }
                      </div>
                    </div>
                  )}

                  {!showForgotPassword && (
                    <div className="flex justify-end mt-2">
                      <div className="text-xs">
                        <div onClick={() => toggleForgotPassword()} className=" text-blue-600 hover:text-blue-500 cursor-pointer">
                          Forgot your password?
                        </div>
                      </div>
                    </div>
                  )}

                  {!showForgotPassword && (
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md border border-transparent
                                    bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm
                                      hover:bg-red-700 focus:outline-none focus:ring-2
                                      focus:ring-red-500 focus:ring-offset-2 mt-4"
                      >
                        {loading ? 'sigining in...' : 'Sign in'}
                      </button>
                    </div>
                  )}

                  {showForgotPassword && (
                    <>
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md border border-transparent
                                    bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm
                                      hover:bg-red-700 focus:outline-none focus:ring-2
                                      focus:ring-red-500 focus:ring-offset-2 mt-8"
                      >
                        {loading ? 'sending...' : 'Reset password'}
                      </button>
                    </div>
                    <div className="relative flex flex-col justify-center text-center text-sm mt-4">
                      <div>
                        <span className="px-1 text-gray-500">or</span>
                        <span onClick={() => toggleForgotPassword()} className="text-blue-600 hover:text-blue-500 cursor-pointer">
                          sign in
                        </span>
                      </div>
                    </div>
                    </>
                  )}

                  <div className="relative flex flex-col justify-center text-center text-sm mt-6">
                    <div>
                      <span className="px-2 text-gray-500">Don't have an account?</span>
                      <Link to="/signup" className="text-blue-600 hover:text-blue-500">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  export default Login;