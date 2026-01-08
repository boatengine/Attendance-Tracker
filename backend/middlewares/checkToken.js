import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  // check have authorization
  if (!req.cookies)
    return res.status(400).json({
      message: "must have authorization",
    });
  // get token
  const reqtoken = req.cookies["token"];
  // check token ว่ามีไหม ?

  if (!reqtoken)
    return res.status(401).json({
      message: "required token",
    });

  // check ว่าตรงกับ secret ไหม ?
  jwt.verify(reqtoken, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        message: "Invalid token",
      });
    req.user = decoded;
    next();
  });
};

export default checkToken;
