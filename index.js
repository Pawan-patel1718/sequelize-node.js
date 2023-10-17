const express = require('express')
const app = express()
const port = process.env.port || 8000;
const bodyParser = require('body-parser');
const dotenv = require("dotenv")
const db = require("./models");
const { User, Post } = require('./models');
const { Op } = require('sequelize');
var multer = require('multer');
const upload = require("./middleware/upload")
dotenv.config()
// var upload = multer({ dest: "uploads/" });
//Configuration for Multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         return cb(null, "./uploads");
//     },
//     filename: function (req, file, cb) {
//         return cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

// const upload = multer({ storage })



// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array("files"));

app.use('/uploads', express.static('uploads'))

const user_route = require("./routes/UserRoute");
const post = require("./routes/PostRoute");
const { getFullImageUrlArray } = require('./reuseables/getFullImageUrl');

app.get('/', async (req, res) => {
    try {
        const jane = await User.findAll({
            attributes: ["user_id", "first_name", "age", "profile_image"]
            ,
            include: [ // use an array to relate to multiple tables
                {
                    model: Post,
                    attributes: ["postName", "title", "post_image"]
                },
            ],
        });
        let post_image = getFullImageUrlArray(jane)
        res.json(post_image)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
})

app.get('/get-all-post', async (req, res) => {
    try {
        const jane = await Post.findAll({
            attributes: ["postName", "title", "post_image"]
            ,
            include: [ // use an array to relate to multiple tables
                {
                    model: User,
                    attributes: ["user_id", "first_name", "age", "profile_image"]
                },
            ],
        });
        let post_image = getFullImageUrlArray(jane)
        res.json(post_image)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
})

// Define your route
// app.post('/create-user', async (req, res) => {
//     let { first_name, age } = req.body;
//     try {
//         const resData = await User.create({ first_name, age });
//         res.status(201).json(resData);
//     } catch (error) {
//         // Handle the Sequelize error and send it as a response to the client
//         res.status(500).json({ error: error.message });
//     }
// });
app.use("/user", user_route)
app.use("/post", post)

// findAndCountAll
app.post('/get-the-count', async (req, res) => {
    let { first_name } = req.body;
    try {
        const resData = await User.findAndCountAll({ where: { first_name } });
        res.json(resData)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
})

// edit multiple user
app.post('/edit-user', async (req, res) => {
    let { first_name, id } = req.body;
    try {
        const resData = await User.update({ first_name }, {
            where: {
                id: id,
            },
        });
        res.json(resData)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
})

//number-comparision
app.get('/number-comparision', async (req, res) => {
    let { age } = req.query;
    try {
        const resData = await User.findAll({
            where: {
                age: {
                    [Op.gte]: age
                }
            }
        });
        res.json(resData)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
})



app.delete('/delete-user', async (req, res) => {
    let { id } = req.query;
    try {
        // const resData = await User.destroy(id);
        const resData = await User.destroy({
            where: {
                age: {
                    [Op.eq]: id
                }
            },
        });
        res.status(204).json(resData)
    } catch (error) {
        // Handle the Sequelize error and send it as a response to the client
        res.status(500).json({ error: error.message });
    }
})

db.sequelize.sync({ alert: true }).then(() => {
    console.log('Database Connected ✅!')
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })
})
