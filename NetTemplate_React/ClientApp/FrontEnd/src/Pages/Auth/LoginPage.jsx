import React, { useState } from 'react'
import { FaLock, FaUserAlt, FaEye, FaEyeSlash } from 'react-icons/fa'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    // Simulate an API call for login
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)

    if (username === 'uniqueuser' && password === 'secret') {
      alert('Login Successful!')
      // Redirect to dashboard
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Visual Engagement */}
      <div className='relative w-0 lg:w-1/2 bg-gradient-to-tr from-purple-600 to-indigo-700 overflow-hidden'>
        <img
          src='https://images.unsplash.com/photo-1556705087-9b9cc86a6ed6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
          alt='Abstract Background'
          className='absolute inset-0 h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-black opacity-20' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white'>
          <h2 className='text-4xl font-bold mb-4'>Welcome Back!</h2>
          <p className='text-lg opacity-80'>
            Unlock a world of possibilities with your account.
          </p>
          <div className='mt-8'>
            <button className='bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400'>
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Sign in
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Or
              <a href='#' className='font-medium text-purple-600 hover:text-purple-500'>
                create a new account
              </a>
            </p>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='rounded-md shadow-sm -space-y-px'>
              <div>
                <label htmlFor='username' className='sr-only'>
                  Username
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FaUserAlt className='h-5 w-5 text-gray-400' aria-hidden='true' />
                  </div>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    autoComplete='username'
                    required
                    className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FaLock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    required
                    className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer' onClick={togglePasswordVisibility}>
                    {showPassword
                      ? (
                        <FaEyeSlash className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        )
                      : (
                        <FaEye className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        )}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a href='#' className='font-medium text-purple-600 hover:text-purple-500'>
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>
                <strong className='font-bold'>Error!</strong>
                <span className='block sm:inline'>{error}</span>
              </div>
            )}

            <div>
              <button
                type='submit'
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                disabled={loading}
              >
                {loading
                  ? (
                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    )
                  : (
                    <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500 group-hover:text-purple-400' aria-hidden='true' />
                    )}
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
