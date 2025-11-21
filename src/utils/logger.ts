/**
 * Logging abstraction for PDFStudio
 * Replaces console.log/warn/error with configurable logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export interface LogMessage {
  level: LogLevel
  message: string
  timestamp: Date
  context?: string
  data?: any
}

export interface Logger {
  debug(message: string, context?: string, data?: any): void
  info(message: string, context?: string, data?: any): void
  warn(message: string, context?: string, data?: any): void
  error(message: string, context?: string, data?: any): void
}

/**
 * Console logger implementation (default)
 */
class ConsoleLogger implements Logger {
  constructor(private minLevel: LogLevel = LogLevel.WARN) {}

  debug(message: string, context?: string, data?: any): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, message, context, data)
    }
  }

  info(message: string, context?: string, data?: any): void {
    if (this.minLevel <= LogLevel.INFO) {
      this.log(LogLevel.INFO, message, context, data)
    }
  }

  warn(message: string, context?: string, data?: any): void {
    if (this.minLevel <= LogLevel.WARN) {
      this.log(LogLevel.WARN, message, context, data)
    }
  }

  error(message: string, context?: string, data?: any): void {
    if (this.minLevel <= LogLevel.ERROR) {
      this.log(LogLevel.ERROR, message, context, data)
    }
  }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    const prefix = context ? `[${context}]` : ''
    const timestamp = new Date().toISOString()

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${timestamp} DEBUG ${prefix} ${message}`, data || '')
        break
      case LogLevel.INFO:
        console.info(`${timestamp} INFO ${prefix} ${message}`, data || '')
        break
      case LogLevel.WARN:
        console.warn(`${timestamp} WARN ${prefix} ${message}`, data || '')
        break
      case LogLevel.ERROR:
        console.error(`${timestamp} ERROR ${prefix} ${message}`, data || '')
        break
    }
  }
}

/**
 * Silent logger (no output)
 */
class SilentLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}

/**
 * Custom logger that calls user-provided callbacks
 */
class CustomLogger implements Logger {
  constructor(private callback: (log: LogMessage) => void) {}

  debug(message: string, context?: string, data?: any): void {
    this.callback({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      context,
      data
    })
  }

  info(message: string, context?: string, data?: any): void {
    this.callback({
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      context,
      data
    })
  }

  warn(message: string, context?: string, data?: any): void {
    this.callback({
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      context,
      data
    })
  }

  error(message: string, context?: string, data?: any): void {
    this.callback({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      context,
      data
    })
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger = new ConsoleLogger(LogLevel.WARN)

/**
 * Get the current logger instance
 */
export function getLogger(): Logger {
  return globalLogger
}

/**
 * Set a custom logger
 */
export function setLogger(logger: Logger): void {
  globalLogger = logger
}

/**
 * Configure console logger with specific log level
 */
export function setLogLevel(level: LogLevel): void {
  globalLogger = new ConsoleLogger(level)
}

/**
 * Set silent logger (no output)
 */
export function setSilentLogger(): void {
  globalLogger = new SilentLogger()
}

/**
 * Set custom logger with callback
 */
export function setCustomLogger(callback: (log: LogMessage) => void): void {
  globalLogger = new CustomLogger(callback)
}

/**
 * Convenience methods for logging
 */
export const logger = {
  debug: (message: string, context?: string, data?: any) =>
    getLogger().debug(message, context, data),
  info: (message: string, context?: string, data?: any) =>
    getLogger().info(message, context, data),
  warn: (message: string, context?: string, data?: any) =>
    getLogger().warn(message, context, data),
  error: (message: string, context?: string, data?: any) =>
    getLogger().error(message, context, data)
}
