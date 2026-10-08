# JAR Solutions — QR Code Generator SaaS v2.0

End-to-end, fully dynamic QR code SaaS. White premium theme, wine-red branding,
multi-language, multi-gateway, admin-controlled everything.

**Backend:** Django 4 + DRF + SQLite | **Frontend:** Next.js 14 + Tailwind + Framer Motion
**Payments:** Razorpay + Direct UPI (switchable in admin)

---

## QUICK START (Windows)

Double-click: **install.bat**  (creates venv, installs, migrates, seeds, runs server)

Then in a second terminal:
```
cd frontend
install-frontend.bat
```

Or manually:

### Backend
```
cd backend
python -m venv venv
venv\Scripts\activate          (Windows)  |  source venv/bin/activate  (Linux/Mac)
pip install -r requirements.txt
copy .env.example .env         (add your Razorpay keys)
python manage.py migrate
python manage.py seed_defaults
python manage.py createsuperuser
python manage.py runserver     http://localhost:8000
```

### Frontend
```
cd frontend
npm install
copy .env.example .env.local   (set NEXT_PUBLIC_API_URL=http://localhost:8000)
npm run dev                    http://localhost:3000
```

Open **http://localhost:3000**

---

## Docker (any server)

```
docker-compose up --build
```

---

## Admin Panel (/admin — login with superuser)

- Overview: users, revenue, pending payments
- Users: Make Pro / back to Guest (one click)
- Payments: view all, approve UPI payments
- QR Codes: every QR by every user
- Languages: add languages, set default, translate UI texts
- Gateways: enable/disable, edit config, set default
- Plans: create plans, edit prices, toggle popular — no code!
- Settings: site name, upload logo, theme colors, guest limit

Django admin also at /jar-admin/

## Payment Gateways (backend-managed)
- Razorpay: cards/UPI/netbanking (keys in .env + admin config)
- UPI Direct: admin sets UPI ID; customer scans + submits ref -> admin approves -> auto Pro
- Add more by creating a gateway row in admin

## Languages
English (default), Tamil, Hindi seeded. Add more in admin and translate keys.
Users switch in navbar; choice saves to their profile.

## QR Features (matched with top QR sites)
Logo embed inside QR (EC-H), 11 QR types, custom colors, size, border,
error-correction levels, scan counter, high-res PNG download.

## Deploy anywhere (no lock-in)
Frontend -> Vercel/Netlify (free). Backend -> Railway/Render/VPS + gunicorn.
SQLite included; swap to PostgreSQL later by changing one setting.

(c) 2026 JAR Solutions - Built on Faith
