import { configure, getConfig, resetConfig } from '../../src/config/defaults';

describe('Config defaults', () => {
  afterEach(() => {
    resetConfig();
  });

  describe('getConfig', () => {
    it('should return default configuration', () => {
      const config = getConfig();
      expect(config).toEqual({
        defaultCreator: 'PDFStudio',
        defaultProducer: 'PDFStudio PDF Library',
        defaultAnnotationAuthor: 'PDFStudio',
      });
    });

    it('should return object with defaultCreator', () => {
      const config = getConfig();
      expect(config.defaultCreator).toBe('PDFStudio');
    });

    it('should return a copy, not a reference', () => {
      const config1 = getConfig();
      const config2 = getConfig();
      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
    });
  });

  describe('configure', () => {
    it('should update specific values', () => {
      configure({ defaultCreator: 'My App' });
      const config = getConfig();
      expect(config.defaultCreator).toBe('My App');
    });

    it('should merge with existing config without clearing other fields', () => {
      configure({ defaultCreator: 'My App' });
      const config = getConfig();
      expect(config.defaultCreator).toBe('My App');
      expect(config.defaultProducer).toBe('PDFStudio PDF Library');
      expect(config.defaultAnnotationAuthor).toBe('PDFStudio');
    });
  });

  describe('resetConfig', () => {
    it('should restore defaults after configuration changes', () => {
      configure({
        defaultCreator: 'Custom',
        defaultProducer: 'Custom Producer',
        defaultAnnotationAuthor: 'Custom Author',
      });
      resetConfig();
      const config = getConfig();
      expect(config).toEqual({
        defaultCreator: 'PDFStudio',
        defaultProducer: 'PDFStudio PDF Library',
        defaultAnnotationAuthor: 'PDFStudio',
      });
    });
  });
});
