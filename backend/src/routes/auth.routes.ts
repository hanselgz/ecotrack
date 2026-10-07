import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const correo = req.body.correo || req.body.email;
  const password = req.body.password || req.body.contrasena;

  console.log('peticion recibida en /login:', req.body);

  // Devolver formato completo compatible con Angular
  return res.status(200).json({
    success: true,
    exito: true,
    message: 'Inicio de sesión exitoso',
    token: 'jwt-token-demo-12345',
    data: {
      token: 'jwt-token-demo-12345',
      usuario: {
        id: 1,
        nombre: 'Hansel',
        email: correo,
        rol: 'admin'
      }
    },
    usuario: {
      id: 1,
      nombre: 'Hansel',
      email: correo,
      rol: 'admin'
    }
  });
});

export default router;