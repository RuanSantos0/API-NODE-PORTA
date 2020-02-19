const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Porta = require('../models/porta');

router.get('/', (req, res, next) => {
    Porta.find().select('_id nome_porta user').populate('user').exec().then(docs => {
        // console.log(docs)
        const response = {
            count: docs.length,
            portas: docs.map(doc => {
                return {
                    _id: doc._id,
                    nome_porta: doc.nome_porta,
                    user: doc.user, 
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/portas/' + doc._id
                    }
                }
            })
        }
        // if(docs.length >= 0){
        res.status(200).json(response);
        // }else{
        //     res.status(404).json({
        //         message: "Não existe produtos cadastrados"
        //     })
        // }       
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const porta = new Porta({
        _id: new mongoose.Types.ObjectId(),
        nome_porta: req.body.nome_porta,
        user: req.body.user
    });
    porta.save().then(result => {
        console.log('result', result);
        res.status(201).json({
            message: 'Porta cadastrada com sucesso',
            createdPorta: {
                user: result.user,
                nome_porta: result.nome_porta,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/portas/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});

router.get('/:portaId', (req, res, next) => {
    const id = req.params.portaId;
    Porta.findById(id).select('_id nome_porta').exec().then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                porta: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/portas'
                }
            });
        } else {
            res.status(404).json({
                message: "Id não cadastrado"
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


router.patch('/:portaId', (req, res, next) => {
    const id = req.params.portaId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Porta.update({ _id: id }, { $set: updateOps }).exec().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Porta atualizada',
            request: {
                type: 'PATCH',
                url: 'http://localhost:3000/portas/' + id
            }
        }
        );
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.delete('/:portaId', (req, res, next) => {
    const id = req.params.portaId;
    Porta.remove({ _id: id }).exec().then(result => {
        console.log(res);
        res.status(200).json({
            message: 'Porta deletada',
            request: {
                type: 'DELETE',
                url: 'http://localhost:3000/portas',
                body: {userId: "ID", nome_porta: 'String', _id: 'Number' }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

module.exports = router;    