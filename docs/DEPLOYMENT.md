# QuickKart Deployment Guide

This project is ready for GitHub and Render deployment.

Render Blueprint syntax is based on the official Render Blueprint docs: https://render.com/docs/blueprint-spec

## 1. Push to GitHub

From the `quickkart` folder:

```bash
git init
git add .
git commit -m "Initial QuickKart production-ready MERN app"
git branch -M main
git remote add origin https://github.com/<your-username>/quickkart.git
git push -u origin main
```

GitHub Actions will run automatically on pushes and pull requests using `.github/workflows/ci.yml`.

The CI checks:

- root dependency install
- server/client/admin/delivery dependency install
- frontend production builds
- backend JavaScript syntax

## 2. Create MongoDB Atlas Database

1. Go to MongoDB Atlas.
2. Create a free cluster.
3. Create a database user.
4. Add your IP or allow `0.0.0.0/0` for Render access.
5. Copy the connection string.
6. Use database name `quickkart`.

Example:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/quickkart?retryWrites=true&w=majority
```

Use this as `MONGO_URI` in Render.

## 3. Deploy With Render Blueprint

1. Push the repo to GitHub.
2. Open Render.
3. Choose New > Blueprint.
4. Connect the GitHub repo.
5. Render will detect `render.yaml`.
6. Fill the `sync: false` environment variables.

Services created:

- `quickkart-api`: Node/Express backend
- `quickkart-client`: Customer static site
- `quickkart-admin`: Admin static site
- `quickkart-delivery`: Delivery static site

## 4. Render Environment Values

Backend service `quickkart-api`:

```text
NODE_ENV=production
MONGO_URI=<MongoDB Atlas URI>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://quickkart-client.onrender.com
ADMIN_URL=https://quickkart-admin.onrender.com
DELIVERY_URL=https://quickkart-delivery.onrender.com
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
RAZORPAY_KEY_ID=<optional>
RAZORPAY_KEY_SECRET=<optional>
GOOGLE_MAPS_API_KEY=<optional>
```

Customer static site:

```text
VITE_API_URL=https://quickkart-api.onrender.com/api
VITE_SOCKET_URL=https://quickkart-api.onrender.com
VITE_GOOGLE_MAPS_API_KEY=<optional>
```

Admin static site:

```text
VITE_API_URL=https://quickkart-api.onrender.com/api
VITE_SOCKET_URL=https://quickkart-api.onrender.com
```

Delivery static site:

```text
VITE_API_URL=https://quickkart-api.onrender.com/api
VITE_SOCKET_URL=https://quickkart-api.onrender.com
```

## 5. Seed Production Data

Render does not automatically run seed scripts. Run seed locally against Atlas:

```bash
cd quickkart
$env:MONGO_URI="<your MongoDB Atlas URI>"
npm.cmd run seed --prefix server
```

On macOS/Linux:

```bash
MONGO_URI="<your MongoDB Atlas URI>" npm run seed --prefix server
```

## 6. Docker Local Deployment

Copy env:

```bash
copy server\.env.example server\.env
```

Start MongoDB, Mongo Express, and API:

```bash
docker compose up -d --build
```

Open:

- API: `http://localhost:5000/health`
- Mongo Express: `http://localhost:8081`

Mongo Express login:

- Username: `admin`
- Password: `quickkart`

Build frontend Docker images from repository root:

```bash
docker build -f client/Dockerfile -t quickkart-client .
docker build -f admin-panel/Dockerfile -t quickkart-admin .
docker build -f delivery-app/Dockerfile -t quickkart-delivery .
```

## 7. Production Checklist

- Replace demo `JWT_SECRET`.
- Use MongoDB Atlas, not local MongoDB.
- Add real Cloudinary credentials before enabling production image uploads.
- Add real Razorpay keys before accepting online payments.
- Restrict CORS origins to deployed frontend URLs.
- Seed only demo-safe data on public deployments.
- Set strong MongoDB Atlas database user password.
- Keep `.env` files out of GitHub.
