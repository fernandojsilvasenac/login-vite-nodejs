const userRoutes = require('express').Router();
const user = require('../controllers/user.controller');
const { validaToken } = require('../middlewares/auth');
const upload = require('../middlewares/uploadImgUser');

userRoutes.get("/all",  validaToken, user.findAll);

userRoutes.get("/validatoken", user.validaToken);

userRoutes.get("/show/:id",  validaToken, user.findOne);

userRoutes.post("/create",  user.create);

userRoutes.post("/login", user.login);

userRoutes.put("/update",  validaToken, user.update);

userRoutes.put("/change-password",  validaToken, user.changepassword);

userRoutes.delete("/delete/:id",  validaToken, user.delete);

userRoutes.put("/edit-profile-image", validaToken, upload.single('image'), user.editProfileImage);

userRoutes.get("/view-profile/:id",  validaToken, user.viewProfile);


module.exports = userRoutes;