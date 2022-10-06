
import { useEffect, useState } from 'react';
import Logo from '../../components/topbar/livetakeoff-logo.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/httpService'
import { setApiAccessToken, setUserInfo } from '../../localstorage';

const Login = () => {
    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate();

    useEffect(() => {
      localStorage.clear();
    }, [])

    const onSubmit = handleSubmit((data) => {
      handleLogin(data)
    })

    const handleLogin = async (data) => {
        setLoading(true);

        const { userName, password } = data;

        try {
            const { data } = await api.post('/api/token/', { username: userName, password });

            setApiAccessToken(data.access)

            const response = await api.get('api/users/me');
            
            setUserInfo(response.data)

            setLoading(false);

            navigate('/');

        } catch (e) {
          toast.error('Unable to login');
          setLoading(false);
        }
    }

    return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mt-32">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-28 w-auto"
              src={Logo}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-2xl font-semibold tracking-tight text-gray-500">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
          </p>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
  
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
  
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent
                                 bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm
                                  hover:bg-red-700 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2"
                  >
                    {loading ? 'sigining in...' : 'Sign in'}
                  </button>
                </div>
                {/* <div className="relative flex flex-col justify-center text-sm">
                  <div className="bg-white px-2 text-gray-500 text-center text-sm">
                    Forgot your Password? 
                  </div>
                  <div className="bg-white px-2 text-gray-500 text-center text-xs mt-1">
                    no worries <a href="" className="underline text-blue-500 mr-1" target="_blank">click here</a>
                     to reset your password.
                  </div>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }

  export default Login;