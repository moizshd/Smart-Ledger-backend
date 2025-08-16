const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());


app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(morgan('dev'));



// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stores', require('./routes/store.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/items', require('./routes/item.routes'));
app.use('/api/issues', require('./routes/issue.routes'));

module.exports = app;
