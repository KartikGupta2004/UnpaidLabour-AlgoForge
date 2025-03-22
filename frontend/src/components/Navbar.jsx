import React from 'react'
import { UtensilsCrossed } from 'lucide-react';
function Navbar() {
  return (
    <>
    <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <UtensilsCrossed className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Food Secure</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar