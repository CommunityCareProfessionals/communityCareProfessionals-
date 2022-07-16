const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    let userData = await User.findOne({ where: { email: req.body.email } });

    // Added by TP for testing only
    if (!userData) {
      userData = await User.create(req.body);
    }

    // Remove password before storing in session
    if (userData && userData.password) {
      delete userData.password; // alternatively, delete userData["password"]
    }

    console.log(userData);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.user = userData.get({ plain: true });
      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
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

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.user = userData.get({ plain: true });

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
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
