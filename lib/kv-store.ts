// Extremely simplified in-memory KV store implementation
// Using a plain object instead of Map to avoid method confusion
const storeData: Record<string, any> = {}

export const kv = {
  // Basic key-value operations
  get: (key: string) => storeData[key] || null,

  set: (key: string, value: any) => {
    storeData[key] = value
    return true
  },

  del: (key: string) => {
    delete storeData[key]
    return true
  },

  delete: function (key: string) {
    return this.del(key)
  },

  // Key operations
  keys: (pattern: string) => {
    const regex = new RegExp(pattern.replace("*", ".*"))
    return Object.keys(storeData).filter((key) => regex.test(key))
  },

  mget: (...keys: string[]) => keys.map((key) => storeData[key] || null),

  // Counter operations
  incr: (key: string) => {
    const val = Number(storeData[key] || 0) + 1
    storeData[key] = val
    return val
  },

  // Set operations
  sadd: (key: string, member: string) => {
    if (!storeData[key]) {
      storeData[key] = []
    }

    const set = new Set(storeData[key])
    const hadMember = set.has(member)
    set.add(member)
    storeData[key] = Array.from(set)

    return hadMember ? 0 : 1
  },

  smembers: (key: string) => storeData[key] || [],

  sismember: (key: string, member: string) => {
    if (!storeData[key]) return 0
    const set = new Set(storeData[key])
    return set.has(member) ? 1 : 0
  },

  srem: (key: string, member: string) => {
    if (!storeData[key]) return 0

    const set = new Set(storeData[key])
    const hadMember = set.has(member)
    set.delete(member)
    storeData[key] = Array.from(set)

    return hadMember ? 1 : 0
  },
}

// Helper functions that use the kv store
export function setValue(key: string, value: any) {
  return kv.set(key, JSON.stringify(value))
}

export function getValue(key: string) {
  const value = kv.get(key)
  try {
    return value ? JSON.parse(value) : null
  } catch (e) {
    return value
  }
}

export function deleteValue(key: string) {
  return kv.del(key)
}

export function getKeys(pattern: string) {
  return kv.keys(pattern)
}

export function getMultipleValues(keys: string[]) {
  if (keys.length === 0) return []
  const values = kv.mget(...keys)
  return values.map((value) => {
    try {
      return value ? JSON.parse(value) : null
    } catch (e) {
      return value
    }
  })
}

export function incrementCounter(key: string) {
  return kv.incr(key)
}

export function addToSet(key: string, member: string) {
  return kv.sadd(key, member)
}

export function getSetMembers(key: string) {
  return kv.smembers(key)
}

export function setContains(key: string, member: string) {
  return kv.sismember(key, member)
}

export function removeFromSet(key: string, member: string) {
  return kv.srem(key, member)
}
