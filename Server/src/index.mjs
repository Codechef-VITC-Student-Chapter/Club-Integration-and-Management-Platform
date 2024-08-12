import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/usersRouter.mjs';
import clubRouter from './routes/clubRouter.mjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use('/userApi', userRouter);
app.use('/clubApi', clubRouter);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

  

export default app;
