const User = require('./userModel');
const bcrypt = require('bcrypt');

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
}

module.exports = { registerUser, getPublicProfile };