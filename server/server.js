require('./config/config')

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Habilitar carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));

//configuración glbal de rutas
app.use(require('./routes/index'))


mongoose.connect(process.env.URLDB, (err, resp) => {


    if (err) throw err;

    console.log('DataBase online');
});

app.listen(process.env.PORT, () => console.log('escuchando puerto: ', process.env.PORT))