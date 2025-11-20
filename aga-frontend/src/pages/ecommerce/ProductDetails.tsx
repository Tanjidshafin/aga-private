import React, { useMemo, useState } from 'react';

const accent = '#d4af37';
const navy = '#0f172a';
const softGray = '#f8fafc';
const slate = '#475467';

const product = {
  name: 'Regal Heritage 24K Gold Bar',
  tagline: 'Investment-grade bullion crafted for discerning collectors',
  description:
    'Handcrafted to exacting standards with mirror-finish luster and laser-etched security markings. Comes in tamper-evident packaging and certified by an independent assayer for purity assurance.',
  price: 62450,
  currency: 'USD',
  rating: 4.9,
  reviews: 182,
  stock: 14,
  status: 'Ready to ship',
  sku: 'RG-24K-HERITAGE',
  purity: '999.9',
  weight: '250 g',
  dimensions: '80mm x 35mm x 5mm',
  mintedAt: 'Swiss National Mint',
  insured: true,
  warranty: 'Lifetime authenticity guarantee',
  dispatch: 'Ships in 1-2 business days',
  returnPolicy: '15-day secure buyback',
  highlights: [
    'Individually serialized and assay-certified',
    'Secure vault-ready packaging with tamper seal',
    'Ultra-low premium for high-volume buyers',
  ],
  images: [
    'https://images.unsplash.com/photo-1636041241541-2ee391bf4f4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80',
  ],
  assurances: [
    { label: 'Assay Certified', detail: 'LBMA accredited refiners', icon: '🛡️' },
    { label: 'Insured Shipping', detail: 'Fully tracked & discreet', icon: '🚚' },
    { label: 'Vault Friendly', detail: 'Serialized for audits', icon: '🏛️' },
  ],
  specs: [
    { label: 'Purity', value: '24K (99.99%)' },
    { label: 'Weight', value: '250 grams' },
    { label: 'Finish', value: 'Mirror polish with reeded edges' },
    { label: 'Certification', value: 'Swiss National Assay Office' },
    { label: 'Serial', value: '#AUR-88423' },
    { label: 'Packaging', value: 'Tamper-proof assay card' },
  ],
};

const badgeStyles: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 999,
  background: `${accent}14`,
  color: navy,
  fontWeight: 700,
  fontSize: 12,
  border: `1px solid ${accent}44`,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
};

const cardStyles: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 20,
  padding: 20,
  border: `1px solid ${accent}1f`,
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
};

