import React from 'react';
import logo from '../../assets/logo.jpg';
import backgroundImage from '../../assets/login-background.svg';
import woman from '../../assets/woman.svg';

/**
 * Reusable Split-Screen Layout for Authentication & Onboarding pages.
 * Features a sticky hero banner to prevent visual cutoffs when form content scrolls.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content to display in the form column
 * @param {string} [props.heroTitle] - Hero title text for the frosted glass card
 * @param {boolean} [props.reverse=false] - If true: Hero on Left, Form on Right. If false: Form on Left, Hero on Right.
 * @param {string} [props.dividerTop='top-40'] - Positioning class for the vertical accent line
 * @param {string} [props.womanClass] - Custom positioning/sizing for the woman illustration
 */
export default function AuthLayout({
  children,
  heroTitle = 'Smart Way To Build \n Your Finance',
  reverse = false,
  dividerTop = 'top-40',
  womanClass = 'absolute bottom-0 -right-20',
}) {
  return (
    <div className="font-satoshi flex items-start justify-center min-h-screen w-full bg-background relative">
      {/* Form Column (Responsive on Mobile, Tablet & Desktop) */}
      <div
        className={`w-full lg:w-[50%] p-6 sm:p-10 lg:p-15 lg:px-20 flex flex-col min-h-screen justify-center lg:justify-start space-y-10 sm:space-y-14 lg:space-y-18 max-w-md sm:max-w-lg lg:max-w-none mx-auto ${
          reverse ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <div className="aspect-square rounded-full w-12 sm:w-15 overflow-hidden shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        {children}
      </div>

      {/* Hero Graphic Column (Sticky & Locked to Viewport on Large Screens) */}
      <div
        className={`hidden lg:flex lg:w-[50%] h-screen sticky top-0 bg-cover bg-center items-center justify-center p-15 shrink-0 ${
          reverse ? 'lg:order-1' : 'lg:order-2'
        }`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full h-full ml-5 shadow-[inset_0_0_30px_rgb(255_255_255/50%)] border border-white rounded-lg backdrop-blur-xl relative overflow-hidden">
          <p className="text-white text-3xl xl:text-4xl font-extrabold absolute top-7 left-7 leading-10 xl:leading-11 whitespace-pre-line">
            {heroTitle}
          </p>
          <div className={`absolute ${dividerTop} left-7 h-20 w-px bg-white/70`}></div>
          <img
            src={woman}
            alt="Hero illustration"
            className={`${womanClass} select-none pointer-events-none`}
          />
        </div>
      </div>
    </div>
  );
}
