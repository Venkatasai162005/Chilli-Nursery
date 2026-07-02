# 🌶️ Chilli Nursery — Full-Stack Web App

A complete nursery management system with a **public farmer shop** and a **private admin dashboard**.

---

## 🚀 Quick Setup (First Time)

### Step 1 — MongoDB Atlas (Free Database)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Sign up free
2. Create a new **Free Cluster**
3. Click **Connect** → **Drivers** → Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### Step 2 — Cloudinary (Free Photo Storage)
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free
2. Your **Cloud Name**, **API Key**, and **API Secret** are on the Dashboard

### Step 3 — Fill in Backend `.env`
Open `backend/.env` and fill in your values:
```
MONGO_URI=mongodb+srv://your_user:your_pass@cluster0.xxxxx.mongodb.net/chilli-nursery
JWT_SECRET=any_long_random_string_here
ADMIN_EMAIL=bava@nursery.com
ADMIN_PASSWORD=your_password_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Step 4 — Create Admin Account (Run Once)
```bash
cd backend
npm run seed
```

### Step 5 — Start the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 📱 Using the App

### Farmer (Public)
- Visit `http://localhost:5173`
- Browse plants, search, filter
- Add to cart → fill name & address → place order
- Get an **Order ID** — use it to track status at `/track`

### Admin (me)
- Go to `http://localhost:5173/admin/login`
- Login with credentials from your `.env` file
- **Dashboard** — see today's orders, revenue, low-stock alerts
- **Plants** — add/edit/delete plant listings with photos
- **Orders** — view all orders, update status (Pending → Confirmed → Ready → Delivered)
- **Reports** — weekly/monthly charts, export PDF or Excel

---

## 🗂️ Project Structure

```
nursery/
├── frontend/           # React + Vite
│   ├── src/
│   │   ├── pages/      # Home, Browse, PlantDetail, Cart, Confirmation, Contact, TrackOrder
│   │   │   └── admin/  # Login, Dashboard, ManagePlants, ViewOrders, Reports
│   │   ├── components/ # Navbar, PlantCard
│   │   ├── context/    # CartContext, AuthContext
│   │   └── api.js      # Axios instance
│   └── .env
│
└── backend/            # Node.js + Express
    ├── models/         # Plant, Order, Admin (Mongoose)
    ├── routes/         # auth.js, plants.js, orders.js
    ├── middleware/     # adminAuth.js (JWT)
    ├── server.js
    ├── seed.js         # Creates admin account
    └── .env
```

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Vanilla CSS (dark mode design) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Images | Cloudinary |
| Charts | Chart.js |
| Export | jsPDF + SheetJS (xlsx) |

---

## 📦 Order Status Flow
```
Pending → Confirmed → Ready → Delivered
```
Farmers can track their order status using their Order ID at `/track`.
