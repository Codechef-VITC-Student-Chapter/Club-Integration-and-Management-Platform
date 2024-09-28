import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


import userRouter from './routes/usersRouter.mjs';
import clubRouter from './routes/clubRouter.mjs';
import authRouter from './routes/authRouter.mjs';
import depsRouter from './routes/depsRouter.mjs';
import contRouter from './routes/contRouter.mjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/userApi', userRouter);
app.use('/clubApi', clubRouter);
app.use('/authApi', authRouter);
app.use('/depsApi', depsRouter);
app.use('/contApi', contRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/apimap', (_req, res) => {
  res.sendFile(join(__dirname, 'sitemap.html'));
});
app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

export default app;
