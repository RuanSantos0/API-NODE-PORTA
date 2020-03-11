const mongoose = require('mongoose');

const portaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome_porta: {type: String, require: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
});

module.exports = mongoose.model('Porta', portaSchema);