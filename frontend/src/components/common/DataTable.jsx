import { memo, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Skeleton,
  Box,
  Typography,
  Checkbox,
} from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

const DataTableSkeleton = memo(({ rows, columns }) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton variant="text" width={j === 0 ? '60%' : '80%'} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
));
DataTableSkeleton.displayName = 'DataTableSkeleton';

const EmptyTable = memo(({ colSpan, title, description }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <InboxOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
          <Typography variant="h6" fontWeight={600} color="text.secondary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  </TableBody>
));
EmptyTable.displayName = 'EmptyTable';

const ErrorTable = memo(({ colSpan, message, onRetry }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight={600} color="error">
            {message || 'Failed to load data'}
          </Typography>
          {onRetry && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onRetry}
            >
              Try again
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  </TableBody>
));
ErrorTable.displayName = 'ErrorTable';

const DataTable = ({
  columns,
  rows,
  loading,
  error,
  onRetry,
  sortField,
  sortOrder,
  onSort,
  page,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display.',
  stickyHeader = true,
  sx,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getRowId: getRowIdProp,
}) => {
  const getRowId = useCallback(
    (row) => (getRowIdProp ? getRowIdProp(row) : row?._id || row?.id),
    [getRowIdProp]
  );

  const handleSort = useCallback(
    (field) => {
      if (!onSort) return;
      const isAsc = sortField === field && sortOrder === 'asc';
      onSort(field, isAsc ? 'desc' : 'asc');
    },
    [onSort, sortField, sortOrder]
  );

  const visibleIds = useMemo(() => rows.map((row) => row._id || row.id), [rows]);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const someSelected = visibleIds.some((id) => selectedIds.includes(id));

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
    } else {
      const newSelected = [...selectedIds];
      visibleIds.forEach((id) => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      onSelectionChange(newSelected);
    }
  }, [onSelectionChange, allSelected, selectedIds, visibleIds]);

  const handleSelectOne = useCallback(
    (id) => {
      if (!onSelectionChange) return;
      const idx = selectedIds.indexOf(id);
      if (idx !== -1) {
        onSelectionChange(selectedIds.filter((x) => x !== id));
      } else {
        onSelectionChange([...selectedIds, id]);
      }
    },
    [onSelectionChange, selectedIds]
  );

  const checkboxColumn = useMemo(
    () => ({
      field: '_checkbox',
      label: '',
      sortable: false,
      renderHeader: () => (
        <Checkbox
          size="small"
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={handleSelectAll}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.includes(getRowId(row))}
          onChange={() => handleSelectOne(getRowId(row))}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      headerSx: { width: 48, px: 0.5 },
      cellSx: { width: 48, px: 0.5 },
    }),
    [allSelected, someSelected, handleSelectAll, selectedIds, handleSelectOne, getRowId]
  );

  const actualColumns = useMemo(
    () => (selectable ? [checkboxColumn, ...columns] : columns),
    [selectable, checkboxColumn, columns]
  );

  const colSpan = actualColumns.length;

  const handleRowClick = useCallback((row) => onRowClick?.(row), [onRowClick]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <TableContainer>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {actualColumns.map((col) => (
                <TableCell
                  key={col.field || col.label}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    bgcolor: 'grey.50',
                    whiteSpace: 'nowrap',
                    ...col.headerSx,
                  }}
                >
                  {col.renderHeader ? (
                    col.renderHeader()
                  ) : col.sortable !== false && onSort ? (
                    <TableSortLabel
                      active={sortField === col.field}
                      direction={sortField === col.field ? sortOrder : 'asc'}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading ? (
            <DataTableSkeleton rows={5} columns={colSpan} />
          ) : error ? (
            <ErrorTable colSpan={colSpan} message={error} onRetry={onRetry} />
          ) : rows.length === 0 ? (
            <EmptyTable colSpan={colSpan} title={emptyTitle} description={emptyDescription} />
          ) : (
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={row._id || row.id || i}
                  hover={!!onRowClick}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  {actualColumns.map((col) => (
                    <TableCell
                      key={col.field || col.label}
                      sx={{
                        whiteSpace: col.nowrap ? 'nowrap' : 'normal',
                        ...col.cellSx,
                      }}
                    >
                      {col.render ? col.render(row) : (row[col.field] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
  );
};

export default memo(DataTable);
