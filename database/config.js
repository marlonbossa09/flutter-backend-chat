const mongoose = require('mongoose');


const dbConnection = async () => {
    
    try {
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB ONLINE');

    }catch(error){
            console.log(error);
            throw new Error('Error en la base de datos - hable con el adnim');
    }
}

module.exports = {
    dbConnection
}