const router = require('express').Router();
const {
  Project,
  User,
  Category,
  ServiceRequest,
  SkillCategory,
  Skill,
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

    const categories = categoryData.map((category) => {
      return category.get({ plain: true });
    });

    console.log(categories[0].category_skills);

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

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', async (req, res) => {
  res.render('signup');

  console.log(req.session.logged_in, 'req.sess');
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const serviceRequestData = await ServiceRequest.findAll({
      where: {
        consumer_id: req.session.user_id,
      },
    });

    const serviceRequests = serviceRequestData.map((sr) =>
      sr.get({ plain: true })
    );

    console.log('user', req.session.user);

    // customize handlebars based on user type
    res.render('dashboard_' + req.session.user.type, {
      serviceRequests,
      user: req.session.user,
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
