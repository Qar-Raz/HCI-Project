# FoodPapa - Premium Food Delivery Application 🍕

A **stunning, feature-rich** food delivery application built with Next.js 14+, TypeScript, and Tailwind CSS v4. This project showcases a complete food ordering experience with **world-class UI/UX** that rivals top platforms like Uber Eats and DoorDash.

## ✨ Highlights

- 🎨 **Beautiful gradient-rich design** with smooth 60fps animations
- 📱 **Fully responsive** - pixel perfect on mobile, tablet, and desktop
- 🔍 **Advanced search & filtering** with real-time results
- 🍽️ **Enhanced restaurant pages** with Info & Reviews tabs
- ♿ **Accessibility-first** with full keyboard navigation
- ⚡ **Lightning fast** with optimized performance
- 🎯 **Intuitive UX** with micro-interactions throughout

## 🚀 Features

### 🏠 Homepage

- **Real-time search** across restaurants, cuisines, and menu items
- **Interactive cuisine filtering** with visual feedback
- **Floating promotional banner** with animated emojis
- **Enhanced restaurant cards** with:
  - Image zoom and shine effects on hover
  - Gradient backgrounds and shadows
  - Star ratings and quick info
  - Active discount badges
- **Search suggestions** dropdown with popular searches
- **Active filter pills** that are removable
- **Empty states** with helpful messaging
- **Glass morphism header** with backdrop blur

### 🔍 Search Page ⭐ NEW

- **Dedicated search interface** at `/search` route
- **Auto-focus** on search input
- **Comprehensive filters**:
  - Sort by: Relevance, Rating, Distance, Delivery Time
  - Minimum rating: All, 3+, 3.5+, 4+, 4.5+
  - Multi-select cuisine filters
  - "Show Open Only" toggle
- **Collapsible filter panel** with active filter counter
- **Active filters display** as removable pills
- **Results counter** and empty states
- **Staggered animations** for smooth card appearance
- **Responsive grid** (1-3 columns)

### 🍽️ Restaurant Page ⭐ ENHANCED

**Three Interactive Tabs:**

#### Menu Tab

- **Enhanced menu items** with:
  - Larger images with zoom on hover
  - "Bestseller" badges on popular items
  - "In Cart" indicators
  - Star ratings (4.6-4.8 range)
  - Cooking time estimates
  - Gradient pricing displays
  - Beautiful quantity controls
  - Gradient "Add to Cart" buttons
- **Category filter pills** (sticky, scrollable)
- **Image overlay effects** on hover
- **Scale animations** for cards

#### Info Tab ⭐ NEW

- **Operating Hours** with day/time schedules
- **Contact Information** (phone, email, address)
- **Safety & Quality** features:
  - Hygiene certified
  - On-time delivery (95%)
  - Secure packaging
  - Expert chefs
- **FAQs** (4 collapsible Q&A items)

#### Reviews Tab ⭐ NEW

- **Rating Summary** with:
  - Large rating display
  - 5-star visualization
  - Distribution bars (5★ to 1★)
- **Individual Reviews** with:
  - Customer avatars
  - Star ratings
  - Review text
  - "Helpful" vote buttons
- **Write Review** CTA button

**Additional Features:**

- **Share button** with toast notification
- **Favorite (heart) button** with fill animation
- **Discount & Trending badges** with gradients
- **Offers section** with promotional codes
- **Info grid** (delivery, distance, price)
- **Highlights section** with icons

### 🛒 Smart Cart Management

- **Add items** with quantity control
- **Multi-restaurant protection** with confirmation modal
- **Automatic validation** for closed restaurants
- **Real-time badge** showing item count
- **"In Cart" indicators** on menu items
- **Green "Add More" buttons** when item already in cart

### 📦 Order Management

- View order history with status tracking
- Track current orders
- Reorder from past orders

### 👤 User Account

- Manage profile information
- Save multiple addresses
- Manage payment methods
- Set preferences

### ♿ Accessibility Features

- Full keyboard navigation support
- Screen reader optimized
- High contrast mode
- Font size adjustment
- Focus indicators throughout
- Semantic HTML structure

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Font**: Inter (Google Fonts)

## 🚦 Getting Started

### Installation

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages Overview

- **Home** (`/`) - Browse restaurants and cuisines
- **Restaurant Detail** (`/restaurant/[slug]`) - View menu and add items
- **Cart** (`/cart`) - Review and confirm order
- **Orders** (`/orders`) - View order history
- **Account** (`/account`) - Manage profile and settings

## 🎯 Key Features

### Multi-Restaurant Cart Protection

Prevents mixing items from different restaurants with a confirmation modal.

### Closed Restaurant Handling

Visual indicators and order prevention for closed restaurants.

### Smart Cart State

Global cart management with real-time updates and calculations.

Built with ❤️ using Next.js and TypeScript

# hci
