# Restaurant Page Testing Guide 🧪

## Quick Test Checklist

### 🎯 Basic Navigation

- [ ] Click on any restaurant card from homepage
- [ ] Back button returns to homepage
- [ ] Bottom navigation works from restaurant page
- [ ] Page loads without errors

### 📑 Tab Navigation

1. **Menu Tab (Default)**

   - [ ] Menu tab is selected by default
   - [ ] All menu items display correctly
   - [ ] Category pills visible and functional
   - [ ] "All Items" shows everything
   - [ ] Individual category shows filtered items

2. **Info Tab**

   - [ ] Click "Info" tab
   - [ ] Operating hours card displays
   - [ ] Contact information shows correctly
   - [ ] Safety features grid displays (4 items)
   - [ ] FAQs are collapsible
   - [ ] Click FAQ to expand/collapse

3. **Reviews Tab**
   - [ ] Click "Reviews" tab
   - [ ] Rating summary displays (5.0 rating)
   - [ ] Rating distribution bars show
   - [ ] Individual reviews display (4 reviews)
   - [ ] Avatar, name, timestamp visible
   - [ ] "Helpful" count displays
   - [ ] "Write a Review" button at bottom

### ❤️ Interactive Elements

#### Header Section

- [ ] **Heart Button**: Click to favorite (should fill with red)
- [ ] **Heart Button**: Click again to unfavorite
- [ ] **Share Button**: Click to see toast notification
- [ ] **Toast**: "Link copied to clipboard!" appears
- [ ] **Toast**: Auto-dismisses after 3 seconds
- [ ] **Badges**: Discount and Trending badges visible

#### Restaurant Info

- [ ] Restaurant name displays with gradient
- [ ] Rating shows in yellow box
- [ ] Tags display (Fast Delivery, Top Rated, Popular)
- [ ] Info grid shows 3 cards (Delivery, Distance, Price)
- [ ] Highlights show 4 items with icons

#### Offers Section

- [ ] 3 offers display with icons
- [ ] Offer codes visible (SAVE50, FIRST, SAVE30)
- [ ] Hover over offer to see "Apply" button
- [ ] Border changes color on hover

### 🍕 Menu Items

#### Card Display

- [ ] Menu items show in grid (1 col mobile, 2 col desktop)
- [ ] Images load correctly
- [ ] "Bestseller" badge on first item per category
- [ ] Item name, description, price visible
- [ ] Star rating displays
- [ ] Cooking time shows

#### Interactions

- [ ] **Hover**: Card scales up slightly
- [ ] **Hover**: Image zooms in
- [ ] **Hover**: Border color changes to orange
- [ ] **Hover**: Shadow increases

#### Quantity Controls

- [ ] Click **minus** button to decrease (min: 1)
- [ ] Click **plus** button to increase
- [ ] Quantity number updates correctly
- [ ] Buttons have hover effects

#### Add to Cart

- [ ] Click "Add to Cart" button
- [ ] Item appears in cart
- [ ] Button changes to "Add More"
- [ ] Button turns green when in cart
- [ ] "In Cart" badge appears on image
- [ ] Quantity controls work for cart items

#### Different Restaurant Flow

- [ ] Add item from Restaurant A to cart
- [ ] Go to Restaurant B
- [ ] Try to add item from Restaurant B
- [ ] Modal appears asking to reset cart
- [ ] Click "Cancel" - item not added
- [ ] Try again, click "Start Fresh Order"
- [ ] Cart clears and new item added

### 🎨 Visual Effects

#### Animations

- [ ] Tab content fades in when switching
- [ ] Category pills slide smoothly
- [ ] Menu cards animate on load
- [ ] Buttons scale on hover
- [ ] Toast slides in from bottom

#### Gradients

- [ ] Restaurant name has gradient text
- [ ] Orange badges have gradient backgrounds
- [ ] Info grid cards have gradient backgrounds
- [ ] Rating bars have gradient fill
- [ ] CTA buttons have gradient backgrounds

#### Responsive Design

- [ ] Test on mobile width (<640px)
- [ ] Test on tablet width (640-1024px)
- [ ] Test on desktop width (>1024px)
- [ ] Category pills scroll horizontally on mobile
- [ ] Grid changes from 1 to 2 columns

### 🔍 Edge Cases

#### Closed Restaurant

- [ ] Find a closed restaurant (if any in data)
- [ ] Red banner shows "currently closed"
- [ ] "Add to Cart" buttons are disabled
- [ ] Buttons show gray color

#### Empty Cart

- [ ] With empty cart, add item
- [ ] Should add successfully
- [ ] No modal appears

#### Multiple Items Same Restaurant

- [ ] Add multiple different items
- [ ] All should add successfully
- [ ] Quantities tracked separately

### 📱 Mobile Testing

#### Touch Interactions

