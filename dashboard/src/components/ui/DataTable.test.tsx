/**
 * ADS INTELLIGENCE Tests - DataTable
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, Column } from './DataTable';

interface TestRow {
  id: string;
  name: string;
  value: number;
  status: 'active' | 'inactive';
}

const mockData: TestRow[] = [
  { id: '1', name: 'Item A', value: 100, status: 'active' },
  { id: '2', name: 'Item B', value: 200, status: 'inactive' },
  { id: '3', name: 'Item C', value: 300, status: 'active' },
];

const columns: Column<TestRow>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name', render: (row: TestRow) => <strong>{row.name}</strong> },
  { key: 'value', header: 'Value', align: 'right' },
  { key: 'status', header: 'Status', render: (row: TestRow) => <span data-testid={`status-${row.id}`}>{row.status}</span> },
];

describe('DataTable', () => {
  it('renders table with headers', () => {
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} />);
    ['ID', 'Name', 'Value', 'Status'].forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} />);
    mockData.forEach((row) => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
      expect(screen.getByText(String(row.value))).toBeInTheDocument();
    });
  });

  it('uses custom render function when provided', () => {
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} />);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    // Strong element from render function
    expect(screen.getByText('Item A').tagName).toBe('STRONG');
  });

  it('calls onSort when sortable header is clicked', () => {
    const onSort = vi.fn();
    const sortableColumns: Column<TestRow>[] = [
      { key: 'id', header: 'ID', sortable: true },
      { key: 'name', header: 'Name' },
    ];
    render(<DataTable columns={sortableColumns} data={mockData} keyExtractor={(r: TestRow) => r.id} onSort={onSort} />);
    fireEvent.click(screen.getByText('ID'));
    expect(onSort).toHaveBeenCalledWith('id');
  });

  it('does not call onSort for non-sortable columns', () => {
    const onSort = vi.fn();
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} onSort={onSort} />);
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).not.toHaveBeenCalled();
  });

  it('shows loading state when loading=true', () => {
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} loading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
  });

  it('shows empty message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} keyExtractor={(r: TestRow) => r.id} emptyMessage="Sem dados" />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });

  it('supports row selection when selectable=true', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={mockData}
        keyExtractor={(r: TestRow) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // First data row checkbox
    fireEvent.click(firstCheckbox);
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('renders select all checkbox in header', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={mockData}
        keyExtractor={(r: TestRow) => r.id}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    expect(selectAllCheckbox).toBeInTheDocument();
  });

  it('applies sticky header class when stickyHeader=true', () => {
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} stickyHeader={true} />);
    const headerRow = screen.getByText('ID').closest('tr');
    expect(headerRow).toHaveClass('sticky');
  });

  it('renders dense row height when rowHeight=dense', () => {
    const { container } = render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} rowHeight="dense" />);
    const row = container.querySelector('tbody tr');
    expect(row).toBeInTheDocument();
  });

  it('handles custom cell alignment', () => {
    render(<DataTable columns={columns} data={mockData} keyExtractor={(r: TestRow) => r.id} />);
    // Value column has align="right" - this applies to data cells (td), not header (th)
    // Find the header and then check its corresponding data cells
    const valueHeader = screen.getByText('Value');
    const columnIndex = 2; // Value is the 3rd column (index 2)
    const valueCells = screen.getAllByText('100'); // First data cell with value 100
    // Check that the data cell has the right alignment via style
    expect(valueCells[0]).toHaveStyle({ textAlign: 'right' });
  });
});
