const router = require('express-promise-router')();
const StarbucksController = require('../controllers/starbucks');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

//http://127.0.0.1:8644/starbucks/data/100/-165.49/-1.14/-45.79/64.96
router.route('/data/:size/:left_lng/:bottom_lat/:right_lng/:top_lat')
  .get(validateParam(schemas.sizeSchema, 'size'), validateParam(schemas.lngSchema, 'left_lng'), validateParam(schemas.latSchema, 'bottom_lat'), validateParam(schemas.lngSchema, 'right_lng'), validateParam(schemas.latSchema, 'top_lat'), StarbucksController.getData);

module.exports = router;
