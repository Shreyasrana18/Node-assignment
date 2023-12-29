const asyncHandler = require('express-async-handler');

const Role = require('../models/roleModel');


const createRole = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const limit = 10;

    if (!name || name.length < 2) {
        return res.status(400).json({
            status: false,
            errors: [
                {
                    param: "name",
                    message: "Name should be at least 2 characters.",
                    code: "INVALID_INPUT",
                },
            ],
        });
    }

    let role = await Role.findOne({ name });

    if (role) {
        return res.status(400).json({
            status: false,
            errors: [
                {
                    param: "name",
                    message: "Role already exists.",
                    code: "ROLE_EXISTS",
                },
            ],
        });
    }

    const newRole = await Role.create({
        name: name,
    });
    const roles = await Role.find({});

    const meta = {
        total: roles.length,
        pages: Math.ceil(roles.length / limit),
        page: 1,
    };

    const response = {
        status: true,
        content: {
            data: {
                id: newRole._id,
                name: newRole.name,
                created_at: newRole.createdAt.toISOString(),
                updated_at: newRole.updatedAt.toISOString(),
            },
        },
        meta,
    };
    res.status(200).json(response);

});

const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find({});
    const limit = 10;
    const page = 1;

    const meta = {
        total: roles.length,
        pages: Math.ceil(roles.length / limit),
        page: page,
    };

    const response = {
        status: true,
        content: {
            data: roles,
        },
        meta,
    };
    res.status(200).json(response);
});

module.exports = { createRole, getAllRoles };
