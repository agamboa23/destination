import { Schema, model } from 'mongoose';

const profileSchema = Schema({
    fb_id: {type: String},
    access_code: {type:String},
    email: {type: String},
    name: {type: String},
    locations: [{type:String}],
    likes_text :{type:String},
    posts_text: {type:String}
});

export default model('Profile', profileSchema, 'profiles');