import express from 'express';
const app = express();
const morgan = require('morgan');
import { urlencoded, json } from 'body-parser';
import mongoose from 'mongoose';

import recommendationRoutes from './api/routes/recommendations';
import provincesRoutes from './api/routes/provinces';
import districtsRoutes from './api/routes/districts';
import stereotypeRoutes from './api/routes/stereotypes';

mongoose.connect(
    "mongodb+srv://destination:n43f8c5bgu5v15bO@cluster0-ncgh8.gcp.mongodb.net/destinationRecSysDB?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(urlencoded({extended: false}));
app.use(json());

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
app.use('/recsys/stereotypes', stereotypeRoutes);

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
export default app;