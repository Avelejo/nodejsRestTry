const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

let app = express();
const _ = require('underscore')

let Categoria = require('../models/categoria');

// =========================================
// Mostrar todas las categorías
// =========================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuentas: conteo
                })
            })


        })
});

// =========================================
// Mostrar una categoria por id
// =========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    Categoria.findById(req.params.id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No existe ese id :>',
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});


// =========================================
// Crear nueva categoria
// =========================================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    // guardamos la respuesta
    let body = req.body;
    // creamos arreglo usuario con las validaciones, model, de usuario con los datos recogidos
    let categoria = new Categoria({ nombre: body.nombre, usuario: req.usuario._id })


    //guardamos el usuario en la DB
    categoria.save((err, categoriaDB) => {
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
            categoria: categoriaDB
        })

    });


});


// =========================================
// Actualizar una categoría
// =========================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre']);




    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })



    })

});

// =========================================
// Actualizar una categoría
// =========================================
app.delete('/categoria/:id', verificaToken, (req, res) => {

    // solo administrador puede borrar. 
    //Categoria.findByIdAndRemove()

    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {



    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };



        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});
module.exports = app;