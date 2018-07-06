const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }


});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
})


module.exports = mongoose.model('categoria', categoriaSchema)