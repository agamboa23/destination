const District = require('../models/district');
var wiki_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids="
const axios = require("axios");
const WikiHelper = require('../utils/wikidata')

exports.districts_get_all = (req, res, next) => {
    District.find()
    .exec()
    .then(districts => {
        res.status(200).json({districts});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.districts_get_aggregated = async(req, res, next) => {
    const qSortBy = req.query.sort_by;
    const qSortCriteria = req.query.sort_criteria;
    const includeImage = req.query.include_image || false;
    const qSkip = Number(req.query.skip) || 0
    const qLimit = Number(req.query.limit) || 10
    const pProvinceId = req.params.province_id && isNaN(req.params.province_id)? -1: req.params.province_id
    const findQuery = req.params.province_id ? {parent_osm_id:(pProvinceId)} : {}
    var districts_qids=""

    try {
        const districts = await District.find(findQuery).skip(qSkip).limit(qLimit).lean().sort([[qSortBy,qSortCriteria]]).exec();
        if (includeImage){
            districts.forEach(district=>districts_qids+=district.wikidata_code+'|')
            districts_qids=districts_qids.slice(0,-1)
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