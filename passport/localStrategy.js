const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const searchUser = await User.findOne({ where: { email: email } });
          if (searchUser) {
            const result = bcrypt.compare(password, searchUser.password);
            if (result) {
              done(null, searchUser); // 로그인 성공
            } else {
              done(null, false, {
                message: "비밀번호 또는 아이디가 틀립니다.",
              });
            }
          } else {
            done(null, false, { message: "가입된 회원이 아닙니다." });
          }
        } catch (e) {
          console.log(e);
          done(e); // 서버 에러
        }
      }
    )
  );
};