const ProductDetails: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const formattedPrice = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price),
    []
  );

  const availabilityTone = useMemo(() => {
    if (product.stock > 20) return '#10b981';
    if (product.stock > 8) return '#f59e0b';
    return '#ef4444';
  }, []);

  const handlePincodeCheck = () => {
    if (!pincode.trim()) {
      setDeliveryMessage('Enter a destination PIN to estimate secure delivery.');
      return;
    }
    setDeliveryMessage(`Secure courier delivery to ${pincode} within 3-5 business days.`);
  };

  return (
    <div style={{ background: softGray, minHeight: '100vh', padding: '32px 24px' }}>
      <style>{`
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: 1fr; }
          .split-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .thumbnails { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .meta-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: slate, fontSize: 14 }}>
          <span>Home</span>
          <span style={{ color: accent }}>•</span>
          <span>Precious Metals</span>
          <span style={{ color: accent }}>•</span>
          <strong style={{ color: navy }}>{product.name}</strong>
        </div>

        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: 20 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ ...cardStyles, padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 0.1fr', gap: 12 }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `1px solid ${accent}33`,
                    background: '#fff',
                  }}
                >
                  <img
                    src={selectedImage}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 14,
                      left: 14,
                      padding: '10px 14px',
                      background: '#ffffffd9',
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      color: navy,
                      border: `1px solid ${accent}55`,
                      boxShadow: '0 10px 35px rgba(0,0,0,0.12)',
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: accent, display: 'inline-block' }} />
                    <span style={{ fontWeight: 700 }}>{product.status}</span>
                  </div>
                </div>

                <div className="thumbnails" style={{ display: 'grid', gap: 10, gridTemplateRows: 'repeat(3, 1fr)' }}>
                  {product.images.map((img) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        border: selectedImage === img ? `2px solid ${accent}` : `1px solid ${accent}33`,
                        borderRadius: 12,
                        overflow: 'hidden',
                        padding: 0,
                        background: '#fff',
                        boxShadow: selectedImage === img ? `0 10px 28px ${accent}33` : 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={img} alt="Gold bar angle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[{ label: 'Purity', value: `${product.purity}‰` }, { label: 'Weight', value: product.weight }, { label: 'Stock', value: `${product.stock} pieces` }].map((item) => (
                <div key={item.label} style={{ ...cardStyles, padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, color: slate, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: navy }}>{item.value}</span>
                  <div style={{ height: 5, background: softGray, borderRadius: 999 }}>
                    <div
                      style={{
                        width: item.label === 'Stock' ? `${Math.min(100, product.stock * 6)}%` : '100%',
                        background: accent,
                        borderRadius: 999,
                        height: '100%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyles, display: 'grid', gap: 14 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <div style={badgeStyles}>SKU • {product.sku}</div>
                <div style={{ ...badgeStyles, background: '#fff', borderColor: accent }}>Minted • {product.mintedAt}</div>
                {product.insured && <div style={{ ...badgeStyles, color: '#14532d', borderColor: '#16a34a55', background: '#dcfce7' }}>Insured Transit</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {product.assurances.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderRadius: 14,
                      padding: 14,
                      border: `1px dashed ${accent}77`,
                      background: `${accent}0d`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      color: navy,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <strong style={{ fontSize: 15 }}>{item.label}</strong>
                    <span style={{ color: slate, fontSize: 13 }}>{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ ...cardStyles, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ ...badgeStyles, background: '#fff' }}>Premium Grade</div>
                <div style={{ color: slate, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  ⭐ {product.rating}
                  <span style={{ fontWeight: 500, color: '#94a3b8' }}>({product.reviews} reviews)</span>
                </div>
              </div>

              <h1 style={{ margin: 0, fontSize: 32, color: navy }}>{product.name}</h1>
              <p style={{ margin: 0, color: slate, lineHeight: 1.6 }}>{product.tagline}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 34, fontWeight: 900, color: navy }}>{formattedPrice}</span>
                <span style={{ color: slate }}>Inclusive of certification & authentication</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: availabilityTone }} />
                  <span style={{ color: slate }}>{product.status}</span>
                </div>
                <div style={{ color: slate }}>Dispatch: {product.dispatch}</div>
                <div style={{ color: slate }}>Purity certified by {product.mintedAt}</div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  style={{
                    background: navy,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 18px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.24)',
                  }}
                >
                  Add to Vault
                </button>
                <button
                  style={{
                    background: accent,
                    color: navy,
                    border: `1px solid ${accent}55`,
                    borderRadius: 12,
                    padding: '12px 18px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: `0 12px 34px ${accent}55`,
                  }}
                >
                  Buy Securely
                </button>
                <button
                  style={{
                    background: '#fff',
                    color: navy,
                    border: `1px solid ${accent}55`,
                    borderRadius: 12,
                    padding: '12px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Talk to Advisor
                </button>
              </div>

              <div style={{ background: '#fdf6e3', borderRadius: 14, padding: 12, border: `1px solid ${accent}55` }}>
                <strong style={{ color: navy }}>Buyback Promise:</strong>{' '}
                <span style={{ color: slate }}>{product.returnPolicy} with transparent pricing.</span>
              </div>
            </div>

            <div style={{ ...cardStyles, display: 'grid', gap: 12 }}>
              <h3 style={{ margin: 0, color: navy }}>Delivery Estimator</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter destination PIN"
                  style={{
                    flex: 1,
                    minWidth: 180,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1px solid ${accent}55`,
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <button
                  onClick={handlePincodeCheck}
                  style={{
                    background: accent,
                    color: navy,
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 18px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Check
                </button>
              </div>
              {deliveryMessage && <div style={{ color: slate }}>{deliveryMessage}</div>}
            </div>

            <div style={{ ...cardStyles, display: 'grid', gap: 16 }}>
              <h3 style={{ margin: 0, color: navy }}>Product Story</h3>
              <p style={{ margin: 0, color: slate, lineHeight: 1.6 }}>{product.description}</p>
              <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {product.highlights.map((item) => (
                  <div
                    key={item}
                    style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: 12,
                      border: `1px solid ${accent}44`,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ color: accent, fontWeight: 900 }}>✺</span>
                    <span style={{ color: slate }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...cardStyles, display: 'grid', gap: 12 }}>
              <h3 style={{ margin: 0, color: navy }}>Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    style={{
                      background: softGray,
                      borderRadius: 12,
                      padding: 12,
                      border: `1px solid ${accent}22`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 12, color: slate, textTransform: 'uppercase', letterSpacing: 0.5 }}>{spec.label}</span>
                    <strong style={{ color: navy }}>{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
