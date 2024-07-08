const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonweb = require("jsonwebtoken");
const authee = require("../middlewares/authee");
const cookieParser = require("cookie-parser");


require("../db/connection");
const User = require("../models/userSchema");

router.use(cookieParser());





router.get("/home", (req, res) => {
    res.send("Home from side");
})

// using promise method 
// router.post("/register", (req, res) => {
//     // old way // console.log(req.body); // new way = 
//     const { name, email, phone, work, password, cpassword } = req.body;
//     // console.log(name);
//     // res.json( {message: req.body} );

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Plz fill the feild property." });
//     }

//     User.findOne({email: email}).then( (userexist) => {
//         if(userexist) {
//             return res.status(422).json( { error:"User Already Exist." } );
//         }
//         const user =new User ({name:name, email: email, phone:phone, work:work, password:password, cpassword:cpassword});

//         user.save().then( ()=>{
//             res.status(201).json( { message:"user registered succesfully." } );
//         } ).catch( (err) => res.status(500).json( { error:"failed to registered." } ) );

//     } ) .catch(err => console.log(err));

// })

// using async 
router.post("/register", async (req, res) => {
    // old way // console.log(req.body); // new way = 
    const { name, email, phone, work, password, cpassword } = req.body;
    // console.log(name);
    // res.json( {message: req.body} );

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz fill the feild property." });
    }

    try {
        const userexist = await User.findOne({ email: email });
        if (userexist) {
            return res.status(422).json({ error: "User Already Exist." });
        }


        const user = new User({ name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword });

        const userregister = await user.save();
        if (userregister) {
            res.status(201).json({ message: "user registered succesfully." });
        }
    }
    catch (err) {
        console.log(err);
    }

})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Empty Data Fields." });
        }

        const checkuser = await User.findOne({ email: email });
        if (!checkuser) {
            return res.status(400).json({ error: "Invalid Credentials." });
        } else {
            const isMatch = await bcrypt.compare(password, checkuser.password);

            if (isMatch) {
                // 1. json token 
                const token = await checkuser.generateAuthToken();
                console.log(token);

                // sending cookie
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: "/",
                    sameSite: "strict",
                });
                res.status(200).json({ message: "Login Successful." });
            } else {
                res.status(400).json({ error: "Wrong Password." });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error." });
    }
});




router.get("/about", authee, (req, res) => {
    // res.cookie("fakeapi",token);
    console.log("wlcm to abt pge");
    res.send(req.rootUser);

});


router.get("/getdata", authee, (req, res) => {
    // res.cookie("fakeapi",token);
    console.log("wlcm to home pge");
    res.send(req.rootUser);

});

router.post("/contact", authee, async(req, res) => {
    // res.cookie("rishabh", "lovely");
    try{
        const { name, email, phone, message } = req.body;
        if (!name || !email  || !phone  || !message) {
            return res.json({ error: "Empty Data Fields." });
            console.log("Empty Data Feilds.");
        }

        const userContact = await User.findOne({_id: req.userID  });

        if(userContact){
            const userMessage =await userContact.addMessage(name,email,phone,message);

            await userContact.save();

            res.status(201).json({message:"User Contacted Successfully."});

        }


    }
    catch(err)
    {
        console.log(err);
    }
    
})


router.get("/logout",(req, res) => {
    // res.cookie("fakeapi",token);
    console.log("Loggeedd Out");
    res.clearCookie("jwtoken", {path:"/"}); // the path should be same as we set at the time of defining cookie in login route.
    res.status(200).send("User Logout");

});




module.exports = router;