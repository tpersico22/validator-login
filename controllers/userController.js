let path = require("path");
const { validationResult } = require('express-validator');
const user = require('../models/user.js');
const bcrytpjs = require ('bcryptjs');

let userController ={
    register: (req,res)=> {
        res.render(path.resolve(__dirname,"../views/formRegister.ejs"));
    },

    processRegister: (req,res)=> {
        const resultValidation = validationResult(req);
        if(resultValidation.errors.length > 0) {
            return res.render(path.resolve(__dirname,"../views/formRegister.ejs"), {
                errors : resultValidation.mapped(),
                oldData: req.body
            })
        }

        let userInDB = user.findByField('email', req.body.email);

        if(userInDB) {
            return res.render(path.resolve(__dirname,"../views/formRegister.ejs"), {
                errors : 
                    {
                        email: {
                            msg: 'Este mail ya está registrado'
                        }
                    },
                oldData: req.body
            });
        }

        let userToCreate = {
            ...req.body,
            password: bcrytpjs.hashSync(req.body.password, 10),
            image: req.file.filename,
        }

        user.create(userToCreate);

        return res.redirect("/user/login");
    },

    login: (req,res)=> {
        res.render(path.resolve(__dirname,"../views/formLogin.ejs"));
    },

    loginProcess: (req,res)=> {
        
        //Verificación de email
        let userToLogin = user.findByField('email', req.body.email);

        if(userToLogin) {

            //Verificación de password
            let passwordOK = bcrytpjs.compareSync(req.body.password, userToLogin.password)
            if(passwordOK){
                res.send('Ok, podes ingresar');
            }

            //Mensaje de error ante password incorrecto
            return res.render(path.resolve(__dirname,"../views/formLogin.ejs"), {
                errors : 
                    {
                        email: {
                            msg: 'Las credenciales son invalidas'
                        }
                    },
                oldData: req.body
            });
        }

        //Mensaje de error ante email no encontrado
        return res.render(path.resolve(__dirname,"../views/formLogin.ejs"), {
            errors : 
                {
                    email: {
                        msg: 'Email no registrado'
                    }
                },
            oldData: req.body
        });
    }

}



module.exports = userController;