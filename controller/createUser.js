const { User } = require('../models');
const fs = require('fs'); // Require the Node.js 'fs' module for file system operations
const baseUrl = process.env.baseUrl;

const registerUser = async (req, res) => {
    let profile_images = req.files; // Assuming req.files is an array of files
    let paths = [];

    // Iterate through each file in the profile_images array
    profile_images.forEach((file) => {
        paths.push(file.path);
    });

    // Join the paths with a comma separator
    let concatenatedPaths = paths.join(',');

    // console.log(concatenatedPaths);
    let { first_name, age } = req.body;

    try {
        const resData = await User.create({ first_name, age, profile_image: concatenatedPaths });

        // Split the concatenated paths by commas and construct full URLs for each
        const storedPaths = concatenatedPaths.split(',');
        const fullUrls = storedPaths.map((path) => baseUrl + path);

        res.status(201).json({ ...resData.toJSON(), profile_image: fullUrls });
        // res.status(201).json(resData);
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    let { user_id } = req.query;
    try {
        // Find the user by ID
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Get the profile image path
        const profileImagePath = user.profile_image;

        // Delete the user from the database
        await user.destroy();

        // Delete the profile image from the server
        if (profileImagePath) {
            const storedPaths = profileImagePath.split(',');
            storedPaths.forEach((path) => {
                const fullPath = path.replace(baseUrl, ''); // Remove the baseUrl to get the relative path
                const filePath = `${__dirname}/../${fullPath}`; // Construct the full file path
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete the file
                }
            });
        }

        res.status(200).send({ message: "User Deleted successfully", success: true }); // User and associated image deleted successfully
    } catch (error) {
        // Handle errors and send a response
        res.status(500).json({ error: error.message, success: false });
    }
}


module.exports = { registerUser, deleteUser }