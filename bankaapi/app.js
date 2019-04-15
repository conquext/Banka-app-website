import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import path from 'path';
import authRouter from './routes/authRouter';
import accountRouter from './routes/accountRouter';
import transactionRouter from './routes/transactionRouter';
import userRouter from './routes/userRouter';

const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

// app.use('/api/v1/', express.static(path.join(__dirname, 'routes')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/transactions', transactionRouter);

// serve file from any static folder
app.use('/', express.static(path.resolve(__dirname, '')));

app.get('/', (req, res) => res.send(`The app is running at port:${PORT}`));

app.get('/api/v1/auth', (req, res) => {
  res.status(200).send({
    message: 'Welcome to Banka API',
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

export default app;
