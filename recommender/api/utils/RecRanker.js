import axios from "axios";
import mimir from "mimir";
import nj from "numjs";

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
const TranslateCharacterLimit=400
const fb_api = "https://graph.facebook.com/v6.0/";
const cursor_iterator = 1;


export async function rank_destinations(destinations,rank_type, user_id) {
    //Find rank type
    //if all, zip results
    var fb_profile = await Profile.findOne({fb_id:user_id});
    if (!fb_profile){
        return {destinations:destinations,error:"User Not in DataBase"};
    }
    //var location_rank = geo_rank(destinations,fb_profile.locations);
    var text_rank_list = await text_rank(destinations,fb_profile.likes_text,fb_profile.posts_text);
    
    return {destinations:text_rank_list};

}
function geo_rank(destinations,user_locations) {
    var lat,lon;
    var filtered_user_locations = user_locations
        .map(x=>x.split("&").map(i=>Number(i)))
        .filter(p=>GeoUtil.is_Bayern(p));
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
    return destinations.sort((a,b)=>a.min_distance-b.min_distance);
}

async function text_rank(destinations,likes_text, posts_text) {
    //Bow for feed and likes
    //bow for nodes
    //vector multiplication
    //add and sort by max value
    var rest_text=[],namesAndDescriptions=[];
    var name,description,tag_text='';
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
    return destinations.sort((a,b)=>b.text_score-a.text_score);

}

async function process_text(documents){
    
    var response = await YandexTranslator.translate(documents, {from:'de', to: 'en'});
    var new_corpus = new tm.Corpus(response);
    new_corpus = new_corpus.removeWords(tm.STOPWORDS.EN).map(x=>x.replace(/[^A-Za-z0-9 ]/g, ' ')).clean().removeInterpunctuation();
    var last_text = new_corpus.documents.join(" ").split(" ").map(x=>lancasterStemmer(x)).join(" ");
    return last_text;
}
function getNested(obj, ...args) {
    return args.reduce((obj, level) => obj && obj[level], obj)
  }