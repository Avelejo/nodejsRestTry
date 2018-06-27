// ==========
//puerto
//==========
process.env.PORT = process.env.PORT || 3000
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    // ==========
    //Base de Datos
    //==========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb://cafe-user:123qwe@ds125318.mlab.com:25318/cafe'
}

process.env.URLDB = urlDB;
//
//'mongodb://localhost:27017/cafe'