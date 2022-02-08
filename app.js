const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/route.js');
const { checkToken } = require('./middlewares/authMiddleware');


require('dotenv').config({
    path: path.join(__dirname, "./.env")
});


const PORT = process.env.PORT || 3000;

// Setup MongoDb Connection
mongoose
    .connect('mongodb://localhost/club')
    .then(() => {
        console.log('Connected to database');
    });
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ 
    extended: true
}));

// Token Check Before Every Route
app.use(checkToken());

app.use('/', routes);

app.listen(PORT, () => {
    console.log('server started at PORT:', PORT);
});