import { PDFDocument } from '../../src/core/PDFDocument';
import { ChartDataError, ValidationError } from '../../src/errors';
import {
  BarChartData,
  LineChartData,
  PieChartData,
  GroupedBarChartData,
  StackedBarChartData,
  MultiLineChartData,
} from '../../src/types';

// --- Shared test data ---

const barData: BarChartData[] = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 30 },
];

const lineData: LineChartData[] = [
  { label: 'Jan', value: 10 },
  { label: 'Feb', value: 25 },
  { label: 'Mar', value: 15 },
  { label: 'Apr', value: 30 },
];

const pieData: PieChartData[] = [
  { label: 'Red', value: 40 },
  { label: 'Blue', value: 30 },
  { label: 'Green', value: 30 },
];

const groupedData: GroupedBarChartData[] = [
  { label: 'Q1', values: [10, 20], series: ['Product A', 'Product B'] },
  { label: 'Q2', values: [15, 25], series: ['Product A', 'Product B'] },
];

const stackedData: StackedBarChartData[] = [
  { label: 'Q1', values: [10, 20], series: ['Revenue', 'Cost'] },
  { label: 'Q2', values: [15, 25], series: ['Revenue', 'Cost'] },
];

const multiLineData: MultiLineChartData[] = [
  { label: 'Jan', values: [10, 20], series: ['Series A', 'Series B'] },
  { label: 'Feb', values: [25, 15], series: ['Series A', 'Series B'] },
  { label: 'Mar', values: [15, 30], series: ['Series A', 'Series B'] },
];

const rect = { x: 50, y: 100, width: 400, height: 300 };

describe('BarChart', () => {
  it('should render with valid data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({ data: barData, ...rect });
    }).not.toThrow();
  });

  it('should throw ChartDataError on empty data array', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({ data: [], ...rect });
    }).toThrow(ValidationError);
  });

  it('should throw on invalid rectangle coordinates', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({ data: barData, x: 50, y: 100, width: 0, height: 300 });
    }).toThrow(ValidationError);
  });

  it('should throw on NaN data value', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: [{ label: 'A', value: NaN }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on Infinity data value', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: [{ label: 'A', value: Infinity }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should render with horizontal orientation', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        orientation: 'horizontal',
      });
    }).not.toThrow();
  });

  it('should render with legend enabled', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        barColors: ['#e74c3c', '#3498db', '#2ecc71'],
        legend: { show: true, position: 'top-right' },
      });
    }).not.toThrow();
  });

  it('should render with grid enabled', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        showGrid: true,
        gridStyle: { color: '#cccccc', width: 1 },
      });
    }).not.toThrow();
  });

  it('should render with custom colors', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        barColors: ['#ff0000', '#00ff00', '#0000ff'],
      });
    }).not.toThrow();
  });

  it('should render with shadow options', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        shadow: { enabled: true, offsetX: 3, offsetY: 3 },
      });
    }).not.toThrow();
  });

  it('should render with border options', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        border: { show: true, color: '#000000', width: 2, padding: 10 },
      });
    }).not.toThrow();
  });

  it('should render with gradient options', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        gradient: { enabled: true, colors: ['#3498db', '#2980b9'] },
      });
    }).not.toThrow();
  });

  it('should render with title', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.barChart({
        data: barData,
        ...rect,
        title: 'Sales Report',
      });
    }).not.toThrow();
  });
});

