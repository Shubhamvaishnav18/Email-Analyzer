const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log("Connected to DB"));
};

module.exports = connectDB;