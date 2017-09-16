const router = require('express-promise-router')();
const StateController = require('../controllers/state');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
  .get(StateController.getStates);

module.exports = router;
