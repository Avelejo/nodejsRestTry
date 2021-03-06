    // =================================
    // Puerto
    // =================================

    process.env.PORT = process.env.PORT || 3000

    // =================================
    // Entorno (Desarrollo/local producción/en web)
    // =================================

    process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



    // =================================
    // Vencimiento de token
    // =================================
    // 60 segundos
    // 60 minutos
    // 24 horas
    // 30 dias

    process.env.CADUCIDAD_TOKEN = '48h'

    // =================================
    // Semilla de autotentificación
    // =================================

    process.env.SEED = process.env.SEED || 'seed-desarollo';

    // =================================
    // Base de datos
    // =================================

    let urlDB;

    if (process.env.NODE_ENV === 'dev') {
        urlDB = 'mongodb://localhost:27017/cafe'
    } else {
        urlDB = process.env.MONGO_URI;
    }

    process.env.URLDB = urlDB;
    //
    //'mongodb://localhost:27017/cafe'

    // =================================
    // Google client id
    // =================================
    process.env.CLIENT_ID = process.env.CLIENT_ID || '370898922974-ovbg5r774so1u17ooeu0pvor9tdh8cbp.apps.googleusercontent.com';