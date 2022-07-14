const router = require('express').Router();
const ServiceRequest = require('../../models/ServiceRequest');
const User = require('../../models/User');
const Skill = require('../../models/Skill');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const serviceData = await ServiceRequest.findAll({
      include: [
        { model: User, as: 'provider' },
        { model: User, as: 'consumer' },
        { model: Skill },
      ],
    });

    // Serialize data so the template can read it
    const services = serviceData.map((service) => service.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('services', {
      services,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const serviceData = await ServiceRequest.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider' },
        { model: User, as: 'consumer' },
        { model: Skill },
      ],
    });

    const service = serviceData.get({ plain: true });

    res.render('service', {
      ...service,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
