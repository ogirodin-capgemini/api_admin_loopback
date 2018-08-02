'use strict';

module.exports = async function(app, callback) {
  // Obtain the datasource registered with the name "db"
  const dataSource = app.dataSources.maintainer;

  // Step 1: define a model for "INVENTORY" table,
  // including any models for related tables (e.g. "PRODUCT").
  var sql = `select 
                 table_name
             from information_schema.tables t 
             where t.table_catalog='maintainer' and 
                   t.table_schema ='public' and
                   t.table_type != 'VIEW'
                 `;

  await dataSource.connector.query(sql, function (err, data) {
    for(let d in data) {
      dataSource.discoverAndBuildModels(
        data[d].table_name,
        {relations: true},
        function (err, models) {
          if (err) return callback(err);

          // Step 2: expose all new models via REST API
          // for (const modelName in models) {
          //   app.model(models[modelName], {dataSource: dataSource});
          //
          // }
        });
    }
  });

  callback();

};
