var RouteParams={};
var RouteDesc={};
var getDocumentwithavailableRoutes = function (app) {
    return app._router.stack
      .filter(r => r.route)
      .map(r => {
        return {
          method: Object.keys(r.route.methods)[0].toUpperCase(),
          path: r.route.path,
          paramsinfo: RouteParams[r.route.path],
          desc:RouteDesc[r.route.path]
        };
      });
  }
var addParamsInfo = function (Info){
  return function (req,res,next) {
    RouteParams[req.path]=Info;
    next();
  }
} 

var addRouteDesc = function (Info){
  return function (req,res,next) {
    RouteDesc[req.path]=Info;
    next();
  }
}
var addParamsInfoImmediately = function (path,Info){
    RouteParams[path]=Info;
} 
var addRouteDescImmediately = function (path,Info){
    RouteDesc[path]=Info;
} 
module.exports.getDocumentwithavailableRoutes = getDocumentwithavailableRoutes;
module.exports.addParamsInfo = addParamsInfo;
module.exports.addRouteDesc = addRouteDesc;
module.exports.addParamsInfoImmediately = addParamsInfoImmediately;
module.exports.addRouteDescImmediately = addRouteDescImmediately;




