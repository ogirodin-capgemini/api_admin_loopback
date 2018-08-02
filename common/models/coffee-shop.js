'use strict';


const Context = require('@loopback/context').Context;
const ctx = new Context();
ctx.bind('greeting').to('Hello');


module.exports = function(CoffeeShop) {
  CoffeeShop.status = function(cb) {

    var ds = CoffeeShop.app.dataSources.maintainer;

    var sql = `select action_detail('{"action_id":"231","u_id":null,"locale":"FR","client_host":"http://localhost:3001"}')`;

    ds.connector.query(sql, function (err, data) {
      if (err) {
        console.log("Error:", err);
      }
      cb(null, data);
      console.log("data:", data);
    });

    //exemple qui marche
    // CoffeeShop.find(function(err, results) {
    //   cb(null, results);
    // });


    // const ctx = new Context();
    // ctx.bind('hello').to('world');
    // const helloVal = await ctx.get('hello');
    // console.log(helloVal); // => 'world'
	//
    // var currentDate = new Date();
    // var currentHour = currentDate.getHours();
    // var OPEN_HOUR = 6;
    // var CLOSE_HOUR = 20;
    // console.log('Current hour is %d', currentHour);
    // var response;
    // if (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR) {
    //   response = 'We are open for business.';
    // } else {
    //   response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
    // }
    // cb(null, response);
  };
  CoffeeShop.remoteMethod(
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
