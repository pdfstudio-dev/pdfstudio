import { Table } from '../../src/tables/Table'
import { PDFWriter } from '../../src/core/PDFWriter'
import { TableOptions } from '../../src/types'

describe('Table', () => {
  let writer: PDFWriter

  beforeEach(() => {
    // Create a Letter-sized page (612 x 792 points)
    writer = new PDFWriter(612, 792)
  })

  describe('Basic Rendering', () => {
    it('should render a basic table with headers', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['A1', 'B1', 'C1'],
          ['A2', 'B2', 'C2']
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should render table without headers', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        rows: [
          ['A1', 'B1', 'C1'],
          ['A2', 'B2', 'C2']
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should render empty table', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Column 1', 'Column 2'],
        rows: []
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should render table with single row', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Name', 'Value'],
        rows: [['Test', '123']]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Column Configuration', () => {
    it('should use column definitions instead of headers array', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        columns: [
          { header: 'ID', width: 50, align: 'center' },
          { header: 'Name', width: 200, align: 'left' },
          { header: 'Value', width: 250, align: 'right' }
        ],
        rows: [
          ['001', 'Test Item', '$100'],
          ['002', 'Another', '$200']
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle auto width columns', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 600,
        columns: [
          { header: 'Col1', width: 'auto' },
          { header: 'Col2', width: 'auto' },
          { header: 'Col3', width: 'auto' }
        ],
        rows: [['A', 'B', 'C']]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle proportional width columns', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 600,
        columns: [
          { header: 'Col1', width: '*' },
          { header: 'Col2', width: '*' },
          { header: 'Col3', width: '*' }
        ],
        rows: [['A', 'B', 'C']]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle mixed width types', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 600,
        columns: [
          { header: 'ID', width: 50 },        // fixed
          { header: 'Name', width: 'auto' },  // auto
          { header: 'Desc', width: '*' }      // proportional
        ],
        rows: [['1', 'Test', 'Description']]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Styling', () => {
    it('should apply header background color', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B', 'C'],
        rows: [['1', '2', '3']],
        headerStyle: {
          backgroundColor: '#4CAF50',
          textColor: '#FFFFFF',
          fontSize: 12,
          height: 40
        }
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should apply alternating row colors', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [
          ['Row 1', 'Data 1'],
          ['Row 2', 'Data 2'],
          ['Row 3', 'Data 3'],
          ['Row 4', 'Data 4']
        ],
        alternateRowColor: '#F0F0F0'
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should apply cell-level styling', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Status', 'Message'],
        rows: [
          [
            { content: 'Success', backgroundColor: '#4CAF50', textColor: '#FFFFFF' },
            'Operation completed'
          ],
          [
            { content: 'Error', backgroundColor: '#F44336', textColor: '#FFFFFF' },
            'Operation failed'
          ]
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should respect custom row height', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        rowHeight: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should respect cell padding', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        cellPadding: 15
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Text Alignment', () => {
    it('should handle left alignment', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Left'],
        rows: [['Text']],
        defaultAlign: 'left'
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle center alignment', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Center'],
        rows: [['Text']],
        defaultAlign: 'center'
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle right alignment', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Right'],
        rows: [['Text']],
        defaultAlign: 'right'
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle vertical alignment - top', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Top'],
        rows: [['Text']],
        defaultVAlign: 'top',
        rowHeight: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle vertical alignment - middle', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Middle'],
        rows: [['Text']],
        defaultVAlign: 'middle',
        rowHeight: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle vertical alignment - bottom', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Bottom'],
        rows: [['Text']],
        defaultVAlign: 'bottom',
        rowHeight: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Borders', () => {
    it('should render table with borders enabled', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        borders: true
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should render table with borders disabled', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        borders: false
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should apply custom border styles', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        borders: {
          top: { color: '#FF0000', width: 3, style: 'solid' },
          bottom: { color: '#0000FF', width: 3, style: 'solid' },
          left: { color: '#00FF00', width: 2, style: 'solid' },
          right: { color: '#FFA500', width: 2, style: 'solid' },
          horizontal: { color: '#CCCCCC', width: 1, style: 'solid' },
          vertical: { color: '#CCCCCC', width: 1, style: 'solid' },
          header: { color: '#000000', width: 2, style: 'solid' }
        }
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle partial border configuration', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        borders: {
          top: { color: '#FF0000', width: 2 },
          horizontal: true
        }
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Auto Page Break', () => {
    it('should handle auto page break disabled', () => {
      const rows: string[][] = []
      for (let i = 1; i <= 50; i++) {
        rows.push([`Row ${i}`, `Data ${i}`])
      }

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['#', 'Data'],
        rows,
        autoPageBreak: false
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle auto page break enabled', () => {
      const rows: string[][] = []
      for (let i = 1; i <= 50; i++) {
        rows.push([`Row ${i}`, `Data ${i}`])
      }

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['#', 'Data'],
        rows,
        autoPageBreak: true,
        repeatHeader: true,
        bottomMargin: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should repeat headers on new page when repeatHeader is true', () => {
      const rows: string[][] = []
      for (let i = 1; i <= 50; i++) {
        rows.push([`Row ${i}`, `Data ${i}`])
      }

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['#', 'Data'],
        rows,
        autoPageBreak: true,
        repeatHeader: true,
        bottomMargin: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should not repeat headers when repeatHeader is false', () => {
      const rows: string[][] = []
      for (let i = 1; i <= 50; i++) {
        rows.push([`Row ${i}`, `Data ${i}`])
      }

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['#', 'Data'],
        rows,
        autoPageBreak: true,
        repeatHeader: false,
        bottomMargin: 50
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should respect custom bottom margin', () => {
      const rows: string[][] = []
      for (let i = 1; i <= 50; i++) {
        rows.push([`Row ${i}`, `Data ${i}`])
      }

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['#', 'Data'],
        rows,
        autoPageBreak: true,
        bottomMargin: 100
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle table with all features combined', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        columns: [
          { header: 'ID', width: 50, align: 'center' },
          { header: 'Name', width: 200, align: 'left' },
          { header: 'Status', width: 150, align: 'center' },
          { header: 'Amount', width: 100, align: 'right' }
        ],
        rows: [
          [
            '001',
            'Item One',
            { content: 'Active', backgroundColor: '#4CAF50', textColor: '#FFFFFF' },
            '$1,234'
          ],
          [
            '002',
            'Item Two',
            { content: 'Pending', backgroundColor: '#FFA500', textColor: '#FFFFFF' },
            '$567'
          ],
          [
            '003',
            'Item Three',
            { content: 'Inactive', backgroundColor: '#9E9E9E', textColor: '#FFFFFF' },
            '$890'
          ]
        ],
        headerStyle: {
          backgroundColor: '#2196F3',
          textColor: '#FFFFFF',
          fontSize: 12,
          bold: true,
          align: 'center',
          valign: 'middle',
          height: 35
        },
        alternateRowColor: '#F5F5F5',
        rowHeight: 30,
        cellPadding: 8,
        borders: {
          top: { color: '#2196F3', width: 3 },
          bottom: { color: '#2196F3', width: 3 },
          left: { color: '#2196F3', width: 2 },
          right: { color: '#2196F3', width: 2 },
          horizontal: { color: '#E0E0E0', width: 1 },
          vertical: { color: '#E0E0E0', width: 1 },
          header: { color: '#2196F3', width: 2 }
        }
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle numeric cell values', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['ID', 'Value', 'Count'],
        rows: [
          [1, 99.99, 42],
          [2, 149.50, 15],
          [3, 79.95, 8]
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle mixed cell types in same row', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['String', 'Number', 'Object'],
        rows: [
          [
            'Text',
            123,
            { content: 'Styled', backgroundColor: '#FFEB3B' }
          ]
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle very wide tables', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 1000,
        headers: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        rows: [
          ['1', '2', '3', '4', '5', '6', '7', '8']
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle many rows efficiently', () => {
      const rows: string[][] = []
      for (let i = 1; i <= 100; i++) {
        rows.push([`${i}`, `Item ${i}`, `Value ${i}`])
      }

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['ID', 'Item', 'Value'],
        rows,
        autoPageBreak: true,
        repeatHeader: true
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string cells', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B', 'C'],
        rows: [
          ['', '', ''],
          ['Text', '', 'More']
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle very long cell content', () => {
      const longText = 'This is a very long text that might exceed the cell width and needs to be handled properly'

      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['Short', 'Long'],
        rows: [
          ['A', longText]
        ]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle minimum width table', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 50,
        headers: ['A'],
        rows: [['1']]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle single column table', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 200,
        headers: ['Single'],
        rows: [['A'], ['B'], ['C']]
      }

      const table = new Table(writer, options)
      expect(() => table.render()).not.toThrow()
    })

    it('should handle table at different Y positions', () => {
      const positions = [100, 300, 500, 700]

      positions.forEach(yPos => {
        const options: TableOptions = {
          x: 50,
          y: yPos,
          width: 500,
          headers: ['A', 'B'],
          rows: [['1', '2']]
        }

        const table = new Table(writer, options)
        expect(() => table.render()).not.toThrow()
      })
    })

    it('should handle zero row height gracefully', () => {
      const options: TableOptions = {
        x: 50,
        y: 700,
        width: 500,
        headers: ['A', 'B'],
        rows: [['1', '2']],
        rowHeight: 0
      }

      const table = new Table(writer, options)
      // Should either throw or handle gracefully
      // In this case, we expect it not to crash
      expect(() => table.render()).not.toThrow()
    })
  })
})
