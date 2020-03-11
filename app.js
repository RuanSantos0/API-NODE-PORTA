const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const portaRoutes = require('./api/routes/porta');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')
const dadosPorta = require('./api/mqtt-dadosPorta');

const dbRoute = 'mongodb+srv://ruansantos99:'+ process.env.MONGO_ATLAS_PW +'@api-porta-4p5qa.mongodb.net/test?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;

mongoose.connect(dbRoute, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
     );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/portas', portaRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/mqtt-dadosPorta', dadosPorta);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;