const { Op } = require('sequelize');
const { User } = require('../models');
const { getFullImageUrl, getFullImageUrlArray } = require('../reuseables/getFullImageUrl');
const baseUrl = process.env.baseUrl;

const getUserDetails = async (req, res) => {

    let { first_name } = req.body;
    // console.log(req.query)
    try {
        // find by id 
        // const resData = await User.findByPk(id);

        // find by text 
        // const user = await User.findOne({
        //     where: {
        //         first_name: first_name
        //     }
        // });

        // if (!user) {
        //     return res.status(404).json({ error: 'User not found' });
        // }

        // let resData = getFullImageUrl(user)


        // get spesific fields with or operator
        const userList = await User.findAll({
            // attributes: ["first_name", "age"],
            where: {
                [Op.or]: [
                    // { age: age },
                    {
                        first_name: {
                            [Op.like]: `%${first_name}%`
                        }
                    }
                ]
            }
        }); ``

        let resData = getFullImageUrlArray(userList)

        res.json(resData)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error });
    }
}

module.exports = { getUserDetails }