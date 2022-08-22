const userRoutes = require('express').Router();
const user = require('../controllers/user.controller');
const { validaToken } = require('../middlewares/auth');

userRoutes.get("/all",  validaToken, user.findAll);

userRoutes.get("/validatoken", user.validaToken);

userRoutes.get("/show/:id",  validaToken, user.findOne);

userRoutes.post("/create",  user.create);

userRoutes.post("/login", user.login);

userRoutes.put("/update",  validaToken, user.update);

userRoutes.put("/change-password",  validaToken, user.changepassword);

userRoutes.delete("/delete/:id",  validaToken, user.delete);


module.exports = userRoutes;