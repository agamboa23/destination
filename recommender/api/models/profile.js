const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: Number},
    arts: {type: Number},
    wikidata_code: { type: String },
    name: {type: String},
    name_eng: {type: String},
    importance_rank: {type: Number},
    osm_type: {type: String},
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

module.exports = mongoose.model('Profiles', profileSchema,'profiles');