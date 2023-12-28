const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const errors = [];

    if (!name || name.length < 2) {
        errors.push({
            param: "name",
            message: "Name should be at least 2 characters.",
            code: "INVALID_INPUT",
        });
        res.status(400).json({ status: false, errors });
    }

    if (!password || password.length < 8) {
        errors.push({
            param: "password",
            message: "Password should be at least 8 characters.",
            code: "INVALID_INPUT",
        });
        res.status(400).json({ status: false, errors });
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        errors.push({
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
        });
        res.status(400).json({ status: false, errors });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (errors.length > 0) {
        res.status(400).json({ status: false, errors });
        return;
    }


    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30d',
    });

    const response = {
        status: true,
        content: {
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.createdAt.toISOString(),
            },
            meta: {
                access_token: accessToken,
            },
        },
    };

    res.status(201).json(response);
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: false,
            errors: [
                {
                    param: !email ? "email" : "password",
                    message: !email ? "Please provide a valid email address." : "Please fill in the password field.",
                    code: !email ? "INVALID_INPUT" : "INVALID_INPUT",
                },
            ],
        });
        return;
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({
            status: false,
            errors: [
                {
                    param: "email",
                    message: "The credentials you provided are invalid.",
                    code: "INVALID_CREDENTIALS",
                },
            ],
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60m" }
        );

        const response = {
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.username,
                    email: user.email,
                    created_at: user.createdAt.toISOString(),
                },
                meta: {
                    access_token: accessToken,
                },
            },
        };

        res.status(200).json(response);
    } else {
        res.status(401).json({
            status: false,
            errors: [
                {
                    param: "password",
                    message: "The credentials you provided are invalid.",
                    code: "INVALID_CREDENTIALS",
                },
            ],
        });
    }
});

const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401).json({
            status: false,
            errors: [
                {
                    message: "You need to sign in to proceed.",
                    code: "NOT_SIGNEDIN"
                },
            ],
        });
    } else {
        const response = {
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.createdAt.toISOString(),
                },
            },
        };
        res.status(200).json(response);
    }

});



module.exports = { signup, login, me };