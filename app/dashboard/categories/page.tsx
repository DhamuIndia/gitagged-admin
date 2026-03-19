'use client';

import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/categories';
import { uploadCategoryImage } from '@/lib/upload';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const [form, setForm] = useState({
    name: '',
    description: '',
    parentId: '' as string | '',
    image: '' as string | '',
  });

  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (!form.description.trim()) return false;
    if (form.parentId === null) return false;
    return true;
  };

  const save = async () => {
    if (!isFormValid()) return;
    const payload = {
      name: form.name,
      description: form.description,
      parentId: form.parentId || null,
      image: form.image || null,
    };

    if (editingId) {
      await updateCategory(editingId, payload);
    } else {
      await createCategory(payload);
    }

    reset();
    loadCategories();
    setShowModel(false);
  };

  const reset = () => {
    setEditingId(null);
    setForm({ name: '', description: '', parentId: '', image: '' });
    setImageInputKey(prev => prev + 1);
  };

  const edit = (cat: any) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId || '',
      image: cat.image || '',
    });
    setShowModel(true);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete category?')) return;
    await deleteCategory(id);
    loadCategories();
  };

  const [imageInputKey, setImageInputKey] = useState(0);

  const getCategoryById = (id: string) =>
    categories.find(c => c._id === id);

  const resolveLevels = (category: any) => {
    let main = '-';
    let sub = '-';
    let child = '-';

    if (!category.parentId) {
      // MAIN CATEGORY
      main = category.name;
    } else {
      const parent = getCategoryById(category.parentId);

      if (parent && !parent.parentId) {
        // SUB CATEGORY
        main = parent.name;
        sub = category.name;
      } else if (parent && parent.parentId) {
        // CHILD CATEGORY
        const grandParent = getCategoryById(parent.parentId);
        if (grandParent) {
          main = grandParent.name;
          sub = parent.name;
          child = category.name;
        }
      }
    }

    return { main, sub, child };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* header and button container!! */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Categories</h1>

          <button
            onClick={() => {
              reset();
              setShowModel(true);
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + Add Category
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Category List</h2>

          <div className='overflow-x-auto no-scrollbar'>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-100">Main Category</th>
                  <th className="border p-2 bg-gray-100">Sub Category</th>
                  <th className="border p-2 bg-gray-100">Child Category</th>
                  <th className="border p-2 bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => {
                  const { main, sub, child } = resolveLevels(c);

                  return (
                    <tr key={c._id}>
                      <td className="border p-2 text-center whitespace-nowrap">{main}</td>
                      <td className="border p-2 text-center whitespace-nowrap">{sub}</td>
                      <td className="border p-2 text-center whitespace-nowrap">{child}</td>
                      <td className="border p-2 text-center">
                        <button onClick={() => edit(c)} className="text-blue-600 mr-3">
                          Edit
                        </button>
                        <button onClick={() => remove(c._id)} className="text-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* pop up feilds!! */}
        {showModel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-gray-50 w-full max-w-5xl rounded-xl shadow-2xl p-6 relative">

              {/* Close Button */}
              <button
                onClick={() => setShowModel(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>

              {/* FORM CARD */}
              <div className="bg-white rounded-xl shadow p-6 mb-10">
                <div className="grid md:grid-cols-3 gap-6">

                  {/* LEFT */}
                  <div className="md:col-span-2 space-y-4">

                    {/* Category Name */}
                    <div>
                      <label className="font-medium block mb-1">Category Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="font-medium block mb-1" htmlFor='descriptionLabel'>Description</label>
                      <textarea
                        id='descriptionLabel'
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 resize-none"
                      />
                    </div>

                    {/* Parent Category */}
                    <div>
                      <label className="font-medium block mb-1">Parent Category</label>
                      <select
                        value={form.parentId}
                        onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">No Parent (Main Category)</option>
                        {categories
                          .filter(c => c._id !== editingId) // prevent self-parent
                          .map(c => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* RIGHT – IMAGE */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Category Media</h3>

                    <div
                      onClick={() =>
                        document.getElementById('category-image-input')?.click()
                      }
                      className="relative border-2 border-dashed rounded-xl h-56 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100"
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
                      id="category-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return;
                        const res = await uploadCategoryImage(e.target.files[0]);
                        setForm(prev => ({ ...prev, image: res.data.url }));
                      }}
                    />
                  </div>

                </div>
                {/* Save Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={save}
                    className="bg-indigo-600 text-white px-20 py-2 rounded-lg"
                  >
                    {editingId ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
