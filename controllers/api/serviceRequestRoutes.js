const router = require('express').Router();
const ServiceRequest = require('../../models/ServiceRequest');
const {
  User,
  Skill,
  Category,
  SkillCategory,
  UserSkill,
} = require('../../models');
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

router.post('/publishskill', withAuth, async (req, res) => {
  try {
    const newUserSkill = await UserSkill.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newUserSkill);
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
    const find_options = {
      attributes: {
        exclude: [
          'provider_id',
          'consumer_id',
          'skillcategory_id',
          'date_requested',
        ],
      },
      include: [
        {
          model: User,
          as: 'provider',
          attributes: { exclude: ['password'] },
          include: [
            {
              model: SkillCategory,
              as: 'provider_skills',
              through: UserSkill,
              include: [{ model: Skill }, { model: Category }],
            },
          ],
        },
        { model: User, as: 'consumer', attributes: { exclude: 'password' } },
      ],
    };

    if (req.session.isProvider) {
      find_options.where = {
        provider_id: req.session.user.id,
      };
    } else {
      find_options.where = {
        consumer_id: req.session.user.id,
      };
    }

    // Find an existing service based on the logged in user
    const serviceData = await ServiceRequest.findAll(find_options);

    const serviceRequests = serviceData.map((service) => {
      let sr = service.get({ plain: true });

      return {
        provider: sr.provider,
        consumer: sr.consumer,
        id: sr.id,
        name: sr.name,
        service_date: sr.service_date,
        description: sr.description,
      };
    });
    const render_options = {
      user: req.session.user,
      services: serviceRequests,
      logged_in: true,
    };

    if (req.session.isProvider) {
      const userSkillData = await User.findAll({
        include: [
          { model: SkillCategory, through: UserSkill, as: 'provider_skills' },
          { model: Skill, through: SkillCategory, as: 'provider_skills' },
        ],
        where: {
          id: req.session.user.id,
        },
      });

      const userSkills = userSkillData.map((service) => {
        return service.get({ plain: true });
      });

      render_options.userskill = userSkills;

      console.log('render_options', render_options);
    }

    res.render('service_getting_started', render_options);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/title', async (req, res) => {
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

router.get('/publishskill', async (req, res) => {
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

    res.render('service_publish_skill', {
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
        { model: Skill, through: SkillCategory, as: 'service_request_skills' },
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
