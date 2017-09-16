const knexConfig = require('../knexfile.js');
const Knex = require('knex');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

module.exports = {

  getNamesByYear: async (req, res, next) => {
    var sql =  " select * from names_by_year; ";
    const result = await knex.raw(sql);
    res.status(200).json(result.rows);
  },

  getRandomName: async (req, res, next) => {
    var sql =  " SELECT sex, name FROM names_distinct ORDER BY random() LIMIT 1; ";
    const result = await knex.raw(sql);
    res.status(200).json(result.rows);
  },

  //router.route('/d/:sex/:name')
  getOccurancesByNameSexD: async (req, res, next) => {

    const name = req.value.params.name;
    const sex = req.value.params.sex;

    var sql =  " select date_part('year', year) as yr, pop_name.state as st, pop_name.occurrences as oc";
        sql += " from pop_name ";
        sql += " where pop_name.name = '" + name + "' ";
        sql += " and pop_name.state != 'DC' ";
        sql += " and sex = '" + sex + "' ";
        sql += " order by year; ";

    const result = await knex.raw(sql);
    res.status(200).json(result.rows);
  },

  getMinMaxYearForNameSex: async (req, res, next) => {

    const sex = req.value.params.sex;
    const name = req.value.params.name;

    var sql =  " select date_part('year',year) as year ";
        sql += " from pop_name ";
        sql += " where pop_name.name = '" + name + "' ";
        sql += " and sex = '" + sex + "' ";
        sql += " order by date_part('year',year); "

    const result = await knex.raw(sql);

    //console.log(sql);

    var year_min_max = {};
    if(result.rows.length > 0) {
      year_min_max.min_year = result.rows[0].year;
      year_min_max.max_year = result.rows[result.rows.length - 1].year;
    }

    res.status(200).json(year_min_max);

  }
};
