const knexConfig = require('../knexfile.js');
const Knex = require('knex');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

module.exports = {

  getGrid: async (req, res, next) => {

    // "left_lng":-165.49,
    // "bottom_lat":-1.14,
    // "right_lng":-45.79,
    // "top_lat":64.96
    var size = req.value.params.size;
    var left_lng = req.value.params.left_lng;
    var bottom_lat = req.value.params.bottom_lat;
    var right_lng = req.value.params.right_lng;
    var top_lat = req.value.params.top_lat;

    var sql =  " select gid, geojson from cont_us_hex_grid_" + size + " WHERE geom && ST_MakeEnvelope (" + left_lng + ", " + bottom_lat + ", " + right_lng + ", " + top_lat + ", 4326 ); ";

    const result = await knex.raw(sql);
    const hexbins = [];
    for(var hexbin in result.rows) {
      hexbins[hexbin] = result.rows[hexbin];
    }

    var hexbinFC = getFeatureCollectionFor(hexbins);
    res.status(200).json(hexbinFC);
  }

};

function getFeatureCollectionFor(coll) {

  var features = [];

  for(item in coll) {
    feature = {
      "type": "Feature",
      "geometry": {
        "type": JSON.parse(coll[item].geojson).type,
        "coordinates": JSON.parse(coll[item].geojson).coordinates
      },
      "properties": {
        "gid": coll[item].gid
      }
    };
    features.push(feature);
  }

  var featureCollection = {
    "type": "FeatureCollection",
    "features": features
  };

  return featureCollection;

}
