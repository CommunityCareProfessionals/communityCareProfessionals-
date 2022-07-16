const router = require('express').Router();
const ServiceRequest = require('../../models/ServiceRequest');
const User = require('../../models/User');
const Skill = require('../../models/Skill');
const Category = require('../../models/Category');
const withAuth = require('../../utils/auth');

router.post('/new', withAuth, async (req, res) => {
  try {
    console.log({
      ...req.body,
      consumer_id: req.session.user_id,
    });
    const newSR = await ServiceRequest.create({
      ...req.body,
      consumer_id: req.session.user_id,
    });

    res.status(200).json(newSR);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

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

router.get('/getting-started', async (req, res) => {
  try {
    // Find an existing service based on the logged in user
    const serviceData = await ServiceRequest.findAll({
      include: [
        { model: User, as: 'provider' },
        { model: User, as: 'consumer' },
        { model: Skill },
      ],
      where: {
        consumer_id: req.session.user.id,
      },
    });

    const services = serviceData.map((service) => {
      return service.get({ plain: true });
    });

    res.render('service_getting_started', {
      user: req.session.user,
      services,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/title', async (req, res) => {
  console.log('query count', req.query.count);

  try {
    const categoryData = await Category.findAll({
      include: [
        {
          model: Skill,
          as: 'category_skills',
        },
      ],
    });

    const categories = categoryData.map((category) => {
      return category.get({ plain: true });
    });

    console.log(categories[0].category_skills);

    res.render('service_title', {
      categories,
      top_categories: categories.slice(0, 3),
      more_categories: categories.slice(3),
      logged_in: true,
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
