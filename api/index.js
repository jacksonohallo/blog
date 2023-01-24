const express = require('express');
const cors=require('cors');
const User = require('./models/User');
const mongoose = require('mongoose');
// Set the "strictQuery" option to false
mongoose.set('strictQuery', false);
const bcrypt=require("bcryptjs");
const app = express();
app.use(cors());
app.use(express.json());

const salt = bcrypt.genSaltSync(10);

mongoose.connect('mongodb+srv://hu:gSABT8lfErChXPPy@cluster0.hflegqn.mongodb.net/?retryWrites=true&w=majority')
app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
    } catch(e) {
      console.log(e);
      res.status(400).json(e);
    }
  });
app.listen(4000)


