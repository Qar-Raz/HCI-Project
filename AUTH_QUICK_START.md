# Quick Start: Authentication System

## 🚀 Get Started in 3 Steps

### Step 1: Start the Development Server

```bash
npm run dev
```

### Step 2: Navigate to Sign Up

Open your browser and go to:

```
http://localhost:3000/signup
```

### Step 3: Create Your Account

1. Enter your full name
2. Enter your email address
3. Create a password (see strength indicator)
4. Confirm your password
5. Click "Create Account"

You'll be automatically signed in and redirected to the home page!

---

## 🔑 Test Account (Already Created)

If you prefer to test with an existing account:

**Email:** `test@example.com`  
**Password:** `password123`

Go to: `http://localhost:3000/login`

---

## 📱 Key Pages

| Page    | URL        | Description                            |
| ------- | ---------- | -------------------------------------- |
| Sign In | `/login`   | Login to existing account              |
| Sign Up | `/signup`  | Create new account                     |
| Home    | `/`        | Main page (redirects here after login) |
| Account | `/account` | View profile & manage account          |

---

## ✨ Features to Try

### On Sign Up Page:

- ✅ Watch the password strength indicator
- ✅ See the password match indicator
- ✅ Try the show/hide password toggle
- ✅ Click "Continue with Google" (UI demo)

### On Sign In Page:

- ✅ Use the test account credentials
- ✅ Try incorrect password to see error handling
- ✅ Click "Forgot Password?" (placeholder)

### On Account Page:

- ✅ When logged out: See the beautiful welcome screen
- ✅ When logged in: See your profile and stats
- ✅ Click "Sign Out" to log out

---

## 🎨 UI/UX Highlights

### Beautiful Design

- Stunning gradient backgrounds
- Smooth animations
- Glass-morphism effects
- Professional color scheme

### Accessibility

- Full keyboard navigation
- Screen reader support
- Clear focus indicators
- ARIA labels throughout

### Responsive

- Perfect on mobile
- Tablet optimized
- Desktop friendly

---

## 🔧 Common Tasks

### Create a New User Programmatically

```bash
npx tsx lib/add-test-user.ts
```

### Check Current Users

The database is located at: `foodhub.db`

You can query it with:

```bash
sqlite3 foodhub.db "SELECT * FROM users;"
```

### Reset Authentication

Clear your browser's localStorage for `localhost:3000` or use:

```javascript
localStorage.removeItem("user");
```

---

## 🐛 Troubleshooting

### "Database locked" error

Stop and restart the dev server:

```bash
# Press Ctrl+C to stop
npm run dev
```

### User not found

Make sure the test user exists:

```bash
npx tsx lib/add-test-user.ts
```

### Can't log in

1. Check that you're using the correct credentials
2. Clear browser cache and localStorage
3. Restart the dev server

---

## 📚 Learn More

For detailed documentation, see:

- **[AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md)** - Complete authentication docs
- **[README.md](./README.md)** - Main project documentation

---

## 🎯 Next Steps

1. ✅ Try creating an account
2. ✅ Log in and out
3. ✅ Explore the account page
4. ✅ Test the responsive design on mobile
5. ✅ Check out the accessibility features

**Enjoy using FoodHub!** 🍔🍕🍜
