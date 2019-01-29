const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization'); // authorization from incoming request
  if(!authHeader) {
    req.isAuth = false; 
    return next(); //return next, dont leave the function, but continue
  }
  const token = authHeader.split(' ')[1]; //Authorization: Bearer gdasaQasdhdasg
  if(!token || token === ''){
    req.isAuth = false;
    return next(); 
  }
  let decodedToken;
  try{
    //verify token with key we created before
    decodedToken = jwt.verify(token, 'somesupersecretkey')
  } catch (err) {
    req.isAuth = false;
    return next(); 
  }
  if(!decodedToken){
    req.isAuth = false;
    return next(); 
  }
  req.isAuth = true;
  req.userId = decodedToken;
  next();
}