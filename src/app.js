const express = require("express");
const app= express();
const path =require("path");
const hbs=require("hbs");
const alert=require("alert");
const bcrypt=require("bcryptjs");

require("./db/conn");
const Register = require("./models/registers");
const { createCipheriv } = require("crypto");
const port=process.env.PORT || 3000;

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/register",(req, res)=>{
    res.render("register");
});

app.post("/register", async(req, res) =>{
    try{
        
        const password =req.body.password;
        const cpassword= req.body.confirmpassword;
        if(password===cpassword){
            const registerNewUser= new Register({
                fullName: req.body.fullName,
                email: req.body.email,
                password:req.body.password,
                confirmpassword: cpassword
            })


            //password hash
            

           const registered= await registerNewUser.save();
           res.status(201).render("home", {object:registered});
        //    res.status(201).send("Name: "+ registered.fullName + " email: "+ registered.email);
        //    res.status(201).send(registered);
        }else{
            res.send("passwords do not match");
        }
    }catch(error){
        res.status(400).send(error);
    }
});

app.get("/login",(req, res)=>{
    res.render("login");
});

app.post("/login", async(req, res)=>{
    try{

        const email=req.body.email;
        const password=req.body.password;
        const useremail= await Register.findOne({email:email});


        const isMatch= await bcrypt.compare(password, useremail.password);
        if(isMatch){
        // res.send("Name: "+ useremail.fullName + " email: "+ useremail.email);
            // res.status(201).render("index");
           res.status(201).render("home", {object:useremail});

        }else{
            alert("Invalid password");
            // res.send("Invalid email or password");
        
        }
    }catch(error){
        alert("invalid details");
        // res.status(400).send("invalid email or password");
    }

})


app.get("*",(req, res)=>{
    res.render("index");
});


// const bcrypt = require("bcryptjs");

// const securePassword=async(password)=>{
//     const passwordHash= await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordMatch= await bcrypt.compare(password, passwordHash);
//     console.log(passwordMatch);
// }

// securePassword("thapa");

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});


