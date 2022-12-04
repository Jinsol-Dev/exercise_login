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

    try{
        //복호화 및 검증
        const {userId} = jwt.verify(authToken, "sparta-secret-key");  // 1.jwt에 들어있는 데이터를 복호화 및 검증을 하고 
        const user = await User.findById(userId); //(object로 형태로 값이 들어가서 실행x) 2. 통과했을 때 정보를 찾고
        res.locals.user = user; // 3. 찾은 정보를 res.locals.user 에다가 저장을 해서        
        next(); // 4. next로 다음 있는 곳으로 넘겨줄거야.
    } catch(error){        
        res.status(400).json({
            errorMessage:"로그인 후 사용이 가능한 API 입니다."
        })
    }
    return;
};   