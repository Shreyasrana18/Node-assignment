const asyncHandler = require('express-async-handler');
const Community = require('../models/communityModel');
const Role = require('../models/roleModel');
const Member = require('../models/memberModel')


function generateSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

const createCommunity = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const slug = generateSlug(name).toString();
    const User = req.user;
    const owner = (User.id).toString();

    const NewCommunity = new Community({
        name,
        slug,
        owner,
    });
    console.log(NewCommunity)
    await Community.save();
    console.log("saved")
    const roles = await Role.findOne({ name: "Community Admin" });
    console.log(roles)
    const Users = User.id
    let role = roles._id;
    let CommunityName = NewCommunity._id;
    const newMember = await Member.create({
        CommunityName,
        Users,
        role,
    })
    res.status(200).json({
        status: true,
        newMember
    });
});

module.exports = { createCommunity };