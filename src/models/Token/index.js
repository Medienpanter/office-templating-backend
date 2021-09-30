const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);
