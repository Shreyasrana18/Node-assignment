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

    const Neww = new Community({
        name,
        slug,
        owner,
    });
    console.log(Neww)
    await Community.save();
    console.log("saved")
    const roles = await Role.findOne({ name: "Community Admin" });
    console.log(roles)
    const Users = User.id
    let role = roles._id;
    let Communitys = Neww._id;
    const newwMember = await Member.create({
        Communitys,
        Users,
        role,
    })
    res.status(200).json({
        status: true,
        newwMember
    });
});

module.exports = { createCommunity };