# Production-Grade Admin Panel

A fully-featured, enterprise SaaS quality admin dashboard built with Next.js, TypeScript, and Tailwind CSS. Strictly adheres to the ADMIN_API_CONTRACT.md specification.

## Features

### Core Modules
- **Dashboard**: Real-time metrics and analytics overview
- **Users Management**: List, search, edit, promote/demote users with permissions management
- **Orders Management**: Full order lifecycle management with status tracking and shipments
- **Products Management**: Create, update, delete products with bulk operations
- **Coupons Management**: Create and manage discount coupons with expiration tracking
- **Shipments**: Track and manage order shipments
- **Payment Events**: Monitor payment transactions and events
- **Analytics**: Advanced reporting and insights

### Architecture
- **Modular API Services**: Clean separation of concerns with dedicated service classes
- **Centralized Configuration**: All endpoints and routes in constants
- **Type Safety**: Full TypeScript support with interfaces for all API responses
- **Error Handling**: Comprehensive error handling aligned to backend error shape
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Enterprise UI**: Polished sidebar navigation, sticky topbar, proper spacing

## Project Structure

```
src/
├── constants/
│   ├── api-endpoints.ts    # All API endpoints from contract
│   └── routes.ts           # All application routes
├── api/
│   ├── client/
│   │   └── axios-client.ts # Axios HTTP client with auth
│   └── services/
│       ├── dashboard.service.ts
│       ├── users.service.ts
│       ├── orders.service.ts
│       ├── products.service.ts
│       ├── coupons.service.ts
│       └── [other services]
├── modules/              # Feature-specific logic
└── components/          # Reusable components

app/
├── admin/
│   ├── layout.tsx       # Admin layout with sidebar
│   ├── dashboard/       # Dashboard page
│   ├── users/           # Users management
│   ├── orders/          # Orders management
│   ├── products/        # Products management
│   ├── coupons/         # Coupons management
│   └── [other routes]
└── page.tsx            # Root redirect

messages/
└── en.json             # All UI text (internationalization ready)
```

## Setup

### 1. Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll be redirected to the dashboard.

## API Integration

### Authentication

The Axios client automatically includes the `Authorization: Bearer <token>` header if a token exists in localStorage under the key `auth_token`.

To set an auth token:
```typescript
import { apiClient } from '@/api/client/axios-client';
apiClient.setToken('your-jwt-token');
```

### Error Handling

All API errors follow the global error response shape:
```typescript
{
  error: {
    name?: string;
    message: string;
    code?: string;
    details?: string;
  }
}
```

The client automatically handles these errors and displays appropriate messages to users.

## API Services

All API interactions go through service classes in `src/api/services/`:

### Dashboard Service
```typescript
import { dashboardService } from '@/api/services/dashboard.service';

const metrics = await dashboardService.getMetrics();
```

### Users Service
```typescript
import { usersService } from '@/api/services/users.service';

const users = await usersService.getUsers(page, limit, search);
const user = await usersService.getUserById(id);
await usersService.updateUser(id, { name, roles, isActive });
await usersService.promoteUser(id);
await usersService.demoteUser(id);
```

### Orders Service
```typescript
import { ordersService } from '@/api/services/orders.service';

const orders = await ordersService.getOrders(page, limit, status, userId);
const order = await ordersService.getOrderById(id);
await ordersService.updateOrder(id, { status, paid });
```

### Products Service
```typescript
import { productsService } from '@/api/services/products.service';

const products = await productsService.getProducts(page, limit, { q, category, minPrice, maxPrice });
const product = await productsService.getProductById(id);
await productsService.createProduct(data);
await productsService.updateProduct(id, data);
await productsService.deleteProduct(id);
```

### Coupons Service
```typescript
import { couponsService } from '@/api/services/coupons.service';

const coupons = await couponsService.getCoupons(page, limit, active);
const coupon = await couponsService.getCouponById(id);
await couponsService.createCoupon(data);
await couponsService.updateCoupon(id, data);
await couponsService.deleteCoupon(id);
```

## Key Features

### No Hardcoding
- ✅ All API endpoints in `src/constants/api-endpoints.ts`
- ✅ All routes in `src/constants/routes.ts`
- ✅ All UI text in `messages/en.json`
- ✅ All error messages from backend error responses

### Type Safety
- ✅ Full TypeScript interfaces for all API responses
- ✅ Strict types for request/response data
- ✅ Request validation at component level

### User Experience
- ✅ Loading states with spinners
- ✅ Error states with helpful messages
- ✅ Empty states for no data
- ✅ Pagination with navigation buttons
- ✅ Search and filtering capabilities
- ✅ Form validation and error handling

### Production Ready
- ✅ Proper HTTP methods (GET, POST, PATCH, PUT, DELETE)
- ✅ Query parameters for filtering and pagination
- ✅ Request/response error handling
- ✅ Auth header management
- ✅ Responsive design

## Customization

### Adding a New Module

1. Create a service in `src/api/services/[module].service.ts`
2. Create the page in `app/admin/[module]/page.tsx`
3. Add routes to `src/constants/routes.ts`
4. Add endpoints to `src/constants/api-endpoints.ts`
5. Add UI text to `messages/en.json`

### Styling

This project uses Tailwind CSS with design tokens. Modify `tailwind.config.ts` and `app/globals.css` to customize colors and typography.

## API Contract

This admin panel strictly follows the specifications in `ADMIN_API_CONTRACT.md`:

- ✅ Only uses endpoints defined in the contract
- ✅ Uses exact request/response JSON shapes
- ✅ Handles errors according to specification
- ✅ Implements proper pagination with exact keys
- ✅ No invented fields or transformations

## License

MIT
