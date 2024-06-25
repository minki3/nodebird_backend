const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");
const cors = require("cors");

dotenv.config();

const corsOption = {
  origin: "http://localhost:3000", // 이 도메인만 허용
  credentials: true,
}; // cors옵션

const { sequelize } = require("./models");
const app = express();
const passportConfig = require("./passport");

app.set("port", process.env.PORT || 8001);
passportConfig();

sequelize
  .sync({ force: true }) // todo : 배포시 변경
  .then(() => console.log("데이터 베이스 연결 성공"))
  .catch((err) => console.error("연결 실패", err));
// db연결

app.use(morgan("dev"));
app.use(cors(corsOption));

// bdoy-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    resave: true,
    saveUninitalized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, //TODO : https 적용할 때 true
    },
  })
);
// 반드시 세션 밑에 작성 passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status(404);
  next(error);
}); // 404 미들웨어

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
}); // 에러 미들웨어

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}에서 대기중`);
});
