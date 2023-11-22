import express from 'express';
import todoController from './controllers/todoController.js';
import cookieParser from  'cookie-parser';
import session from 'express-session';

const app = express();
app.listen(3000);

app.use(session({secret: '123456', resave: true, saveUninitialized: true}))
app.set('view engine', 'ejs');
app.use(express.static('./public'));

todoController(app);

console.log('Listening port 3000');
