const mongoose = require("mongoose");


const DB = process.env.DATABASE;
mongoose.connect(DB).then( ()=> { console.log("Connection Estisblished Succesfully.") } ) .catch( (err) => console.log("Error in Connecting.") )