const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');



// =========================================
// Obtener todos los productos
// =========================================
app.get('/productos', verificaToken, (req, res) => {
        // trae todo los productos
        // populate: usuario categoria
        // paginado 
        let desde = req.query.desde || 0; // guardamos en una variable donde queremos comenzar a listar o 0 si no recibimos nada

        desde = Number(desde); // lo convertimos a numérico
        let limite = req.query.limite || 5; // guardamos si 
        limite = Number(limite)

        Producto.find({ disponible: true })
            .sort('nombre')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre ')
            .skip(desde)
            .limit(limite)
            .exec((err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }


                res.json({
                    ok: true,
                    productos: producto

                })




            })
    })
    // =========================================
    // Obtener un producto por id
    // =========================================
app.get('/productos/:id', verificaToken, (req, res) => {
        // populate: usuario categoria

        Producto.findById(req.params.id, (err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No existe ese id :>',
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoDB
                })

            })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre ')

    })
    // =========================================
    // Buscar productos
    // =========================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })

})

// =========================================
// Crear un nuevo producto
// =========================================
app.post('/productos', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    // guardamos la respuesta
    let body = req.body;
    // creamos arreglo usuario con las validaciones, model, de usuario con los datos recogidos
    let producto = new Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        categoria: body.categoria,
        precioUni: body.precioUni

    })


    //guardamos el usuario en la DB
    producto.save((err, productoDB) => {
        // si hay un error devolvemos un objeto json con el error y salimos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;

        //devolvemos que se ha guardado como objeto json
        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    });




})

// =========================================
// Actualizar un producto
// =========================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    let id = req.params.id;

    let body = req.body;



    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.cateogira = body.categoria;
        productoDB.disponible = body.disponible;



        productoDB.save((err, productoguardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoguardado
            })

        })


    })

})

// =========================================
// Borrar un producto
// =========================================
app.delete('/productos/:id', verificaToken, (req, res) => {



    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }


        productoDB.disponible = false;

        productoDB.save((err, productoBorrrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrrado,
                message: 'producto borrado'
            })
        })
    })


})



module.exports = app;