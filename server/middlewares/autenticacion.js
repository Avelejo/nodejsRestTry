const jwt = require('jsonwebtoken');

// ===============
// Verificar token
// ===============

let verificaToken = (req, res, next) => {

    let token = req.get('token'); // buscamos variable en headers
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })



}

// ===============
// Verifica AdminRole
// ===============


let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== "ADMIN_ROLE") {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    } else {
        next()
    }


}

// ===============
// Verificar token para imagen
// ===============
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })

}
module.exports = { verificaToken, verificaAdmin_Role, verificaTokenImg }