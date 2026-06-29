import { useLang } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLang();
  const PHONE    = '+91 74163 37364';
  const WHATSAPP = '917416337364';
  const ADDRESS  = 'Sri Devi Chilli Nursery, Martur Mandal, Prakasam District, Andhra Pradesh 523301';
  const MAP_LINK = 'https://maps.app.goo.gl/y3H6zETvHzMQADy28';
  // Embed using exact lat/lng from the shared link
  const MAP_SRC  = 'https://www.google.com/maps?q=15.942055,80.142542&z=17&output=embed';

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div className="contact-header animate-fade-up">
          <h1 className="contact-title">{t('contactTitle')}</h1>
          <p className="text-muted">{t('contactSub')}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-cards-col">
            {/* Phone */}
            <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="contact-card animate-fade-up">
              <div className="contact-card-icon" style={{ background: 'rgba(64,145,108,0.12)', color: 'var(--green-400)' }}>📞</div>
              <div className="contact-card-body">
                <div className="contact-card-label">{t('callUs')}</div>
                <div className="contact-card-value">{PHONE}</div>
                <div className="contact-card-sub">{t('tapToCall')}</div>
              </div>
            </a>

            {/* WhatsApp */}
            <a href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20want%20to%20enquire%20about%20chilli%20plants.`}
              target="_blank" rel="noreferrer"
              className="contact-card animate-fade-up"
              style={{ animationDelay: '0.07s' }}>
              <div className="contact-card-icon" style={{ background: 'rgba(37,211,102,0.12)', color: '#25d366' }}>💬</div>
              <div className="contact-card-body">
                <div className="contact-card-label">{t('whatsapp')}</div>
                <div className="contact-card-value">{PHONE}</div>
                <div className="contact-card-sub">{t('whatsappMsg')}</div>
              </div>
            </a>

            {/* Address */}
            <div className="contact-card animate-fade-up" style={{ animationDelay: '0.14s', cursor: 'default' }}>
              <div className="contact-card-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>📍</div>
              <div className="contact-card-body">
                <div className="contact-card-label">{t('location')}</div>
                <div className="contact-card-value" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{ADDRESS}</div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="contact-map-wrap animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="contact-map-title">{t('findOnMap')}</h3>
            <iframe src={MAP_SRC} className="contact-map" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Nursery Location" />
            <a href={MAP_LINK} target="_blank" rel="noreferrer"
              className="btn btn-outline btn-sm contact-map-link">
              {t('openInMaps')}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .contact-header { margin-bottom:2.5rem; }
        .contact-title { font-size:clamp(1.6rem,5vw,2.2rem); font-weight:800; margin-bottom:.4rem; }
        .contact-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:2rem; align-items:start; }
        .contact-cards-col { display:flex; flex-direction:column; gap:1rem; }
        .contact-card { display:flex; align-items:flex-start; gap:1rem; background:var(--bg-2);
          border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.25rem;
          text-decoration:none; color:inherit; transition:border-color .2s,transform .2s,box-shadow .2s; }
        .contact-card:hover { border-color:var(--green-500); transform:translateY(-2px); box-shadow:var(--shadow-glow); }
        .contact-card-icon { font-size:1.5rem; width:48px; height:48px; min-width:48px;
          border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .contact-card-body { flex:1; min-width:0; }
        .contact-card-label { font-size:.72rem; text-transform:uppercase; letter-spacing:.07em;
          color:var(--text-muted); font-weight:700; margin-bottom:.25rem; }
        .contact-card-value { font-weight:700; font-size:.95rem; color:var(--text-primary); word-break:break-word; }
        .contact-card-sub { font-size:.78rem; color:var(--text-muted); margin-top:.15rem; }
        .contact-map-wrap { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; }
        .contact-map-title { font-size:1.05rem; font-weight:700; margin-bottom:1rem; }
        .contact-map { width:100%; height:320px; border-radius:var(--radius-md); border:none; display:block; }
        .contact-map-link { margin-top:.75rem; display:inline-flex; }
        @media(max-width:900px){ .contact-grid{ grid-template-columns:1fr; } }
        @media(max-width:600px){ .contact-grid{ gap:1.25rem; } .contact-card{ padding:1rem; gap:.85rem; }
          .contact-card-icon{ width:42px; height:42px; min-width:42px; font-size:1.3rem; }
          .contact-card-value{ font-size:.88rem; } .contact-map{ height:240px; } .contact-map-wrap{ padding:1rem; } }
      `}</style>
    </div>
  );
}
