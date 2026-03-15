import {
  LogLevel,
  LogMessage,
  getLogger,
  setLogger,
  setLogLevel,
  setSilentLogger,
  setCustomLogger,
  logger,
} from '../../src/utils/logger';

describe('Logger', () => {
  let consoleSpy: {
    debug: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    // Reset to default logger (WARN level) before each test
    setLogLevel(LogLevel.WARN);

    // Spy on console methods and suppress output
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ConsoleLogger', () => {
    it('should log debug messages when level is DEBUG', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);

      // Act
      getLogger().debug('debug message');

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG'),
        expect.anything()
      );
    });

    it('should log info messages when level is DEBUG', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);

      // Act
      getLogger().info('info message');

      // Assert
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('INFO'),
        expect.anything()
      );
    });

    it('should log warn messages when level is WARN', () => {
      // Arrange
      setLogLevel(LogLevel.WARN);

      // Act
      getLogger().warn('warn message');

      // Assert
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARN'),
        expect.anything()
      );
    });

    it('should log error messages when level is ERROR', () => {
      // Arrange
      setLogLevel(LogLevel.ERROR);

      // Act
      getLogger().error('error message');

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR'),
        expect.anything()
      );
    });

    it('should not log debug messages when level is WARN', () => {
      // Arrange
      setLogLevel(LogLevel.WARN);

      // Act
      getLogger().debug('should not appear');

      // Assert
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it('should not log info messages when level is WARN', () => {
      // Arrange
      setLogLevel(LogLevel.WARN);

      // Act
      getLogger().info('should not appear');

      // Assert
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it('should not log debug or info when level is ERROR', () => {
      // Arrange
      setLogLevel(LogLevel.ERROR);

      // Act
      getLogger().debug('no debug');
      getLogger().info('no info');
      getLogger().warn('no warn');

      // Assert
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log anything when level is NONE', () => {
      // Arrange
      setLogLevel(LogLevel.NONE);

      // Act
      getLogger().debug('no');
      getLogger().info('no');
      getLogger().warn('no');
      getLogger().error('no');

      // Assert
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should include context in log output when provided', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);

      // Act
      getLogger().debug('test message', 'MyContext');

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[MyContext]'),
        expect.anything()
      );
    });

    it('should include data in log output when provided', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);
      const data = { key: 'value' };

      // Act
      getLogger().debug('test message', 'Ctx', data);

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledWith(expect.any(String), data);
    });

    it('should pass empty string as data when no data provided', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);

      // Act
      getLogger().debug('test message');

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledWith(expect.any(String), '');
    });

    it('should include ISO timestamp in log output', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);

      // Act
      getLogger().debug('test');

      // Assert
      const loggedString = consoleSpy.debug.mock.calls[0][0] as string;
      // ISO timestamp starts with a year like 2024-
      expect(loggedString).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should log all levels when set to DEBUG', () => {
      // Arrange
      setLogLevel(LogLevel.DEBUG);

      // Act
      getLogger().debug('d');
      getLogger().info('i');
      getLogger().warn('w');
      getLogger().error('e');

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should log warn and error when level is INFO', () => {
      // Arrange
      setLogLevel(LogLevel.INFO);

      // Act
      getLogger().debug('d');
      getLogger().info('i');
      getLogger().warn('w');
      getLogger().error('e');

      // Assert
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('SilentLogger', () => {
    it('should not produce any console output', () => {
      // Arrange
      setSilentLogger();

      // Act
      getLogger().debug('silent debug');
      getLogger().info('silent info');
      getLogger().warn('silent warn');
      getLogger().error('silent error');

      // Assert
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('CustomLogger', () => {
    it('should call callback with correct LogMessage for debug', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      getLogger().debug('custom debug', 'TestCtx', { foo: 'bar' });

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.DEBUG);
      expect(logMsg.message).toBe('custom debug');
      expect(logMsg.context).toBe('TestCtx');
      expect(logMsg.data).toEqual({ foo: 'bar' });
      expect(logMsg.timestamp).toBeInstanceOf(Date);
    });

    it('should call callback with correct LogMessage for info', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      getLogger().info('info msg');

      // Assert
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.INFO);
      expect(logMsg.message).toBe('info msg');
      expect(logMsg.context).toBeUndefined();
      expect(logMsg.data).toBeUndefined();
    });

    it('should call callback with correct LogMessage for warn', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      getLogger().warn('warn msg', 'WarnCtx');

      // Assert
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.WARN);
      expect(logMsg.message).toBe('warn msg');
      expect(logMsg.context).toBe('WarnCtx');
    });

    it('should call callback with correct LogMessage for error', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      getLogger().error('error msg', undefined, 42);

      // Assert
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.ERROR);
      expect(logMsg.message).toBe('error msg');
      expect(logMsg.data).toBe(42);
    });

    it('should receive all log levels (no filtering in CustomLogger)', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      getLogger().debug('d');
      getLogger().info('i');
      getLogger().warn('w');
      getLogger().error('e');

      // Assert
      expect(callback).toHaveBeenCalledTimes(4);
    });
  });

  describe('setLogger', () => {
    it('should allow setting a custom Logger implementation', () => {
      // Arrange
      const customImpl = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };
      setLogger(customImpl);

      // Act
      getLogger().warn('test');

      // Assert
      expect(customImpl.warn).toHaveBeenCalledWith('test');
    });
  });

  describe('logger convenience object', () => {
    it('should delegate debug to current global logger', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      logger.debug('convenience debug', 'Ctx', { x: 1 });

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.DEBUG);
      expect(logMsg.message).toBe('convenience debug');
    });

    it('should delegate info to current global logger', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      logger.info('convenience info');

      // Assert
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.INFO);
    });

    it('should delegate warn to current global logger', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      logger.warn('convenience warn');

      // Assert
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.WARN);
    });

    it('should delegate error to current global logger', () => {
      // Arrange
      const callback = jest.fn();
      setCustomLogger(callback);

      // Act
      logger.error('convenience error');

      // Assert
      const logMsg: LogMessage = callback.mock.calls[0][0];
      expect(logMsg.level).toBe(LogLevel.ERROR);
    });

    it('should reflect logger changes dynamically', () => {
      // Arrange
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      // Act
      setCustomLogger(callback1);
      logger.info('first');
      setCustomLogger(callback2);
      logger.info('second');

      // Assert
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('LogLevel enum values', () => {
    it('should have correct numeric ordering', () => {
      // Assert
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
      expect(LogLevel.NONE).toBe(4);
    });

    it('should have DEBUG < INFO < WARN < ERROR < NONE', () => {
      // Assert
      expect(LogLevel.DEBUG).toBeLessThan(LogLevel.INFO);
      expect(LogLevel.INFO).toBeLessThan(LogLevel.WARN);
      expect(LogLevel.WARN).toBeLessThan(LogLevel.ERROR);
      expect(LogLevel.ERROR).toBeLessThan(LogLevel.NONE);
    });
  });
});
