'use client';

import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getRegions } from '@/lib/gi-regions';
import { uploadImage } from '@/lib/upload';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showRegions, setShowRegions] = useState(false);


  const [form, setForm] = useState({
    title: '',
    price: '',
    stock: '',
    images: [] as string[],
    categories: [] as string[],
    giRegions: [] as string[],
    status: 'active',
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [p, c, r] = await Promise.all([
      getProducts(),
      getCategories(),
      getRegions(),
    ]);
    setProducts(p.data);
    setCategories(c.data);
    setRegions(r.data);
  };

  const isFormValid = () => {

    if (!form.title.trim()) return false;
    if (!form.price || Number(form.price) <= 0) return false;
    if (!form.stock || Number(form.stock) < 0) return false;

    if (form.categories.length === 0) return false;
    if (form.giRegions.length === 0) return false;

    for (const attr of attributes) {
      const hasKey = attr.key.trim() !== '';
      const hasValue = attr.value.trim() !== '';

      if (hasKey !== hasValue) {
        return false;
      }
    }

    return true;
  };

  const save = async () => {
    if (!isFormValid()) {
      alert('Please fill all required fields correctly');
      return;
    }

    const payload = {
      ...form,
      slug: form.title.toLowerCase().replace(/\s+/g, '-'),
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images,
      attributes: attributes.reduce((acc, item) => {
        if (item.key && item.value) {
          acc[item.key] = item.value;
        }
        return acc;
      }, {} as Record<string, string>),
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload);
    }

    reset();
    load();
  };

  const reset = () => {
    setEditingId(null);
    setForm({
      title: '',
      price: '',
      stock: '',
      images: [],
      categories: [],
      giRegions: [],
      status: 'active',
    });
    setAttributes([{ key: '', value: '' }]);
  };

  const edit = (p: any) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      price: p.price,
      stock: p.stock,
      images: p.images || [],
      categories: p.categories || [],
      giRegions: p.giRegions || [],
      status: p.status,
    });
    setAttributes(
      p.attributes
        ? Object.entries(p.attributes).map(([key, value]) => ({
          key,
          value: value as string,
        }))
        : [{ key: '', value: '' }]
    );
  };

  const remove = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await deleteProduct(id);
    load();
  };

  const [attributes, setAttributes] = useState([
    { key: '', value: '' }
  ]);

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const copy = [...attributes];
    copy[index][field] = value;
    setAttributes(copy);
  };

  const addAttributeRow = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const removeAttributeRow = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const attributesObject = attributes.reduce((acc, item) => {
    if (item.key && item.value) {
      acc[item.key] = item.value;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-6 max-w-6xl center mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Product Form */}
      <div className="border p-4 rounded mb-6 space-y-3">

        <div className="grid grid-cols-2 gap-2">
          <label htmlFor="product-title" className="w-32 font-medium">Product Title</label>
          <input
            id='product-title'
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
          />
          <label htmlFor='product-price'>Price</label>
          <input
            id='product-price'
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
          />
          <label htmlFor='product-stock'>Stock Available</label>
          <input
            id='product-stock'
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        {attributes.map((attr, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 items-center mb-2"
          >
            {/* LEFT LABEL */}
            <label className="font-medium">
              {index === 0 ? 'Attribute' : ''}
            </label>

            {/* RIGHT INPUTS */}
            <div className="flex gap-2 w-full">
              <input
                placeholder="Key"
                value={attr.key}
                onChange={(e) =>
                  updateAttribute(index, 'key', e.target.value)
                }
                className="border px-3 py-2 rounded w-1/2"
              />

              <input
                placeholder="Value"
                value={attr.value}
                onChange={(e) =>
                  updateAttribute(index, 'value', e.target.value)
                }
                className="border px-3 py-2 rounded w-1/2"
              />

              <button
                type="button"
                onClick={addAttributeRow}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                +
              </button>

              {attributes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttributeRow(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded"
                >
                  −
                </button>
              )}
            </div>
          </div>
        ))}

        {/* IMAGE UPLOAD */}
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* LEFT LABEL */}
          <label className="font-medium">Choose Image</label>

          {/* RIGHT INPUT */}
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;

              try {
                const res = await uploadImage(e.target.files[0]);

                setForm((prev) => ({
                  ...prev,
                  images: [...prev.images, res.data.url],
                }));
              } catch (err) {
                alert('Image upload failed');
                console.error(err);
              }
            }}
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="font-medium">Categories</label>

          <div className="relative">
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

        {/* GI Regions */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="font-medium">GI Regions</label>

          <div className="relative">
            <div
              onClick={() => setShowRegions(!showRegions)}
              className="border rounded px-3 py-2 cursor-pointer flex justify-between bg-white"
            >
              <span className="text-gray-600">
                {form.giRegions.length
                  ? `${form.giRegions.length} selected`
                  : 'Select GI Regions'}
              </span>
              <span>▾</span>
            </div>

            {showRegions && (
              <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto mt-1">
                {regions.map((r) => (
                  <label
                    key={r._id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.giRegions.includes(r._id)}
                      onChange={() =>
                        setForm({
                          ...form,
                          giRegions: form.giRegions.includes(r._id)
                            ? form.giRegions.filter(id => id !== r._id)
                            : [...form.giRegions, r._id],
                        })
                      }
                    />
                    {r.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div></div>

          <button
            onClick={save}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg w-full"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
        </div>


        {/* Product List */}
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td className="border p-2 text-center">{p.title}</td>
                <td className="border p-2 text-center">₹{p.price}</td>
                <td className="border p-2 text-center">{p.stock}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => edit(p)} className="text-blue-600 mr-3">
                    Edit
                  </button>
                  <button onClick={() => remove(p._id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
