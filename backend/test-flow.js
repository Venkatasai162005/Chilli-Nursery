/**
 * Full end-to-end pipeline test
 * Admin login → Add plant → Farmer sees it → Farmer orders → Admin sees order → Admin updates status
 */
const http = require('http');

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({
      hostname: 'localhost', port: 5000, path, method,
      headers: {
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
    }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => resolve({ s: res.statusCode, d: JSON.parse(d) }));
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

function postMultipart(path, fields, token) {
  return new Promise((resolve, reject) => {
    const boundary = 'FormBoundary' + Date.now();
    const parts = Object.entries(fields).map(([k, v]) =>
      `--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`
    ).join('') + `--${boundary}--\r\n`;
    const buf = Buffer.from(parts, 'utf8');
    const r = http.request({
      hostname: 'localhost', port: 5000, path, method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': buf.length,
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
    }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => resolve({ s: res.statusCode, d: JSON.parse(d) }));
    });
    r.on('error', reject);
    r.write(buf);
    r.end();
  });
}

(async () => {
  console.log('\n====================================================');
  console.log('  Sri Devi Chilli Nursery — Full Pipeline Test');
  console.log('====================================================\n');

  // STEP 1: Admin Login
  const login = await req('POST', '/api/auth/login', { email: 'dvsaii16@gmail.com', password: 'sai162005' });
  const token = login.d.token;
  console.log('STEP 1 — Admin Login      :', login.s === 200 ? '✅ OK' : '❌ FAIL', '| Email:', login.d.email);

  // STEP 2: Admin Adds Plant
  const p = await postMultipart('/api/plants', {
    name: 'Jwala Chilli Plant', type: 'Seedling',
    description: 'Popular pungent variety', price: '20', stock: '1000', hidden: 'false',
  }, token);
  const plantId = p.d._id;
  console.log('STEP 2 — Admin Add Plant  :', p.s === 201 ? '✅ OK' : '❌ FAIL (' + p.s + ')', '| Name:', p.d.name, '| Stock:', p.d.stock);

  // STEP 3: Farmer Sees Plant (public)
  const plants = await req('GET', '/api/plants');
  const found = plants.d.find(x => x._id === plantId);
  console.log('STEP 3 — Farmer Sees Plant:', plants.s === 200 && found ? '✅ OK' : '❌ FAIL', '|', plants.d.length, 'plant(s) visible |', found ? found.name + ' @ Rs' + found.price : 'not found');

  // STEP 4: Farmer Places Order
  const order = await req('POST', '/api/orders', {
    farmerName: 'Raju Naidu', phone: '9876543210',
    address: 'Guntur, AP', deliveryType: 'pickup',
    items: [{ plantId, qty: 50 }],
  });
  console.log('STEP 4 — Farmer Order     :', order.s === 201 ? '✅ OK' : '❌ FAIL', '| Order ID:', order.d.orderId, '| Total: Rs', order.d.total);

  // STEP 5: Stock Auto-Deducted
  const chk = await req('GET', '/api/plants/' + plantId);
  const stockOk = chk.d.stock === 950;
  console.log('STEP 5 — Stock Deducted   :', stockOk ? '✅ OK' : '❌ FAIL', '| Stock:', 1000, '→', chk.d.stock, '(ordered 50)');

  // STEP 6: Admin Sees Order
  const orders = await req('GET', '/api/orders', null, token);
  const foundOrder = orders.d.find(o => o.orderId === order.d.orderId);
  console.log('STEP 6 — Admin Sees Order :', orders.s === 200 && foundOrder ? '✅ OK' : '❌ FAIL', '|', orders.d.length, 'order(s) | Latest:', orders.d[0]?.orderId, '[' + orders.d[0]?.status + ']');

  // STEP 7: Admin Updates Status
  const upd = await req('PUT', '/api/orders/' + order.d._id + '/status', { status: 'Confirmed' }, token);
  console.log('STEP 7 — Status Update    :', upd.s === 200 ? '✅ OK' : '❌ FAIL', '| Status: Pending →', upd.d.status);

  // CLEANUP
  await req('DELETE', '/api/plants/' + plantId, null, token);
  console.log('\n🗑  Test plant cleaned up from DB');

  const allOk = login.s === 200 && p.s === 201 && found && order.s === 201 && stockOk && foundOrder && upd.s === 200;
  console.log('\n====================================================');
  console.log(allOk
    ? '🎉 ALL 7 STEPS PASSED — Full flow is working!'
    : '⚠️  Some steps failed — check above');
  console.log('====================================================\n');
})().catch(err => { console.error('Test error:', err.message); });
