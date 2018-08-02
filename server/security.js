let jwt = require('jsonwebtoken');
let log = require('./log').log;

let sqlQuery = require('./db').sqlQuery;

const secret = process.env.SECRET || 'api_admin';
let _instance = null;
let refresh_cycle = process.env.REFRESH_CYCLE || 24;

let secureApi = (req, res, next, app, services) => {
  let method;
  let scope;
  app._router.stack.forEach((r) => {
    if (r.path != "" && r.match(req.url)) {
      method = req.method;
      scope = services[r.route.path].scope;
    }
  });
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    try {
      let token = req.headers.authorization.split(' ')[1];
      let decoded = jwt.verify(token, secret);
      log.send(JSON.stringify(decoded), 'SECURITY');
      let today = new Date();
      let decodedDate = new Date(decoded.date);
      if ((decodedDate.getTime() < today.getTime() - refresh_cycle * 3600000)) {
        res.status(419).json({
          message: 'TOKEN_EXPIRED'
        });
      }
      sqlQuery.execProc('user_exist', {
          u_id: decoded.id,
          method,
          scope
        })
        .then((result) => {
          res.locals = result[0];
          next();
        })
        .catch((err) => {
          log.send(err, 'SECURITY');
          res.status(401).json({
            message: err
          });
        });
    } catch (e) {
      log.send(e, 'SECURITY');
      res.status(401).json({
        message: e
      });
    }

  } else {
    res.status(401).json({
      message: "UNAUTHORIZED"
    });
  }
}

let decodeToken = (token) => {
  return jwt.verify(token, secret);
}

let generateToken = (id) => {
  return jwt.sign({
    id,
    date: new Date()
  }, secret);
}

exports.security = {
  secureApi,
  decodeToken,
  generateToken
}
