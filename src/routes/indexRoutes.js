const express = require("express");
const router = express.Router();
const { authenticateUser, checkBlacklistedUser } = require("../middleware/authMiddleware");

router.get("/", function (req, res, next) {
  res.render("landing", { title: "CodeLib" });
});

router.get("/validate", checkBlacklistedUser, authenticateUser, async (req, res) => {
  const user = req.user;
  res.status(200).json({
    message: "Token is valid",
    user: {
      name: user?.name,
      lastname: user?.lastname,
      id: user?.id,
      role: user?.role,
    },
  });
});

module.exports = router;
