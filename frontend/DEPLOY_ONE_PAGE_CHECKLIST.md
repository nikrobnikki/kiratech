# KIRATECH — ONE-PAGE DEPLOY CHECKLIST

## 1) GitHub repo
- Repo must contain:
  - backend/
  - frontend/
  - render.yaml
- Do not connect Render to an empty repo or wrong repo.

## 2) Create PlanetScale database
- Database name: kiratech_db
- Get values:
  - DB_HOST
  - DB_USER
  - DB_PASSWORD

## 3) Backend on Render
- New -> Web Service
- Name: kiratech-backend
- Root Directory: backend
- Runtime: Node
- Build Command: npm install
- Start Command: npm start

Environment variables:
```env
NODE_ENV=production
PORT=10000

DB_HOST=your_planetscale_host
DB_PORT=3306
DB_NAME=kiratech_db
DB_USER=your_planetscale_user
DB_PASSWORD=your_planetscale_password

JWT_SECRET=generate_a_random_64_char_hex_string
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.onrender.com

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=robertcharles088@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=KIRATECH IT Support <robertcharles088@gmail.com>

ADMIN_EMAIL=robertcharles088@gmail.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Robert Charles (KIRATECH Admin)

STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_CURRENCY=usd

MPESA_TZ_BUSINESS_NUMBER=+255714759884
MPESA_TZ_ACCOUNT_REF=KIRATECH
AIRTEL_MERCHANT_NUMBER=+255784759884
TIGO_BILLER_MSISDN=+255652759884
MTN_MERCHANT_NUMBER=+255714759884

BINANCE_MERCHANT_ID=your_binance_merchant_id
USDT_BEP20_ADDRESS=your_bep20_wallet_address
USDT_TRC20_ADDRESS=your_trc20_wallet_address
USDT_ERC20_ADDRESS=your_erc20_wallet_address
```

## 4) Deploy backend and seed database
- Wait for backend deploy to finish
- Shell command:
```bash
npm install && NODE_ENV=production node scripts/seed.js
```

## 5) Frontend on Render
- New -> Static Site
- Name: kiratech-frontend
- Root Directory: frontend
- Build Command: npm install && npm run build
- Publish Directory: dist

Environment variable:
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 6) Update backend after frontend is live
- Go to backend service -> Environment
- Set:
```env
CLIENT_URL=https://your-frontend.onrender.com
```

## 7) Verify
- Backend health:
```text
https://your-backend.onrender.com/api/health
```
- Expected:
```json
{"status":"OK"}
```

## 8) Final checks
- Render repo points to correct GitHub repo
- Root directory is exactly backend for backend service
- Root directory is exactly frontend for frontend service
- DB_HOST is PlanetScale host, not localhost
- Frontend uses backend URL in VITE_API_URL
- Backend uses frontend URL in CLIENT_URL
- Database is seeded
