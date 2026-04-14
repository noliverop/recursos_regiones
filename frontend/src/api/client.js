import axios from 'axios'

// Requests go through Vite's proxy (/api → backend), keeping cookies same-origin.
const API_BASE = '/api'

function getCsrfToken() {
  const match = document.cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('csrftoken='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const csrf = getCsrfToken()
  if (csrf) {
    config.headers['X-CSRFToken'] = csrf
  }
  return config
})

/** Fetches a CSRF cookie so subsequent POST requests work. */
export async function initCsrf() {
  await api.get('/auth/csrf/')
}

export async function login(username, password) {
  const res = await api.post('/auth/login/', { username, password })
  return res.data.user
}

export async function logout() {
  await api.post('/auth/logout/')
}

export async function getMe() {
  const res = await api.get('/auth/me/')
  return res.data
}

export async function uploadExcel(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/excel/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
