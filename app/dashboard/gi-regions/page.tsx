'use client';

import { useEffect, useState } from 'react';
import {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from '@/lib/gi-regions';
import { getCategories } from '@/lib/categories';
import { uploadGiRegionImage } from '@/lib/upload';

export default function GIRegionsPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    state: '',
    image: '',
    description: '',
    categories: [] as string[],
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [r, c] = await Promise.all([
      getRegions(),
      getCategories(),
    ]);
    setRegions(r.data);
    setCategories(c.data);
  };

  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (!form.state.trim()) return false;
    if (!form.description.trim()) return false;
    if (form.categories.length === 0) return false;

    return true;
  };

  const save = async () => {
    if (!isFormValid()) {
      alert('Please fill all required fields correctly');
      return;
    }

    if (editingId) {
      await updateRegion(editingId, form);
    } else {
      await createRegion(form);
    }

    setForm({ name: '', state: '', description: '', image: '', categories: [] });
    setEditingId(null);
    setImageInputKey(prev => prev + 1);
    load();
  };

  const edit = (r: any) => {
    setForm({
      name: r.name || '',
      state: r.state || '',
      description: r.description || '',
      image: r.image || '',
      categories: r.categories || [],
    });
    setEditingId(r._id);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this GI region?')) return;
    await deleteRegion(id);
    load();
  };

  return (
    // {/* Form */}
    <div className="bg-white border rounded-xl p-6 mb-8">
      <h1 className="text-2xl font-semibold mb-4">
        {editingId ? 'Edit GI Region' : 'GI Region'}
      </h1>

      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Region Name */}
        <label htmlFor="regionName" className="font-medium">
          Region Name
        </label>
        <input
          id="regionName"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-4 py-2"
        />

        {/* State */}
        <label htmlFor="stateName" className="font-medium">
          State
        </label>
        <input
          id="stateName"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="border rounded-lg px-4 py-2"
        />

        {/* Description */}
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-lg px-4 py-2 resize-none"
          rows={2}
        />
        
        {/* Image */}
          <label className="font-medium">State Image</label>

          <input
          key={imageInputKey}
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const res = await uploadGiRegionImage(e.target.files[0]);
              setForm(prev => ({
                ...prev,
                image: res.data.url,
              }));
            }}
          />

        {/* Categories */}
        <label className="font-medium">Categories</label>
        <div className="relative">

          {/* Trigger */}
          <div
            onClick={() => setShowCategories(!showCategories)}
            className="border rounded px-3 py-2 cursor-pointer flex justify-between bg-white"
          >
            <span className="text-gray-600">
              {form.categories.length
                ? `${form.categories.length} selected`
                : 'Select Categories'}
            </span>
            <span>▾</span>
          </div>

          {/* Dropdown */}
          {showCategories && (
            <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto mt-1">
              {categories.map((c) => (
                <label
                  key={c._id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.categories.includes(c._id)}
                    onChange={() =>
                      setForm({
                        ...form,
                        categories: form.categories.includes(c._id)
                          ? form.categories.filter(id => id !== c._id)
                          : [...form.categories, c._id],
                      })
                    }
                  />
                  {c.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Button */}
        <div></div>
        <button
          onClick={save}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
      <section className='p-4'></section>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">State</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((r) => (
            <tr key={r._id}>
              <td className="border p-2 text-center">{r.name}</td>
              <td className="border p-2 text-center">{r.state}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => edit(r)}
                  className="text-blue-600 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(r._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
