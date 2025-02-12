import React from 'react';
import { Sprout } from 'lucide-react';
import { Button } from './button';
// Assuming you are using this button component

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white border-b">
      <div className="max-w-4xl mx-auto flex justify-between items-center"> {/* Added justify-between to space out content */}
        <div className="flex items-center">
          <Sprout className="mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Hamro Guide</h1>
        </div>
        
        {/* Sign In Button */}
<Button 
  className="bg-black text-white hover:bg-gray-800 border-black transition duration-300 ease-in-out rounded-md py-2 px-4">
  Sign In
</Button>

      </div>
    </header>
  );
};

export default Header;
