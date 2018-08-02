'use strict';

module.exports = function(Maintainers) {
  Maintainers.status = function(cb) {
    Maintainers.find(function(err, data) {
      data[0].roles(function(error, data){
        cb(null, data);
      });

      // data.Maintainerss(function(err, data) {
      //   cb(null, data);
      // });
    });
  };
  Maintainers.remoteMethod(
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
