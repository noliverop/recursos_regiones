import { useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Tooltip,
} from '@mui/material'

const DAYS_COLUMN = 'Días desde Ingreso'

function getDaysColor(days) {
  if (days === null || days === undefined) return 'inherit'
  if (days <= 30) return '#e8f5e9'
  if (days <= 90) return '#fff8e1'
  return '#ffebee'
}

function getDaysTextColor(days) {
  if (days === null || days === undefined) return 'inherit'
  if (days <= 30) return '#2e7d32'
  if (days <= 90) return '#f57f17'
  return '#c62828'
}

export default function DataTable({ columns, rows }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const paginated = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

  return (
    <Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ maxHeight: 500, borderRadius: 2 }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    bgcolor: col === DAYS_COLUMN ? 'primary.main' : 'grey.100',
                    color: col === DAYS_COLUMN ? 'white' : 'text.primary',
                    fontSize: 13,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row, idx) => (
              <TableRow key={idx} hover>
                {columns.map(col => {
                  const val = row[col]
                  const isDays = col === DAYS_COLUMN
                  return (
                    <TableCell
                      key={col}
                      sx={{
                        bgcolor: isDays ? getDaysColor(val) : 'inherit',
                        color: isDays ? getDaysTextColor(val) : 'inherit',
                        fontWeight: isDays ? 700 : 400,
                        fontSize: 13,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {val != null ? String(val) : '—'}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count}`
        }
      />
    </Box>
  )
}
