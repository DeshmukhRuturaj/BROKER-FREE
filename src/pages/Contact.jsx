import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-6">Have questions or need help? Fill out the form below or email us at <a href="mailto:support@propertyhub.com" className="text-primary-600 underline">support@propertyhub.com</a>.</p>
        {submitted ? (
          <div className="text-green-600 font-semibold text-lg">Thank you for reaching out! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        )}
        <div className="mt-8 text-gray-500 text-sm">
          <div>PropertyHub, 123 Main Street, Your City, Country</div>
          <div>Phone: +1 234 567 8900</div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 