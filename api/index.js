const express = require('express');
const cors=require('cors');
const User = require('./models/User');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
// Set the "strictQuery" option to false
mongoose.set('strictQuery', false);
const bcrypt=require("bcryptjs");
const app = express();
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(10);
const secret='qwertyuiopasdfghjkl'

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
  app.post ('/login', async(req,res)=>{
const {username, password} = req.body
const userDoc = await User.findOne({username});
const passOk = bcrypt.compareSync(password, userDoc.password);
if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }

  });

  app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
  });
  
  app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });
  app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    res.json({exit});
  });
  
  
app.listen(4000)


