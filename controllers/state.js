const knexConfig = require('../knexfile.js');
const Knex = require('knex');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

module.exports = {

  getStates: async (req, res, next) => {

    var sql =  " select statefp, ST_AsGeoJSON(ST_SimplifyPreserveTopology(geom, .01), 2) as geojson, statens, affgeoid, geoid, stusps, name, lsad, aland, awater ";
        sql += " from state ";
        sql += " where state.stusps not in ('AS', 'DC', 'FM', 'GU', 'MH', 'MP', 'PW', 'PW', 'VI') ";
        sql += " order by statefp; ";

    const result = await knex.raw(sql);

    const states = [];
    for(var state in result.rows) {
      states[state] = result.rows[state];
    }

    var statesFC = getFeatureCollectionFor(states);
    res.status(200).json(statesFC);

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
        "statefp": coll[item].statefp,
        "statens": coll[item].statens,
        "affgeoid": coll[item].affgeoid,
        "geoid": coll[item].geoid,
        "stusps": coll[item].stusps,
        "name": coll[item].name,
        "lsad": coll[item].lsad,
        "aland": coll[item].aland,
        "awater": coll[item].awater
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
