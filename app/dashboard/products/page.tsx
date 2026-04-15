'use client';

import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getSellerProducts } from '@/lib/products';
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
  const [role, setRole] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [variantOptions, setVariantOptions] = useState([
    { name: '', options: [''] }
  ]);

  const [variants, setVariants] = useState<any[]>([]);

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
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    load(storedRole);
  }, []);

  const load = async (roleParam?: string | null) => {
    const roleValue = roleParam ?? role;

    let productResponse;

    if (roleValue === 'ADMIN') {
      productResponse = await getProducts();
    } else {
      productResponse = await getSellerProducts();
    }

    const [c, r] = await Promise.all([
      getCategories(),
      getRegions(),
    ]);

    setProducts(productResponse.data);
    setCategories(c.data);
    setRegions(r.data);
  };

  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!hasVariants) {
      if (!form.price || Number(form.price) <= 0) return false;
      if (!form.stock || Number(form.stock) < 0) return false;
    }

    if (hasVariants) {
      if (variants.length === 0) return false;

      for (const v of variants) {
        if (!v.price || v.price <= 0) return false;
        if (v.stock < 0) return false;
      }
    }
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
      title: form.title,
      slug: form.title.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      discountPercentage: Number(form.discountPercentage),
      images: form.images,
      categories: form.categories,
      giRegions: form.giRegions,
      status: form.status,

      attributes: attributes.reduce((acc, item) => {
        if (item.key && item.value) acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>),

      variantOptions: hasVariants ? variantOptions : [],

      variants: hasVariants
        ? variants.map(v => ({
          values: v.values,
          price: Number(v.price),
          stock: Number(v.stock),
        }))
        : [
          {
            values: ['default'],
            price: Number(form.price),
            stock: Number(form.stock),
          }
        ],
    };
    console.log('Payload:', payload);
    try{
    editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
    }catch(e){
      alert('Failed to save the product!!');
    }
    reset();
    setShowModel(false);
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
    setHasVariants(false);
    setVariantOptions([{ name: '', options: [''] }]);
    setVariants([]);
  };

  const edit = (p: any) => {
    setEditingId(p._id);

    const hasVar = p.variantOptions && p.variantOptions.length > 0;
    setHasVariants(hasVar);

    setVariantOptions(
      hasVar
        ? p.variantOptions
        : [{ name: '', options: [''] }]
    );

    setVariants(
      hasVar
        ? p.variants.map((v: any) => ({
          values: v.values,
          price: v.price,
          stock: v.stock,
        }))
        : []
    );

    setForm({
      title: p.title,
      price: String(p.variants?.[0]?.price ?? ''),
      stock: String(p.variants?.[0]?.stock ?? ''),
      description: p.description,
      discountPercentage: p.discountPercentage
        ? String(p.discountPercentage)
        : '',
      images: p.images || [],
      categories: p.categories || [],
      giRegions: p.giRegions || [],
      status: p.status || 'active',
    });
    const attrs =
      p.attributes && Object.keys(p.attributes).length > 0
        ? Object.entries(p.attributes).map(([key, value]) => ({
          key,
          value: value as string,
        }))
        : [{ key: '', value: '' }];

    setAttributes(attrs);
    setShowModel(true);
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
    return categories.map(c => c.name).join(', ')
  };

  const getLeafCategories = () => {
    return categories.filter(cat => {
      return !categories.some(c => c.parentId === cat._id);
    });
  };

  const toggleStatus = async (product: any) => {

    if (product.approveStatus === 'PENDING') {
      alert('This product is not approved yet!!');
      return;
    }
    const newStatus = product.status === 'active' ? 'inactive' : 'active';

    const newApproveStatus =
      newStatus === 'active' ? 'APPROVED' : 'REJECTED';

    setProducts(prev =>
      prev.map(p =>
        p._id === product._id
          ? { ...p, status: newStatus, approveStatus: newApproveStatus }
          : p
      )
    );

    try {
      await updateProduct(product._id, {
        status: newStatus,
        approveStatus: newApproveStatus,
      });
    } catch (err) {
      setProducts(prev =>
        prev.map(p =>
          p._id === product._id ? product : p
        )
      );

      alert('Failed to update status');
    }
  };

  const generateCombinations = (options: { name: string; options: string[] }[]): string[][] => {
    if (!options.length) return [];

    return options.reduce((acc: string[][], option: any) => {
      const result: string[][] = [];

      acc.forEach((a: string[]) => {
        option.options.forEach((opt: string) => {
          if (opt.trim()) {
            result.push([...a, opt]);
          }
        });
      });

      return result;
    }, [[]] as string[][]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
          </div>
          {
            role === 'SELLER' && (
              <button
                onClick={() => {
                  reset();
                  setShowModel(true);
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
              >
                + Add Product
              </button>
            )
          }
        </div>

        {/* FORM */}
        {showModel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-gray-50 w-full max-w-5xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">

              {/* Close */}
              <button
                onClick={() => setShowModel(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>

              {/* FORM CARD */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="grid md:grid-cols-3 gap-6">

                  {/* LEFT */}
                  <div className="md:col-span-2 space-y-4">

                    {/* TITLE */}
                    <div>
                      <label className="font-medium block mb-1">Product Title</label>
                      <input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="font-medium">Has Variants?</label>
                      <input
                        type="checkbox"
                        checked={hasVariants}
                        onChange={(e) => setHasVariants(e.target.checked)}
                      />
                    </div>

                    {/* PRICE + STOCK */}
                    {!hasVariants && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-medium block mb-1">Price</label>
                          <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="font-medium block mb-1">Stock</label>
                          <input
                            type="number"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>
                    )}

                    {hasVariants && (
                      <div className="border rounded-xl p-4 bg-gray-50">
                        <h3 className="font-semibold mb-3 text-lg">Variant Builder</h3>

                        {/* STEP 1: Variant Types */}
                        <p className="text-sm text-gray-500 mb-2">
                          Step 1: Add variant types (Size, Color, Weight)
                        </p>

                        {variantOptions.map((vo, i) => (
                          <div key={i} className="mb-3 border p-3 rounded bg-white">
                            <input
                              placeholder="Variant Type (e.g. Size)"
                              value={vo.name}
                              className="border px-2 py-1 mb-2 w-full"
                              onChange={(e) => {
                                const copy = [...variantOptions];
                                copy[i].name = e.target.value;
                                setVariantOptions(copy);
                              }}
                            />

                            {vo.options.map((opt, j) => (
                              <input
                                key={j}
                                placeholder="Option (e.g. M)"
                                value={opt}
                                className="border px-2 py-1 mb-1 w-full"
                                onChange={(e) => {
                                  const copy = [...variantOptions];
                                  copy[i].options[j] = e.target.value;
                                  setVariantOptions(copy);
                                }}
                              />
                            ))}

                            <button
                              className="text-blue-600 text-sm"
                              onClick={() => {
                                const copy = [...variantOptions];
                                copy[i].options.push('');
                                setVariantOptions(copy);
                              }}
                            >
                              + Add Option
                            </button>
                          </div>
                        ))}

                        <button
                          className="text-indigo-600 mb-4"
                          onClick={() =>
                            setVariantOptions([...variantOptions, { name: '', options: [''] }])
                          }
                        >
                          + Add Variant Type
                        </button>

                        {/* STEP 2: GENERATE */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">
                            Step 2: Generate combinations
                          </p>

                          <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                            onClick={() => {
                              const combinations = generateCombinations(variantOptions);

                              setVariants(
                                combinations.map((c: string[]) => ({
                                  values: c,
                                  price: '',
                                  stock: '',
                                }))
                              );
                            }}
                          >
                            Generate Variants
                          </button>
                        </div>

                        {/* STEP 3: PRICE/STOCK */}
                        {variants.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">
                              Step 3: Set price & stock
                            </p>

                            {variants.map((v, i) => (
                              <div key={i} className="flex gap-3 mb-2 items-center">
                                <span className="w-40 font-medium">
                                  {variantOptions.map((vo, index) => `${vo.name}: ${v.values[index]}`).join(' | ')}
                                  {/* {v.values.join(' / ')} */}
                                </span>

                                <input
                                  type="number"
                                  placeholder="Price"
                                  className="border px-2 py-1"
                                  onChange={(e) => {
                                    const copy = [...variants];
                                    copy[i].price = Number(e.target.value);
                                    setVariants(copy);
                                  }}
                                />

                                <input
                                  type="number"
                                  placeholder="Stock"
                                  className="border px-2 py-1"
                                  onChange={(e) => {
                                    const copy = [...variants];
                                    copy[i].stock = Number(e.target.value);
                                    setVariants(copy);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* DISCOUNT */}
                    <div>
                      <label className="font-medium block mb-1">Discount Percentage</label>
                      <input
                        type="number"
                        value={form.discountPercentage}
                        onChange={e => setForm({ ...form, discountPercentage: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    {/* ATTRIBUTES */}
                    <div>
                      <label className="font-medium block mb-1">Attributes</label>

                      {attributes.map((attr, index) => (
                        <div key={index} className="flex gap-2 mb-2">
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
                          <button className="bg-green-600 text-white px-3 rounded" onClick={addAttributeRow}>+</button>
                          {attributes.length > 1 && (
                            <button className="bg-red-600 text-white px-3 rounded" onClick={() => removeAttributeRow(index)}>−</button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CATEGORY */}
                    <div className="relative">
                      <label className="font-medium block mb-1">Categories</label>

                      <div
                        onClick={() => setShowCategories(!showCategories)}
                        className="border rounded-lg px-3 py-2 cursor-pointer flex justify-between"
                      >
                        {form.categories.length
                          ? `${form.categories.length} selected`
                          : 'Select Categories'}
                        <span>▾</span>
                      </div>

                      {showCategories && (
                        <div className="absolute z-10 bg-white border rounded shadow max-h-30 overflow-y-auto w-full mt-1">
                          {getLeafCategories().map(c => (
                            <label key={c._id} className="flex gap-2 px-3 py-2 hover:bg-gray-100">
                              <input
                                type="checkbox"
                                checked={form.categories.includes(String(c._id))}
                                onChange={() =>
                                  setForm({
                                    ...form,
                                    categories: form.categories.includes(String(c._id))
                                      ? form.categories.filter(id => id !== String(c._id))
                                      : [...form.categories, String(c._id)],
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
                      <label className="font-medium block mb-1">GI Regions</label>

                      <div
                        onClick={() => setShowRegions(!showRegions)}
                        className="border rounded-lg px-3 py-2 cursor-pointer flex justify-between"
                      >
                        {form.giRegions.length
                          ? `${form.giRegions.length} selected`
                          : 'Select GI Regions'}
                        <span>▾</span>
                      </div>

                      {showRegions && (
                        <div className="absolute z-10 bg-white border rounded shadow max-h-30 overflow-y-auto w-full mt-1">
                          {regions.map(r => (
                            <label key={r._id} className="flex gap-2 px-3 py-2 hover:bg-gray-100">
                              <input
                                type="checkbox"
                                checked={form.giRegions.includes(String(r._id))}
                                onChange={() =>
                                  setForm({
                                    ...form,
                                    giRegions: form.giRegions.includes(String(r._id))
                                      ? form.giRegions.filter(id => id !== String(r._id))
                                      : [...form.giRegions, String(r._id)],
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

                  {/* RIGHT */}
                  <div className="space-y-4">

                    <div>
                      <label className="font-medium block mb-1">Description</label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 resize-none"
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Product Media</h3>

                      <div
                        onClick={() => document.getElementById('product-image-input')?.click()}
                        className="relative border-2 border-dashed rounded-xl h-56 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                      >
                        {!form.images.length && (
                          <div className="text-center text-gray-500">
                            <p className="font-medium">Upload Images</p>
                            <p className="text-sm">PNG, JPG supported</p>
                          </div>
                        )}

                        {form.images.length > 0 && (
                          <img
                            src={form.images[0]}
                            className="absolute w-40 h-40 object-cover rounded-lg border shadow"
                          />
                        )}
                      </div>

                      <input
                        id="product-image-input"
                        type="file"
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
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={save}
                    className="bg-indigo-600 text-white px-20 py-2 rounded-lg"
                  >
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Product List</h2>
          <div className='overflow-x-auto no-scrollbar'>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Approve Status</th>
                  {
                    role === 'ADMIN' && (
                      <th className="border p-2">Status</th>
                    )
                  }
                  {
                    role === 'SELLER' && (
                      <th className="border p-2">Actions</th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="border p-2 whitespace-nowrap">{index + 1}</td>
                    <td className="border p-2 whitespace-nowrap">{p.title}</td>
                    <td className="border p-2 whitespace-nowrap">₹{p.variants?.[0]?.price}</td>
                    <td className="border p-2 whitespace-nowrap">{p.variants?.[0]?.stock}</td>
                    <td className="border p-2 whitespace-nowrap">
                      {getCategoryNames(p.categories)}
                    </td>
                    <td className="border p-2 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${p.approveStatus === 'APPROVED'
                          ? 'bg-green-600'
                          : p.approveStatus === 'PENDING'
                            ? 'bg-yellow-500'
                            : 'bg-red-600'
                          }`}
                      >{p.approveStatus}</span>
                    </td>
                    {
                      role === 'ADMIN' && (
                        <td className="border p-2 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div
                              onClick={() => toggleStatus(p)}
                              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${p.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            >
                              <div
                                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${p.status === 'active' ? 'translate-x-7' : 'translate-x-0'
                                  }`}
                              />
                            </div>
                          </div>
                        </td>
                      )
                    }
                    {
                      role === 'SELLER' && (
                        <td className="border p-2 text-center whitespace-nowrap">
                          <button onClick={() => edit(p)} className="text-blue-600 mr-3">Edit</button>
                          <button onClick={() => remove(p._id)} className="text-red-600">Delete</button>
                        </td>
                      )
                    }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}

