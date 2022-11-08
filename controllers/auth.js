const {response} = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;

    try{
        
        const existeEmail = await Usuario.findOne({email: email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

            // ENCRIPTAR CONTRASEÑA
           const salt = bcrypt.genSaltSync();
           usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // GENERAR JSON WEB TOKEN
         const token = await generarJWT( usuario.id );
      
             res.json({
                 ok: true,
                 usuario,
                 token
             });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

 const login = async (req, res = response) => {

    const {email, password} = req.body;


    try {

        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            });
        }
            // VALIDAR EL password

            const validPassword = bcrypt.compareSync(password, usuarioDB.password);

            if(!validPassword) {
                return res.status(404).json({
                    ok: false,
                    msg: 'La contraseña no es valida'
                });
            }

            //GENERAR EL JWT 
            const token = await generarJWT(usuarioDB.id);
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
 }


const renewToken = async(req, res= response) => {

    const uid = req.uid;

    // generar nuevo JWT
    const token = await generarJWT(uid);

    // OBTENER USUARIO POR EL ID
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });

}



module.exports = {
    crearUsuario,
    login,
    renewToken
}