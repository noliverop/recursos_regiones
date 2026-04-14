# Recursos Regiones

Dashboard web para cargar y visualizar archivos Excel con autenticación de usuarios.

## Stack

- **Frontend**: React + Vite + Material UI v5
- **Backend**: Django 4.x + Django REST Framework

---

## Entorno en la nube (Gitpod / Ona)

Los servicios arrancan automáticamente al abrir el entorno. Si las URLs muestran "service unavailable", significa que los servicios están detenidos. Para reiniciarlos:

```bash
gitpod automations service start django
gitpod automations service start vite
```

Las URLs públicas de acceso son:
- **Frontend**: se imprime en los logs del servicio `vite` al arrancar
- **API**: se imprime en los logs del servicio `django` al arrancar

---

## Setup rápido (desarrollo local)

### 1. Backend (Django)

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Instalar dependencias
pip install -r requirements.txt

# Crear base de datos y aplicar migraciones
python manage.py migrate

# Crear superusuario (administrador)
python manage.py createsuperuser

# Iniciar servidor en puerto 8000
python manage.py runserver
```

El backend queda en: http://localhost:8000  
Admin de Django: http://localhost:8000/admin

### 2. Crear usuarios

Los usuarios se crean desde el admin de Django:
1. Ve a http://localhost:8000/admin
2. Inicia sesión con el superusuario creado
3. Ve a **Users → Add user** y crea los usuarios que necesites

### 3. Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto 5173
npm run dev
```

La app queda en: http://localhost:5173

---

## Estructura del proyecto

```
recursos_regiones/
├── backend/
│   ├── config/              # Configuración Django (settings, urls, wsgi)
│   ├── authentication/      # Login, logout, CSRF
│   ├── excel_processor/     # Carga y procesamiento de archivos Excel
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/             # Cliente axios
    │   ├── components/
    │   │   ├── Auth/        # ProtectedRoute
    │   │   ├── Excel/       # FileUpload, DataTable, TabsView
    │   │   └── Layout/      # Sidebar, DashboardLayout
    │   ├── context/         # AuthContext
    │   ├── pages/           # Login, Dashboard
    │   ├── App.jsx
    │   └── theme.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Funcionalidades

- **Autenticación**: Login/logout con sesiones Django
- **Carga de Excel**: Drag & drop o selección de archivo (.xlsx/.xls)
- **Tabla de datos**: Visualización paginada con columna calculada "Días desde Ingreso"
- **Tabs por Unidad Resolutora**: Filtrado automático por cada unidad encontrada en el Excel
