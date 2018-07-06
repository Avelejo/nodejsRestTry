const express = require('express')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario')

const app = express()
    // exportamos constantes de librerias


// usamos la constante de express para abrir 
app.post('/login', (req, res) => {

    let body = req.body; // guardamos en una variable el body (donde está los datos que vamos a necesitar)
    //usamos la constante de modelos de usuario con el metodo findOne para encontrar el los registros
    //un objeto que email sea el que recogemos del body, luego ejecutamos un callback con err o el registro si lo encuentra
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) { // comprobamos si tenemos un error interno de mongo/servidor
            return res.status(500).json({ // devolvemos un objeto json 
                ok: false,
                err
            });
        }

        if (!usuarioDB) { // comprobamos si ha devuelto un usuario
            return res.status(400).json({ // devolvemos error si no encontramos ese usuario
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { // comprobamos si la contraseña es la misma
            return res.status(400).json({ //devolvemos error si son distintas
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
            // si hemos llegado hasta aquí, devolvemos como JSON el usuario de la Base de Datos
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })



    })





})

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}




app.post('/google', async(req, res) => {

    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) { // comprobamos si tenemos un error interno de mongo/servidor
            return res.status(500).json({ // devolvemos un objeto json 
                ok: false,
                err
            });
        };

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(500).json({ // devolvemos un objeto json 
                    ok: false,
                    err: {
                        message: 'Debe de usar su autentificaciín normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })




                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //Si el usuario no existe en nuestra Base de Datos

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) { // comprobamos si tenemos un error interno de mongo/servidor
                    return res.status(500).json({ // devolvemos un objeto json 
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })




                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })


        }


    })

});


module.exports = app;