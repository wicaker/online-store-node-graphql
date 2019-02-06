const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //const authHeader = req.get('Authorization'); // authorization from incoming request
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.isAuth = false;
    return next(); //return next, dont leave the function, but continue
  }
  //const token = authHeader.split(' ')[1]; //Authorization: Bearer gdasaQasdhdasg
  const token = authHeader;
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    //verify token with key we created before
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken;
  next();
};
