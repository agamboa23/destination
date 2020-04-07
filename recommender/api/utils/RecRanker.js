import axios from "axios";
import mimir from "mimir";
import nj from "numjs";
export const RANKTYPES = {
    SEMANTIC: 'semantic',
    LOCATION: 'location',
    ALL: 'all'
};
var bow = mimir.bow, dict = mimir.dict;
import tm from "text-miner";
import * as GeoUtil from "../utils/geocalculator";
import Profile from '../models/profile';
import { getDistance } from 'geolib';

const util = require('util');
var lancasterStemmer = require('lancaster-stemmer');

const YANDEXKEY = 'trnsl.1.1.20200404T180324Z.ff6dd6fd7d6572f1.1bd83273a39201564029ab25e0b4d53c892dae50';
import YandexTranslate from 'yet-another-yandex-translate';
const YandexTranslator = new YandexTranslate(YANDEXKEY);
const TranslateCharacterLimit=400;


export async function rank_destinations(destinations,rank_type, user_id) {
    //Find rank type
    //if all, zip results
    var location_rank,semantic_rank,result;
    var fb_profile = await Profile.findOne({fb_id:user_id});
    if (!fb_profile){
        return {destinations:destinations,error:"User Not in DataBase"};
    }
    switch (rank_type) {
        case RANKTYPES.SEMANTIC:
            result = await text_rank(destinations,fb_profile.likes_text,fb_profile.posts_text);
            if (!result){
                return {destinations:destinations,error:"No Text Found"};
            }
            break;
        case RANKTYPES.LOCATION:
            result = geo_rank(destinations,fb_profile.locations);
            if (!result)
            return {destinations:destinations,error:"No Locations Found"};
            break;
        case RANKTYPES.ALL:
            location_rank = geo_rank(destinations,fb_profile.locations);
            if (location_rank){
                semantic_rank = await text_rank(location_rank,fb_profile.likes_text,fb_profile.posts_text);
                if (!semantic_rank){
                    return {destinations:destinations,error:"No Text Found"};
                }
                result = zip_merge_to_array(semantic_rank,location_rank);
            }
            else{
                return {destinations:destinations,error:"No Locations Found"};
            }
            break;
        default:
            return {destinations:destinations,error:"Invalid Rank Type"};
    }
    return {destinations:result};
}

function geo_rank(destinations,user_locations) {
    var results=[];
    var lat,lon;
    if (destinations[0].min_distance){
        results = [...destinations];
        return results.sort((a,b)=>a.min_distance-b.min_distance);
    }
    var filtered_user_locations = user_locations
        .map(x=>x.split("&").map(i=>Number(i)))
        .filter(p=>GeoUtil.is_Bayern(p));
    if (filtered_user_locations.length==0){
        return false;
    } 
    destinations.forEach(element => {
        if (element.center){
            [lat,lon] = [element.center.lat,element.center.lon];
        }
        else{
            [lat,lon] = [element.lat,element.lon];
        }
        element.min_distance=filtered_user_locations.map(x=>getDistance(
            {latitude:lat,longitude:lon},
            {latitude:x[0],longitude:x[1]}))
            .reduce((min,current)=>Math.min(min,current));
    });
    results = [...destinations];
    return results.sort((a,b)=>a.min_distance-b.min_distance);
}

async function text_rank(destinations,likes_text, posts_text) {
    if (posts_text.length<1 || likes_text.length==0){
        return false;
    }
    var rest_text=[],namesAndDescriptions=[],results=[];
    var name,description,tag_text='';
    if (destinations[0].text_score){
        results = [...destinations];
        return results.sort((a,b)=>b.text_score-a.text_score);
    }
    destinations.forEach(element => {
        name = getNested(element,"tags","name")?getNested(element,"tags","name"):'';
        description = getNested(element,"tags","description")?getNested(element,"tags","description"):'';
        namesAndDescriptions.push(name+' '+description);        
        tag_text = Object.entries(element.tags).filter(x=>!x[0].includes("name") && !x[0].includes("description")).map(x=>x[1]).join(" ");
        rest_text.push(tag_text);
    });
    var reduced_namesAndDescriptions=namesAndDescriptions.map(x=>x.replace(/&/g, ' ')).join("&").substr(0,TranslateCharacterLimit).split("&");
    var reduced_rest_text=rest_text.map(x=>x.replace(/&/g, ' ')).join("&").substr(0,TranslateCharacterLimit).split("&");
    var [names_translate, rest_translate] = await Promise.all([YandexTranslator.translate(reduced_namesAndDescriptions, {from:'de', to: 'en'}), YandexTranslator.translate(reduced_rest_text, {from:'de', to: 'en'})]);
    rest_text=reduced_rest_text.concat(rest_text.slice(reduced_rest_text.length));
    namesAndDescriptions=reduced_namesAndDescriptions.concat(namesAndDescriptions.slice(reduced_namesAndDescriptions.length));
    
    var new_corpus = new tm.Corpus(rest_text.concat(namesAndDescriptions));
    new_corpus = new_corpus.removeWords(tm.STOPWORDS.EN).clean().removeInterpunctuation().map(x=>x.replace(/[^A-Za-z0-9 ]/g, ' ').split(' ').map(p=>lancasterStemmer(p)).join(' '));
    var full_text_list = new_corpus.documents.map(x=>x.text);
    //BOW time
    var voc=dict([likes_text,posts_text]);
    var likes_vector = bow(likes_text,voc);
    var posts_vector = bow(posts_text,voc);
    var full_destination_matrix = [];
    full_text_list.forEach(element => {
        full_destination_matrix.push(bow(element,voc));
    });
    full_destination_matrix = nj.array(full_destination_matrix);
    var user_matrix = nj.array([likes_vector,posts_vector]);

    var result_matrix = nj.dot(full_destination_matrix,user_matrix.T);

    var items_count=result_matrix.shape[0]/2;
    result_matrix = nj.concatenate(result_matrix.slice([-items_count]),result_matrix.slice(-items_count));
    var weights = nj.array([1,1,1,1]);
    //Master console.log(nj.concatenate(b.slice([-2]) ,b.slice(-2)))
    var final_rank = nj.dot(result_matrix,weights.T);

    for (var i=0;i<items_count;i++){
        destinations[i].text_score=final_rank.get(i);
    }
    results=[...destinations];
    return results.sort((a,b)=>b.text_score-a.text_score);

}

function zip_merge_to_array(array_a,array_b){
    var result = [],i, l = Math.min(array_a.length, array_b.length);
    for (i = 0; i < l; i++) {
        result.push(array_a[i], array_b[i]);
    }
    var unique_results = [...new Set(result)];
    return unique_results;
}

function getNested(obj, ...args) {
    return args.reduce((obj, level) => obj && obj[level], obj);
  }