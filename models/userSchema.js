const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonweb = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: true
            }
           
        }
    ]
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) { // it mean jb pass chnge ho tb hi ecrypt krna he.
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();

})

// JSON TOKEN  function
// note this dont work with arroe function so we used normal function
// 1.in auth 2. defined ths function 3.defining new input in databse named tokens. 4. now store the token in database. 5. send cookiw in auth using cookie.
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jsonweb.sign({ _id: this._id }, process.env.SECRET_KEY);
        // ( database tokens = db tokens({ db token:let token }) )
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;

    }
    catch (err) { console.log(err); }
}

userSchema.methods.addMessage = async function(name,email,phone,message){
    try{
        this.messages = this.messages.concat({name:name,email:email,phone,message})
        await this.save();
        return message;

    }
    catch(err){
        console.log(err);
    }

}


const User = mongoose.model("USER", userSchema);

// we have exported this so that we can use it anywhere,to use it simpliy do "require...."
module.exports = User;