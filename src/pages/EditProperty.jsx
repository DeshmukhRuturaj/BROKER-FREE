import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../services/api';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await getPropertyById(id);
        setProperty(res.data);
        setForm(res.data);
        setLoading(false);
        // Debug output
        console.log('Loaded property for edit:', res.data);
        if (res.data.images) {
          console.log('Property images:', res.data.images);
        }
      } catch (err) {
        toast.error('Failed to load property');
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProperty(id, form);
      toast.success('Property updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" value={form.title || ''} onChange={handleChange} className="input-field w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} className="input-field w-full" rows={3} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="input-field w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bedrooms</label>
          <input name="bedrooms" type="number" value={form.bedrooms || ''} onChange={handleChange} className="input-field w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bathrooms</label>
          <input name="bathrooms" type="number" value={form.bathrooms || ''} onChange={handleChange} className="input-field w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sq Ft</label>
          <input name="areaSqFt" type="number" value={form.areaSqFt || ''} onChange={handleChange} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input name="propertyType" value={form.propertyType || ''} onChange={handleChange} className="input-field w-full" required />
        </div>
        {/* Add more fields as needed */}
        <div className="flex justify-end space-x-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Updating...' : 'Update Property'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty; 