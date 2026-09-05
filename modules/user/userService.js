const User = require('./userModel');
const bcrypt = require('bcrypt');
const auth = require('../../middlewares/auth');
const fs = require('fs/promises');
const path = require('path');

const PROFILE_UPLOADS_DIR = path.join(__dirname, '../../public/uploads/profiles');
const DEFAULT_PROFILE = 'default-profile.png';

function profileData(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        recipesCount: user.recipesCount
    };
}

async function registerUser(username, email, password, fullName){

    const emailExists = await User.findOne({ where: { email }});
    const usernameExists = await User.findOne({ where: { username }});
    
    if(emailExists || usernameExists){
        throw new Error('O nome de usuário ou e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName
    })

    return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
    };

}

async function getPublicProfile(username){
    const user = await User.findOne({
        where: { username },
        attributes: ['id', 'username', 'fullName', 'bio', 'profilePicture', 'followersCount', 'followingCount', 'recipesCount']
    })

    if(!user){
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }

    return profileData(user);
}

async function getUserProfile(id){

    const user = await User.findByPk(id);

    if(!user){
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }

    return profileData(user);

}

async function updateUserProfile(id, { fullName, bio, profilePicture }) {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }

    const previousPicture = user.profilePicture;
    const updateData = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture) updateData.profilePicture = profilePicture;

    await user.update(updateData);

    if (profilePicture && previousPicture && previousPicture !== DEFAULT_PROFILE) {
        const previousPath = path.join(PROFILE_UPLOADS_DIR, path.basename(previousPicture));
        await fs.unlink(previousPath).catch(() => undefined);
    }

    return profileData(user);
}

module.exports = { registerUser, getPublicProfile, getUserProfile, updateUserProfile };