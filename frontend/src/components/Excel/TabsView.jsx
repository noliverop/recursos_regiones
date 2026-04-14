import { useState } from 'react'
import { Box, Tab, Tabs, Typography, Chip, Paper } from '@mui/material'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import DataTable from './DataTable'

const UNIT_COLUMN = 'Unidad Resolutora'

function TabPanel({ children, value, index }) {
  return value === index ? <Box pt={2}>{children}</Box> : null
}

export default function TabsView({ data }) {
  const { columns, rows, unidades_resolutoras, total_rows } = data
  const [tab, setTab] = useState(0)

  const getFilteredRows = unidad =>
    rows.filter(row => row[UNIT_COLUMN] === unidad)

  const hasUnidades = unidades_resolutoras && unidades_resolutoras.length > 0

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <TableChartOutlinedIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Datos cargados
        </Typography>
        <Chip
          label={`${total_rows} registros`}
          color="primary"
          size="small"
          sx={{ fontWeight: 600 }}
        />
        {hasUnidades && (
          <Chip
            label={`${unidades_resolutoras.length} unidades resolutoras`}
            color="secondary"
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {hasUnidades ? (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {/* "All" tab */}
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={0.8}>
                    <span>Todos</span>
                    <Chip
                      label={total_rows}
                      size="small"
                      sx={{ height: 18, fontSize: 11, fontWeight: 700 }}
                    />
                  </Box>
                }
              />
              {/* One tab per Unidad Resolutora */}
              {unidades_resolutoras.map(u => (
                <Tab
                  key={u}
                  label={
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <span>{u}</span>
                      <Chip
                        label={getFilteredRows(u).length}
                        size="small"
                        sx={{ height: 18, fontSize: 11, fontWeight: 700 }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* "All" panel */}
          <TabPanel value={tab} index={0}>
            <DataTable columns={columns} rows={rows} />
          </TabPanel>

          {/* One panel per Unidad Resolutora */}
          {unidades_resolutoras.map((u, i) => (
            <TabPanel key={u} value={tab} index={i + 1}>
              <DataTable columns={columns} rows={getFilteredRows(u)} />
            </TabPanel>
          ))}
        </>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}
    </Paper>
  )
}
