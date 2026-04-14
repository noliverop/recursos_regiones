import pandas as pd
from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

DATE_COLUMN = 'Fecha Ingreso Recurso'
UNIT_COLUMN = 'Unidad Resolutora'
DAYS_COLUMN = 'Días desde Ingreso'


def _parse_date(val):
    """Try to parse a value as a date, returning None on failure."""
    if pd.isna(val):
        return None
    try:
        if isinstance(val, str):
            # Try ISO format first, then let pandas infer
            parsed = pd.to_datetime(val, format='%Y-%m-%d', errors='coerce')
            if pd.isna(parsed):
                parsed = pd.to_datetime(val, errors='coerce')
        else:
            parsed = pd.to_datetime(val, errors='coerce')

        return None if pd.isna(parsed) else parsed.date()
    except Exception:
        return None


class ExcelUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response(
                {'error': 'No se recibió ningún archivo'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not file.name.lower().endswith(('.xlsx', '.xls')):
            return Response(
                {'error': 'El archivo debe ser formato Excel (.xlsx o .xls)'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            df = pd.read_excel(file, engine='openpyxl')
        except Exception as exc:
            return Response(
                {'error': f'Error al leer el archivo: {str(exc)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add computed days column if the date column exists
        if DATE_COLUMN in df.columns:
            today = date.today()

            def calc_days(val):
                d = _parse_date(val)
                return (today - d).days if d is not None else None

            df[DAYS_COLUMN] = df[DATE_COLUMN].apply(calc_days)

        # Convert datetime columns to ISO strings for JSON serialization
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.strftime('%Y-%m-%d')

        # Replace NaN / NaT / NA with None so JSON serializes cleanly
        df = df.where(pd.notna(df), other=None)

        columns = list(df.columns)
        rows = df.to_dict(orient='records')

        # Unique Unidad Resolutora values (preserving order of appearance)
        unidades = []
        if UNIT_COLUMN in df.columns:
            seen = set()
            for val in df[UNIT_COLUMN]:
                if val is not None and val not in seen:
                    seen.add(val)
                    unidades.append(val)

        return Response({
            'columns': columns,
            'rows': rows,
            'unidades_resolutoras': unidades,
            'total_rows': len(rows),
        })
