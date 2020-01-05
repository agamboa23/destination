const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recommendationRoutes = require('./api/routes/recommendations');
const provincesRoutes = require('./api/routes/provinces');
const districtsRoutes = require('./api/routes/districts');

mongoose.connect(
    "mongodb+srv://destination:n43f8c5bgu5v15bO@cluster0-ncgh8.gcp.mongodb.net/destinationRecSysDB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/recsys/recommendations', recommendationRoutes);
app.use('/recsys/provinces', provincesRoutes);
app.use('/recsys/districts', districtsRoutes);

app.use((req,res,next) => {
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