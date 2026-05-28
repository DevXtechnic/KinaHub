import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Save } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { API, formatPrice } from '../lib/products';
import type { CategoryType, ProductType } from '../lib/products';
import { useTranslation } from '../i18n/LocaleContext';
import { categoryName } from '../lib/categoryText';

interface ProductFormState {
  name: string;
  category_id: string;
  description: string;
  price: string;
  discount_price: string;
  stock: string;
  primary_image_url: string;
}

const initialForm: ProductFormState = {
  name: '',
  category_id: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '1',
  primary_image_url: '',
};

export default function SellerProducts() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [error, setError] = useState('');

  function loadProducts() {
    apiRequest<ProductType[]>('/products/items/?mine=true', { token })
      .then(setProducts)
      .catch(() => setError(t('seller.couldNotLoad', { defaultValue: 'Could not load seller data' })));
  }

  useEffect(() => {
    loadProducts();
    fetch(`${API}/categories/`)
      .then((response) => response.json())
      .then(setCategories)
      .catch(() => {});
  }, [token]);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await apiRequest<ProductType>('/products/items/', {
        token,
        method: 'POST',
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          price: Number(form.price),
          discount_price: form.discount_price ? Number(form.discount_price) : null,
          stock: Number(form.stock),
          is_active: true,
          is_featured: false,
          rating: 0,
        }),
      });
      setForm(initialForm);
      loadProducts();
    } catch (err) {
      setError(t('seller.couldNotCreate', { defaultValue: 'Could not create product' }));
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h1 className="text-2xl font-black tracking-tight">{t('seller.title', { defaultValue: 'Product management' })}</h1>
        <p className="mt-2 text-secondary">{t('seller.copy', { defaultValue: 'Create products, track stock, and keep your catalog ready for checkout.' })}</p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Plus className="h-5 w-5 text-accent" />
          {t('seller.addProduct', { defaultValue: 'Add product' })}
        </h2>
        {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={createProduct} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" placeholder={t('seller.productName', { defaultValue: 'Product name' })} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
            <option value="">{t('seller.category', { defaultValue: 'Category' })}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{categoryName(t, category.slug, category.name)}</option>)}
          </select>
          <input className="rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" placeholder={t('seller.price', { defaultValue: 'Price' })} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" placeholder={t('seller.discountPrice', { defaultValue: 'Discount price' })} type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
          <input className="rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" placeholder={t('seller.stock', { defaultValue: 'Stock' })} type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <input className="rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" placeholder={t('seller.imageUrl', { defaultValue: 'Image URL' })} value={form.primary_image_url} onChange={(e) => setForm({ ...form, primary_image_url: e.target.value })} />
          <textarea className="md:col-span-2 rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:border-accent" placeholder={t('seller.description', { defaultValue: 'Description' })} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-bold text-background md:w-fit">
            <Save className="h-4 w-4" />
            {t('seller.saveProduct', { defaultValue: 'Save product' })}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h2 className="text-lg font-bold">{t('seller.catalog', { defaultValue: 'Catalog' })}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">{t('seller.product', { defaultValue: 'Product' })}</th>
                <th className="py-2">{t('seller.category', { defaultValue: 'Category' })}</th>
                <th className="py-2">{t('seller.price', { defaultValue: 'Price' })}</th>
                <th className="py-2">{t('seller.stock', { defaultValue: 'Stock' })}</th>
                <th className="py-2">{t('seller.status', { defaultValue: 'Status' })}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{product.name}</td>
                  <td className="py-3">{categoryName(t, product.category.slug, product.category.name)}</td>
                  <td className="py-3">{formatPrice(product.discount_price || product.price)}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">{product.is_active ? t('seller.active', { defaultValue: 'Active' }) : t('seller.inactive', { defaultValue: 'Inactive' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
