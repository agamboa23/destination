export const STEREOTYPES = [
    {
        id:1,
        name:"Art Lover",
        description:"Snob that loves art",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="library"||
            t["amenity"]=="arts_centre"||
            t["amenity"]=="cinema"||
            t["amenity"]=="theatre"||
            t["tourism"]=="museum"||
            t["tourism"]=="artwork"||
            t["tourism"]=="gallery"
            `,
    },
    {
        id:2,
        name:"Sport Maniac",
        description:"Cannot have fun without someone else balls",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["sport"] || 
            t["aerialway"] ||
            t["amenity"]=="bicycle_rental"||
            t["amenity"]=="boat_rental"|| 
            t["building"]=="sports_hall"||
            t["leisure"]=="bicycle_rental" ||
            t["leisure"]=="sports_centre" ||
            t["leisure"]=="ice_rink"
            `,
    },
    {
        id:3,
        name:"Historian Keeper",
        description:"Loves old stuff",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["historic"] || 
            t["amenity"]=="place_of_worship"||
            t["amenity"]=="theatre"|| 
            t["building"]=="cathedral"||
            t["building"]=="ruins" ||
            t["tourism"]=="museum" 
            `,
    },    
];

export default STEREOTYPES;