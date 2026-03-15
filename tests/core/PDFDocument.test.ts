import { PDFDocument } from '../../src/core/PDFDocument';
import { PAGE_SIZES } from '../../src/types';

describe('PDFDocument', () => {
  // ─── Document Creation & Configuration ───

  describe('Document Creation & Configuration', () => {
    it('should create a document with default options', () => {
      const doc = new PDFDocument();

      expect(doc.getPageWidth()).toBe(PAGE_SIZES['A4'][0]);
      expect(doc.getPageHeight()).toBe(PAGE_SIZES['A4'][1]);
      expect(doc.getPageCount()).toBe(1);
    });

    it('should create a document with custom page size', () => {
      const doc = new PDFDocument({ size: 'Letter' });

      expect(doc.getPageWidth()).toBe(612);
      expect(doc.getPageHeight()).toBe(792);
    });

    it('should create a document with custom numeric page size', () => {
      const doc = new PDFDocument({ size: [400, 600] });

      expect(doc.getPageWidth()).toBe(400);
      expect(doc.getPageHeight()).toBe(600);
    });

    it('should create a document with landscape orientation', () => {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

      // Landscape swaps width and height
      expect(doc.getPageWidth()).toBe(PAGE_SIZES['A4'][1]);
      expect(doc.getPageHeight()).toBe(PAGE_SIZES['A4'][0]);
    });

    it('should create a document with custom margins (uniform)', () => {
      const doc = new PDFDocument({ margins: 50 });

      const margins = doc.getMargins();
      expect(margins.top).toBe(50);
      expect(margins.right).toBe(50);
      expect(margins.bottom).toBe(50);
      expect(margins.left).toBe(50);
    });

    it('should create a document with custom margins (per-side)', () => {
      const doc = new PDFDocument({
        margins: { top: 10, right: 20, bottom: 30, left: 40 },
      });

      const margins = doc.getMargins();
      expect(margins.top).toBe(10);
      expect(margins.right).toBe(20);
      expect(margins.bottom).toBe(30);
      expect(margins.left).toBe(40);
    });

    it('should create a document with metadata', () => {
      // Metadata is passed to the writer; we verify no error is thrown
      const doc = new PDFDocument({
        info: {
          Title: 'Test Document',
          Author: 'Test Author',
          Subject: 'Testing',
          Keywords: 'pdf, test, unit',
        },
      });

      expect(doc).toBeDefined();
      expect(doc.getPageCount()).toBe(1);
    });

    it('should create a document with compression options', () => {
      const doc = new PDFDocument({
        compression: {
          compressStreams: true,
          compressionLevel: 6,
        },
      });

      expect(doc).toBeDefined();
      expect(doc.getPageCount()).toBe(1);
    });

    it('should create a document without auto first page', () => {
      const doc = new PDFDocument({ autoFirstPage: false });

      expect(doc.getPageCount()).toBe(0);
    });
  });

  // ─── Page Management ───

  describe('Page Management', () => {
    it('should add pages', () => {
      const doc = new PDFDocument();

      doc.addPage();

      expect(doc.getPageCount()).toBe(2);
    });

    it('should add multiple pages', () => {
      const doc = new PDFDocument();

      doc.addPage();
      doc.addPage();
      doc.addPage();

      expect(doc.getPageCount()).toBe(4);
    });

    it('should add a page with a specific size', () => {
      const doc = new PDFDocument();

      doc.addPage('Letter');

      expect(doc.getPageCount()).toBe(2);
    });

    it('should add a page with custom dimensions', () => {
      const doc = new PDFDocument();

      doc.addPage([300, 500]);

      expect(doc.getPageCount()).toBe(2);
    });

    it('should switch between pages', () => {
      const doc = new PDFDocument();
      doc.addPage();
      doc.addPage();

      doc.switchToPage(0);

      expect(doc.getCurrentPageNumber()).toBe(1); // 1-indexed
    });

    it('should get page count', () => {
      const doc = new PDFDocument();

      expect(doc.getPageCount()).toBe(1);

      doc.addPage();
      expect(doc.getPageCount()).toBe(2);
    });

    it('should delete a page', () => {
      const doc = new PDFDocument();
      doc.addPage();
      doc.addPage();

      doc.deletePage(1);

      expect(doc.getPageCount()).toBe(2);
    });

    it('should duplicate a page', () => {
      const doc = new PDFDocument();
      doc.addPage();

      const newIndex = doc.duplicatePage(0);

      expect(doc.getPageCount()).toBe(3);
      expect(newIndex).toBe(1); // Inserted after original at index 0
    });

    it('should rotate a page', () => {
      const doc = new PDFDocument();

      // Should not throw
      doc.rotatePage(0, 90);

      expect(doc.getPageCount()).toBe(1);
    });

    it('should rotate the current page', () => {
      const doc = new PDFDocument();

      doc.rotateCurrentPage(180);

      expect(doc.getPageCount()).toBe(1);
    });

    it('should reorder pages', () => {
      const doc = new PDFDocument();
      doc.addPage();
      doc.addPage();

      // Reverse the order
      doc.reorderPages([2, 1, 0]);

      expect(doc.getPageCount()).toBe(3);
    });

    it('should return this for chaining on page operations', () => {
      const doc = new PDFDocument();

      const result = doc.addPage();

      expect(result).toBe(doc);
    });
  });

  // ─── Text Operations ───

  describe('Text Operations', () => {
    it('should write basic text', () => {
      const doc = new PDFDocument();

      const result = doc.text('Hello World', 100, 700);

      expect(result).toBe(doc);
    });

    it('should write text with font size', () => {
      const doc = new PDFDocument();

      const result = doc.text('Hello World', 100, 700, 24);

      expect(result).toBe(doc);
    });

    it('should write text with a specific base font', () => {
      const doc = new PDFDocument();

      const result = doc.text('Hello World', 100, 700, 14, 'Courier');

      expect(result).toBe(doc);
    });

    it('should write text with options object', () => {
      const doc = new PDFDocument();

      const result = doc.text('Hello World', 100, 700, 12, {
        align: 'center',
      });

      expect(result).toBe(doc);
    });

    it('should write text with advanced options API', () => {
      const doc = new PDFDocument();

      const result = doc.text('Hello World', {
        x: 100,
        y: 700,
        fontSize: 16,
        font: 'Helvetica-Bold',
        align: 'center',
        width: 400,
      });

      expect(result).toBe(doc);
    });

    it('should write text with left alignment', () => {
      const doc = new PDFDocument();

      const result = doc.text('Left aligned', {
        x: 100,
        y: 700,
        align: 'left',
        width: 400,
      });

      expect(result).toBe(doc);
    });

    it('should write text with center alignment', () => {
      const doc = new PDFDocument();

      const result = doc.text('Centered', {
        x: 100,
        y: 700,
        align: 'center',
        width: 400,
      });

      expect(result).toBe(doc);
    });

    it('should write text with right alignment', () => {
      const doc = new PDFDocument();

      const result = doc.text('Right aligned', {
        x: 100,
        y: 700,
        align: 'right',
        width: 400,
      });

      expect(result).toBe(doc);
    });

    it('should write a list with bullets', () => {
      const doc = new PDFDocument();

      const result = doc.list(['Item 1', 'Item 2', 'Item 3'], 100, 700);

      expect(result).toBe(doc);
    });

    it('should write a list with options', () => {
      const doc = new PDFDocument();

      const result = doc.list(['Step 1', 'Step 2'], 100, 700, {
        bulletStyle: 'decimal',
        fontSize: 14,
      });

      expect(result).toBe(doc);
    });

    it('should adjust Y position with moveDown', () => {
      const doc = new PDFDocument();
      doc.text('First line', 100, 700, 12);
      const yBefore = doc.getCurrentY();

      doc.moveDown();

      const yAfter = doc.getCurrentY();
      expect(yAfter).toBeLessThan(yBefore);
    });

    it('should adjust Y position with moveUp', () => {
      const doc = new PDFDocument();
      doc.text('First line', 100, 700, 12);
      doc.moveDown(3);
      const yBefore = doc.getCurrentY();

      doc.moveUp();

      const yAfter = doc.getCurrentY();
      expect(yAfter).toBeGreaterThan(yBefore);
    });

    it('should moveDown multiple lines', () => {
      const doc = new PDFDocument();
      doc.text('Line', 100, 700, 12);
      const yBefore = doc.getCurrentY();

      doc.moveDown(3);

      const yAfter = doc.getCurrentY();
      expect(yAfter).toBeLessThan(yBefore);
    });

    it('should return this from moveDown and moveUp for chaining', () => {
      const doc = new PDFDocument();
      doc.text('Line', 100, 700, 12);

      expect(doc.moveDown()).toBe(doc);
      expect(doc.moveUp()).toBe(doc);
    });

    it('should measure string width', () => {
      const doc = new PDFDocument();

      const width = doc.widthOfString('Hello', 12);

      expect(width).toBeGreaterThan(0);
    });

    it('should measure string height', () => {
      const doc = new PDFDocument();

      const height = doc.heightOfString('Hello', 12);

      expect(height).toBeGreaterThan(0);
    });
  });

  // ─── Drawing Operations ───

  describe('Drawing Operations', () => {
    it('should draw a rectangle', () => {
      const doc = new PDFDocument();

      const result = doc.rect(100, 100, 200, 150);

      expect(result).toBe(doc);
    });

    it('should draw a circle', () => {
      const doc = new PDFDocument();

      const result = doc.circle({ x: 200, y: 200, radius: 50 });

      expect(result).toBe(doc);
    });

    it('should draw an ellipse', () => {
      const doc = new PDFDocument();

      const result = doc.ellipse({ x: 200, y: 200, radiusX: 80, radiusY: 50 });

      expect(result).toBe(doc);
    });

    it('should draw a line using moveTo and lineTo', () => {
      const doc = new PDFDocument();

      const result = doc.moveTo(100, 100).lineTo(300, 300).stroke();

      expect(result).toBe(doc);
    });

    it('should draw a polygon', () => {
      const doc = new PDFDocument();

      const result = doc.polygon({ x: 200, y: 200, radius: 50, sides: 6 });

      expect(result).toBe(doc);
    });

    it('should draw a rounded rectangle', () => {
      const doc = new PDFDocument();

      const result = doc.roundedRect(100, 100, 200, 150, 10);

      expect(result).toBe(doc);
    });

    it('should set fill color', () => {
      const doc = new PDFDocument();

      const result = doc.setFillColor(1, 0, 0);

      expect(result).toBe(doc);
    });

    it('should set stroke color', () => {
      const doc = new PDFDocument();

      const result = doc.setStrokeColor(0, 0, 1);

      expect(result).toBe(doc);
    });

    it('should fill the current path', () => {
      const doc = new PDFDocument();

      doc.rect(100, 100, 200, 150);
      const result = doc.fill();

      expect(result).toBe(doc);
    });

    it('should stroke the current path', () => {
      const doc = new PDFDocument();

      doc.rect(100, 100, 200, 150);
      const result = doc.stroke();

      expect(result).toBe(doc);
    });

    it('should fill and stroke the current path', () => {
      const doc = new PDFDocument();

      doc.setFillColor(1, 0, 0);
      doc.setStrokeColor(0, 0, 0);
      doc.rect(100, 100, 200, 150);
      const result = doc.fillAndStroke();

      expect(result).toBe(doc);
    });

    it('should close a path', () => {
      const doc = new PDFDocument();

      const result = doc.moveTo(100, 100).lineTo(200, 200).lineTo(300, 100).closePath();

      expect(result).toBe(doc);
    });

    it('should validate rectangle parameters', () => {
      const doc = new PDFDocument();

      expect(() => doc.rect(NaN, 100, 200, 150)).toThrow();
    });

    it('should validate coordinate parameters', () => {
      const doc = new PDFDocument();

      expect(() => doc.moveTo(NaN, 100)).toThrow();
    });

    it('should validate RGB color range', () => {
      const doc = new PDFDocument();

      expect(() => doc.setFillColor(2, 0, 0)).toThrow();
    });
  });

  // ─── Fonts ───

  describe('Fonts', () => {
    it('should use Helvetica base font', () => {
      const doc = new PDFDocument();

      const result = doc.useBaseFont('Helvetica');

      expect(result).toBe(doc);
    });

    it('should use Times-Roman base font', () => {
      const doc = new PDFDocument();

      const result = doc.useBaseFont('Times-Roman');

      expect(result).toBe(doc);
    });

    it('should use Courier base font', () => {
      const doc = new PDFDocument();

      const result = doc.useBaseFont('Courier');

      expect(result).toBe(doc);
    });

    it('should get content width', () => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, right: 50, bottom: 50, left: 50 },
      });

      const contentWidth = doc.getContentWidth();

      expect(contentWidth).toBe(PAGE_SIZES['A4'][0] - 100);
    });

    it('should get content height', () => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, right: 50, bottom: 50, left: 50 },
      });

      const contentHeight = doc.getContentHeight();

      expect(contentHeight).toBe(PAGE_SIZES['A4'][1] - 100);
    });
  });

  // ─── Graphics State ───

  describe('Graphics State', () => {
    it('should save and restore graphics state', () => {
      const doc = new PDFDocument();

      const saveResult = doc.saveGraphicsState();
      doc.setFillColor(1, 0, 0);
      const restoreResult = doc.restoreGraphicsState();

      expect(saveResult).toBe(doc);
      expect(restoreResult).toBe(doc);
    });

    it('should set opacity', () => {
      const doc = new PDFDocument();

      const result = doc.opacity(0.5);

      expect(result).toBe(doc);
    });

    it('should validate opacity range', () => {
      const doc = new PDFDocument();

      expect(() => doc.opacity(-0.1)).toThrow();
      expect(() => doc.opacity(1.5)).toThrow();
    });

    it('should set line width', () => {
      const doc = new PDFDocument();

      const result = doc.setLineWidth(2);

      expect(result).toBe(doc);
    });

    it('should validate line width', () => {
      const doc = new PDFDocument();

      expect(() => doc.setLineWidth(-1)).toThrow();
    });

    it('should set line cap style', () => {
      const doc = new PDFDocument();

      const result = doc.setLineCap(1);

      expect(result).toBe(doc);
    });

    it('should set line join style', () => {
      const doc = new PDFDocument();

      const result = doc.setLineJoin(2);

      expect(result).toBe(doc);
    });

    it('should set dash pattern', () => {
      const doc = new PDFDocument();

      const result = doc.dash([5, 10]);

      expect(result).toBe(doc);
    });

    it('should remove dash pattern', () => {
      const doc = new PDFDocument();
      doc.dash([5, 10]);

      const result = doc.undash();

      expect(result).toBe(doc);
    });

    it('should apply transformation matrix', () => {
      const doc = new PDFDocument();

      const result = doc.transform(1, 0, 0, 1, 100, 100);

      expect(result).toBe(doc);
    });

    it('should rotate the coordinate system', () => {
      const doc = new PDFDocument();

      const result = doc.rotate(45);

      expect(result).toBe(doc);
    });

    it('should scale the coordinate system', () => {
      const doc = new PDFDocument();

      const result = doc.scale(2);

      expect(result).toBe(doc);
    });

    it('should translate the coordinate system', () => {
      const doc = new PDFDocument();

      const result = doc.translate(100, 200);

      expect(result).toBe(doc);
    });
  });

  // ─── Document Output ───

  describe('Document Output', () => {
    it('should return a Buffer from toBuffer', async () => {
      const doc = new PDFDocument();
      doc.text('Hello World', 100, 700, 12);

      const buffer = await doc.toBuffer();

      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should produce a buffer starting with %PDF-', async () => {
      const doc = new PDFDocument();
      doc.text('Test', 100, 700, 12);

      const buffer = await doc.toBuffer();
      const header = buffer.subarray(0, 5).toString('ascii');

      expect(header).toBe('%PDF-');
    });

    it('should produce valid PDF with multiple pages', async () => {
      const doc = new PDFDocument();
      doc.text('Page 1', 100, 700, 12);
      doc.addPage();
      doc.text('Page 2', 100, 700, 12);

      const buffer = await doc.toBuffer();

      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should end and write to a piped stream', async () => {
      const doc = new PDFDocument();
      doc.text('Hello', 100, 700, 12);

      const chunks: Buffer[] = [];
      const { Writable } = require('stream');
      const writable = new Writable({
        write(chunk: Buffer, _encoding: string, callback: () => void) {
          chunks.push(chunk);
          callback();
        },
      });

      doc.pipe(writable);
      await doc.end();

      const output = Buffer.concat(chunks);
      expect(output.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    });

    it('should throw if end is called twice', async () => {
      const doc = new PDFDocument();

      await doc.end();

      await expect(doc.end()).rejects.toThrow('Document has already been ended');
    });
  });

  // ─── Margins and Layout ───

  describe('Margins and Layout', () => {
    it('should return correct margins via getMargins', () => {
      const doc = new PDFDocument({
        margins: { top: 10, right: 20, bottom: 30, left: 40 },
      });

      const margins = doc.getMargins();

      expect(margins).toEqual({ top: 10, right: 20, bottom: 30, left: 40 });
    });

    it('should return a copy of margins (not a reference)', () => {
      const doc = new PDFDocument({ margins: 50 });

      const margins = doc.getMargins();
      margins.top = 999;

      expect(doc.getMargins().top).toBe(50);
    });

    it('should update margins with setMargins (uniform)', () => {
      const doc = new PDFDocument();

      doc.setMargins(72);

      const margins = doc.getMargins();
      expect(margins.top).toBe(72);
      expect(margins.right).toBe(72);
      expect(margins.bottom).toBe(72);
      expect(margins.left).toBe(72);
    });

    it('should update margins with setMargins (per-side)', () => {
      const doc = new PDFDocument();

      doc.setMargins({ top: 10, right: 20, bottom: 30, left: 40 });

      const margins = doc.getMargins();
      expect(margins).toEqual({ top: 10, right: 20, bottom: 30, left: 40 });
    });

    it('should return this from setMargins for chaining', () => {
      const doc = new PDFDocument();

      const result = doc.setMargins(50);

      expect(result).toBe(doc);
    });

    it('should return content width (page width minus left and right margins)', () => {
      const doc = new PDFDocument({
        size: 'Letter',
        margins: { top: 50, right: 30, bottom: 50, left: 40 },
      });

      const contentWidth = doc.getContentWidth();

      expect(contentWidth).toBe(612 - 30 - 40);
    });

    it('should return page height', () => {
      const doc = new PDFDocument({ size: 'Letter' });

      expect(doc.getPageHeight()).toBe(792);
    });

    it('should return page width', () => {
      const doc = new PDFDocument({ size: 'Letter' });

      expect(doc.getPageWidth()).toBe(612);
    });

    it('should return content X (left margin)', () => {
      const doc = new PDFDocument({
        margins: { top: 10, right: 20, bottom: 30, left: 40 },
      });

      expect(doc.getContentX()).toBe(40);
    });

    it('should return content Y (page height minus top margin)', () => {
      const doc = new PDFDocument({
        size: 'Letter',
        margins: { top: 50, right: 20, bottom: 30, left: 40 },
      });

      expect(doc.getContentY()).toBe(792 - 50);
    });

    it('should return content bottom (bottom margin)', () => {
      const doc = new PDFDocument({
        margins: { top: 10, right: 20, bottom: 30, left: 40 },
      });

      expect(doc.getContentBottom()).toBe(30);
    });

    it('should return content right (page width minus right margin)', () => {
      const doc = new PDFDocument({
        size: 'Letter',
        margins: { top: 10, right: 20, bottom: 30, left: 40 },
      });

      expect(doc.getContentRight()).toBe(612 - 20);
    });

    it('should recalculate content width after setMargins', () => {
      const doc = new PDFDocument({ size: 'Letter', margins: 0 });

      expect(doc.getContentWidth()).toBe(612);

      doc.setMargins({ top: 0, right: 50, bottom: 0, left: 50 });

      expect(doc.getContentWidth()).toBe(512);
    });

    it('should default margins to 0 when not specified', () => {
      const doc = new PDFDocument();

      const margins = doc.getMargins();

      expect(margins).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    });
  });
});
