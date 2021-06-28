// const NodeCache = require('node-cache');
const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./scratch');

// stdTTL: time to live in seconds for every generated cache element.
// const cache = new NodeCache({ stdTTL: 5 * 60 });

// function getUrlFromRequest(req) {
//   const url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
//   return url;
// }

// function set(req, res, next) {
//   const url = getUrlFromRequest(req);
//   cache.set(url, res.locals.data);
//   console.log('inn');
//   return next();
// }

// function get(req, res, next) {
//   const url = getUrlFromRequest(req);
//   const content = cache.get(url);
//   if (content) {
//     console.log('gettt');
//     return res.status(200).send(content);
//   }
//   return next();
// }

module.exports = { localStorage };
