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
    certificateNumber: '',
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
    if (form.certificateNumber.trim() === '') return false;

    return true;
  };

  const save = async () => {
    if (!isFormValid()) {
      // alert('Please fill all required fields correctly');
      return;
    }

    if (editingId) {
      await updateRegion(editingId, form);
    } else {
      await createRegion(form);
    }

    setForm({ name: '', state: '', certificateNumber: '', description: '', image: '', categories: [] });
    setEditingId(null);
    setImageInputKey(prev => prev + 1);
    load();
  };

  const edit = (r: any) => {
    setForm({
      name: r.name || '',
      state: r.state || '',
      certificateNumber: r.certificateNumber || '',
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold mb-6">
          {editingId ? 'Edit GI Region' : 'GI Regions'}
        </h1>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-4">

              {/* Region Name */}
              <div>
                <label className="font-medium block mb-1">Region Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* State */}
              <div>
                <label className="font-medium block mb-1">State</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-medium block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 resize-none"
                />
              </div>

              {/* Categories */}
              <div className="relative">
                <label className="font-medium block mb-1">Categories</label>

                <div
                  onClick={() => setShowCategories(!showCategories)}
                  className="border rounded-lg px-3 py-2 cursor-pointer flex justify-between bg-white"
                >
                  <span className="text-gray-600">
                    {form.categories.length
                      ? `${form.categories.length} selected`
                      : 'Select Categories'}
                  </span>
                  <span>▾</span>
                </div>

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
            </div>

            {/* RIGHT – MEDIA */}
            <div className="space-y-4">
              <h3 className="font-medium">Region Media</h3>

              <div
                onClick={() =>
                  document.getElementById('region-image-input')?.click()
                }
                className="relative border-2 border-dashed rounded-xl h-72 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100"
              >
                {!form.image && (
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Upload Image</p>
                    <p className="text-sm">PNG, JPG supported</p>
                  </div>
                )}

                {form.image && (
                  <img
                    src={form.image}
                    className="absolute w-40 h-40 object-cover rounded-lg border shadow"
                  />
                )}
              </div>

              <input
                key={imageInputKey}
                id="region-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const res = await uploadGiRegionImage(e.target.files[0]);
                  setForm(prev => ({ ...prev, image: res.data.url }));
                }}
              />

              {/* Certificate Number */}
              <div className="pt-4">
                <label className="font-medium block mb-1">Certificate Number</label>
                <input
                  value={form.certificateNumber}
                  onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

            </div>
          </div>
          {/* SAVE */}
          <div className=" flex justify-center pt-4">
            <button
              onClick={save}
              className="bg-indigo-600 text-white px-20 py-2 rounded-lg"
            >
              {editingId ? 'Update Region' : 'Add Region'}
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">GI Region List</h2>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
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

      </div>
    </div>
  );

}
