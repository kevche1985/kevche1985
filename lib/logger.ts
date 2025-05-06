// Extremely simplified logger implementation
type LogLevel = "info" | "warning" | "error" | "debug"

// Simple in-memory storage for logs
const logsData: Array<{
  id: string
  timestamp: number
  level: LogLevel
  category: string
  message: string
  details?: any
}> = []

// Simple logger object with explicit function declarations
export const logger = {
  // Main logging function
  log: (level: LogLevel, category: string, message: string, details?: any) => {
    const id = Math.random().toString(36).substring(2, 15)
    const logEntry = {
      id,
      timestamp: Date.now(),
      level,
      category,
      message,
      details,
    }

    logsData.unshift(logEntry)

    // Keep only the last 1000 logs
    if (logsData.length > 1000) {
      logsData.pop()
    }

    // Log to console for development
    console.log(`[${level.toUpperCase()}][${category}] ${message}`, details || "")

    return true
  },

  // Convenience methods
  info: function (category: string, message: string, details?: any) {
    return this.log("info", category, message, details)
  },

  warn: function (category: string, message: string, details?: any) {
    return this.log("warning", category, message, details)
  },

  error: function (category: string, message: string, details?: any) {
    return this.log("error", category, message, details)
  },

  debug: function (category: string, message: string, details?: any) {
    return this.log("debug", category, message, details)
  },

  // Utility methods
  getLogs: (offset = 0, limit = 50, filters?: any) => {
    let filteredLogs = [...logsData]

    if (filters) {
      if (filters.level) {
        filteredLogs = filteredLogs.filter((log) => log.level === filters.level)
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter((log) => log.category === filters.category)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredLogs = filteredLogs.filter(
          (log) =>
            log.message.toLowerCase().includes(searchLower) ||
            (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower)),
        )
      }
    }

    return filteredLogs.slice(offset, offset + limit)
  },

  clearLogs: () => {
    logsData.length = 0
    return true
  },

  getCategories: () => {
    const categories = new Set<string>()
    logsData.forEach((log) => categories.add(log.category))
    return Array.from(categories)
  },
}

// For backward compatibility - using explicit function declarations
export function logInfo(category: string, message: string, details?: any) {
  return logger.info(category, message, details)
}

export function logError(category: string, message: string, details?: any) {
  return logger.error(category, message, details)
}

export type { LogLevel }
