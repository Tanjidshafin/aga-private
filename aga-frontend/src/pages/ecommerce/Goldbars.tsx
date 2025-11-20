import React, { useEffect, useMemo, useState } from 'react';

const accent = '#d4af37';
const subtleGray = '#f5f7fb';

interface Product {
  _id: string;
  name: string;
  description?: string;
  brand?: string;
  manufacturer?: string;
  price: number;
  stock: number;
  weight?: string;
  purity?: string;
  placement?: string;
  image?: string;
}

interface FiltersResponse {
  categories: { name: string; subcategories: string[] }[];
  minPrice: number;
  maxPrice: number;
  minStock: number;
  maxStock: number;
  minWeight: number;
  maxWeight: number;
  purity: string[];
  brands: string[];
  manufacturers: string[];
  placements: string[];
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

const pillStyles: React.CSSProperties = {
  background: subtleGray,
  color: '#1d1d1d',
  padding: '8px 12px',
  borderRadius: 999,
  border: `1px solid ${accent}`,
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
};

const cardStyles: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 16,
  border: `1px solid ${accent}22`,
  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
  padding: 16,
  display: 'flex',
  gap: 16,
  flexDirection: 'column',
};

const rangeLabel = (label: string, value: number | string, extra?: string) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 12, color: '#4b5563' }}>
    <span>{label}</span>
    <span style={{ color: '#111827', fontWeight: 600 }}>{value}{extra ? ` ${extra}` : ''}</span>
  </div>
);

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <h3 style={{ margin: 0, color: '#111827', fontSize: 16, fontWeight: 700 }}>{title}</h3>
    {description ? (
      <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>{description}</p>
    ) : null}
  </div>
);

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }>= ({ title, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
    {children}
  </div>
);

const Goldbars: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtersMeta, setFiltersMeta] = useState<FiltersResponse | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    stockStatus: '',
    brand: [] as string[],
    manufacturer: [] as string[],
    purity: [] as string[],
    placement: [] as string[],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
  });

  const buildQueryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value !== '' && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });
    return params.toString();
  }, [query]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/goldCatalogs?${buildQueryString}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch gold catalog');
      setProducts(data.products || []);
      setPagination(data.pagination);
      setFiltersMeta(data.filters);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildQueryString]);

  const handleCheckbox = (group: 'brand' | 'manufacturer' | 'purity' | 'placement', value: string) => {
    setQuery((prev) => {
      const set = new Set(prev[group]);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      return { ...prev, [group]: Array.from(set), page: 1 };
    });
  };

  const updateField = (key: keyof typeof query, value: any) => {
    setQuery((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const heroStyles: React.CSSProperties = {
    background: '#ffffff',
    border: `1px solid ${accent}33`,
    borderRadius: 16,
    padding: 24,
    display: 'grid',
    gridTemplateColumns: '1.5fr 2fr',
    gap: 20,
    alignItems: 'center',
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '28px 36px', color: '#0f172a' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1280, margin: '0 auto' }}>
        <div style={heroStyles}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={pillStyles}>Exclusive Precious Metals</div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#0f172a' }}>Premium Gold Bars & Coins</h1>
            <p style={{ margin: 0, color: '#475467', lineHeight: 1.6 }}>
              Discover investment-grade bullion crafted with precision. Compare purity, weight, and availability in real time with intelligent filters and elegant product cards.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ ...pillStyles, background: '#fff', borderColor: accent }}>Assayed & Certified</div>
              <div style={{ ...pillStyles, background: '#fff', borderColor: accent }}>Fully Insured Shipping</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={cardStyles}>
              <SectionTitle title="Smart Search" description="Find by name, brand, or description" />
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  placeholder="Search gold bars or coins"
                  value={query.search}
                  onChange={(e) => updateField('search', e.target.value)}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    border: `1px solid ${accent}55`,
                    padding: '10px 12px',
                    background: subtleGray,
                    outline: 'none',
                    fontSize: 14,
                  }}
                />
                <select
                  value={query.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  style={{
                    minWidth: 140,
                    borderRadius: 12,
                    border: `1px solid ${accent}55`,
                    padding: '10px 12px',
                    background: '#fff',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                >
                  <option value="all">All categories</option>
                  <option value="bars">Gold Bars</option>
                  <option value="coins">Gold Coins</option>
                </select>
              </div>
            </div>
            <div style={cardStyles}>
              <SectionTitle title="Sorting" description="Reorder by priority" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <select
                  value={query.sortBy}
                  onChange={(e) => updateField('sortBy', e.target.value)}
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${accent}55`,
                    padding: '10px 12px',
                    background: '#fff',
                    outline: 'none',
                  }}
                >
                  <option value="createdAt">Newest</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="weight">Weight</option>
                  <option value="name">Name</option>
                  <option value="popularity">Popularity</option>
                </select>
                <select
                  value={query.sortOrder}
                  onChange={(e) => updateField('sortOrder', e.target.value)}
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${accent}55`,
                    padding: '10px 12px',
                    background: '#fff',
                    outline: 'none',
                  }}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <select
                value={query.stockStatus}
                onChange={(e) => updateField('stockStatus', e.target.value)}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${accent}55`,
                  padding: '10px 12px',
                  background: '#fff',
                  outline: 'none',
                  width: '100%',
                }}
              >
                <option value="">Any availability</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="low-stock">Low Stock (&lt;=10)</option>
                <option value="high-stock">Bulk Available (&gt;50)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ ...cardStyles, position: 'sticky', top: 24, gap: 16 }}>
            <SectionTitle title="Precision Filters" description="Refine purity, weight, or brand" />

            <FilterGroup title="Price (USD)">
              {rangeLabel('Range', `${query.minPrice || filtersMeta?.minPrice || 0} - ${query.maxPrice || filtersMeta?.maxPrice || '∞'}`)}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  type="number"
                  placeholder={`Min ${filtersMeta?.minPrice ?? ''}`}
                  value={query.minPrice}
                  onChange={(e) => updateField('minPrice', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 12, border: `1px solid ${accent}33`, background: subtleGray }}
                />
                <input
                  type="number"
                  placeholder={`Max ${filtersMeta?.maxPrice ?? ''}`}
                  value={query.maxPrice}
                  onChange={(e) => updateField('maxPrice', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 12, border: `1px solid ${accent}33`, background: subtleGray }}
                />
              </div>
            </FilterGroup>

            <FilterGroup title="Stock">
              {rangeLabel('Units', `${query.minStock || filtersMeta?.minStock || 0} - ${query.maxStock || filtersMeta?.maxStock || '∞'}`)}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  type="number"
                  placeholder={`Min ${filtersMeta?.minStock ?? ''}`}
                  value={query.minStock}
                  onChange={(e) => updateField('minStock', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 12, border: `1px solid ${accent}33`, background: subtleGray }}
                />
                <input
                  type="number"
                  placeholder={`Max ${filtersMeta?.maxStock ?? ''}`}
                  value={query.maxStock}
                  onChange={(e) => updateField('maxStock', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 12, border: `1px solid ${accent}33`, background: subtleGray }}
                />
              </div>
            </FilterGroup>

            {filtersMeta?.purity?.length ? (
              <FilterGroup title="Purity">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {filtersMeta.purity.map((p) => (
                    <label key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: subtleGray, padding: '6px 10px', borderRadius: 10, border: `1px solid ${accent}33` }}>
                      <input
                        type="checkbox"
                        checked={query.purity.includes(p)}
                        onChange={() => handleCheckbox('purity', p)}
                      />
                      <span style={{ fontWeight: 600 }}>{p}</span>
                    </label>
                  ))}
                </div>
              </FilterGroup>
            ) : null}

            {filtersMeta?.brands?.length ? (
              <FilterGroup title="Brands">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filtersMeta.brands.map((b) => (
                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, border: `1px solid ${accent}22`, background: '#fff' }}>
                      <input type="checkbox" checked={query.brand.includes(b)} onChange={() => handleCheckbox('brand', b)} />
                      <span style={{ fontWeight: 600 }}>{b}</span>
                    </label>
                  ))}
                </div>
              </FilterGroup>
            ) : null}

            {filtersMeta?.manufacturers?.length ? (
              <FilterGroup title="Manufacturers">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filtersMeta.manufacturers.map((m) => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, border: `1px solid ${accent}22`, background: '#fff' }}>
                      <input type="checkbox" checked={query.manufacturer.includes(m)} onChange={() => handleCheckbox('manufacturer', m)} />
                      <span style={{ fontWeight: 600 }}>{m}</span>
                    </label>
                  ))}
                </div>
              </FilterGroup>
            ) : null}

            {filtersMeta?.placements?.length ? (
              <FilterGroup title="Placement">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {filtersMeta.placements.map((p) => (
                    <label key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', padding: '6px 10px', borderRadius: 10, border: `1px solid ${accent}22` }}>
                      <input type="checkbox" checked={query.placement.includes(p)} onChange={() => handleCheckbox('placement', p)} />
                      <span style={{ fontWeight: 600 }}>{p}</span>
                    </label>
                  ))}
                </div>
              </FilterGroup>
            ) : null}

            <button
              onClick={() => setQuery({
                search: '',
                category: 'all',
                minPrice: '',
                maxPrice: '',
                minStock: '',
                maxStock: '',
                stockStatus: '',
                brand: [],
                manufacturer: [],
                purity: [],
                placement: [],
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page: 1,
              })}
              style={{
                marginTop: 4,
                width: '100%',
                background: '#fff',
                color: '#111827',
                border: `1px solid ${accent}`,
                borderRadius: 12,
                padding: '12px 14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset filters
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={pillStyles}>{products.length} results</div>
                {pagination ? (
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>
                    Page {pagination.page} of {pagination.pages} • Total {pagination.total}
                  </span>
                ) : null}
              </div>
              <button
                onClick={fetchProducts}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${accent}`,
                  background: accent,
                  color: '#111827',
                  padding: '10px 14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(212, 175, 55, 0.25)',
                }}
              >
                Refresh catalog
              </button>
            </div>

            {loading ? (
              <div style={{ ...cardStyles, alignItems: 'center' }}>Loading premium bullion...</div>
            ) : error ? (
              <div style={{ ...cardStyles, color: '#b91c1c', background: '#fef2f2', borderColor: '#fecaca' }}>{error}</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {products.map((product) => (
                  <div key={product._id} style={{ ...cardStyles, height: '100%', border: `1px solid ${accent}55` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ ...pillStyles, padding: '6px 10px', borderColor: accent }}>{product.purity || 'Assayed'}</div>
                      <span style={{ color: '#6b7280', fontSize: 12 }}>{product.weight || 'N/A'}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{product.name}</div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>{product.description || 'Investment-grade gold bullion with exceptional finish.'}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', color: '#4b5563', fontSize: 13 }}>
                      {product.brand ? <span style={{ ...pillStyles, background: '#fff', padding: '6px 10px' }}>{product.brand}</span> : null}
                      {product.manufacturer ? <span style={{ ...pillStyles, background: '#fff', padding: '6px 10px' }}>{product.manufacturer}</span> : null}
                      {product.placement ? <span style={{ ...pillStyles, background: '#fff', padding: '6px 10px' }}>{product.placement}</span> : null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Price</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>${product.price.toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Stock</div>
                        <div style={{ fontWeight: 700, color: product.stock > 0 ? '#16a34a' : '#b91c1c' }}>
                          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        width: '100%',
                        borderRadius: 12,
                        border: `1px solid ${accent}`,
                        background: '#fff',
                        color: '#111827',
                        padding: '12px 14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      View details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pagination && pagination.pages > 1 ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
                <button
                  disabled={pagination.page === 1}
                  onClick={() => updateField('page', Math.max(1, pagination.page - 1))}
                  style={{
                    ...pillStyles,
                    background: '#fff',
                    opacity: pagination.page === 1 ? 0.5 : 1,
                    cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <span style={{ fontWeight: 700 }}>Page {pagination.page} of {pagination.pages}</span>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => updateField('page', Math.min(pagination.pages, pagination.page + 1))}
                  style={{
                    ...pillStyles,
                    background: '#fff',
                    opacity: pagination.page === pagination.pages ? 0.5 : 1,
                    cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goldbars;

