const wiki_url="https://commons.wikimedia.org/w/api.php?format=json&action=query&list=geosearch&gsnamespace=6&gsradius=1000&gslimit=1&gscoord=";
import * as WikiHelper from '../utils/wikidata';
import { get } from "axios";

export async function get_images_by_locations(req, res, next) {
    const pLocations = req.params.locations;
    var locations = pLocations.split(",");
    var results=[],file_url,wikidata;
    try {
        for await( var location of locations){
            console.log(wiki_url+location);
            wikidata = await get(wiki_url+location);
            file_url=WikiHelper.generate_image_url(wikidata.data.query.geosearch);
            results.push({location:location,image_url:file_url});
        }
        res.status(200).json({results});
    }
    catch(err){
        throw err;
    }
 
}