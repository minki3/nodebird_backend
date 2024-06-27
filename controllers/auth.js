const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

exports.join = async (req, res, next) => {
  const { email, nickName, password } = req.body;
  try {
    const searchUser = await User.findOne({ where: { email: email } });
    if (searchUser) {
      return res.status(403).send("이미 있는 사용자");
    }
    const hash = await bcrypt.hash(password, 12); // 비밀번호 해쉬처리

    await User.create({
      email,
      nickName,
      password: hash,
    });
    return res.status(202).send("회원가입 완료");
  } catch (e) {
    console.log(e);
    next(e);
  }
};
exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    console.log(user);
    if (authError) {
      // 서버 실패
      console.log(authError);
      return next(authError);
    }
    if (!user) {
      // 로직 실패
      return res.status(403).send(`${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.log(loginError);
        return next(loginError);
      }
      return res.status(202).send("성공ㄴ");
    }); // 로그인 성공
  })(req, res, next);
};
exports.logout = (req, res, next) => {
  req.logout(() => {
    res.status(202).send("로그아웃ㄴ");
  });
};
