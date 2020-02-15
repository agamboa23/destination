import { Schema, model } from 'mongoose';

const provinceSchema = Schema({
    _id: Schema.Types.ObjectId,
    osm_id: {type: Number},
    place_id: {type: Number},
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
});

export default model('Province', provinceSchema,'provinces');