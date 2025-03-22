import React, { useState } from 'react';
import { UtensilsCrossed, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const roleOptions = [
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'List surplus food and manage donations'
  },
  {
    id: 'ngo',
    title: 'NGO / Food Bank',
    description: 'Request and distribute food donations'
  },
  {
    id: 'buyer',
    title: 'Individual Buyer',
    description: 'Purchase discounted surplus food'
  }
];

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ isLogin, selectedRole, email, password, name });
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-green-600 hover:text-green-500"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
          {!isLogin && !selectedRole ? (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Choose your role</h3>
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <div className="text-left">
                    <h4 className="text-lg font-medium text-gray-900">{role.title}</h4>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {!isLogin && selectedRole && (
                <div className="flex items-center mb-4">
                  <button
                    type="button"
                    onClick={handleBackToRoles}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to role selection
                  </button>
                </div>
              )}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none rounded-lg block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-lg block w-full pl-10 px-3 py-2 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:ring-green-500">
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;