const express = require("express");
const { registerUser, deleteUser } = require("../controller/createUser");
const { getUserDetails } = require("../controller/getUserDetails");
const router = express.Router()

// const upload = require("../middleware/upload")

// router.post("/create-user", upload.array('profile_image[]'), registerUser)
router.post("/create-user", registerUser)
router.get("/get-single-user", getUserDetails)
router.delete("/delete-user", deleteUser)

module.exports = router;