const { User } = require('../models');
const baseUrl = 'http://localhost:8000/';

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

module.exports = { registerUser }