describe('LineChart', () => {
  it('should render with valid data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({ data: lineData, ...rect });
    }).not.toThrow();
  });

  it('should throw on empty data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({ data: [], ...rect });
    }).toThrow(ValidationError);
  });

  it('should throw on invalid rectangle', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({ data: lineData, x: NaN, y: 100, width: 400, height: 300 });
    }).toThrow(ValidationError);
  });

  it('should throw on NaN data value', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: [{ label: 'A', value: NaN }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should render with smooth lines', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: lineData,
        ...rect,
        smooth: true,
      });
    }).not.toThrow();
  });

  it('should render with area fill', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: lineData,
        ...rect,
        fillArea: true,
        fillColor: '#3498db',
        fillOpacity: 0.3,
      });
    }).not.toThrow();
  });

  it('should render with dots (showPoints)', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: lineData,
        ...rect,
        showPoints: true,
        pointSize: 4,
        pointColor: '#e74c3c',
      });
    }).not.toThrow();
  });

  it('should render with grid enabled', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: lineData,
        ...rect,
        showGrid: true,
      });
    }).not.toThrow();
  });

  it('should render with border', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: lineData,
        ...rect,
        border: { show: true, color: '#000000', width: 1, padding: 5 },
      });
    }).not.toThrow();
  });

  it('should render with values shown', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.lineChart({
        data: lineData,
        ...rect,
        showValues: true,
      });
    }).not.toThrow();
  });
});

describe('PieChart', () => {
  it('should render with valid data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: pieData,
        x: 200,
        y: 400,
        radius: 100,
      });
    }).not.toThrow();
  });

  it('should throw on empty data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: [],
        x: 200,
        y: 400,
        radius: 100,
      });
    }).toThrow(ValidationError);
  });

  it('should throw on negative pie value', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: [{ label: 'A', value: -5 }],
        x: 200,
        y: 400,
        radius: 100,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw when all values are zero', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: [
          { label: 'A', value: 0 },
          { label: 'B', value: 0 },
        ],
        x: 200,
        y: 400,
        radius: 100,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on zero radius', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: pieData,
        x: 200,
        y: 400,
        radius: 0,
      });
    }).toThrow(ValidationError);
  });

  it('should render as donut chart', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.donutChart({
        data: pieData,
        x: 200,
        y: 400,
        outerRadius: 100,
        innerRadius: 50,
      });
    }).not.toThrow();
  });

  it('should throw on donut with innerRadius >= outerRadius', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.donutChart({
        data: pieData,
        x: 200,
        y: 400,
        outerRadius: 100,
        innerRadius: 100,
      });
    }).toThrow(ChartDataError);
  });

  it('should render with legend', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: pieData,
        x: 200,
        y: 400,
        radius: 100,
        legend: { show: true, position: 'right' },
      });
    }).not.toThrow();
  });

  it('should render with percentage labels', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: pieData,
        x: 200,
        y: 400,
        radius: 100,
        showPercentages: true,
        showLabels: true,
      });
    }).not.toThrow();
  });

  it('should render with custom colors per slice', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: [
          { label: 'Red', value: 40, color: '#ff0000' },
          { label: 'Blue', value: 30, color: '#0000ff' },
          { label: 'Green', value: 30, color: '#00ff00' },
        ],
        x: 200,
        y: 400,
        radius: 100,
      });
    }).not.toThrow();
  });

  it('should render with border', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.pieChart({
        data: pieData,
        x: 200,
        y: 400,
        radius: 100,
        border: { show: true, color: '#000000', width: 1, padding: 10 },
      });
    }).not.toThrow();
  });

  it('should render donut with center text', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.donutChart({
        data: pieData,
        x: 200,
        y: 400,
        outerRadius: 100,
        innerRadius: 50,
        centerText: 'Total',
      });
    }).not.toThrow();
  });
});

describe('GroupedBarChart', () => {
  it('should render with valid grouped data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.groupedBarChart({ data: groupedData, ...rect });
    }).not.toThrow();
  });

  it('should throw on empty data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.groupedBarChart({ data: [], ...rect });
    }).toThrow(ValidationError);
  });

  it('should throw when group has empty values array', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.groupedBarChart({
        data: [{ label: 'Q1', values: [], series: [] }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on NaN value in group', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.groupedBarChart({
        data: [{ label: 'Q1', values: [10, NaN], series: ['A', 'B'] }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on invalid rectangle', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.groupedBarChart({
        data: groupedData,
        x: 50,
        y: 100,
        width: -10,
        height: 300,
      });
    }).toThrow(ValidationError);
  });

  it('should render with legend', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.groupedBarChart({
        data: groupedData,
        ...rect,
        legend: { show: true, position: 'top-right' },
      });
    }).not.toThrow();
  });
});

