const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/");
const { join, login, logout } = require("../controllers/auth");
const passport = require("passport");

router.post("/join", isNotLoggedIn, join);
router.post("/login", isNotLoggedIn, login);
router.get("/logout", isLoggedIn, logout);

//kakao
router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate(
    "kakao",
    {
      failureMessage: "로그인 실패",
    },
    (req, res) => {
      res.status(202).send("로그인 성공");
    }
  )
);

module.exports = router;
