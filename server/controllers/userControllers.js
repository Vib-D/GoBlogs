const User = require("../models/userModel")
const HttpError = require("../models/errorModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path =  require('path')
const {v4: uuid} = require('uuid')



// -------------- REGISTER A NEW USER
// POST : api/users/register
// UNPROTECTED
const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        if(!name || !email || !password){
            return next(new HttpError("Fill in all the fields!", 422))
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email: newEmail})
        if(emailExists){
            return next(new HttpError("Email already exist!", 422))
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password must be at least 6 characters!", 422))
        }

        if (password != confirmPassword){
            return next(new HttpError("Passwords do not match!", 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        const newUser = await User.create({ name, email: newEmail, password: hashedPass  })
        res.status(201).json(`New user ${newUser.email} registered!`)
    } catch (error) {
        return next(new HttpError("User registeration failed!", 422))
    }
}




// -------------- LOGIN A REGISTERED USER
// POST : api/users/register
// UNPROTECTED
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if( !email || !password){
            return next(new HttpError("Fill in all the fields!", 422))
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail})
        if (!user) {
            return next(new HttpError("Invalid credentials!", 422))
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentials!", 422))
        }

        const {_id: id , name} = user;
        const token = jwt.sign({id, name}, process.env.SECRET_KEY, {expiresIn: "1d"})

        res.status(200).json({token, id, name})
    } catch (error) {
        return next(new HttpError("Login Failed. Please check your credentials!", 422))
    }
}





// -------------- USER PROFILE
// POST : api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select('-password');
        if(!user){
            return next(new HttpError("User not found!", 404))
        }
        res.status(200).json(user)
    } catch (error) {
        return next(new HttpError(error))
    }
}









// -------------- CHANGE USER AVATAR
// POST : api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError("Please choose an image to upload", 422));
        }

        // Find user from the database
        const user = await User.findById(req.user.id);

        // If the user already has an avatar in the database, it's stored as Base64, so no need to delete files from the file system.

        const { avatar } = req.files;

        // (Optional) Size check in bytes (if needed)
        

        // Convert the uploaded image to Base64
        const base64Image = avatar.data.toString('base64');

        // Create the avatar in Base64 format with MIME type
        const newAvatar = `data:${avatar.mimetype};base64,${base64Image}`;

        // Update the user's avatar in the database
        const updatedAvatar = await User.findByIdAndUpdate(
            req.user.id, 
            { avatar: newAvatar }, // Store the Base64 encoded avatar in the database
            { new: true }
        );

        if (!updatedAvatar) {
            return next(new HttpError("Failed to update user avatar", 422));
        }

        // Return the updated user information (including the new avatar)
        res.status(200).json(updatedAvatar);
    } catch (error) {
        return next(new HttpError("An error occurred while changing the avatar", 500));
    }
};






// -------------- EDIT USER DETAILS
// POST : api/users/edit-user
// PROTECTED
const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword){
            return next(new HttpError("Please fill in all the fields!", 422))
        }

        // get user from database
        const user = await User.findById(req.user.id)
        if(!user) {
            return next(new HttpError("User not found!", 403))
        }

        //make sure email already doesnt exist
        

        //compare new password with password in db
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        if(!isValidPassword) {
            return next(new HttpError("Invalid current password", 422))
        }
        
        // compare new passwords
        if(newPassword !== confirmNewPassword) {
            return next(new HttpError("New passwords do not match", 422))
        }

        // hash new password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)

        // update user info into db
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true})
        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error))
    }
}






// -------------- GET AUTHORS
// POST : api/users/authors
// UNPROTECTED
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors)
    } catch (error) {
        return next(new HttpError(error))
    }
}






module.exports = { getAuthors, getUser, editUser, loginUser, registerUser, changeAvatar }