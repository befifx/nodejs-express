import createHttpError from 'http-errors';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { router as indexRouter } from './routes/index';
import { router as usersRouter } from './routes/users';
import { router as execbatRouter} from './routes/execbat';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/execbat', execbatRouter);

app.use((req: Request, res: Response, next: NextFunction) => next(createHttpError(404)));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
// 追加コード
app.listen(3000, () => {
  console.log('start port to 3000');
  console.log('http://localhost:3000');
});

module.exports = app;
