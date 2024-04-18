const mongoose = require("mongoose");

const databaseConnection = async () => {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("connection was made successfully!");
    console.log("Port: ", connect.connection.port)
    console.log("Name: ", connect.connection.name)
    console.log("Host: ", connect.connection.host)
}

module.exports = databaseConnection;
// i1kHO5eV878W3Jol