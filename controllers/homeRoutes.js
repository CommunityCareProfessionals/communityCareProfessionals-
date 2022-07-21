const router = require('express').Router();
const {
  Project,
  User,
  Category,
  ServiceRequest,
  SkillCategory,
  Skill,
  UserSkill,
} = require('../models');
const moment = require('moment');

const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [
        {
          model: Skill,
          through: SkillCategory,
          as: 'category_skills',
        },
      ],
    });

    const categories = categoryData.map((category) => {
      return category.get({ plain: true });
    });

    // Pass serialized data and session flag into template
    res.render('homepage', {
      categories,
      top_categories: categories.slice(0, 3),
      more_categories: categories.slice(3),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      isProvider: user.type === 'provider',
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  try {
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }

    res.render('login');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/signup', async (req, res) => {
  res.render('role_selection');

  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
});

router.get('/register', withAuth, async (req, res) => {
  res.render('register', {
    isProvider: req.query.type === 'provider',
    type: req.query.type,
  });

  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  let provider_skill;

  try {
    const find_options = {
      attributes: {
        exclude: ['provider_id', 'consumer_id', 'skillcategory_id'],
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

      provider_skill = await User.findOne({
        where: { id: req.session.user.id },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: SkillCategory,
            as: 'provider_skills',
            through: UserSkill,
            include: [{ model: Skill }, { model: Category }],
          },
        ],
      });

      provider_skill = provider_skill.get({ plain: true }).provider_skills[0];

      req.session.provider_skill = provider_skill;
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
        id: sr.id,
        name: sr.name,
        date_requested: sr.date_requested,
        service_date: sr.service_date,
        status: sr.status,
        isOpen: sr.status === 'OPEN',
        description: sr.description,
        provider: sr.provider,
        consumer: sr.consumer,
      };
    });

    let render_uri = 'dashboard_' + req.session.user.type;

    if (req.session.isProvider && provider_skill) {
      render_uri += '_with_skill';
    }

    if (
      !req.session.isAdmin &&
      !req.session.isProvider &&
      serviceRequests.length === 0
    ) {
      render_uri += '_no_sr';
    }
    // customize handlebars based on user type
    res.render(render_uri, {
      services: serviceRequests,
      open_services: serviceRequests.filter(
        (service) => service.status === 'OPEN'
      ),
      closed_services: serviceRequests.filter(
        (service) => service.status === 'CLOSED'
      ),
      provider_skill,
      user: req.session.user,
      isDemo: process.env.isDemo === 'true',
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/aboutus', async (req, res) => {
  res.render('about_us');
});

router.get('/whycare', async (req, res) => {
  res.render('why_care');
});

router.get('/contactus', async (req, res) => {
  res.render('contactus');
});

router.put('/demo', async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      res
        .status(400)
        .json({ message: 'You are not authorized to make the change' });
      return;
    }

    process.env.isDemo = req.body.isDemo;
    req.session.isDemo = req.body.isDemo;

    if (req.body.isDemo === true) {
      const demoUsersData = User.findAll({ where: { role: 'demo' } });
      const demoUsers = (await demoUsersData).map((user) => {
        user = user.get({ plain: true });
        delete user.password;
        return user;
      });

      req.session.demo_users = demoUsers;
    }

    res.status(200).json({ isDemo: req.body.isDemo });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
