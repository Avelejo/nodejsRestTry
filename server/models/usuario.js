const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//arreglo con roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol válido'
}

// validación de usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {

        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
    }, // no obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    }, // default: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, // Boolean
    google: {
        type: Boolean,
        default: false
    } // Boolean
});

// funcion para quitar la pass 
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})


module.exports = mongoose.model('usuario', usuarioSchema)