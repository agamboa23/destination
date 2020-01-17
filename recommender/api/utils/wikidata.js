import Province from '../models/province';
import md5 from 'md5';
var wiki_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids=";
var provinces_qids= "Q10559|Q10547|Q10551|Q10557|Q10562|Q10554|Q10555";
import axios from "axios";
var media_url = "https://upload.wikimedia.org/wikipedia/commons/";

export function wikidata_extractor_helper(place_reference,wikidata) {
    var wappen,image, image_md,wappen_md,image_name,wappen_name;
    image = wikidata.data.entities[place_reference.wikidata_code].claims.P18;
    wappen = wikidata.data.entities[place_reference.wikidata_code].claims.P94;
    if (image){
        image_name=image[0].mainsnak.datavalue.value.replace(/ /g,"_");
        image_md = md5(image_name).substr(0,2);
        place_reference.image_url = media_url+image_md[0]+'/'+image_md+'/'+image_name;
    }
    else{
        place_reference.image_url = "NA";
    }
    if (wappen){
        wappen_name=wappen[0].mainsnak.datavalue.value.replace(/ /g,"_");
        wappen_md = md5(wappen_name).substr(0,2);
        place_reference.wappen_url = media_url+wappen_md[0]+'/'+wappen_md+'/'+wappen_name;
    }
    else{
        place_reference.wappen_url = "NA";
    }
    population = wikidata.data.entities[place_reference.wikidata_code].claims.P1082;
    area = wikidata.data.entities[place_reference.wikidata_code].claims.P2046;
    place_reference.population= population ? population[0].mainsnak.datavalue.value.amount : "NA";
    place_reference.area= area ? area[0].mainsnak.datavalue.value.amount : "NA";
}

