import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className=" bg-white relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen">
      {/* Background Image */}
      <div className="absolute top-0 w-full h-full bg-center">
        {/* <Image 
          src="/images/landing.png"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute top-0 w-full h-full"></div>
      </div>
      
      {/* Content */}
      <div className="container relative mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
            <div className="text-black">
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Plan Your Perfect Trip with AI
              </h1>
              <p className="text-xl mb-8">
                Get personalized travel recommendations and create custom itineraries powered by artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="px-6 py-3 rounded-lg text-gray-900 w-full sm:w-96"
                /> */}
                <Link href="/create-trip"> {/* Wrap button with Link */}
                  <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">
                    Lets get started
                  </button>
                </Link>
                
              </div>
              {/* <img 
          src="/images/landing.png"
         className='width-100 height-100'
        /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;