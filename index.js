// "type": "module",  use this in package.json file if wanna use import
// npm i dotenv : used to hide the confidential data from the users. the confidential data is written in "config.env" file, and imported here for use like PORT and DATABASE
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
// Importing the config file to import the data and use like see we have impoeted port and database (in connection.js) file.
dotenv.config( {path:"./config.env"} );
// Importing the code which will used again and again so we have write it in different file so that we can use in many files.
require("./db/connection");
app.use(express.json());

app.use(cookieParser());
// app.use(cors());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

//  this contain the routes imported auth file
app.use(require("./routes/auth"));
// Imported user schemea 
const User = require("./models/userSchema"); 

// UPDATE : we have written this in coon.js file as its reusable code.
// link of the DB where to connect this app. taken from mongo atlus.
// const DB = process.env.DATABASE;
// mongoose.connect(DB).then( ()=> { console.log("Connection Estisblished Succesfully.") } ) .catch( (err) => console.log("Error in Connecting.") )

// Importing PORT
const PORT = process.env.PORT;

// Middleware
// >>>  middleware are the functions which has access to reuest object (req) , response object (res) and next function in the applicants requst cycle modal.
// >>> the next function is a fucntion in express router which when envoked, executes the middleware successdind the current middleware.
// const middleware = (req, res, next) => {
//     console.log("Hello Middleware");
//     next();
// }
// middleware();

app.get("/home", (req, res) => {
    // res.cookie("ABC", "test");
    res.send("Home");
})

// app.get("/about", middleware, (req, res) => {
//     res.send("about");
// })
 
// app.get("/contact", (req, res) => {
//     res.cookie("rishabh", "lovely");
//     res.send("Contact");
// })

app.get("/signin", (req, res) => {
    res.send("SignIN");
})

app.get("/signup", (req, res) => {
    res.send("SignUp");
})


app.listen(PORT, () => { console.log(`Server statred on Port No. ${PORT}`); })
