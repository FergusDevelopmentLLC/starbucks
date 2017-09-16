const knexConfig = require('../knexfile.js');
const Knex = require('knex');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

module.exports = {

  getData: async (req, res, next) => {

    // "left_lng":-165.49,
    // "bottom_lat":-1.14,
    // "right_lng":-45.79,
    // "top_lat":64.96

    var size = req.value.params.size;
    var left_lng = req.value.params.left_lng;
    var bottom_lat = req.value.params.bottom_lat;
    var right_lng = req.value.params.right_lng;
    var top_lat = req.value.params.top_lat;

    var sql =  " SELECT cont_us_hex_grid_" + size + ".gid as hex_id, open_date ";
        sql += " from cont_us_hex_grid_" + size + " ";
        sql += " JOIN starbucks_location ON st_contains(cont_us_hex_grid_" + size + ".geom, starbucks_location.geom) ";
        sql += " WHERE cont_us_hex_grid_" + size + ".geom && ST_MakeEnvelope (" + left_lng + ", " + bottom_lat + ", " + right_lng + ", " + top_lat + ", 4326 ) ";
        sql += " ORDER BY open_date; ";

    //console.log(sql);
    const result = await knex.raw(sql);
    res.status(200).json(result.rows);
  }

};
