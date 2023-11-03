const mongoose = require("mongoose");


const mongoURI = "mongodb://0.0.0.0:27017/airnotes";

const connectomongo = () => {
    mongoose.connect(mongoURI);     
    console.log("connected to database");
}

module.exports = connectomongo;