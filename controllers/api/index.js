const router = require('express').Router();
const userRoutes = require('./userRoutes');
const serviceRequestRoutes = require('./serviceRequestRoutes');

router.use('/users', userRoutes);
router.use('/services', serviceRequestRoutes);

module.exports = router;
