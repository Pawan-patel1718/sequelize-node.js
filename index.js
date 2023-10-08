const express = require('express')
const app = express()
const port = process.env.port || 8000;
const bodyParser = require('body-parser');
const db = require("./models");
const { User } = require('./models');
const { Op } = require('sequelize');
var multer = require('multer');
const upload = require("./middleware/upload")
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

app.get('/', async (req, res) => {
    try {
        const jane = await User.findAll();
        res.json(jane)
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

app.get('/get-single-user', async (req, res) => {
    let { age, first_name } = req.query;
    console.log(req.query)
    try {
        // find by id 
        // const resData = await User.findByPk(id);

        // find by text 
        // const resData = await User.findAll({
        //     where: {
        //         age: age,
        //         first_name: {
        //             [Op.like]: `%${first_name}%`
        //         }
        //     }
        // });

        // get spesific fields with or operator
        const resData = await User.findAll({
            attributes: ["first_name", "age"],
            where: {
                [Op.or]: [
                    { age: age },
                    {
                        first_name: {
                            [Op.like]: `%${first_name}%`
                        }
                    }
                ]
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

db.sequelize.sync().then(() => {
    console.log('Database synced and tables created!')
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })
})
