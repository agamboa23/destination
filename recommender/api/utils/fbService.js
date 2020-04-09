import axios from "axios";
import tm from "text-miner";
const util = require('util');
var lancasterStemmer = require('lancaster-stemmer')

const YANDEXKEY = 'trnsl.1.1.20200404T180324Z.ff6dd6fd7d6572f1.1bd83273a39201564029ab25e0b4d53c892dae50';
import YandexTranslate from 'yet-another-yandex-translate';
const YandexTranslator = new YandexTranslate(YANDEXKEY);

const fb_api = "https://graph.facebook.com/v6.0/";
const cursor_iterator = 5;


export async function fb_data_etl(fb_id,access_token) {
    try {
        var [photos_locations, [likes_locations,likes_text], feed] = await Promise.all([fb_photos_et(fb_id,access_token), fb_likes_et(fb_id,access_token), fb_feed_et(fb_id,access_token)]);
        var master_locations = photos_locations.concat(likes_locations);
        return {posts_text:feed,likes_text:likes_text,locations:master_locations}; 
       
    } catch (error) {
        return {error:error};
    }
}

async function fb_photos_et(fb_id,access_token){
    var response,current_call,photos_list;
    photos_list=[];
    current_call = fb_api+fb_id+"/photos?fields=place&access_token="+access_token;
    for(var i=0;i<cursor_iterator;i++){
        if (current_call==null) break;
        response = await axios.get(current_call);
        photos_list=photos_list.concat(response.data.data.filter(p=>getNested(p,"place","location","latitude")!=null).map(x=>get_place_coordinates(x.place)))
        current_call = getNested(response,"data","paging","next");
    }
    return [...new Set (photos_list)];
}

async function fb_likes_et(fb_id,access_token){
    var response,current_call,result;
    var text_list = [];
    var location_list=[];
    current_call = fb_api+fb_id+"/likes?fields=description,location,category,name,products&access_token="+access_token;
    for(var i=0;i<cursor_iterator;i++){
        if (current_call==null) break;
        response = await axios.get(current_call);
        location_list=location_list.concat(response.data.data.filter(p=>getNested(p,"location","latitude")!=null).map(x=>get_place_coordinates(x)));
        text_list=text_list.concat(response.data.data.map(x=>get_list_text(x)));
        current_call = getNested(response,"data","paging","next");
    }
    text_list=text_list.join("&&").substr(0,10000).split("&&");
    result = await process_text(text_list);
    return [location_list,result];
}

async function fb_feed_et(fb_id,access_token){
    var response,current_call,feed_text,result;
    feed_text=[];
    current_call = fb_api+fb_id+"/feed?fields=message&access_token="+access_token;
    for(var i=0;i<cursor_iterator;i++){
        if (current_call==null) break;
        response = await axios.get(current_call);
        feed_text=feed_text.concat(response.data.data.filter(p=>getNested(p,"message")!=null).map(x=>x.message));
        current_call = getNested(response,"data","paging","next");
    }
    feed_text=feed_text.join("&&").substr(0,10000).split("&&");
    result = await process_text(feed_text);
    return result;
}

function get_list_text(x){
    return [getNested(x,"name"),getNested(x,"description"),getNested(x,"category"),getNested(x,"products")].join(" ");
}

function get_place_coordinates(x){
	return getNested(x,"location","latitude") + '&' + getNested(x,"location","longitude")
}

function getNested(obj, ...args) {
  return args.reduce((obj, level) => obj && obj[level], obj)
}

async function process_text(documents){
    var response = await YandexTranslator.translate(documents, { to: 'en'});
    var new_corpus = new tm.Corpus(response);
    new_corpus = new_corpus.removeWords(tm.STOPWORDS.EN).map(x=>x.replace(/[^A-Za-z0-9 ]/g, ' ')).clean().removeInterpunctuation();
    var last_text = new_corpus.documents.join(" ").split(" ").map(x=>lancasterStemmer(x)).join(" ");
    return last_text;
}

function zip_merge_to_String(array_a,array_b){
    var result = "",
    i, l = Math.min(array_a.length, array_b.length);
    for (i = 0; i < l; i++) {
        result+= " " +array_a[i]+ " " +array_b[i];
    }
    result+=array_a.slice(l).join(" ") + " " +array_b.slice(l).join(" ");
    return result;
}

function zip_merge_to_array(array_a,array_b){
    var result = [],i, l = Math.min(array_a.length, array_b.length);
    
    for (i = 0; i < l; i++) {
        result.push(array_a[i], array_b[i]);
    }
    result.push(...array_a.slice(l), ...array_b.slice(l));
    result = result.join("&&").substr(0,10000).split("&&");
    return result;
}
