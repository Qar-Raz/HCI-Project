# 🗄️ SQLite Backend - Quick Reference

## Database File

```
Location: /home/muddasir/Project/hci/foodhub.db
Size: ~100KB
Format: SQLite 3
```

## Quick Commands

### Setup

```bash
# Seed database
npm run db:seed

# Initialize schema only
npm run db:init

# Reset database
npm run db:reset
```

### API Endpoints

| Method | Endpoint                    | Purpose                |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/restaurants`          | Get all restaurants    |
| GET    | `/api/restaurants?q=pizza`  | Search restaurants     |
| GET    | `/api/restaurants/[slug]`   | Get restaurant by slug |
| POST   | `/api/restaurants`          | Create restaurant      |
| GET    | `/api/menu/search?q=burger` | Search menu items      |
| GET    | `/api/orders`               | Get all orders         |
| POST   | `/api/orders`               | Create order           |
| POST   | `/api/reviews`              | Create review          |

## Code Examples

### Fetch All Restaurants

```typescript
import { restaurantApi } from "@/lib/api";

const restaurants = await restaurantApi.getAll();
```

### Get Restaurant by Slug

```typescript
const restaurant = await restaurantApi.getBySlug("pizza-palace");
```

### Search Menu Items

```typescript
import { menuApi } from "@/lib/api";

const items = await menuApi.search("burger");
```

### Create Order

```typescript
import { orderApi } from "@/lib/api";

const order = await orderApi.create({
  restaurantId: "1",
  restaurantName: "Pizza Palace",
  items: cart.items,
  total: 598,
});
```

### Create Review

```typescript
import { reviewApi } from "@/lib/api";

await reviewApi.create({
  restaurantId: "1",
  name: "John Doe",
  rating: 5,
  comment: "Excellent!",
  avatar: "👨",
});
```

## Database Schema (Simplified)

```
restaurants
├── id, slug, name
├── rating, reviews
├── distance, delivery_time
├── cuisine, discount
└── is_closed

menu_items
├── id, restaurant_id
├── name, description
├── price, category
└── image

reviews
├── id, restaurant_id
├── name, rating, comment
├── avatar, helpful
└── time

orders
├── id, restaurant_id
├── items (JSON), total
└── status
```

## Testing

### Via Browser

```
http://localhost:3000/api/restaurants
http://localhost:3000/api/restaurants/pizza-palace
http://localhost:3000/api/menu/search?q=pizza
```

### Via curl

```bash
# Get restaurants
curl http://localhost:3000/api/restaurants

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"1","restaurantName":"Pizza Palace","items":[],"total":500}'
```

## Database Status

✅ **Initialized**: Yes
✅ **Seeded**: Yes (5 restaurants, 20 menu items, 20 reviews)
✅ **API Routes**: Working
✅ **Type-Safe**: Yes

## Files Reference

| File                | Purpose             |
| ------------------- | ------------------- |
| `lib/db.ts`         | Database operations |
| `lib/api.ts`        | API utilities       |
| `lib/seed.ts`       | Seeding script      |
| `app/api/**`        | API routes          |
| `DATABASE_GUIDE.md` | Full documentation  |

## Common Issues

### Database locked

```bash
# Restart dev server
npm run dev
```

### Need fresh data

```bash
rm foodhub.db && npm run db:seed
```

### Check if database exists

```bash
ls -la foodhub.db
```

---

**Full Documentation**: See `DATABASE_GUIDE.md`
**Status**: ✅ Production Ready
