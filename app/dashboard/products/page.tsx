'use client';

import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getRegions } from '@/lib/gi-regions';
import { uploadProductImage } from '@/lib/upload';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showRegions, setShowRegions] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);


  const [form, setForm] = useState({
    title: '',
    price: '',
    stock: '',
    description: '',
    discountPercentage: '',
    images: [] as string[],
    categories: [] as string[],
    giRegions: [] as string[],
    status: 'active',
  });

  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);

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
    if (form.description.trim() === '') return false;
    if (form.discountPercentage.length === 0) return false;

    for (const attr of attributes) {
      const hasKey = attr.key.trim() !== '';
      const hasValue = attr.value.trim() !== '';
      if (hasKey !== hasValue) return false;
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
      description: form.description,
      discountPercentage: Number(form.discountPercentage),
      images: form.images,
      attributes: attributes.reduce((acc, item) => {
        if (item.key && item.value) acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>),
    };

    editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
    reset();
    load();
  };

  const reset = () => {
    setEditingId(null);
    setForm({
      title: '',
      price: '',
      stock: '',
      description: '',
      discountPercentage: '',
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
      description: p.description,
      discountPercentage: p.discountPercentage,
      images: p.images || [],
      categories: p.categories || [],
      giRegions: p.giRegions || [],
      status: p.status,
    });
    const attrs =
      p.attributes && Object.keys(p.attributes).length > 0
        ? Object.entries(p.attributes).map(([key, value]) => ({
          key,
          value: value as string,
        }))
        : [{ key: '', value: '' }];

    setAttributes(attrs);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await deleteProduct(id);
    load();
  };

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

  const getCategoryNames = (categories: any[]) => {
  if (!Array.isArray(categories)) return '';
  return categories.map(c => c.name).join(', ');
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <label className='block mb-2 font-medium' htmlFor='titleLabel'>Product Title</label>
                <input
                  type="text"
                  id='titleLabel'
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className='block mb-2 font-medium' htmlFor='priceLabel'>Price</label>
                <input
                  type="number"
                  id='priceLabel'
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />
                <label className='block mb-2 font-medium' htmlFor='stockLabel'>Stock</label>
                <input
                  type="number"
                  id='stockLabel'
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />
                <label className='block mb-2 font-medium' htmlFor='discountLabel'>Discount Percentage</label>
                <input
                  type="number"
                  id='discountLabel'
                  value={form.discountPercentage}
                  onChange={e => setForm({ ...form, discountPercentage: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              {/* ATTRIBUTES */}
              {/* <div className="border rounded-lg p-4 space-y-2"> */}
              <h3 className="font-medium">Attributes</h3>
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    placeholder="Key"
                    value={attr.key}
                    onChange={e => updateAttribute(index, 'key', e.target.value)}
                    className="border rounded px-3 py-2 w-1/2"
                  />
                  <input
                    placeholder="Value"
                    value={attr.value}
                    onChange={e => updateAttribute(index, 'value', e.target.value)}
                    className="border rounded px-3 py-2 w-1/2"
                  />
                  <button onClick={addAttributeRow} className="bg-green-600 text-white px-3 rounded">+</button>
                  {attributes.length > 1 && (
                    <button onClick={() => removeAttributeRow(index)} className="bg-red-600 text-white px-3 rounded">−</button>
                  )}
                </div>
              ))}
              {/* </div> */}

              {/* CATEGORIES */}
              <div className="relative">
                <label className="font-medium">Categories</label>
                <div
                  onClick={() => setShowCategories(!showCategories)}
                  className="border rounded-lg px-3 py-2 cursor-pointer flex justify-between"
                >
                  {form.categories.length ? `${form.categories.length} selected` : 'Select Categories'}
                  <span>▾</span>
                </div>

                {showCategories && (
                  <div className="absolute z-10 bg-white border rounded shadow max-h-48 overflow-y-auto w-full mt-1">
                    {categories.map(c => (
                      <label key={c._id} className="flex gap-2 px-3 py-2 hover:bg-gray-100">
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

              {/* GI REGIONS */}
              <div className="relative">
                <label className="font-medium">GI Regions</label>
                <div
                  onClick={() => setShowRegions(!showRegions)}
                  className="border rounded-lg px-3 py-2 cursor-pointer flex justify-between"
                >
                  {form.giRegions.length ? `${form.giRegions.length} selected` : 'Select GI Regions'}
                  <span>▾</span>
                </div>

                {showRegions && (
                  <div className="absolute z-10 bg-white border rounded shadow max-h-48 overflow-y-auto w-full mt-1">
                    {regions.map(r => (
                      <label key={r._id} className="flex gap-2 px-3 py-2 hover:bg-gray-100">
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

            {/* RIGHT – MEDIA */}
            <div className="space-y-4">

              <label htmlFor='descriptionLabel'>Description</label>
              <textarea
                id='descriptionLabel'
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 resize-none"
              />

              <h2 className="font-semibold text-lg">Product Media</h2>
              {/* Upload / Preview Box */}
              <div
                onClick={() => {
                  if (form.images.length > 0) {
                    setShowImageModal(true);
                  } else {
                    document.getElementById('product-image-input')?.click();
                  }
                }}
                className="relative border-2 border-dashed rounded-xl h-72 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100"
              >
                {/* EMPTY STATE */}
                {form.images.length === 0 && (
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Upload Images</p>
                    <p className="text-sm">PNG, JPG supported</p>
                  </div>
                )}

                {/* STACKED IMAGES */}
                {form.images.length > 0 && (
                  <div className="relative w-40 h-40">
                    {form.images.slice(0, 3).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="absolute w-40 h-40 object-cover rounded-lg border shadow"
                        style={{
                          top: index * 6,
                          left: index * 6,
                          zIndex: 10 - index,
                        }}
                      />
                    ))}

                    {form.images.length > 3 && (
                      <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                        +{form.images.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                id="product-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const res = await uploadProductImage(e.target.files[0]);
                  setForm(prev => ({
                    ...prev,
                    images: [...prev.images, res.data.url],
                  }));
                }}
              />
            </div>

          </div>

          {/* IMAGE MODAL */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Product Images</h2>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() =>
                          setForm(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => document.getElementById('product-image-input')?.click()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    Upload More
                  </button>

                  <button
                    onClick={() => setShowImageModal(false)}
                    className="border px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save */}
          <div className="flex justify-center pt-4">
            <button
              onClick={save}
              className="bg-indigo-600 text-white px-20 py-2 rounded-lg"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>

        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Product List</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Title</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{p.title}</td>
                  <td className="border p-2 text-center">₹{p.price}</td>
                  <td className="border p-2 text-center">{p.stock}</td>
                  <td className="border p-2 text-center">
                    {getCategoryNames(p.categories)}
                  </td>
                  <td className="border p-2 text-center">
                    <button onClick={() => edit(p)} className="text-blue-600 mr-3">Edit</button>
                    <button onClick={() => remove(p._id)} className="text-red-600">Delete</button>
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

