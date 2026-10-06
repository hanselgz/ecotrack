import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'EcoTrack API funcionando correctamente', data: null });
});

app.listen(PORT, () => {
  console.log(\[EcoTrack Backend] Servidor ejecutandose en el puerto \\);
});
