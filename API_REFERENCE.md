# API Reference

## Base URL

```
https://[project-id].supabase.co/rest/v1
```

## Authentication

Required headers for all requests:

```typescript
{
  apikey: string; // Supabase anon key
  Authorization: string; // Format: "Bearer {user_token}"
}
```

## Types

### Order

```typescript
interface Order {
  id: string;
  created_at: string; // ISO date string
  customer_id: string;
  material: string;
  quantity: number; // Minimum: 24
  design_url: string;
  design_description: string;
  total_amount: number;
  unique_code: number; // 3-digit code
  status: "menunggu_pembayaran" | "diproses" | "produksi" | "selesai";
  estimated_completion_days?: number;
  is_paid: boolean;
}
```

### Material

```typescript
interface Material {
  id: string;
  name: string;
  description: string;
  price_per_piece: number;
  image_url: string;
}
```

### Profile

```typescript
interface Profile {
  id: string;
  created_at: string;
  display_name: string;
  email: string;
  avatar_url: string;
  role: "admin" | "customer";
}
```

### Notification

```typescript
interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  message: string;
  type: "order_status" | "payment" | "system";
  is_read: boolean;
}
```

## Endpoints

### Orders

#### Get Customer Orders

```http
GET /rest/v1/orders?select=*&customer_id=eq.{user_id}&order=created_at.desc
```

Example Response:

```json
[
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "created_at": "2025-04-29T12:00:00Z",
    "customer_id": "user123",
    "material": "Cotton Combed 24s",
    "quantity": 24,
    "design_url": "https://example.com/designs/user123-12345.jpg",
    "design_description": "Print on center front, size 30x30cm",
    "total_amount": 1320000,
    "unique_code": 123,
    "status": "menunggu_pembayaran",
    "is_paid": false
  }
]
```

#### Create Order

```http
POST /rest/v1/orders
Content-Type: application/json

// Request Body Type:
interface CreateOrderRequest {
  customer_id: string
  material: string
  quantity: number     // min: 24
  design_url: string
  design_description: string
  total_amount: number
}

// Example Request:
{
  "customer_id": "user123",
  "material": "Cotton Combed 24s",
  "quantity": 24,
  "design_url": "https://example.com/designs/user123-12345.jpg",
  "design_description": "Print on center front, size 30x30cm",
  "total_amount": 1320000
}

// Example Response:
{
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "created_at": "2025-04-29T12:00:00Z",
  "status": "menunggu_pembayaran",
  "unique_code": 123,
  ...rest of order fields
}
```

### Materials

#### List Materials

```http
GET /rest/v1/materials?select=*

// Example Response:
[
  {
    "id": "materials1",
    "name": "Cotton Combed 24s",
    "description": "Premium cotton material, perfect for t-shirts",
    "price_per_piece": 55000,
    "image_url": "https://example.com/materials/cotton24s.jpg"
  },
  {
    "id": "materials2",
    "name": "Cotton Combed 30s",
    "description": "Softer variant, suitable for premium t-shirts",
    "price_per_piece": 65000,
    "image_url": "https://example.com/materials/cotton30s.jpg"
  }
]
```

### Notifications

#### Get User Notifications

```http
GET /rest/v1/notifications?user_id=eq.{user_id}&order=created_at.desc

// Example Response:
[
  {
    "id": "notif1",
    "created_at": "2025-04-29T12:00:00Z",
    "user_id": "user123",
    "title": "Order Status Updated",
    "message": "Your order #12345 is now in production",
    "type": "order_status",
    "is_read": false
  }
]
```

#### Mark as Read

```http
PATCH /rest/v1/notifications?id=eq.{notification_id}

// Request Body:
{
  "is_read": true
}
```

## Error Responses

All errors follow this format:

```typescript
interface ErrorResponse {
  code: number        // HTTP status code
  message: string     // Error description
  details?: any       // Additional error details
}

// Example 401 Unauthorized:
{
  "code": 401,
  "message": "JWT token is missing or invalid"
}

// Example 422 Validation Error:
{
  "code": 422,
  "message": "Validation error",
  "details": {
    "quantity": ["must be greater than or equal to 24"]
  }
}
```

## Realtime Subscriptions

### Order Status Changes

```typescript
supabase
  .channel("orders")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "orders" },
    payload => {
      // Handle order updates
    }
  );
```

### New Notifications

```typescript
supabase.channel("public:notifications").on(
  "postgres_changes",
  {
    event: "INSERT",
    schema: "public",
    table: "notifications",
    filter: `user_id=eq.${userId}`,
  },
  payload => {
    // Handle new notifications
  }
);
```

## Database Triggers

### Order Status Change Notification

```sql
-- Order status change trigger that creates notifications
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_order_status_change();
```

## Image Configuration

Next.js image configuration for external domains:

```ts
// next.config.ts
{
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fcmgvrxzteydktmfcqqa.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
    ],
  }
}
```
