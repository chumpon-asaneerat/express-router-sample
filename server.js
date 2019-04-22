const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const info = { port: 3000, name: 'express router sample.' };

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

const publicRoute = express.Router();
publicRoute.get('/', (req, res) => {
    res.send('Public home route.')
});
publicRoute.get('/contact', (req, res) => {
    res.send('Public contact route.')
});
publicRoute.get('/about', (req, res) => {
    res.send('Public about route.')
});
publicRoute.all('/login/:id', (req, res) => {
    // req.params: data received from route paramsters like http://.../users/:userId/books/:bookId
    //   req.body: data send inside body content (like application/json)
    //  req.query: query string from url.
    let id = req.body['id'] || req.query['id'] || req.params['id'];
    console.log(`id: ${id}`);

    res.send('Public login route.');
});
app.use('/', publicRoute);

const adminRoute = express.Router();
adminRoute.use((req, res, next) => {
    let { method, originalUrl, protocol } = req;
    console.log(`${method} => ${protocol}://${req.get('host')}${originalUrl}`);
    next();
});
adminRoute.get('/', (req, res) => {
    res.send('Admin home route.')
});
adminRoute.get('/setup', (req, res) => {
    res.send('Admin setup route.')
});
adminRoute.get('/about', (req, res) => {
    res.send('Admin about route.')
});
app.use('/admin', adminRoute);

const server = app.listen(info.port, () => {
    console.log(`${info.name} listen on port: ${info.port}`);
});
