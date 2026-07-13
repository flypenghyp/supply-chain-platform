# Supply Chain Collaboration Platform

A modern, full-stack supplier collaboration platform built with React, Ant Design, and Express.js. Features an interactive dashboard with data visualization, Excel-like data tables, and comprehensive supplier/product/order management.

## 🎯 Features

- **Interactive Dashboard** - Real-time analytics with charts and key metrics
- **Data Visualization** - Charts showing order distribution, top suppliers, and product categories
- **Supplier Management** - CRUD operations for supplier information
- **Product Catalog** - Manage products with pricing, stock, and supplier relationships
- **Order Tracking** - Full order lifecycle management with status tracking
- **Excel-like Tables** - Responsive data tables with sorting, pagination, and inline editing
- **Ant Design Layout** - Professional UI with Ant Design components

## 📋 Prerequisites

- Node.js 16+ and npm
- Windows, macOS, or Linux

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

This installs dependencies for the root, server, and client packages.

### 2. Set Up Environment Variables

Create `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

### 3. Start Development Servers

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will:
- Start the backend API on `http://localhost:5000`
- Start the frontend on `http://localhost:3000`

### 4. Open in Browser

Navigate to `http://localhost:3000` to view the application.

## 📁 Project Structure

```
supply-chain/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Dashboard, Suppliers, Products, Orders)
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API service layer
│   │   ├── styles/        # CSS styles
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── db/           # Database configuration
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   └── index.ts      # Server entry point
│   ├── data/             # SQLite database file
│   └── package.json
└── package.json           # Workspace root

```

## 🔧 Available Scripts

### Development

```bash
npm run dev              # Run both client and server in dev mode
npm --prefix client dev  # Run client only
npm --prefix server dev  # Run server only
```

### Build

```bash
npm run build            # Build both client and server
npm --prefix client build
npm --prefix server build
```

### Production

```bash
npm --prefix server start  # Start production server
npm --prefix client start  # Preview production build
```

## 📊 API Endpoints

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `POST /api/orders/:id/items` - Add items to order

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/orders` - Order status analytics
- `GET /api/analytics/suppliers` - Top suppliers
- `GET /api/analytics/categories` - Product categories analysis

## 🗄️ Database Schema

### Suppliers
- id, name, email, phone, address, city, country, status, rating, created_at, updated_at

### Products
- id, supplier_id, name, sku, category, unit_price, stock_quantity, min_order_qty, lead_time_days, created_at, updated_at

### Orders
- id, order_number, supplier_id, total_amount, status, order_date, delivery_date, created_at, updated_at

### Order Items
- id, order_id, product_id, quantity, unit_price, subtotal

### Analytics
- id, metric_type, metric_name, metric_value, timestamp

## 💡 Usage Examples

### Adding a Supplier
1. Navigate to "Suppliers" page
2. Click "Add Supplier"
3. Fill in the form with supplier details
4. Click OK to save

### Creating an Order
1. Go to "Orders" page
2. Click "Create Order"
3. Select supplier and enter order details
4. Confirm to create the order

### Viewing Analytics
- Dashboard page shows real-time statistics
- Charts display order distribution, top suppliers, and product categories
- All metrics auto-update when data changes

## 🔒 Security Notes

- Store sensitive data in environment variables
- Use proper authentication in production
- Validate all inputs on both client and server
- Use HTTPS in production

## 📦 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Ant Design 5
- Recharts (for data visualization)
- Axios (for API calls)
- Vite (build tool)

**Backend:**
- Node.js with TypeScript
- Express.js
- SQLite3
- CORS support

## 🐛 Troubleshooting

### Port already in use
- Change the port in `client/vite.config.ts` or `server/.env`

### Database error
- Ensure `server/data` directory exists
- Check file permissions in the data directory

### CORS errors
- Verify the backend is running on port 5000
- Check proxy configuration in `client/vite.config.ts`

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📞 Support

For issues and questions, please create an issue in the repository.
