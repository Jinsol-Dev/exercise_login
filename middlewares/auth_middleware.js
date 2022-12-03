//모델
//jwt
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");


module.exports = async (req, res, next) => {
    const {authorization} = req.headers;    
    console.log(authorization);
    const [authType, authToken] = authorization.split(" ");   //split이 되지 않는 이유는?
    //authType: Bearer
    //authToken: 실제 jwt 값이 들어옴
    console.log(authType, authToken);

    if(authType !== "Bearer" || !authToken){
        res.status(400).json({
            errorMessage: "로그인 후 사용이 가능한 API 입니다."
        });
        return;
    }
    //14강 14분49초
    
    //복호화 및 검증
    const {userId} = jwt.verify(authToken, "sparta-secret-key");
    console.log(userId);
};