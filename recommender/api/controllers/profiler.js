import Profile from '../models/profile';
import { get } from "axios";
import Stereotypes from '../models/stereotypes';
import * as FBService from "../utils/fbService";

export async function is_new_profile(req,res,next){
    console.log(req.params.profile_id);
    var response=await get("https://graph.facebook.com/v6.0/10158719569674237?fields=birthday%2Cage_range%2Cemail%2Csports&access_token=EAAQMbzwen4EBACa36xnZCORiI8IK4xXpkwMDegie4OBBIDNGcKF0hjewSmBRaUgYgvahSKBXKtpLdZAw9s3dqDHTohZBjD0ZBQEtvqtdFZARyfhWZAXo3zOMOUNou2w8M7oWcncGlkstwuSt6Mh0iK0GGYEzZAVwibmj8yDCbM6H0sJTfy3a4YTT9M7HE5bTYwt1OgiJ9bEWj2FiIrGGnqTDXnzeQZBtsb9HdsNEp7KHMAZDZD")
    res.status(200).json(response.data);
}

export async function build_profile(req, res, next) {
    //get locations
    //get likes
    //get posts
    //post user profile
    /*const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        age: req.body.age,
        languages: req.body.languages,
        phone_number: req.body.phone_number,
        trips: req.body.trips,
    });
    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User created'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        */
//    var fb_profi = await Profile.findOne({fb_id:"11"})
    //const userDoc = new Profile({ name: 'Foo' });
    //userDoc.save().then((data)=>{
     //   console.log('save data: ',data)
       // what you want to do after saving like res.render
    //  });
    var fb_profile = await Profile.findOne({fb_id:req.body.fbId})
    if (fb_profile) {
        res.status(200).json({Message: "Already Registered User",profile:fb_profile});
    }
    else{
        var new_profile = new Profile({
            fb_id:"",
            access_code:req.body.fbId,
            email:req.body.access_code
        });
        await new_profile.save();
        var profile_extracted_data = await FBService.fb_data_etl(req.body.fbId,req.body.access_code,req.body.name,req.body.email);
        if (profile_extracted_data.error){
            var log = new Profile({
                fb_id:profile_extracted_data.error,
                access_code:req.body.fbId,
                email:req.body.access_code
            });
            await log.save();
            res.status(400).json({Message:profile_extracted_data.error.message});
        }
        else{
            var old_profile = await Profile.findOne({access_code:req.body.fbId})
            new_profile.overwrite({ 
                fb_id:req.body.fbId,
                access_code:req.body.access_code,
                email:req.body.email,
                locations:profile_extracted_data.locations,
                likes_text:profile_extracted_data.likes_text,
                posts_text:profile_extracted_data.posts_text });
            await new_profile.save();
            res.status(200).json({Message:"completed"});
        }
    }
}