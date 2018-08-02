'use strict';

module.exports = function(Roles) {
  Roles.status = function(cb) {
    Roles.find(function(err, data) {
      Roles.maintainers(function(error, data){
        cb(null, data);
      });

      // data.maintainers(function(err, data) {
      //   cb(null, data);
      // });
    });
  };
  Roles.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get'
      },
      returns: {
        arg: 'status',
        type: 'json'
      }
    }
  );
};
