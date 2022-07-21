var express = require('express');
var router = express.Router();
let userRouter = require("../controllers/userController");
const multer = require('multer');
const path = require('path')
const { body } = require('express-validator');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage })


//Middleware Validations
const validations = [
    body("name").notEmpty().withMessage("Tenes que escribir un nombre"),
    body("userName").notEmpty().withMessage("Tenes que escribir un nombre de usuario"),
    body("email")
        .notEmpty().withMessage("Tenes que escribir un email").bail()
        .isEmail().withMessage('Debes escribir un formato de correo válido'),
    body("password").notEmpty().withMessage("Tenes que escribir una contraseña"),
    body('image').custom((value, {req}) =>{
        let file = req.file;
        if(!file) {
            throw new Error ('Tenes que subir una imagen');
        }
        return true;
    })
];

//Registro
router.get("/register", userRouter.register);

//Procesar registro
router.post("/register", upload.single("image"), validations, userRouter.processRegister);

//Login
router.get("/login", userRouter.login);

//Login Process
router.post("/login", userRouter.loginProcess);


module.exports = router;