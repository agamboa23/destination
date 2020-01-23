import Stereotypes from '../models/stereotypes';


export function get_all_stereotypes(req, res, next) {
    res.status(200).json({Stereotypes});
}

export function get_stereotypes_filters(ids){
    var filters="";
    var id_list = ids.split(",");
    Stereotypes.forEach(stereotype=> {if (id_list.includes(stereotype.id.toString()))filters+="||"+stereotype.filters;});
    filters=filters.substr(2);
    return filters;
}
