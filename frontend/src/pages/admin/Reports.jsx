import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import api from '../../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { labels: { color: '#a7c4ae', font: { family: 'Outfit', size: 12 } } } },
  scales: {
    x: { ticks: { color: '#6a8f72' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#6a8f72' }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [range, setRange]   = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter orders by range
  const now = new Date();
  const filtered = orders.filter((o) => {
    const d = new Date(o.createdAt);
    if (range === 'week')  return (now - d) <= 7  * 86400000;
    if (range === 'month') return (now - d) <= 30 * 86400000;
    return true;
  });

  const totalRevenue = filtered.reduce((s, o) => s + (o.status !== 'Pending' ? o.total : 0), 0);
  const totalOrders  = filtered.length;
  const delivered    = filtered.filter((o) => o.status === 'Delivered').length;

  // Daily revenue bar chart (last 7 or 30 days)
  const days = range === 'week' ? 7 : 30;
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  });
  const dailyRevenue = labels.map((label, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (days - 1 - i));
    const dStr = d.toDateString();
    return filtered
      .filter((o) => new Date(o.createdAt).toDateString() === dStr && o.status !== 'Pending')
      .reduce((s, o) => s + o.total, 0);
  });

  // Top plants
  const plantMap = {};
  filtered.forEach((o) => o.items.forEach((i) => {
    if (!plantMap[i.plantName]) plantMap[i.plantName] = 0;
    plantMap[i.plantName] += i.qty;
  }));
  const topPlants = Object.entries(plantMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const barData = {
    labels,
    datasets: [{ label: 'Revenue (₹)', data: dailyRevenue,
      backgroundColor: 'rgba(64,145,108,0.6)', borderColor: 'rgba(64,145,108,1)', borderWidth: 1, borderRadius: 4 }],
  };
  const pieData = topPlants.length > 0 ? {
    labels: topPlants.map(([n]) => n),
    datasets: [{ data: topPlants.map(([, q]) => q),
      backgroundColor: ['rgba(64,145,108,0.7)','rgba(230,57,70,0.7)','rgba(244,162,97,0.7)','rgba(59,130,246,0.7)','rgba(168,85,247,0.7)','rgba(245,158,11,0.7)'] }],
  } : null;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("Bava's Chilli Nursery — Sales Report", 14, 20);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : 'All Time'}`, 14, 30);
    doc.text(`Total Orders: ${totalOrders}`, 14, 40);
    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString('en-IN')}`, 14, 48);
    doc.text(`Delivered: ${delivered}`, 14, 56);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Top Plants', 14, 70);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    topPlants.forEach(([name, qty], i) => doc.text(`${i + 1}. ${name} — ${qty} plants`, 14, 80 + i * 8));
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Order List', 14, 80 + topPlants.length * 8 + 10);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    filtered.slice(0, 30).forEach((o, i) => {
      const y = 90 + topPlants.length * 8 + i * 7;
      if (y > 280) return;
      doc.text(`${o.orderId}  ${o.farmerName}  ₹${o.total}  ${o.status}  ${new Date(o.createdAt).toLocaleDateString('en-IN')}`, 14, y);
    });
    doc.save(`nursery-report-${range}.pdf`);
  };

  const exportExcel = () => {
    const rows = filtered.map((o) => ({
      'Order ID': o.orderId, 'Farmer': o.farmerName, 'Phone': o.phone,
      'Address': o.address, 'Type': o.deliveryType,
      'Items': o.items.map((i) => `${i.plantName}×${i.qty}`).join(', '),
      'Total (₹)': o.total, 'Status': o.status,
      'Date': new Date(o.createdAt).toLocaleDateString('en-IN'),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `nursery-orders-${range}.xlsx`);
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>📊 Reports</h1>
            <p className="text-muted">Sales analytics and order export</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={range} onChange={(e) => setRange(e.target.value)} style={{ minWidth: 150 }}>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button className="btn btn-ghost btn-sm" onClick={exportPDF}>📄 Export PDF</button>
            <button className="btn btn-primary btn-sm" onClick={exportExcel}>📊 Export Excel</button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value" style={{ fontSize: '1.6rem' }}>₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-card orange">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{totalOrders}</span>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-card blue">
            <span className="stat-label">Delivered</span>
            <span className="stat-value">{delivered}</span>
            <span className="stat-icon">✅</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
          <div className="card-elevated" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Daily Revenue</h3>
            <Bar data={barData} options={{ ...CHART_OPTS, plugins: { ...CHART_OPTS.plugins, legend: { display: false } } }} />
          </div>
          <div className="card-elevated" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Top Plants by Quantity</h3>
            {pieData ? (
              <Pie data={pieData} options={{ responsive: true, plugins: { legend: { labels: { color: '#a7c4ae', font: { family: 'Outfit' } } } } }} />
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}><p>No order data yet</p></div>
            )}
          </div>
        </div>

        {/* Orders table */}
        <div className="card-elevated" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order List ({filtered.length})</h3>
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="emoji">📭</div><h3>No orders in this period</h3></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Order ID</th><th>Farmer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 700 }}>{o.orderId}</td>
                      <td>{o.farmerName}</td>
                      <td>{o.items.map((i) => `${i.plantName}×${i.qty}`).join(', ')}</td>
                      <td style={{ color: 'var(--green-300)', fontWeight: 700 }}>₹{o.total}</td>
                      <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
