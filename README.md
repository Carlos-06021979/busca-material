# 📦 Busca Material - Control y Ubicación de Almacén

**Busca Material** es una aplicación web moderna, responsive y multiterminal diseñada para el control físico de stock en almacenes, localización exacta por zonas (naves, altillos, carpas, patio), trazabilidad por número de lote y fechas (fabricación, entrada, caducidad), e historial imborrable de movimientos por operario.

---

## ✨ Características Principales

1. **Ubicación Física y Dinámica:**
   - Gestión y edición de zonas: *Altillo 1, Altillo 2, Carpa 1, Carpa 2, Nave 1, Patio Exterior*, etc.
   - Posibilidad de crear e inventariar en **sitios o zonas completamente nuevas**.
   - Definición de coordenadas exactas: **Fila / Pasillo**, **Posición / Hueco**, **Estantería / Nivel**.

2. **Buscador Inteligente de Stock:**
   - Consulta instantánea por **Nombre de Material**, **Código SKU** o **Número de Lote**.
   - Muestra el **Stock Total acumulado** y el desglose de en qué sitios específicos se encuentra almacenado.

3. **Operaciones de Inventario:**
   - 🟢 **Entradas de Material**: Registro con lote, fecha de fabricación, fecha de entrada, ubicación destino y observaciones.
   - 🔴 **Salidas de Material**: Retiro parcial o total con motivo documentado.
   - 🔄 **Traslados / Intercambios**: Movimiento directo entre dos ubicaciones manteniendo el control del lote.

4. **Trazabilidad & Historial de Usuario:**
   - Registro cronológico imborrable de cada movimiento: *Quién lo realizó*, *Fecha y hora exacta*, *Material*, *Lote*, *Origen y Destino*.
   - **Registro de Fallos / Log de Errores**: Pestaña dedicada a la auditoría técnica de fallos.

5. **Modo Especial Auditoría:**
   - Vista optimizada para inspecciones de calidad e inventarios externos.
   - Generación de informes imprimibles y exportación a **Excel / CSV**.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + Vite.
- **Iconos**: Lucide React.
- **Estilos**: Vanilla CSS3 Modern (Glassmorphism, Tema Oscuro/Claro, CSS Grid & Flexbox, Google Fonts Inter & Outfit).
- **Backend / Database**: **Supabase** (PostgreSQL + Auth + Row Level Security) con **Modo Híbrido LocalStorage** (funciona inmediatamente en modo demostración local sin configuración previa).

---

## 🚀 Inicio Rápido en Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador o dispositivo móvil en la misma red.

---

## 🗄️ Configuración de Supabase (Opcional)

Para conectar tu propia base de datos gratuita en Supabase:

1. Crea un proyecto en [Supabase.com](https://supabase.com).
2. Ve al **SQL Editor** en tu panel de Supabase y ejecuta el script completo contenido en [`supabase_schema.sql`](file:///g:/TRABAJO/APLICACIONES%20DE%20ALMACEN/APLICACIONES%20PARA%20LEVANTE%20SUR/APLICACION%20SITUACION%20MATERIALES/BUSCA%20MATERIAL/supabase_schema.sql).
3. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Añade tus credenciales de Supabase (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
5. La aplicación cambiará automáticamente a sincronización en la nube.

---

## 🐙 Repositorio en GitHub

El repositorio está listo para sincronizar con tu GitHub:

```bash
git remote add origin https://github.com/Carlos-06021979/busca-material.git
git push -u origin main
```
