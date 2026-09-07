import React from 'react'
import logo from '../assets/logo.jpg'
import Input from '../components/forms/Input'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import backgroundImage from '../assets/login-background.svg'
import woman from '../assets/woman.svg'

const Login = () => {
  return (
    <div className="font-satoshi flex items-center justify-center min-h-screen ">
        <div className='w-[50%] p-15 flex flex-col h-screen space-y-20'>
            <div className='aspect-square rounded-full w-15 overflow-hidden'> <img src={logo} alt="Logo" className="w-full h-full object-cover" /></div>
            <div className='flex flex-col space-y-5'>
                <Input label="Email Address" type="email" />
                <Input label="Password" type="password" />
                <div className="flex justify-between" >
                    <div className='flex items-center space-x-2'>
                        <input type="checkbox" id="rememberMe" className='w-4 h-4 accent-primary' />
                        <label htmlFor="rememberMe" className='text-sm text-primary-text'>Remember Me</label>
                    </div>
                    <Link to="/forgot-password" className='text-sm text-primary-text hover:text-primary'>Forgot Password?</Link>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-5">
                <Button className="shadow-lg shadow-primary-text/30" >Login</Button>
                <div><p className='text-sm text-slate-600'>Don't have an account? <Link to="/register" className='text-primary font-bold'>Register Now</Link></p></div>
            </div>

        </div>
        <div className="w-[50%] h-screen bg-cover bg-center flex items-center justify-center p-15" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className='w-full h-full ml-5 shadow-[inset_0_0_30px_rgb(255_255_255/50%)] border border-white rounded-lg backdrop-blur-xl relative'>
                <p className='text-white text-4xl font-extrabold absolute top-10 left-10 leading-11'>Smart Way To Build <br/> Your Finance </p>
                <img src={woman} alt="Logo" className="absolute bottom-0 -right-20" />
            </div>
        </div>
    </div>
  )
}

export default Login