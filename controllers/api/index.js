const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const serviceRequestRoutes = require('./serviceRequestRoutes');

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/services', serviceRequestRoutes);

module.exports = router;
