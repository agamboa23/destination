export const STEREOTYPES = [
    {
        id:1,
        name:"Art Lover",
        description:"Museums, Libraries, Cinemas, Galleries, Theatres",
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
        description:"Sport fields, equipment rentals, sport centers",
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
        name:"Adventure Seeker",
        description:"Adventure experiences, canopy, hiking, climbing, sailing",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["sport"]=="climbing_adventure"||
            t["sport"]=="cliff_diving"|| 
            t["aerialway"]=="canopy"||
            t["building"]=="ruins" ||
            t["tourism"]=="viewpoint" ||
            t["amenity"]=="climbing_adventure" ||
            t["sport"]=="climbing" ||
            t["sport"]=="sailing" 
            `,
    },
    {
        id:4,
        name:"Water Soul",
        description:"Lakes, Swimming pools, Hot springs",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="dive_centre"||
            t["amenity"]=="kneipp_water_cure"||
            t["amenity"]=="drinking_water"||
            t["amenity"]=="boat_rental"||
            t["amenity"]=="water_point"||
            t["leisure"]=="swimming_area"||
            t["leisure"]=="swimming_pool"||
            t["leisure"]=="water_park"||
            t["water"]=="hot_spring"||
            t["sport"]=="kitesurfing"||
            t["sport"]=="sailing"||
            t["sport"]=="surfing"||
            t["sport"]=="swimming"
            `,
    },
    {
        id:5,
        name:"Historian",
        description:"Buildings and artifacts with historic meaning",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["historic"]
            `,
    },
    {
        id:6,
        name:"Temple Visitor",
        description:"Cathedrals, Chapels, Temples, Synanogues",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="place_of_worship"||
            t["building"]=="cathedral"||
            t["building"]=="chapel"||
            t["building"]=="church"||
            t["building"]=="mosque"||
            t["building"]=="shrine"||
            t["building"]=="synanogue"||
            t["building"]=="temple"
            `,
    },
    {
        id:7,
        name:"Hungry Stomach",
        description:"Retaurants, Foodcourts, bakeries",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="bbq"||
            t["amenity"]=="marketplace"||
            t["Amenity"]=="biergarten"||
            t["Amenity"]=="food_court"||
            t["Amenity"]=="fast_food"||
            t["Amenity"]=="ice_cream"||
            t["Amenity"]=="restaurant"||
            t["Amenity"]=="vending_machine"||
            t["Amenity"]=="supermarket"||
            t["shop"]=="bakery"||
            t["shop"]=="cheese"||
            t["shop"]=="chocolate"||
            t["shop"]=="coffe"||
            t["shop"]=="beverages"
            `,
    },
    {
        id:8,
        name:"Pub Crawler",
        description:"Bars, pubs, nightclubs, biergartens",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="bar"||
            t["amenity"]=="biergarten"||
            t["amenity"]=="nightclub"||
            t["amenity"]=="pub"
            `,
    },
    {
        id:9,
        name:"Snow Fan",
        description:"Skii routes, ice rinks, pistes, ice skating",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["route"]=="ski"||
            t["leisure"]=="ice_rink"||
            t["sport"]=="toboggan"||
            t["sport"]=="ice_skating"||
            t["sport"]=="ice_hockey"||
            t["sport"]=="skiing"||
            t["shop"]=="ski"||
            t["route"]=="piste"
            `,
    },
    {
        id:10,
        name:"Hike Explorer",
        description:"Hiking routes, climbing sites, mountain peaks, viewpoints",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["route"]=="hiking"||
            t["natural"]=="peak"||
            t["tourism"]=="viewpoint"||
            t["sport"]=="climbing_adventure" ||
            t["sport"]=="climbing" ||
            t["tourism"]=="gallery"
            `,
    },
    {
        id:11,
        name:"Skate and BMX",
        description:"Skate parks, bmw zones, radical handrails",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["sport"]=="roller_skating"||
            t["sport"]=="skateboard"||
            t["route"]=="inline_skates"||
            t["sport"]=="bmx"||
            t["barrier"]=="handrail"
            `,
    },
    {
        id:12,
        name:"Social and Friends",
        description:"Bowling, Go Karting, Escape Rooms, among other social games",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="social_centre"||
            t["leisure"]=="amusement_arcade"||
            t["leisure"]=="bandstand"||
            t["leisure"]=="escape_game"||
            t["leisure"]=="ice_rink"||
            t["leisure"]=="dance"||
            t["leisure"]=="miniature_golf"||
            t["leisure"]=="picnic_table"||
            t["leisure"]=="pitch"||
            t["leisure"]=="swimming_area"||
            t["leisure"]=="water_park"||
            t["tourism"]=="theme_park"||
            t["tourism"]=="zoo"||
            t["sport"]=="9pin"||
            t["sport"]=="10pin"||
            t["sport"]=="karting"||
            t["tourism"]=="picnic_site"
            `,
    },
    {
        id:13,
        name:"Bicycle Trips",
        description:"Bike routes, Mountain Bike routes, Bike repair stands",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["sport"]=="bmx"||
            t["sport"]=="cycling"||
            t["amenity"]=="bicycle_repair_station"||
            t["route"]=="bicycle"||
            t["shop"]=="bicycle"||
            t["route"]=="mtb"
            `,
    },
    {
        id:14,
        name:"Fashionista Shopping",
        description:"Garment Shops",
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
        id:15,
        name:"Popular",
        description:"Tourism destinations",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["tourism"]
            `,
    },
    {
        id:16,
        name:"Car Enthusiast",
        description:"Snob that loves art",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["highway"]=="raceway"||
            t["sport"]=="karting"
            `,
    },
    {
        id:17,
        name:"Thirsty",
        description:"Public drinking water around you",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="drinking_water"||
            t["amenity"]=="water_point"||
            t["emergency"]=="drinking_water"||
            t["shop"]=="water"
            `,
    },
    {
        id:18,
        name:"WC Needed",
        description:"Public toilettes around you",
        image_url:"https://tekrabuilders.com/wp-content/uploads/2018/12/male-placeholder-image-300x300.jpeg",
        filters:`
            t["amenity"]=="toilets"
            `,
    }      
];

export default STEREOTYPES;