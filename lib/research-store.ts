//
// lib/research-store.ts
//
// A singleton Map that survives across all route files (within the same
// module graph/worker).  In production you’d replace this with a real DB.
//
export const researchStore = new Map<string, any>()
