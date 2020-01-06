const queryOverpass = require('@derhuerst/query-overpass')
const District = require('../models/district');
const Province = require('../models/province');
var wiki_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids="
const axios = require("axios");
const WikiHelper = require('../utils/wikidata')
var provinces_qids= "Q10559|Q10547|Q10551|Q10557|Q10562|Q10554|Q10555"

exports.get_provinces_recommendations = async(req, res, next) => {
    const qSortBy = "population";
    const qSortCriteria = "descending";
    const includeImage = true;
    var wappen,image, image_md,wappen_md,image_name,wappen_name,population,area;
    try {
        const provinces = await Province.find().lean().sort([[qSortBy,qSortCriteria]]).exec();
        if (includeImage){
            wikidata = await axios.get(wiki_url+provinces_qids);
            for await( var province of provinces){
                WikiHelper.wikidata_extractor_helper(province,wikidata)
            }
        }
        res.status(200).json({provinces});
    }
    catch(err){
        throw err;
    }
}

exports.get_districts_recommendations = async(req, res, next) => {
    const qSortBy = "population";
    const qSortCriteria = "descending";
    const includeImage = true;
    const qSkip = Number(req.query.skip) || 0
    const qLimit = Number(req.query.limit) || 20
    const pProvinceId = req.params.province_osm_id && isNaN(req.params.province_osm_id)? -1: req.params.province_osm_id
    const findQuery = req.params.province_osm_id ? {parent_osm_id:(pProvinceId)} : {}
    var districts_qids=""
    try {
        const districts = await District.find(findQuery).skip(qSkip).limit(qLimit).lean().sort([[qSortBy,qSortCriteria]]).exec();
        if (includeImage){
            districts.forEach(district=>districts_qids+=district.wikidata_code+'|')
            districts_qids=districts_qids.slice(0,-1)
            console.log(wiki_url+districts_qids)
            wikidata = await axios.get(wiki_url+districts_qids);
            for await( var district of districts){
                WikiHelper.wikidata_extractor_helper(district,wikidata)
            }
        }
        res.status(200).json({districts});
    }
    catch(err){
        throw err;
    }
}

exports.get_dstn_recommendations = async(req, res, next) => {
    const pDistrictId = req.params.district_osm_id || 62686
    const areaPrefix = 3600000000;
    if (isNaN(pDistrictId)){
        return res.status(400).json({message:"Bad Request, invalid district id"});
    }
    const overpassAreaCode = areaPrefix+Number(pDistrictId)
    try {
        const destinations = await queryOverpass(`
        [out:json][timeout:800];
        area(`+overpassAreaCode+`)->.searchArea;
        // determine set public transportation stations
        (
          node[public_transport=station](area.searchArea);
          way[public_transport=station](area.searchArea);
          rel[public_transport=station](area.searchArea);
        )->.stations; // put them into the set "stations"
        
        // determine set of locations, in this case tourism
        (
          node[tourism](area.searchArea);
          way[tourism](area.searchArea);
          rel[tourism](area.searchArea);
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

