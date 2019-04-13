import express from 'express';
import bodyParser from 'body-parser';
import { authRouter, userRouter, accountRouter, transactionRouter } from '../routes';


const app = express();
const port = process.env.PORT || 4000;


app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/transactions', transactionRouter);

// serve file from any static folder
app.use('/', express.static(path.resolve(__dirname, '')));
app.use('*', express.static(path.resolve(__dirname, '')));

app.get('/', (req, res) => res.send(`The app is running at http://localhost:${port}`));

app.get('/api/v1/auth', (req, res) => {
  res.status(200).send({
    message: 'Welcome to Banka',
  });
});


app.listen(port, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

export default app;