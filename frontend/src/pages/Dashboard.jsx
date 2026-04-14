import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import DashboardLayout from '../components/Layout/DashboardLayout'
import FileUpload from '../components/Excel/FileUpload'
import TabsView from '../components/Excel/TabsView'

export default function Dashboard() {
  const [excelData, setExcelData] = useState(null)

  return (
    <DashboardLayout>
      <Typography variant="h5" fontWeight={700} color="text.primary" mb={0.5}>
        Carga de Excel
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Sube un archivo Excel para visualizar y explorar los datos.
      </Typography>

      <FileUpload onDataLoaded={setExcelData} />

      {excelData && (
        <Box mt={4}>
          <TabsView data={excelData} />
        </Box>
      )}
    </DashboardLayout>
  )
}
