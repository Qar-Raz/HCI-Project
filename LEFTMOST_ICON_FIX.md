# Leftmost Icon Clipping Fix

## 🐛 Issue

When selecting the leftmost cuisine icon (Pizza), the selected state (orange background + green checkmark badge) was getting cut off on the left edge because the checkmark badge extends `-1.5px` beyond the icon bounds.

## ✅ Solution

Added horizontal padding to the scrollable container to prevent clipping:

```tsx
// BEFORE
className =
  "flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x snap-mandatory";

// AFTER
className =
  "flex gap-4 overflow-x-auto pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory";
```

### What This Does:

- **`px-2`**: Adds 8px (0.5rem) padding on left and right sides
- **`-mx-2`**: Adds -8px margin on left and right to offset the padding
- **Result**: The container expands into the negative margin space, giving room for the checkmark badge without changing the visual alignment

## 🎯 Visual Impact

- ✅ Leftmost icon now displays correctly when selected
- ✅ Rightmost icon also has proper spacing
- ✅ No change to the visual layout (padding is offset by negative margin)
- ✅ Checkmark badge fully visible on all icons
- ✅ Orange background not clipped

## Technical Details

The checkmark badge is positioned at `-top-1.5 -right-1.5` (6px outside the icon bounds). Without padding, this would overflow the container on the left edge. The `px-2` gives 8px of breathing room, which is more than enough for the 6px overflow.

---

_Fixed: November 10, 2025_
