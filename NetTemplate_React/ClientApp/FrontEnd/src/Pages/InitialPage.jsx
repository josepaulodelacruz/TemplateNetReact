import React from 'react'
import { NavLink } from 'react-router'
import StringRoutes from '~/Constants/StringRoutes'
import { Button } from '~/components/ui/button'

/**
 * Sample page only
 * NO actual purposes. This is just a generated webpage by AI
 */
const InitialPage = () => {
  return (
    <div className='bg-gray-100 min-h-screen flex flex-col'>
      {/* Navigation Bar */}
      <nav className='bg-white shadow-md py-4'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <a href='/' className='text-xl font-bold text-blue-500'>
            My Awesome App
          </a>
          <div className='space-x-4'>
            <a href='#features' className='text-gray-700 hover:text-blue-500'>
              Features
            </a>
            <a href='#pricing' className='text-gray-700 hover:text-blue-500'>
              Pricing
            </a>
            <Button href='#contact' className='text-gray-700 hover:text-blue-500'>
              Contact
            </Button>
            <NavLink to={StringRoutes.login} className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
              Login
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className='bg-blue-500 text-white py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl font-bold mb-6'>Welcome to the Future!</h1>
          <p className='text-lg mb-8'>
            Discover innovative solutions that will change the way you work and live.
          </p>
          <button className='bg-white text-blue-500 font-semibold py-3 px-6 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400'>
            Learn More
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section id='features' className='py-16 bg-gray-100'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-10'>Key Features</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-blue-500 mb-2'>Intuitive Interface</h3>
              <p className='text-gray-700'>Easy to use and navigate, designed for a seamless user experience.</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-green-500 mb-2'>Powerful Tools</h3>
              <p className='text-gray-700'>Access a wide range of features to boost your productivity.</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-yellow-500 mb-2'>Secure & Reliable</h3>
              <p className='text-gray-700'>Your data is safe with our advanced security measures.</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-red-500 mb-2'>Customizable Options</h3>
              <p className='text-gray-700'>Tailor the application to fit your specific needs and preferences.</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-purple-500 mb-2'>24/7 Support</h3>
              <p className='text-gray-700'>Our dedicated support team is always here to help you.</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-indigo-500 mb-2'>Scalable Solution</h3>
              <p className='text-gray-700'>Grow your business with our flexible and scalable platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='py-16 bg-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-10'>Pricing Plans</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-gray-100 rounded-lg shadow-md p-8'>
              <h4 className='text-xl font-semibold text-gray-800 mb-4'>Basic</h4>
              <span className='text-3xl font-bold text-blue-500'>$19</span>
              <span className='text-gray-600'>/month</span>
              <ul className='mt-6 space-y-2 text-gray-700'>
                <li>Limited Features</li>
                <li>Up to 5 Users</li>
                <li>Basic Support</li>
              </ul>
              <button className='mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                Choose Plan
              </button>
            </div>
            <div className='bg-blue-500 text-white rounded-lg shadow-md p-8'>
              <h4 className='text-xl font-semibold mb-4'>Pro</h4>
              <span className='text-3xl font-bold'>$49</span>
              <span>/month</span>
              <ul className='mt-6 space-y-2'>
                <li>All Basic Features</li>
                <li>Unlimited Users</li>
                <li>Priority Support</li>
                <li>Advanced Analytics</li>
              </ul>
              <button className='mt-6 bg-white text-blue-500 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                Choose Plan
              </button>
            </div>
            <div className='bg-gray-100 rounded-lg shadow-md p-8'>
              <h4 className='text-xl font-semibold text-gray-800 mb-4'>Enterprise</h4>
              <span className='text-3xl font-bold text-blue-500'>Contact Us</span>
              <p className='mt-6 text-gray-700'>Custom solutions tailored to your business needs.</p>
              <button className='mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-16 bg-gray-100'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-10'>Contact Us</h2>
          <p className='text-lg text-gray-700 mb-8'>
            Have questions? Our team is ready to assist you.
          </p>
          <div className='max-w-md mx-auto'>
            <form className='space-y-4'>
              <input
                type='text'
                placeholder='Your Name'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <input
                type='email'
                placeholder='Your Email'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <textarea
                placeholder='Your Message'
                rows='4'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <button
                type='submit'
                className='w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 text-white py-8 mt-auto'>
        <div className='container mx-auto px-4 text-center'>
          <p>&copy; {new Date().getFullYear()} My Awesome App. All rights reserved.</p>
          <div className='mt-4 space-x-4'>
            <a href='/privacy' className='text-gray-300 hover:text-white'>
              Privacy Policy
            </a>
            <a href='/terms' className='text-gray-300 hover:text-white'>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default InitialPage
