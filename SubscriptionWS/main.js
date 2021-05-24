const express = require('express');
var app = express();
const subsRouter = require('./Router/subscriptionsRouter')

require('./config/dataBase');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/subscription',subsRouter);


app.listen(8000);
