import queryOverpass from '@derhuerst/query-overpass';
import District  from '../models/district';
import Province from '../models/province';
import { get } from "axios";
import * as WikiHelper from '../utils/wikidata';
import * as GeoCalculator from '../utils/geocalculator';
import * as opQueryBuilder from '../utils/overpassQueryBuilder';
import * as Stereotypes from '../controllers/stereotypes';
const wiki_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids=";
const provinces_qids= "Q10559|Q10547|Q10551|Q10557|Q10562|Q10554|Q10555";

export async function get_provinces_recommendations(req, res, next) {
    const qSortBy = "population";
    const qSortCriteria = "descending";
    const includeImage = true;
    var wappen,image, image_md,wappen_md,image_name,wappen_name,population,area,wikidata;
    try {
        const provinces = await Province.find().lean().sort([[qSortBy,qSortCriteria]]).exec();
        if (includeImage){
            wikidata = await get(wiki_url+provinces_qids);
            for await( var province of provinces){
                WikiHelper.wikidata_extractor_helper(province,wikidata);
            }
        }
        res.status(200).json({provinces});
    }
    catch(err){
        throw err;
    }
}

export async function get_districts_recommendations(req, res, next) {
    const qSortBy = "population";
    const qSortCriteria = "descending";
    const includeImage = true;
    const qSkip = Number(req.query.skip) || 0;
    const qLimit = Number(req.query.limit) || 20;
    const pProvinceId = req.params.province_osm_id && isNaN(req.params.province_osm_id)? -1: req.params.province_osm_id;
    const findQuery = req.params.province_osm_id ? {parent_osm_id:(pProvinceId)} : {};
    var wikidata,districts_qids="";
    try {
        const districts = await District.find(findQuery).skip(qSkip).limit(qLimit).lean().sort([[qSortBy,qSortCriteria]]).exec();
        if (includeImage){
            districts.forEach(district=>districts_qids+=district.wikidata_code+'|');
            districts_qids=districts_qids.slice(0,-1);
            wikidata = await get(wiki_url+districts_qids);
            for await( var district of districts){
                WikiHelper.wikidata_extractor_helper(district,wikidata);
            }
        }
        res.status(200).json({districts});
    }
    catch(err){
        throw err;
    }
}

export async function get_dstn_recommendations(req, res, next) {
    const pDistrictId = req.params.district_osm_id || 62686;
    const areaPrefix = 3600000000;
    if (isNaN(pDistrictId)){
        return res.status(400).json({message:"Bad Request, invalid district id"});
    }
    const overpassAreaCode = areaPrefix+Number(pDistrictId);
    try {
        const destinations = await queryOverpass(`
        [out:json][timeout:800];
        area(`+overpassAreaCode+`)->.searchArea;
        // determine set public transportation stations
        (
          node[public_transport=station](`+overpassAreaCode+`);
          way[public_transport=station](`+overpassAreaCode+`);
          rel[public_transport=station](`+overpassAreaCode+`);
        )->.stations; // put them into the set "stations"
        
        // determine set of locations, in this case tourism
        (
          node[tourism](`+overpassAreaCode+`);
          way[tourism](`+overpassAreaCode+`);
          rel[tourism](`+overpassAreaCode+`);
        )->.destinations; // put them into the set "destinations"
        
        // determine set of banks near police stations
        (
          node.destinations(around.stations:1000);
          way.destinations(around.stations:1000);
          rel.destinations(around.stations:1000);
        )->.destinationsNearStations; // put them into the set "banksNearPolices"
        
        // determine destinations far from stations
        //(.destinations; - .destinationsNearStations;);
        (.destinationsNearStations;);
        // return node, ways, relations as determined above
        out geom meta;
        `);
        console.log(`
        [out:json][timeout:800];
        area(`+overpassAreaCode+`)->.searchArea;
        // determine set public transportation stations
        (
          node[public_transport=station](`+overpassAreaCode+`);
          way[public_transport=station](`+overpassAreaCode+`);
          rel[public_transport=station](`+overpassAreaCode+`);
        )->.stations; // put them into the set "stations"
        
        // determine set of locations, in this case tourism
        (
          node[tourism](`+overpassAreaCode+`);
          way[tourism](`+overpassAreaCode+`);
          rel[tourism](`+overpassAreaCode+`);
        )->.destinations; // put them into the set "destinations"
        
        // determine set of banks near police stations
        (
          node.destinations(around.stations:1000);
          way.destinations(around.stations:1000);
          rel.destinations(around.stations:1000);
        )->.destinationsNearStations; // put them into the set "banksNearPolices"
        
        // determine destinations far from stations
        //(.destinations; - .destinationsNearStations;);
        (.destinationsNearStations;);
        // return node, ways, relations as determined above
        out geom meta;
        `)
        res.status(200).json({destinations});
    }
    catch(err){
        throw err;
    }
}

export async function get_dstn_by_stereotype(req, res, next) {
    const pStereotypes = req.params.stereotypes;
    const qFilter = req.query.filter || "";
    const qArea = req.query.area || "62532";
    const qMaxDistance = isNaN(req.query.maxDistance)? 15 : Number(req.query.maxDistance);
    const qMinDistance = isNaN(req.query.minDistance)? 0 : Number(req.query.minDistance);
    const qAroundMetric = req.query.aroundMetric || "km";
    const qLocation = req.query.location;
    const pBtReachable = req.params.bt_reachable=="false"? false : true;
    var overpassAreaCode,maxDistance,minDistance,location,queryString,filters;
    console.log(qFilter)
    filters=qFilter+"&&("+Stereotypes.get_stereotypes_filters(pStereotypes)+")";
    if (qLocation){
        location = qLocation.split('|');
        if (location.length<2||isNaN(location[0],isNaN(location[1]))){
            return res.status(400).json({message:"Bad Request, invalid location latitude and longitude"});
        }
        switch(qAroundMetric){
            case "km":
                maxDistance = qMaxDistance*1000;
                minDistance = qMinDistance*1000;
                break;
            case "m":
                maxDistance = qMaxDistance;
                minDistance = qMinDistance;
                break;
            case "h":
                maxDistance = qMaxDistance*30000;
                minDistance = qMinDistance*30000;
                break;
            case "min":
                maxDistance = qMaxDistance*500;
                minDistance = qMinDistance*500;
                break;
            default:
                maxDistance = 15000;
                minDistance = 0;
                break;
        }
        if (qMinDistance==0){
            queryString=opQueryBuilder.get_around_query(location.toString(),filters,maxDistance,pBtReachable);
        }
        else{
            queryString=opQueryBuilder.get_ring_query(location.toString(),filters,maxDistance,minDistance,pBtReachable);
        }
    }
    else{
        const areaPrefix = 3600000000;
        if (isNaN(qArea)){
            return res.status(400).json({message:"Bad Request, invalid area code"});
        }
        overpassAreaCode = areaPrefix+Number(qArea);
        overpassAreaCode = "area:" + overpassAreaCode;
        queryString=opQueryBuilder.get_area_query(overpassAreaCode,filters,pBtReachable);
    }
    try {
        console.log(queryString);
        const destinations = await queryOverpass(queryString);
        console.log(destinations.length);
        res.status(200).json({destinations});
    }
    catch(err){
        res.status(400).json({error:err});
        throw err;
    }
}