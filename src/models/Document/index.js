const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    version: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

const documentVersionSchema = new Schema({
    majorVersion: { type: Number, required: true },
    minorVersion: { type: Number, required: true },
    originalName: { type: String, required: true,
            validate: [ 
                { validator: value => value.length < 255, msg: 'Name is too long (max 255 chars).' },
                { validator: value => value.length > 3, msg: 'Name is too short (min 3 chars).' },
            ] 
    },
    serverName: { type: String, required: true },
    tags: { type: [String], required: true },
    fields:  { type: [String], required: true },
}, { timestamps: true });

const documentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    versions: [documentVersionSchema],
    registrations: [registrationSchema],
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
