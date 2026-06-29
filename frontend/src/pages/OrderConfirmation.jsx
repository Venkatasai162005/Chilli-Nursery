import { useLocation, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;
  const printRef = useRef();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!order) {
    return (
      <div className="page-wrapper">
        <div className="loading-center">
          <h2>No order found</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
        </div>
      </div>
    );
  }

  const statusSteps = ['Pending', 'Confirmed', 'Ready', 'Delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div className="confirm-wrapper animate-scale-in" ref={printRef}>
          {/* Success header */}
          <div className="confirm-header">
            <div className="confirm-checkmark">✓</div>
            <h1>Order Placed!</h1>
            <p>Your plants will be ready for {order.deliveryType === 'pickup' ? 'pickup' : 'delivery'} soon.</p>
          </div>

          {/* Order ID */}
          <div className="confirm-id-box">
            <span className="confirm-id-label">Your Order ID</span>
            <span className="confirm-id">{order.orderId}</span>
            <span className="confirm-id-note">Save this ID to track your order</span>
          </div>

          {/* Status timeline */}
          <div className="confirm-section">
            <h3>Order Status</h3>
            <div className="status-timeline">
              {statusSteps.map((s, i) => (
                <div key={s} className={`timeline-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}>
                  <div className="timeline-dot">{i <= currentStep ? '✓' : i + 1}</div>
                  <span>{s}</span>
                  {i < statusSteps.length - 1 && <div className={`timeline-line ${i < currentStep ? 'done' : ''}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="confirm-section">
            <h3>Farmer Details</h3>
            <div className="confirm-details">
              <div><span>Name</span><strong>{order.farmerName}</strong></div>
              <div><span>Phone</span><strong>{order.phone}</strong></div>
              <div><span>Address</span><strong>{order.address}</strong></div>
              <div><span>Type</span><strong style={{ textTransform: 'capitalize' }}>{order.deliveryType}</strong></div>
            </div>
          </div>

          {/* Items */}
          <div className="confirm-section">
            <h3>Items Ordered</h3>
            {order.items.map((item, i) => (
              <div key={i} className="confirm-item">
                <span>{item.plantName}</span>
                <span>{item.qty} × ₹{item.priceEach}</span>
                <strong style={{ color: 'var(--green-300)' }}>₹{item.qty * item.priceEach}</strong>
              </div>
            ))}
            <div className="divider" />
            <div className="confirm-total">
              <span>Total Amount</span>
              <strong>₹{order.total}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="confirm-actions">
            <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ Print / Screenshot</button>
            <Link to="/track" className="btn btn-outline">📦 Track Order</Link>
            <Link to="/browse" className="btn btn-primary">🌶️ Order More Plants</Link>
          </div>
        </div>
      </div>

      <style>{`
        .confirm-wrapper {
          max-width: 640px; margin: 0 auto;
          background: var(--bg-2); border: 1px solid var(--border-2);
          border-radius: var(--radius-xl); overflow: hidden;
        }
        .confirm-header {
          background: linear-gradient(135deg, var(--green-800), var(--green-700));
          padding: 3rem 2rem; text-align: center;
          border-bottom: 1px solid var(--green-600);
        }
        .confirm-checkmark {
          width: 70px; height: 70px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 3px solid rgba(255,255,255,0.4);
          font-size: 2rem; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem; color: white; font-weight: 700;
        }
        .confirm-header h1 { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 0.4rem; }
        .confirm-header p { color: var(--green-100); font-size: 0.95rem; }
        .confirm-id-box {
          display: flex; flex-direction: column; align-items: center;
          padding: 1.5rem; background: var(--bg-3);
          border-bottom: 1px solid var(--border);
          text-align: center;
        }
        .confirm-id-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.4rem; }
        .confirm-id { font-size: 2rem; font-weight: 900; color: var(--green-300); font-family: var(--font-display); letter-spacing: 0.05em; }
        .confirm-id-note { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem; }
        .confirm-section { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); }
        .confirm-section h3 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 700; margin-bottom: 1rem; }
        .confirm-details { display: flex; flex-direction: column; gap: 0.5rem; }
        .confirm-details div { display: flex; gap: 1rem; font-size: 0.9rem; }
        .confirm-details span { color: var(--text-muted); min-width: 70px; }
        .confirm-item { display: flex; gap: 1rem; align-items: center; padding: 0.5rem 0; font-size: 0.9rem; }
        .confirm-item span:first-child { flex: 1; color: var(--text-secondary); }
        .confirm-item span:nth-child(2) { color: var(--text-muted); }
        .confirm-total { display: flex; justify-content: space-between; font-size: 1.05rem; }
        .confirm-total strong { color: var(--green-300); font-size: 1.2rem; }
        .confirm-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; padding: 1.5rem 2rem; }
        .confirm-actions .btn { flex: 1; min-width: 130px; justify-content: center; }

        .status-timeline { display: flex; align-items: flex-start; gap: 0; }
        .timeline-step {
          display: flex; flex-direction: column; align-items: center;
          flex: 1; gap: 0.4rem; position: relative; font-size: 0.78rem;
          color: var(--text-muted); text-align: center;
        }
        .timeline-step.done { color: var(--green-300); }
        .timeline-step.current { color: var(--text-primary); }
        .timeline-dot {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--bg-3); border: 2px solid var(--border-2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; z-index: 1;
        }
        .timeline-step.done .timeline-dot { background: var(--green-600); border-color: var(--green-400); color: white; }
        .timeline-step.current .timeline-dot { border-color: var(--green-400); color: var(--green-300); box-shadow: 0 0 0 3px rgba(64,145,108,0.2); }
        .timeline-line {
          position: absolute; top: 16px; left: calc(50% + 16px);
          width: calc(100% - 32px); height: 2px;
          background: var(--border-2);
        }
        .timeline-line.done { background: var(--green-500); }

        @media print {
          .navbar, .confirm-actions { display: none !important; }
          .confirm-wrapper { border: 1px solid #ccc; }
          body { background: white; color: black; }
        }
      `}</style>
    </div>
  );
}
