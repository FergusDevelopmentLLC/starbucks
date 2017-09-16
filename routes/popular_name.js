const router = require('express-promise-router')();
const PopularNameController = require('../controllers/popular_name');
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/d/:name/:sex')
  .get(validateParam(schemas.sexSchema, 'name'), validateParam(schemas.nameSchema, 'sex'), PopularNameController.getOccurancesByNameSexD);

router.route('/:name/:sex')
  .get(validateParam(schemas.nameSchema, 'name'), validateParam(schemas.sexSchema, 'sex'), PopularNameController.getMinMaxYearForNameSex);

router.route('/getNamesByYear')
  .get(PopularNameController.getNamesByYear);

router.route('/getRandomName')
  .get(PopularNameController.getRandomName);

module.exports = router;
