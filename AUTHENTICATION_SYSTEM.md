# Authentication System Documentation

## Overview

FoodHub now includes a complete authentication system with beautiful, accessible sign-in and sign-up pages. The system uses SQLite for user storage and includes session management with localStorage.

## Features

### 🔐 Authentication Pages

#### **Sign In Page** (`/login`)

- **Beautiful gradient background** with animated patterns
- **Email and password inputs** with show/hide password toggle
- **Google Sign-In button** (UI only, ready for integration)
- **Forgot Password link** (placeholder for future implementation)
- **Responsive design** that works perfectly on mobile and desktop
- **Accessibility features**: ARIA labels, keyboard navigation, focus indicators
- **Error handling** with user-friendly messages
- **Loading states** with spinner animation

#### **Sign Up Page** (`/signup`)

- **All features from Sign In** plus:
- **Name field** for user registration
- **Password strength indicator** (Weak/Medium/Strong with visual bar)
- **Confirm password field** with match validation
- **Real-time password matching** indicator
- **Terms of Service** and Privacy Policy links
- **Input validation** for email format and password requirements

### 🗄️ Database

**Users Table Structure:**

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 🎯 User Flow

1. **Non-authenticated users** see a beautiful welcome screen on the Account page with:

   - Sign In and Create Account buttons
   - List of benefits (Save Favorites, Earn Rewards, Track Orders)
   - Clear call-to-action

2. **After sign-in/sign-up**: User is automatically redirected to the home page (`/`)

3. **Authenticated users** see:
   - Their profile information (name, email, avatar)
   - Account statistics (orders, points, tier)
   - Edit Profile and Sign Out buttons
   - Full access to all account features

## API Endpoints

### POST `/api/auth/login`

Authenticate a user with email and password.

**Request:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response (Success):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "phone": "+1234567890",
    "avatar": "https://..."
  }
}
```

**Response (Error):**

```json
{
  "message": "Invalid email or password"
}
```

### POST `/api/auth/signup`

Create a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (Success):**

```json
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://..."
  }
}
```

**Response (Error):**

```json
{
  "message": "An account with this email already exists"
}
```

## Usage

### Testing the System

**Test Account:**

- Email: `test@example.com`
- Password: `password123`

OR create a new account using the Sign Up page.

### Adding a Test User Manually

Run this command to add the test user:

```bash
npx tsx lib/add-test-user.ts
```

### Using Authentication in Your Code

```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { user, isAuthenticated, login, signup, logout } = useAuth();

  // Check if user is logged in
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  // Display user info
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## Security Notes

⚠️ **Important**: This implementation stores passwords in **plain text** for UI/UX demonstration purposes only.

**For production use**, you should:

1. Hash passwords using bcrypt or similar
2. Implement JWT or session-based authentication
3. Add CSRF protection
4. Use HTTPS
5. Implement rate limiting
6. Add email verification
7. Implement secure password reset flow

## UI/UX Features

### Accessibility

- ✅ Full keyboard navigation support
- ✅ Screen reader optimized with ARIA labels
- ✅ Clear focus indicators
- ✅ Error messages announced to screen readers
- ✅ Descriptive button labels
- ✅ Proper form structure and labels

### Visual Design

- 🎨 Beautiful gradient backgrounds
- ✨ Smooth animations and transitions
- 📱 Fully responsive (mobile-first)
- 🎯 Clear visual hierarchy
- 💫 Microinteractions (hover effects, loading states)
- 🌟 Consistent with FoodHub brand colors

### User Experience

- ⚡ Fast and responsive
- 💡 Helpful error messages
- 🔄 Loading states for all actions
- ✅ Success feedback
- 🎯 Clear calls-to-action
- 🔐 Password visibility toggle
- 💪 Password strength indicator
- ✓ Real-time validation feedback

## Pages Overview

### `/login` - Sign In Page

![Sign In Features]

- Email input with mail icon
- Password input with lock icon and show/hide toggle
- "Forgot Password?" link
- Sign In button with loading state
- Google Sign-In option
- Link to Sign Up page
- Demo credentials displayed

### `/signup` - Sign Up Page

![Sign Up Features]

- Full Name input with user icon
- Email input with validation
- Password input with strength indicator
- Confirm Password with match indicator
- Create Account button with loading state
- Google Sign-Up option
- Link to Sign In page
- Terms of Service acceptance

### `/account` - Account Page

**Non-authenticated:**

- Welcome message
- Benefits showcase
- Sign In and Create Account buttons

**Authenticated:**

- User profile with avatar
- Name and email display
- Account statistics
- Edit Profile button
- Sign Out button
- Full account management options

## File Structure

```
app/
├── login/
│   └── page.tsx           # Sign in page
├── signup/
│   └── page.tsx           # Sign up page
├── (tabs)/
│   └── account/
│       └── page.tsx       # Account page with auth check
└── api/
    └── auth/
        ├── login/
        │   └── route.ts   # Login API endpoint
        └── signup/
            └── route.ts   # Signup API endpoint

lib/
├── auth-context.tsx       # Authentication context provider
├── db.ts                  # Database with users table
├── add-test-user.ts       # Script to add test user
└── seed.ts                # Database seeding (includes test user)
```

## Future Enhancements

- [ ] Implement actual Google OAuth
- [ ] Add password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Remember me functionality
- [ ] Social login (Facebook, Apple)
- [ ] Password strength requirements enforcement
- [ ] Account deletion
- [ ] Session expiration
- [ ] Profile picture upload

## Support

For any issues or questions about the authentication system, please refer to the main README or create an issue in the repository.
