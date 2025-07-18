import React from 'react';
import { Wine, Users, Package, BarChart3, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Efficiently manage your customer database with event details and contact information.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Real-time inventory management with automatic stock updates and availability tracking.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive reporting with revenue tracking and business insights.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const glassTypes = [
    { name: 'Beer Glasses', price: '400 RWF', available: '240 glasses', color: 'bg-amber-500' },
    { name: 'Wine Glasses', price: '450 RWF', available: '144 glasses', color: 'bg-red-500' },
    { name: 'Cocktail Glasses', price: '500 RWF', available: '144 glasses', color: 'bg-purple-500' },
    { name: 'Champagne Glasses', price: '450 RWF', available: '96 glasses', color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Glass Rental Pro</h1>
                <p className="text-sm text-gray-600">Professional Glass Rental Management</p>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Professional Glass Rental Solution
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Glass Rental </span>
              Business
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete management system for your glass rental business. Track inventory, manage customers, 
              process orders, and generate reports - all in one powerful platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold"
            >
              Start Managing Now
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold">
              View Demo
            </button>
          </div>

          {/* Glass Types Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {glassTypes.map((glass, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className={`w-12 h-12 ${glass.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <Wine className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{glass.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">{glass.price}</p>
                <p className="text-sm text-gray-600">{glass.available}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to run a successful glass rental business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                  <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Glass Rental Pro?
              </h2>
              <div className="space-y-4">
                {[
                  'Real-time inventory tracking with automatic updates',
                  'Complete customer management with event details',
                  'Automated order processing and status tracking',
                  'Comprehensive reporting and analytics',
                  'Secure cloud-based data storage',
                  'User-friendly interface designed for efficiency'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join hundreds of businesses already using Glass Rental Pro to streamline their operations.
                </p>
                <button
                  onClick={onGetStarted}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  Start Your Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wine className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Glass Rental Pro</h3>
                <p className="text-gray-400 text-sm">Professional Management Solution</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Glass Rental Pro. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Built with ❤️ for glass rental businesses
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}