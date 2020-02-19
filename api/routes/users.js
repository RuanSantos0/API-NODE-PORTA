const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    User.find({user: req.body.user}).exec().then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Usuário já existe'
            });
        }else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                }else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        user: req.body.user,
                        password: hash
                     });
                     user.save().then(result => {
                         console.log(result);
                         res.status(201).json({
                            message: 'Usuário cadastrado'
                         });
                     }).catch(err => {
                         console.log(err);
                         res.status(500).json({
                             error: err
                         });
                     });
                }
           });  
        }
    });   
});


router.post("/login", (req, res, nex) => {
    User.find({user: req.body.user}).exec().then(user => {
        if(user.length < 1) {
            return res.status(404).json({
                message: 'Falha na altenticação'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Falha na altenticação'
                });
            }
            if(result) {
                const token = jwt.sign(
                    {
                    user: user[0].user,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY, 
                { 
                    expiresIn: "1h"
                }
            );
                return res.status(200).json({
                    message: 'Sucesso na altenticação',
                    token: token
                })
            }
            res.status(401).json({
                message: 'Falha na altenticação'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId}).exec().then(result => {
        res.status(200).json({
            message: "Usuário deletado"
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;