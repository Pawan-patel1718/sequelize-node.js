const express = require("express");
const { registerUser } = require("../controller/createUser");
const router = express.Router()

// const upload = require("../middleware/upload")

// router.post("/create-user", upload.array('profile_image[]'), registerUser)
router.post("/create-user", registerUser)

module.exports = router;