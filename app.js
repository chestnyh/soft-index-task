const express = require('express');
const app = express();
const themeRoutes = require('./api/routes/theme');
 
app.use('/theme', themeRoutes);

app.use(function(req, res, next) {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.json({
        err: {
            message : err.message
        }
    });
});

module.exports = app;