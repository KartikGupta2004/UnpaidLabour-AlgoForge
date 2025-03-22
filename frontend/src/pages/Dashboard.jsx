import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  LayoutDashboard, 
  ListPlus, 
  ClipboardList, 
  Users, 
  Award, 
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Package,
  Timer,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';

const stats = {
  restaurant: {
    donations: { value: '1,234', label: 'Total Donations', trend: 'up', percentage: '12%' },
    impact: { value: '5,678', label: 'Meals Saved', trend: 'up', percentage: '8%' },
    active: { value: '42', label: 'Active Listings', trend: 'up', percentage: '5%' }
  },
  ngo: {
    received: { value: '2,345', label: 'Meals Received', trend: 'up', percentage: '15%' },
    distributed: { value: '2,100', label: 'Meals Distributed', trend: 'up', percentage: '10%' },
    pending: { value: '12', label: 'Pending Requests', trend: 'down', percentage: '3%' }
  },
  buyer: {
    saved: { value: '$345', label: 'Money Saved', trend: 'up', percentage: '18%' },
    purchased: { value: '56', label: 'Items Purchased', trend: 'up', percentage: '7%' },
    available: { value: '89', label: 'Available Items', trend: 'up', percentage: '4%' }
  }
};

const menuItems = {
  restaurant: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
    { icon: ListPlus, label: 'List Food', href: '#' },
    { icon: ClipboardList, label: 'My Listings', href: '#' },
    { icon: Users, label: 'Requests', href: '#' },
    { icon: Award, label: 'Impact', href: '#' }
  ],
  ngo: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
    { icon: Package, label: 'Available Food', href: '#' },
    { icon: ClipboardList, label: 'My Requests', href: '#' },
    { icon: Timer, label: 'Schedule Pickup', href: '#' },
    { icon: Award, label: 'Impact', href: '#' }
  ],
  buyer: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
    { icon: ShoppingCart, label: 'Marketplace', href: '#' },
    { icon: ClipboardList, label: 'My Orders', href: '#' },
    { icon: TrendingUp, label: 'Deals', href: '#' },
    { icon: Award, label: 'Rewards', href: '#' }
  ]
};

function Dashboard() {
  const [userRole] = useState('restaurant');
  const [userName] = useState("John's Restaurant");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center h-16 px-6">
          <UtensilsCrossed className="h-8 w-8 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">Food Secure</span>
        </div>
        <div className="px-4 py-6">
          <div className="space-y-4">
            {menuItems[userRole].map((item, index) => (
              <a key={index} href={item.href} className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors">
                <item.icon className="h-5 w-5" />
                <span className="ml-3">{item.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t">
            <button className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full">
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="ml-64">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-8">
            <div className="relative">
              <input type="text" placeholder="Search..." className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500" />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full bg-gray-300" src="https://via.placeholder.com/256" alt="User" />
                <button className="flex items-center ml-2 text-sm font-medium text-gray-700">
                  {userName}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="mt-1 text-gray-500">Here's what's happening with your account today.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(stats[userRole]).map(([key, stat]) => (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;