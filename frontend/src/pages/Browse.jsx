import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import PlantCard from '../components/PlantCard';
import { useLang } from '../context/LanguageContext';

// value = DB value used for filtering, key = translation key for display label
const TYPES = [
  { value: 'All',            key: 'typeAll' },
  { value: 'Seedling',       key: 'typeSeedling' },
  { value: 'Grafted',        key: 'typeGrafted' },
  { value: 'Hybrid',         key: 'typeHybrid' },
  { value: 'Open Pollinated',key: 'typeOpenPollinated' },
  { value: 'Other',          key: 'typeOther' },
];

export default function Browse() {
  const { t } = useLang();
  const [apiPlants, setApiPlants] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [typeFilter, setType]     = useState('All');
  const [maxPrice, setMaxPrice]   = useState('');

  // Fetch from API (best-effort — static plants always show)
  const fetchPlants = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/plants');
      setApiPlants(Array.isArray(data) ? data : []);
    } catch { setApiPlants([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchPlants, 300);
    return () => clearTimeout(timer);
  }, [fetchPlants]);

  // Apply filters — only DB plants from MongoDB
  const plants = apiPlants
    .filter((p) => {
      const price = p.price ?? 0;
      const matchSearch   = !search     || p.name.toLowerCase().includes(search.toLowerCase());
      const matchType     = typeFilter === 'All' || p.type === typeFilter;
      const matchMaxPrice = !maxPrice   || price <= Number(maxPrice);
      return matchSearch && matchType && matchMaxPrice;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const clearFilters = () => { setSearch(''); setType('All'); setMaxPrice(''); };
  const hasFilters   = search || typeFilter !== 'All' || maxPrice;

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{t('browseTitle')}</h1>
          <p className="text-muted">
            {loading ? t('loading') : `${plants.length} ${t('varietiesAvailable')}`}
          </p>
        </div>

        <div className="browse-filters">
          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '0.9rem' }}>🔍</span>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.5rem' : '1rem' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >✕</button>
            )}
          </div>

          {/* Type filter chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {TYPES.map((tp) => (
              <button key={tp.value} onClick={() => setType(tp.value)}
                style={{
                  padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.82rem',
                  fontWeight: 600, fontFamily: 'var(--font-display)', cursor: 'pointer',
                  background: typeFilter === tp.value ? 'rgba(64,145,108,0.2)' : 'var(--surface)',
                  border: `1px solid ${typeFilter === tp.value ? 'var(--green-400)' : 'var(--border-2)'}`,
                  color: typeFilter === tp.value ? 'var(--green-200)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                {t(tp.key)}
              </button>
            ))}
          </div>

          {/* Max budget + clear */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                position: 'absolute', left: '0.8rem', fontSize: '0.85rem',
                color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none',
              }}>₹</span>
              <input
                type="number"
                placeholder={t('maxPrice')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ paddingLeft: '1.8rem', maxWidth: 200 }}
                min={0}
              />
            </div>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>{t('clear')}</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : plants.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">{hasFilters ? '🔍' : '🌱'}</div>
            <h3>{hasFilters ? t('noPlantsFound') : 'No plants available yet'}</h3>
            <p>{hasFilters ? t('tryAdjusting') : 'The admin hasn\'t added any plants yet. Check back soon!'}</p>
            {hasFilters && (
              <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={clearFilters}>
                {t('clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid-4">
            {plants.map((p) => <PlantCard key={p._id} plant={p} />)}
          </div>
        )}
      </div>

      <style>{`
        .browse-filters {
          display: flex; flex-direction: column; gap: 1rem;
          margin-bottom: 2rem; background: var(--bg-2);
          border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem;
        }
      `}</style>
    </div>
  );
}
