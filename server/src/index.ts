import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

/* ROUTE IMPORTS */
import auth from './routes/auth';
import courses from './routes/semon';
import gallery from './routes/gallery';
import transactions from './routes/transaction';
import users from './routes/user';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false })
);
app.use(cors());

/* ROUTES */
app.get('/', (req, res) => {
  res.send(
    '<html><body><h1>Welcome to the Home Route</h1></body></html>'
  );
});

app.use('/identity-impact-hub/auth', auth);
app.use('/identity-impact-hub/users', users);
app.use('/identity-impact-hub/courses', courses);
app.use('/identity-impact-hub/gallery', gallery);
app.use(
  '/identity-impact-hub/transactions',
  transactions
);

/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
