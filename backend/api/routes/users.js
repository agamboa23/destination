const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

const User = require('../models/user');

const UsersController = require('../controllers/users');

router.post('/signup', UsersController.users_signup);
router.post('/login', UsersController.users_login);
router.get('/', UsersController.users_get_all);
router.get('/:userId', UsersController.users_get_user);
router.patch('/:userId', UsersController.users_patch_user);
router.delete('/:userId', UsersController.users_delete_user);
router.delete('/', UsersController.users_delete_all);

router.post('/', upload.single('userImage'),(req, res, next) => {
    console.log(req.file);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        age: req.body.age,
        languages: req.body.languages,
        userImage: req.file.path
    });
    user.save()
        .then(result => {
            res.status(201).json({
                message: 'Created user successfully',
                createdUser: {
                    first_name: result.first_name,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;