# QuickKart Functionality

## Customer App

Customers can:

- Register and log in
- Browse categories and products
- Search products with debounce
- View product details
- Add products to cart
- Persist cart state locally
- Apply coupon code `QUICK50`
- Checkout with COD or Razorpay-ready flow
- Open Razorpay checkout when Razorpay keys are configured
- View order history
- Track order status in real time
- View Google Maps tracking when a Maps key is configured
- View rider live location events when delivery partner shares location

## Admin Dashboard

Admins can:

- Log in with admin role
- View analytics cards for users, products, stores, orders, and revenue
- See recent orders
- Moderate users with ban/unban
- View product inventory
- Receive real-time new order notifications through Socket.io

## Delivery Partner App

Delivery partners can:

- Log in with delivery partner role
- View assigned deliveries
- Mark orders as picked up
- Mark orders as delivered
- Send live location updates from browser geolocation
- View earnings value from delivery partner profile

## Backend API

The backend provides:

- JWT authentication
- Role-based authorization
- Product and category APIs
- Cart APIs
- Coupon application
- Order placement
- Order status updates
- Delivery assignment structure
- Razorpay order creation and payment signature verification
- Cloudinary image upload endpoint for product images
- Delivery location update endpoint
- Admin analytics and user management
- Socket.io events for live updates

## Real-Time Events

Socket rooms:

- `user:<userId>`
- `order:<orderId>`

Client events:

- `user:join`
- `order:join`
- `delivery:location`
- `support:message`

Server events:

- `order:update`
- `delivery:location`
- `inventory:update`
- `admin:order`
- `support:message`

## Main Database Collections

- `users`: customers, admins, store owners, riders
- `products`: catalog and inventory
- `categories`: grocery categories
- `stores`: hyperlocal store details with geolocation
- `carts`: customer cart items and coupon
- `orders`: checkout, payment, delivery status, timeline
- `coupons`: discount rules
- `reviews`: product reviews
- `notifications`: user notifications
- `deliverypartners`: rider profile, location, earnings

## Resume Talking Points

- Built a modular MERN quick-commerce app with three role-specific frontends.
- Designed REST API using route-controller-service-model architecture.
- Implemented JWT auth, RBAC, Socket.io live tracking, Razorpay-ready payments, and inventory management.
- Added production hygiene with Docker, Render Blueprint, GitHub Actions CI, env examples, API docs, and seed data.
- Used MongoDB geospatial indexes for stores and delivery partner location readiness.
