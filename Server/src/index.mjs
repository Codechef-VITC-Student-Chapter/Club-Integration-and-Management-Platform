import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

export default app;
