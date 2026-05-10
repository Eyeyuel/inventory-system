// common/throttle-presets.ts
export const THROTTLE_PRESETS = {
  // Global named throttlers (match ThrottlerModule.forRoot)
  strict: { name: 'strict', limit: 5, ttl: 1000 },
  moderate: { name: 'moderate', limit: 30, ttl: 10000 },
  relaxed: { name: 'relaxed', limit: 200, ttl: 60000 },

  // Module‑specific overrides
  category: { name: 'strict', limit: 10, ttl: 1000 },
  location: { name: 'strict', limit: 10, ttl: 1000 },
  product: {
    read: { name: 'relaxed', limit: 150, ttl: 30000 },
    write: { name: 'strict', limit: 5, ttl: 1000 },
  },
  profile: { name: 'moderate', limit: 20, ttl: 10000 },
  purchase: { name: 'strict', limit: 3, ttl: 1000 },
  sales: { name: 'strict', limit: 3, ttl: 1000 },
  stock: { name: 'strict', limit: 10, ttl: 1000 },
  users: {
    strict: { name: 'strict', limit: 5, ttl: 60000 },
    // here create an obj just for requesting verify tokens once per min
    standard: { name: 'moderate', limit: 50, ttl: 60000 },
    refresh: { name: 'strict', limit: 10, ttl: 60000 },
  },
};
