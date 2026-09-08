import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.js';
import logo from '../../assets/logo.jpg';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';
import backgroundImage from '../../assets/login-background.svg';
import woman from '../../assets/woman.svg';

const RegisterBusiness1 = () => {


    return (
        <div className="font-satoshi flex items-center justify-center min-h-screen w-full bg-background">


            <div
                className="hidden lg:flex lg:w-[50%] h-screen bg-cover bg-center items-center justify-center p-15"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="w-full h-full ml-5 shadow-[inset_0_0_30px_rgb(255_255_255/50%)] border border-white rounded-lg backdrop-blur-xl relative overflow-hidden">
                    <p className="text-white text-3xl xl:text-4xl font-extrabold absolute top-7 left-7 leading-10 xl:leading-11">
                        Get Started! <br /> Finance Your Dreams, <br /> Effortlessly!
                    </p>
                    <div className="absolute top-45 left-7 h-20 w-px bg-white/70"></div>
                    <img src={woman} alt="Hero" className="h-85 absolute bottom-0 right-0 select-none pointer-events-none" />
                </div>
            </div>

            {/* Right Form Section (Responsive for Mobile, Tablet & Desktop) */}
            <div className="w-full lg:w-[50%] p-6 sm:p-10 lg:p-15 lg:px-20 flex flex-col min-h-screen lg:h-screen justify-center lg:justify-start space-y-10 sm:space-y-14 lg:space-y-18 max-w-md sm:max-w-lg lg:max-w-none mx-auto">
                <div className="aspect-square rounded-full w-12 sm:w-15 overflow-hidden shrink-0">
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                </div>

                <form onSubmit className="flex flex-col space-y-10 sm:space-y-14 lg:space-y-20">
                    <div className="flex flex-col space-y-5">
                        {/* {generalError && <FormError message={generalError} />} */}

                        <Input
                            label="Company Name"

                        />
                        <Input
                            label="Email Address"

                        />
                        <Input
                            label="Contact Number"
                        />
                    </div>

                    <div className="flex flex-col items-center space-y-5">
                        <Button
                            type="submit"
                            // loading={loginMutation.isPending}
                            // disabled={loginMutation.isPending}
                            className="shadow-lg shadow-primary-text/30"
                            size="lg"
                        >
                            Continue
                        </Button>
                        <div>
                            <p className="text-xs sm:text-sm text-slate-600 text-center">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-bold hover:underline">
                                    Login Now
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterBusiness1;