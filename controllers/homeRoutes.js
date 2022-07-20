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

    console.log('categoryData', categoryData);

    const categories = categoryData.map((category) => {
      return category.get({ plain: true });
    });

    console.log(categories);

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

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['first_name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
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

    console.log(user);

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

  console.log(req.session.logged_in, 'req.sess');
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
});

router.get('/register', async (req, res) => {
  res.render('register', {
    isProvider: req.query.type === 'provider',
    type: req.query.type,
  });

  console.log(req.session.logged_in, 'req.sess');
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

      console.log('provider_skill', provider_skill);
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
        service_date: sr.service_date,
        description: sr.description,
        provider: sr.provider,
        consumer: sr.consumer,
      };
    });

    console.log('serviceRequests: ', serviceRequests);
    console.log('isProvider: ', req.session.isProvider);

    let render_uri = 'dashboard_' + req.session.user.type;

    if (req.session.isProvider && provider_skill) {
      render_uri += '_with_skill';
      req.session.provider_skill = provider_skill;
    }

    console.log('render_uri', render_uri);
    // customize handlebars based on user type
    res.render(render_uri, {
      services: serviceRequests,
      provider_skill,
      user: req.session.user,
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
})

module.exports = router;
