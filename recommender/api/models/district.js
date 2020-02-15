import { Schema, model } from 'mongoose';

const districtSchema = Schema({
    _id: Schema.Types.ObjectId,
    parent_osm_id: {type: Number},
    osm_id: {type: Number},
    place_id: {type: Number},
    wikidata_code: { type: String },
    name: {type: String},
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

export default model('District', districtSchema, 'districts');