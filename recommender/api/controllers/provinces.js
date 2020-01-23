import Province from '../models/province';
var wiki_url = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids=";
var provinces_qids= "Q10559|Q10547|Q10551|Q10557|Q10562|Q10554|Q10555";
import { get } from "axios";
import { wikidata_extractor_helper } from '../utils/wikidata';

export function provinces_get_all(req, res, next) {
    find()
    .exec()
    .then(provinces => {
        res.status(200).json({provinces});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

export async function provinces_get_aggregated(req, res, next) {
    const qSortBy = req.query.sort_by;
    const qSortCriteria = req.query.sort_criteria;
    const includeImage = req.query.include_image || false;
    var wappen,image, image_md,wappen_md,image_name,wappen_name,population,area;
    try {
        const provinces = await Province.find().lean().sort([[qSortBy,qSortCriteria]]).exec();
        if (includeImage){
            wikidata = await get(wiki_url+provinces_qids);
            for await( var province of provinces){
                wikidata_extractor_helper(province,wikidata);
            }
        }
        res.status(200).json({provinces});
    }
    catch(err){
        throw err;
    }
}

