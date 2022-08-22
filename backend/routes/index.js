const router = require('express').Router();

// Route in users
const userRoutes = require('./users.routes');
router.use('/user', userRoutes);

// Route in categories
const categoriesRoutes = require('./categories.routes');
router.use('/categories', categoriesRoutes);

// Route in products    
const productsRoutes = require('./products.routes');
router.use('/products', productsRoutes);


module.exports = router;
