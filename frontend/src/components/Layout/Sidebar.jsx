import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../api/client'

const NAV_ITEMS = [
  { label: 'Inicio / Cargar Excel', icon: <DashboardIcon />, path: '/dashboard' },
]

export default function Sidebar({ drawerWidth }) {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setUser(null)
      navigate('/login')
    }
  }

  const displayName = user
    ? user.first_name
      ? `${user.first_name} ${user.last_name}`.trim()
      : user.username
    : ''

  const initials = displayName
    ? displayName
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2, pt: 3, pb: 2, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={800} color="white" letterSpacing={0.5}>
          Recursos
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'rgba(255,255,255,0.65)', display: 'block', mt: -0.5 }}
        >
          Regiones
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)' }} />

      {/* User info */}
      {user && (
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'rgba(255,255,255,0.25)',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography variant="body2" color="white" fontWeight={600} noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {user.email || user.username}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)' }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.18)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, color: 'white' }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Logout at the bottom */}
      <Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)' }} />
        <List sx={{ py: 1 }}>
          <ListItem disablePadding sx={{ px: 1 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar Sesión"
                primaryTypographyProps={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
