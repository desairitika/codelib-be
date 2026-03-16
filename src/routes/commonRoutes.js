const express = require("express");
const router = express.Router();
const CommonController = require("../controllers/commonController");
const {
  authenticateUser,
} = require("../middleware/authMiddleware");

// /constants is frequently requested from the public API client (`publicGet`) which sets
// `skipAuth=true` on the Axios request.  The front end expects the server to treat the
// GET route as public (no automatic 401) – a 401 would only be logged/toasted by the
// client and would *not* trigger a redirect, avoiding infinite reload loops.  If the
// data becomes sensitive in the future the client must stop using `publicGet` and
// instead call the normal `http.get` with an Authorization header.
router.get('/constants', CommonController.getConstants);

// The other methods still require an authenticated user.
router.post('/constants', authenticateUser, CommonController.createConstants);
router.put('/constants/:constId', authenticateUser, CommonController.updateConstants);
router.delete('/constants/:constId', authenticateUser, CommonController.deleteConstants);

module.exports = router;
