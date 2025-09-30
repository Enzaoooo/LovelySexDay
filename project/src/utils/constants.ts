export const STORAGE_KEYS = {
  CART: 'lovely-sex-day-cart',
  ADMIN_SESSION: 'lovely-sex-day-admin',
  FAVORITES: 'lovely-sex-day-favorites'
} as const;

export const ADMIN_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123'
} as const;

export const CAROUSEL_CONFIG = {
  AUTO_PLAY_INTERVAL: 5000,
  TRANSITION_DURATION: 700
} as const;

export const PAGINATION = {
  ITEMS_PER_VIEW: 4,
  PRODUCTS_PER_PAGE: 12
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280
} as const;