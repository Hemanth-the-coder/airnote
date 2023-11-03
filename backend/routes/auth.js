const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchdata = require("../middleware/fetchdata");
//create a user using post /. Doesnt require authentication
const SECRET_KEY = "youcantguessit";

async function hashPassword(password) {
  const saltRounds = 10; // You can adjust the number of salt rounds as needed.
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

router.post(
  "/",
  [
    // Validation and sanitization rules
    body("name").isLength({ min: 5 }).trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).*$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      User.findOne({ email: req.body.email }).then(async (user) => {
        if (user) {
          res.send("Email already exists");
        } else {
          var secpassword = await hashPassword(req.body.password);
          user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpassword,
          });
          const data = {
            user: {
              id: user.id,
            },
          };

          const authtoken = jwt.sign(data, SECRET_KEY);
          res.json({ authtoken });
        }
      });
    }
  }
);

// Authenticate a user
router.post(
  "/login",
  [
    body("email", "kindly enter a valid email address").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
 

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }



    const { email, password } = req.body;

    console.log(email)
    try {
      let user = await User.findOne({email : email})
      console.log(user.email)
      if(!user.email){
        res.json({error : "Please try to login with correct credentials"})
      }
      else{
        console.log("email validation passed");
        const passwordcompare = await bcrypt.compare(password , user.password);
        if(!passwordcompare){
          res.json({error : "Please try to login with correct credentials"})
        }
        
        const data = {
          user : {
            id : user.id
          }
        }

        let authcode = jwt.sign(data , SECRET_KEY)
        res.json({authcode})
      }

    }
    catch(error){
      console.log(error.message)
      res.json({error : error.message})
    }
  }
);


router.post("/getuser" ,fetchdata , async (req, res)=>{
  try{

    let userid = req.user.id;
    let data = await User.findById(userid).select("-password");
    res.send(data)
  }
  catch(e){
    res.json({message : e.message})

  }


})

module.exports = router;
