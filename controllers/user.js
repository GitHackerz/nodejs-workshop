const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

require('dotenv').config();

const AddUser = async(req, res) => {
    try {
        const newUser = new UserModel(req.body);

        const existedUser = await UserModel.findOne({ email: newUser.email });
        if (existedUser) return res.status(400).send('Email is already existed');

        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        res.send('User added successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

const UpdateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('ID Not Valid');

        const existedUser = await UserModel.findById(id);
        if (!existedUser) return res.status(400).send('User not found');

        if ((req.payload.user.role === 'user' || req.payload.user.role === 'admin') && !req.payload.user._id === id) return res.status(401).send('Access denied. You are not allowed to update another user');

        if (updatedUser.password) updatedUser.password = await bcrypt.hash(updatedUser.password, salt);

        existedUser.set(updatedUser);

        await existedUser.save();
        res.send('User updated successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

const DeleteUser = async(req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('ID Not Valid');

        const deleteUser = await UserModel.findByIdAndDelete(id);
        if (!deleteUser) return res.status(400).send('User not found');

        if ((req.payload.user.role === 'user' || req.payload.user.role === 'admin') && !req.payload.user._id === id) return res.status(401).send('Access denied. You are not allowed to delete another user');

        res.send('User deleted successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

const GetUsers = async(req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

const GetUser = async(req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('User not found');

        const user = UserModel.findById(id);
        if (!user) return res.status(400).send('User not found');
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

module.exports = {
    AddUser, UpdateUser, DeleteUser, GetUsers, GetUser
};