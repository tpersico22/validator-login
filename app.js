const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');

var homeRouter = require('./routes/home');
var userRouter = require('./routes/userRoutes');

app.use('/', homeRouter);
app.use('/user', userRouter);


app.get("/404", (req, res) => {
    res.send("Error página no encontrada");
});

app.listen(3500, () => {
    console.log("Servidor funcionando en el puerto 3500");
});
