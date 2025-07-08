import React from 'react';
import { HomeIcon, UsersIcon, BoltIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: <UsersIcon className="h-8 w-8 text-primary-500" />, 
    title: 'Community Driven',
    desc: 'Connect directly with property owners and seekers. No brokers, no hidden fees.'
  },
  {
    icon: <BoltIcon className="h-8 w-8 text-yellow-400" />, 
    title: 'Fast & Easy',
    desc: 'List or find properties in minutes with our intuitive, user-friendly platform.'
  },
  {
    icon: <GlobeAltIcon className="h-8 w-8 text-green-500" />, 
    title: 'Widest Reach',
    desc: 'Access a wide range of listings and reach buyers and renters across the country.'
  }
];

const AboutUs = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-100 via-blue-50 to-white flex flex-col items-center justify-center py-12 px-4">
    {/* Hero Section */}
    <div className="w-full max-w-3xl text-center mb-10">
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-600 shadow-lg h-20 w-20">
          <HomeIcon className="h-12 w-12 text-white" />
        </span>
      </div>
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">Welcome to PropertyHub</h1>
      <p className="text-xl text-gray-600 mb-6 font-medium max-w-2xl mx-auto">
        The <span className="text-primary-600 font-bold">#1 platform</span> for buying, selling, and renting properties <span className="text-primary-600 font-bold">without brokers</span>. Experience transparency, speed, and a community-first approach.
      </p>
    </div>

    {/* Features Card */}
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {features.map((f, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <div className="mb-4">{f.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
          <p className="text-gray-500 text-center">{f.desc}</p>
        </div>
      ))}
    </div>

    {/* Mission Statement */}
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-primary-600 mb-2">Our Mission</h2>
      <p className="text-gray-700 text-lg mb-4">
        Empower everyone to find their dream home or the perfect buyer with zero hassle. We believe in <span className="text-primary-600 font-semibold">direct connections</span>, <span className="text-primary-600 font-semibold">secure transactions</span>, and a <span className="text-primary-600 font-semibold">better property experience</span> for all.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <div className="bg-primary-50 px-6 py-3 rounded-lg text-primary-700 font-semibold shadow">1000+ Happy Users</div>
        <div className="bg-green-50 px-6 py-3 rounded-lg text-green-700 font-semibold shadow">500+ Properties Listed</div>
        <div className="bg-yellow-50 px-6 py-3 rounded-lg text-yellow-700 font-semibold shadow">Zero Brokerage</div>
      </div>
    </div>
  </div>
);

export default AboutUs; 