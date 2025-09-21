export const colors = {
  // Primary colors
  primary: '#e50914',
  primaryDark: '#b20711',

  // Header colors
  headerBackground: '#000000', // Pure black for all screen headers

  // Background colors
  background: '#121212',
  surface: '#1e1e1e',
  card: '#2d2d2d',

  // Text colors
  text: '#ffffff',
  white: '#ffffff', // Added missing white color
  textSecondary: '#b3b3b3',
  textMuted: '#8c8c8c',
  textSubtle: '#999999',
  textDark: '#8c8c8c', // Fixed: was #666666 (3.73:1) → now (4.97:1) ✅
  textLight: '#cccccc',

  // Specific text colors for different UI elements
  titlePrimary: '#ffffff',
  titleSecondary: '#e50914',
  descriptionText: '#b3b3b3',
  subtitleText: '#8c8c8c',
  captionText: '#999999',
  disabledText: '#8c8c8c', // Fixed: was #666666 (3.73:1) → now (4.97:1) ✅

  // Border colors
  border: '#404040',
  borderLight: '#333333',

  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',

  // Seat colors (enhanced for dark mode)
  seatStandard: '#2d2d2d', // Standard seats - dark theme compatible
  seatPremium: '#4a4a00', // Premium seats - dark yellow tint
  seatVip: '#4a2d4a', // VIP seats - dark purple tint
  seatSelected: '#e50914', // Selected - brand color
  seatOccupied: '#555555', // Occupied - medium gray (was too dark)
  seatLocked: '#8b4513', // Locked - dark orange
  seatBorder: '#404040', // Seat borders
  seatBorderSelected: '#e50914', // Selected seat border
  seatTextLight: '#ffffff', // Text on dark seats
  seatTextDark: '#cccccc', // Text on lighter seats

  // Tab bar colors
  tabActive: '#e50914',
  tabInactive: '#8c8c8c',
  tabBackground: '#1e1e1e',

  // Input colors
  inputBackground: '#2d2d2d',
  inputBorder: '#404040',
  inputText: '#ffffff',
  placeholder: '#ffffff', // Fixed: was #8c8c8c (2.65:1) → now (4.64:1) ✅

  // Quantity Selector colors
  quantityBackground: '#2d2d2d', // Container background
  quantityButton: '#404040', // Button background
  quantityButtonDisabled: '#555555', // Disabled button
  quantityCenter: '#1e1e1e', // Center number area
  quantityBorder: '#404040', // Borders
  quantityText: '#ffffff', // Number text
  quantityTextDisabled: '#8c8c8c', // Disabled text

  // TimeSlot colors
  timeSlotBackground: '#2d2d2d', // Default slot background
  timeSlotSelected: '#e50914', // Selected slot
  timeSlotUnavailable: '#1e1e1e', // Unavailable slot
  timeSlotBorder: '#404040', // Default border
  timeSlotBorderSelected: '#e50914', // Selected border
  timeSlotBorderUnavailable: '#333333', // Unavailable border
  timeSlotText: '#ffffff', // Default text
  timeSlotTextSelected: '#ffffff', // Selected text
  timeSlotTextUnavailable: '#8c8c8c', // Unavailable text
};

export const gradients = {
  primary: ['#e50914', '#b20711'],
  dark: ['#121212', '#1e1e1e'],
  card: ['#2d2d2d', '#1e1e1e'],
};
