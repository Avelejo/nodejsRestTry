//definimos las rutas donde trabajaremos con usuarios

//constantes y librerias que usaremos para 
const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const _ = require('underscore')

//web principal respondemos con un objeto json con hello word"
app.get('/', function(req, res) {
        res.json('Hello World')
    })
    // obtenemos usuarios
app.get('/usuario', function(req, res) {

        let desde = req.query.desde || 0;

        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite)
        Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuentas: conteo
                    })
                })


            })


    })
    // ingresar usuarios en db
app.post('/usuario', function(req, res) {
    // guardamos la respuesta
    let body = req.body;
    // creamos arreglo usuario con las validaciones, model, de usuario con los datos recogidos
    let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role

        })
        //guardamos el usuario en la DB


    usuario.save((err, usuarioDB) => {
        // si hay un error devolvemos un objeto json con el error y salimos
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;

        //devolvemos que se ha guardado como objeto json
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });





    //actualizar registro


})


app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', ]

    );




    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })



    })




})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User no encontrado',
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



})
module.exports = app;