- [ ] Tap buttons (not hover)
- [ ] Swipe category pills horizontally
- [ ] Scroll through menu smoothly
- [ ] Bottom nav doesn't obstruct content
- [ ] Back button easy to tap

#### Layout

- [ ] Header image responsive
- [ ] Info grid stacks vertically
- [ ] Menu cards full width
- [ ] Text readable (not too small)
- [ ] Spacing appropriate

### ♿ Accessibility

#### Keyboard Navigation

- [ ] Tab through interactive elements
- [ ] Focus states visible
- [ ] Enter key activates buttons
- [ ] Escape closes modals

#### Screen Reader

- [ ] Button labels meaningful
- [ ] Images have alt text
- [ ] Semantic HTML used
- [ ] Heading hierarchy correct

### 🐛 Bug Checks

#### Console Errors

- [ ] Open DevTools console
- [ ] No React errors
- [ ] No TypeScript errors
- [ ] No 404 image errors
- [ ] No infinite loops

#### Performance

- [ ] Page loads quickly (<2s)
- [ ] Animations smooth (60fps)
- [ ] No layout shifts
- [ ] Images load progressively

## Test Scenarios

### Scenario 1: First-Time User

```
1. Land on homepage
2. Browse restaurants
3. Click on "Pizza Palace"
4. Review menu in Menu tab
5. Check Info tab for hours
6. Read reviews in Reviews tab
7. Return to Menu tab
8. Add Margherita Pizza (quantity: 2)
9. Add Garlic Bread (quantity: 1)
10. Navigate to cart
11. Verify items and quantities
```

### Scenario 2: Returning User

```
1. Already have items in cart from Restaurant A
2. Browse and click Restaurant B
3. Try to add item
4. See reset cart modal
5. Cancel and go back
6. Complete order from Restaurant A first
7. Then order from Restaurant B
```

### Scenario 3: Restaurant Research

```
1. Open restaurant page
2. Click Info tab
3. Note operating hours
4. Save phone number
5. Read through FAQs
6. Click Reviews tab
7. Read customer experiences
8. Check rating distribution
9. Decide to order
10. Switch to Menu tab
```

### Scenario 4: Mobile User

```
1. Open on mobile device
2. Scroll through header
3. Swipe through category pills
4. Filter by category
5. Add item to cart
6. Use bottom navigation
7. Return to restaurant
8. Share restaurant link
```

## Performance Benchmarks

### Load Times

- Initial page load: **< 2 seconds**
- Tab switch: **< 100ms**
- Add to cart: **< 50ms**
- Category filter: **< 50ms**

### Animation Framerate

- Card hover: **60 fps**
- Image zoom: **60 fps**
- Tab transition: **60 fps**
- Toast animation: **60 fps**

### Bundle Size

- Page JS: **< 150KB** (gzipped)
- Images: Progressive loading
- Total initial load: **< 500KB**

## Browser Compatibility

### Desktop

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile

- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet 14+

## Known Issues & Limitations

### Current Limitations

1. **Static Data**: Restaurant info is hardcoded (temporary)
2. **No Backend**: No actual API calls yet
3. **Placeholder Images**: Using placehold.co images
4. **Mock Reviews**: Reviews are sample data

### Future Improvements Needed

1. Connect to real API
2. Add image gallery/carousel
3. Implement real share functionality
4. Add map for location
5. Enable actual review submission
6. Add nutrition information
7. Implement order customization

## Reporting Issues

### Issue Template

```
**Title**: Brief description

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Environment**:
- Browser:
- Device:
- OS:

**Screenshots**:
[Attach if relevant]
```

## Success Criteria

### Must Have ✅

- [x] All tabs functional
- [x] Menu items display correctly
- [x] Add to cart works
- [x] Quantity controls work
- [x] Navigation works
- [x] Responsive design
- [x] No console errors
- [x] Smooth animations

### Nice to Have 🎯

- [x] Share toast notification
- [x] Favorite functionality
- [x] FAQ collapsible
- [x] Helpful button on reviews
- [x] Hover effects throughout
- [x] Gradient designs
- [x] Badge indicators

### Future Enhancements 🚀

- [ ] Image gallery
- [ ] Map integration
- [ ] Live chat
- [ ] Nutrition info
- [ ] Order customization
- [ ] Photo reviews
- [ ] Similar restaurants

---

## Quick Test URLs

Assuming dev server on `http://localhost:3000`:

1. **The Gourmet Kitchen**: `/restaurant/the-gourmet-kitchen`
2. **Pizza Palace**: `/restaurant/pizza-palace`
3. **Burger Barn**: `/restaurant/burger-barn`
4. **Sushi Station**: `/restaurant/sushi-station`

## Testing Commands

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

**Happy Testing! 🎉**

_Last Updated: November 10, 2025_
