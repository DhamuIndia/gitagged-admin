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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const [form, setForm] = useState({
    name: '',
    parentId: '' as string | '',
    image: '' as string | '',
  });

  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (form.parentId === null) return false;
    return true;
  };

  const save = async () => {
    if (!isFormValid()) return;
    const payload = {
      name: form.name,
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
  };

  const reset = () => {
    setEditingId(null);
    setForm({ name: '', parentId: '', image: '' });
    setImageInputKey(prev => prev + 1);
  };

  const edit = (cat: any) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      parentId: cat.parentId || '',
      image: cat.image || '',
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete category?')) return;
    await deleteCategory(id);
    loadCategories();
  };

  const [imageInputKey, setImageInputKey] = useState(0);

  return (
    <div className="bg-white border rounded-xl p-6 mb-8">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Name */}
        <label htmlFor="categoryName" className="font-medium">Category Name</label>
        <input
          id="categoryName"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-4 py-2"
        />

        {/* Parent */}
        <label className="font-medium">Parent Category</label>
        <select
          value={form.parentId}
          onChange={(e) =>
            setForm({ ...form, parentId: e.target.value })
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Select Parent Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* CATEGORY IMAGE */}
        <label className="font-medium">Category Image</label>

        <div>
          {/* Custom Button */}
          <label
            htmlFor="category-image"
            className="block border px-4 py-2 rounded cursor-pointer bg-white hover:bg-gray-50 text-gray-600 text-center"
          >
            Choose from folder
          </label>

          {/* Hidden Input */}
          <input
            key={imageInputKey}
            id="category-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;

              try {
                const res = await uploadCategoryImage(e.target.files[0]);

                setForm(prev => ({
                  ...prev,
                  image: res.data.url,
                }));
              } catch (err) {
                alert('Image upload failed');
                console.error(err);
              }
            }}
          />

          {/* IMAGE PREVIEW */}
          {form.image && (
            <div className="mt-3 flex justify-end">
              <img
                src={form.image}
                alt="Category"
                className="h-28 w-28 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <button
          onClick={save}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          {editingId ? 'Update Category' : 'Add Category'}
        </button>
      </div>

      <br></br>

      {/* LIST */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Category</th>
            <th className="border p-2">Sub Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td className="border p-2 text-center">{c.name}</td>
              <td className="border p-2 text-center">
                {categories.find((x) => x._id === c.parentId)?.name || '-'}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => edit(c)}
                  className="text-blue-600 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(c._id)}
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
