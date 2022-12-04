const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb+srv://test:sparta@cluster0.lwbd7w1.mongodb.net/shopping-demo?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

//회원가입
const User = require("./models/user.js");
router.post("/users", async(req, res) => {
  const {nickname, email, password, confirmPassword} = req.body;

  
  //1. 패스워드, 패스워드 검증 값이 일치하는가 - ok
  if (password !== confirmPassword) {
    res.status(400).json({
      erroMessage: "password와 confirmPassword가 일치하지 않습니다."
    });
    return;
  }
  
  //2. email에 해당하는 사용자가 있는가 - ok
  //3. nickname에 해당하는 사용자가 있는가 - ok
  const existUser = await User.findOne({
    $or: [{email : email}, {nickname : nickname}]
  });

  if(existUser){
    res.status(400).json({
      errorMessage: "Email이나, NIckname이 이미 사용 중 입니다."
    });
    return;
  }
  
  //4. DB에 데이터를 삽입
   const user = new User({nickname, email, password});
   await user.save();

  res.status(201).json({});
});


//로그인
router.post("/auth", async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  
  //1. 사용자가 존재하지 않거나,
  //2. 입력받은 password와 사용자의 password가 다를 떄 에러메시지가 발생해야한다.
  if (!user || password !== user.password){
    res.status(400).json({
      errorMessage: "사용자가 존재하지 않거나, 사용자의 password와 입력받은 password가 일치하지 않습니다."
    });
    return;
  }

  const token = jwt.sign({userId:user.userId}, "sparta-secret-key");
  res.status(200).json({
    "token": token,
  })
});

// 내 정보 조회 API구현하기
const authMiddleWare = require("./middlewares/auth_middleware.js");
router.get("/users/me", authMiddleWare, async (req, res) => {   //authoMiddleware를 탄 다음에 api 실행 
  res.json({user: res.locals.user});
});

//urlencoded를 사용할 것이기 때문에 미들웨어를 통과할 수 있도록 16번째 줄 앞에다가 만들거야.
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});