const passport = require("passport");
const { Strategy: kakaoStrategy } = require("passport-kakao");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const searchUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (searchUser) {
            done(null, searchUser);
          } else {
            // 카카오 로그인은 여기서 처리
            const newUser = await User.create({
              email: profile._json?.kakako_account?.email,
              nickName: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );
};
