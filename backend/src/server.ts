import app from './app';
import pool from './config/db';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log(' Conexión exitosa a la base de datos MySQL');
    connection.release();
  } catch (error) {
    console.warn(' No se pudo conectar a la base de datos. El servidor continuará en modo desarrollo sin base de datos disponible.');
    console.warn(error);
  }

  app.listen(PORT, () => {
    console.log(` Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();