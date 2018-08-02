var ds = Model.app.dataSources.maintainer;

ds.createModel(user.name, user.properties, user.options);
ds.autoupdate(user.name, function (err, result) {
  ds.discoverModelProperties('user', function (err, props) {
    console.log(props);
  });
});
