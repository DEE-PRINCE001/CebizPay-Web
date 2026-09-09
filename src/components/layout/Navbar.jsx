import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import Button from '../common/Button'
import { Bell, Coins, LayoutDashboard, User, UsersRound, Wallet } from 'lucide-react'


const Navbar = () => {
    return (
        <div className='flex space-x-7 w-full items-center'>
            <div className='w-15 h-15 rounded-full overflow-hidden'>
                <img src={logo} alt="Logo" className='w-full h-full object-cover' />
            </div>
            <div className="flex-1 flex space-x-5 items-center">
                <div className="bg-white w-fit rounded-xl py-4 px-5 flex items-center justify-center space-x-5">
                    <p className='font-bold text-primary-text'>Hello Tayo</p>
                    <div>
                        <img src={logo} alt="Profile" className='w-8 h-8 bg-bg-green-300 rounded-full object-cover' />
                    </div>
                </div>
                <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between flex-1">
                    <div className='flex space-x-3'>
                        <NavLink to="/dashboard-test" className=''>
                            {({ isActive }) => (
                                <Button icon={LayoutDashboard} size="lg" variant={isActive ? 'primaryLink' : 'outline'}>Dashboard</Button>
                            )}
                        </NavLink>
                        <NavLink to="/organization" className=''>
                            {({ isActive }) => (
                                <Button icon={UsersRound} size="lg" variant={isActive ? 'primaryLink' : 'outline'}>Organization</Button>
                            )}
                        </NavLink>
                        <NavLink to="/individual" className=''>
                            {({ isActive }) => (
                                <Button icon={User} size="lg" variant={isActive ? 'primaryLink' : 'outline'}>Individual</Button>
                            )}
                        </NavLink>
                        <NavLink to="/wallet" className=''>
                            {({ isActive }) => (
                                <Button icon={Wallet} size="lg" variant={isActive ? 'primaryLink' : 'outline'}>Wallet</Button>
                            )}
                        </NavLink>
                        <NavLink to="/saving-plan">
                            {({ isActive }) => (
                                <Button icon={Coins} size="lg" variant={isActive ? 'primaryLink' : 'outline'}>Saving Plan</Button>
                            )}
                        </NavLink>
                    </div>
                    <div className="rounded-full p-2 border hover:bg-primary/20 border-primary/30"><Bell className="w-5 h-5 text-primary" /></div>

                </div>
                {/* <div className="rounded-full p-2 border border-primary/30"><Bell className="w-5 h-5 text-primary" /></div> */}

            </div>
        </div>
        
    )
}

export default Navbar