const asyncHandler = require('express-async-handler');
const Member = require('../models/memberModel');
const Community = require('../models/communityModel');
const Role = require('../models/roleModel');

const addMember = asyncHandler(async (req, res) => {
    const { community, user, role } = req.body;
    const User = req.user;
    const id = User._id;

    try {
        const communitys = await Community.findOne({ _id: community });

        if (!communitys) {
            return res.status(404).json({
                status: false,
                errors: [
                    {
                        param: "community",
                        message: "Community not found.",
                        code: "RESOURCE_NOT_FOUND",
                    },
                ],
            });
        }

        const existingMember = await Member.findOne({
            community,
            user,
        });

        if (existingMember) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        message: "User is already added in the community.",
                        code: "RESOURCE_EXISTS",
                    },
                ],
            });
        }

        const roleObj = await Role.findOne({ _id: role });

        if (!roleObj) {
            return res.status(404).json({
                status: false,
                errors: [
                    {
                        param: "role",
                        message: "Role not found.",
                        code: "RESOURCE_NOT_FOUND",
                    },
                ],
            });
        }

        const userObj = await User.findOne({ _id: user });

        if (!userObj) {
            return res.status(404).json({
                status: false,
                errors: [
                    {
                        param: "user",
                        message: "User not found.",
                        code: "RESOURCE_NOT_FOUND",
                    },
                ],
            });
        }

        if (communitys.owner !== id) {
            return res.status(403).json({
                status: false,
                errors: [
                    {
                        message: "You are not authorized to perform this action.",
                        code: "NOT_ALLOWED_ACCESS",
                    },
                ],
            });
        }

        const add = await Member.create({
            community,
            user,
            role,
        });

        res.status(201).json({
            status: true,
            content: {
                data: {
                    id: add._id,
                    community: add.community,
                    user: add.user,
                    role: add.role,
                    created_at: add.createdAt.toISOString(),
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            errors: [
                {
                    param: "server",
                    message: "Internal Server Error",
                    code: "INTERNAL_SERVER_ERROR",
                },
            ],
        });
    }


});

const deleteMember = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const member = await Member.findOne({ _id: id });
    console.log(member)

    const community = await Community.findOne({ _id: member.community });

    console.log(community)

    if (community.owner != req.user._id) {
        return next(new ErrorHandler("NOT_ALLOWED_ACCESS", 400))
    }


    await Member.deleteOne({ _id: id });


    res.status(200).json({
        status: true,
    });
});

module.exports = { addMember, deleteMember };