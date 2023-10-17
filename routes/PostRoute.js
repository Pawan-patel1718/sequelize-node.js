const express = require("express");
const { createPost } = require("../controller/Post");

const router = express.Router()

// const upload = require("../middleware/upload")

// router.post("/create-user", upload.array('profile_image[]'), registerUser)
router.post("/create-post", createPost)
// router.get("/get-single-post", getUserDetails)

module.exports = router;