describe('StackedBarChart', () => {
  it('should render with valid stacked data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.stackedBarChart({ data: stackedData, ...rect });
    }).not.toThrow();
  });

  it('should throw on empty data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.stackedBarChart({ data: [], ...rect });
    }).toThrow(ValidationError);
  });

  it('should throw when stack has empty values array', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.stackedBarChart({
        data: [{ label: 'Q1', values: [], series: [] }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on Infinity value in stack', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.stackedBarChart({
        data: [{ label: 'Q1', values: [10, Infinity], series: ['A', 'B'] }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on invalid rectangle', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.stackedBarChart({
        data: stackedData,
        x: 50,
        y: 100,
        width: 400,
        height: 0,
      });
    }).toThrow(ValidationError);
  });

  it('should render with title and legend', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.stackedBarChart({
        data: stackedData,
        ...rect,
        title: 'Revenue vs Cost',
        legend: { show: true, position: 'top-right' },
      });
    }).not.toThrow();
  });
});

describe('MultiLineChart', () => {
  it('should render with multiple line datasets', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({ data: multiLineData, ...rect });
    }).not.toThrow();
  });

  it('should throw on empty data', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({ data: [], ...rect });
    }).toThrow(ValidationError);
  });

  it('should throw when data point has empty values', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({
        data: [{ label: 'Jan', values: [], series: [] }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on NaN value in data point', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({
        data: [{ label: 'Jan', values: [10, NaN], series: ['A', 'B'] }],
        ...rect,
      });
    }).toThrow(ChartDataError);
  });

  it('should throw on invalid rectangle', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({
        data: multiLineData,
        x: Infinity,
        y: 100,
        width: 400,
        height: 300,
      });
    }).toThrow(ValidationError);
  });

  it('should render with legend', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({
        data: multiLineData,
        ...rect,
        legend: { show: true, position: 'right' },
      });
    }).not.toThrow();
  });

  it('should render with grid and points', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc.multiLineChart({
        data: multiLineData,
        ...rect,
        showGrid: true,
        showPoints: true,
        pointSize: 4,
      });
    }).not.toThrow();
  });
});

describe('Integration via PDFDocument', () => {
  it('should support barChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.barChart({ data: barData, ...rect });

    expect(result).toBe(doc);
  });

  it('should support pieChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.pieChart({
      data: pieData,
      x: 200,
      y: 400,
      radius: 100,
    });

    expect(result).toBe(doc);
  });

  it('should support lineChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.lineChart({ data: lineData, ...rect });

    expect(result).toBe(doc);
  });

  it('should support groupedBarChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.groupedBarChart({ data: groupedData, ...rect });

    expect(result).toBe(doc);
  });

  it('should support stackedBarChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.stackedBarChart({ data: stackedData, ...rect });

    expect(result).toBe(doc);
  });

  it('should support multiLineChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.multiLineChart({ data: multiLineData, ...rect });

    expect(result).toBe(doc);
  });

  it('should support donutChart method and return this for chaining', () => {
    const doc = new PDFDocument({});

    const result = doc.donutChart({
      data: pieData,
      x: 200,
      y: 400,
      outerRadius: 100,
      innerRadius: 50,
    });

    expect(result).toBe(doc);
  });

  it('should allow chaining multiple chart calls', () => {
    const doc = new PDFDocument({});

    expect(() => {
      doc
        .barChart({ data: barData, ...rect })
        .lineChart({ data: lineData, x: 50, y: 450, width: 400, height: 300 });
    }).not.toThrow();
  });
});
