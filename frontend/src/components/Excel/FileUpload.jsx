import { useState, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { uploadExcel } from '../../api/client'

export default function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const processFile = async file => {
    if (!file) return
    setError('')
    setFileName(file.name)
    setLoading(true)
    try {
      const data = await uploadExcel(file)
      onDataLoaded(data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al procesar el archivo'
      setError(msg)
      onDataLoaded(null)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = e => {
    const file = e.target.files[0]
    // Reset input so the same file can be re-uploaded
    e.target.value = ''
    if (file) processFile(file)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !loading && inputRef.current.click()}
        sx={{
          p: 5,
          textAlign: 'center',
          cursor: loading ? 'default' : 'pointer',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: dragOver ? 'primary.main' : 'primary.light',
          bgcolor: dragOver
            ? 'rgba(21,101,192,0.08)'
            : 'rgba(21,101,192,0.03)',
          transition: 'all 0.2s ease',
          '&:hover': !loading
            ? { bgcolor: 'rgba(21,101,192,0.07)', borderColor: 'primary.main' }
            : {},
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleInputChange}
        />

        {loading ? (
          <Box>
            <CircularProgress size={40} />
            <Typography variant="body1" color="text.secondary" mt={2}>
              Procesando archivo...
            </Typography>
          </Box>
        ) : fileName ? (
          <Box>
            <InsertDriveFileOutlinedIcon
              sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
            />
            <Typography variant="h6" color="primary" fontWeight={600}>
              {fileName}
            </Typography>
            <Chip
              label="Haz clic para cambiar el archivo"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        ) : (
          <Box>
            <UploadFileIcon sx={{ fontSize: 52, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" color="primary" fontWeight={600}>
              Arrastra tu archivo Excel aquí
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              o haz clic para seleccionar &nbsp;
              <Box component="span" fontWeight={600}>
                (.xlsx, .xls)
              </Box>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
