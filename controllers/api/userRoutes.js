const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  console.log('userRoute.post called', req.body);

  try {
    let userData = await User.findOne({ where: { email: req.body.email } });

    console.log('userData.b4', userData);

    // Added by TP for testing only
    if (userData) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    console.log('userData', userData);

    userData = await User.create(req.body);

    // Remove password before storing in session
    if (userData && userData.password) {
      delete userData.password; // alternatively, delete userData["password"]
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.user = userData.get({ plain: true });
      req.session.isProvider = req.body.type === 'provider';
      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'User signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Remove password before storing in session
    delete userData.password; // alternatively, delete userData["password"]

    if (process.env.isDemo) {
      const demoUsersData = User.findAll({ where: { role: 'demo' } });
      const demoUsers = (await demoUsersData).map((user) => {
        user = user.get({ plain: true });
        delete user.password;
        return user;
      });

      req.session.demo_users = demoUsers;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.isProvider = userData.type === 'provider';
      req.session.isAdmin = userData.role === 'admin';
      req.session.user = userData.get({ plain: true });
      req.session.isDemo = process.env.isDemo === 'true';
      req.session.demo_users = req.session.demo_users;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
