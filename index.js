const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const DB_URI = 'mongodb+srv://issue-tracker:issue-tracker@cluster0-gcimf.mongodb.net/test?retryWrites=true&w=majority';
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//connectiong to our mongodb databesa
mongoose.connect(DB_URI)
    .catch(err => console.log(err))
    .then(() => {
        console.log("Connected to DB successfully")
    })
//User Routes
const UserModel = require('./models/user.model');
//create user
app.post('/user', (req, res, next) => {
    let user = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })
    UserModel.create(user, (err, response) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json(response);
    })
}) 
//gett all users
app.get('/user', (req, res) => {
    UserModel.find({}, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})
//delete all users
app.delete('/user/:id', (req, res, next) => {
    const id =req.params.id;
    UserModel.deleteOne({_id: id}, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})

//update user by id
app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findbyIdAndUpdate(id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    }, (err,result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})

//login
app.post('/user/login', (req, res) => {
    let userEmail = req.body.email;
    let userPassword = req.body.password;

    UserModel.findOne({email: userEmail}, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        if(result == null) {
            res.json({
                message: "user does not exist",
                loggedIn: false
            })
            return;
        }
        if (userPassword == result.password) {
            res.json({
                message: 'logged in successfully',
                loggedIn: true
            })
            return;
        }
        res.json({
            message: 'email or password incorrect',
            loggedIn: falce
        })
    })
})
 
//Issue Routes
const IssueModel = require('./models/issue.model');

app.post('/issue', (req, res) => {
    IssueModel.create(req.body, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})

app.delete('/issue/:id', (req, res) => {
    IssueModel.deleteOne({_id: req.params.id}, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})

app.get('/issue', (req, res) => {
    IssueModel.find({}, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})

app.put('/issue/:id', (req,res) => {
    let obj = {};
    if (req.body.resolved) {
        obj.resolved = req.body.resolved
        obj.resolved_at = Date.now();
    }
    if (req.body.title) {
        obj.title = req.body.title;
    }
    IssueModel.updateOne({_id: req.params.id}, obj, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
        res.json(result);
    })
})
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
