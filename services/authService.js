const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(name, email, password) {}
async function login(email, password) {}
async function logout(token) {}

module.exports = { register, login, logout };
