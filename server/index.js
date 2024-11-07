const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');  // Import bcrypt
const UserModel = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // Compare hashed password
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        res.json("Success");
                    } else {
                        res.json("Incorrect password");
                    }
                });
            } else {
                res.json("Incorrect email");
            }
        })
        .catch(err => res.json(err));
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password before saving it
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.json(err);
        }

        const newUser = new UserModel({ name, email, password: hash });
        newUser.save()
            .then(user => res.json(user))
            .catch(err => res.json(err));
    });
});

app.listen(3002, () => {
    console.log("server is running on port 3002");
});