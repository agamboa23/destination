export const STEREOTYPES = [
    {
        id:1,
        name:"Art Lover",
        description:"Museums, Libraries, Cinemas, Galleries, Theatres",
        image_url:"https://www.daz3d.com/galleryimage/image/1101/art-lover_full.jpg",
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
        image_url:"https://cdn.pixabay.com/photo/2014/10/22/17/25/stretching-498256_960_720.jpg",
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
        image_url:"https://cdn.pixabay.com/photo/2017/03/01/01/22/zip-line-2107234_960_720.jpg",
        filters:`
            t["natural"]=="cave_entrance"||
            t["route"]=="canoe"||
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
        image_url:"https://cdn.pixabay.com/photo/2016/11/29/05/26/beach-1867524_960_720.jpg",
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
            t["route"]=="canoe"||
            t["sport"]=="swimming"
            `,
    },
    {
        id:5,
        name:"Historian",
        description:"Buildings and artifacts with historic meaning",
        image_url:"https://cdn.pixabay.com/photo/2015/12/08/01/04/bookshelf-1082309_960_720.jpg",
        filters:`
            t["historic"]
            `,
    },
    {
        id:6,
        name:"Temple Visitor",
        description:"Cathedrals, Chapels, Temples, Synanogues",
        image_url:"https://cdn.pixabay.com/photo/2013/10/13/17/55/statue-of-mary-195137_960_720.jpg",
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
        description:"Restaurants, Foodcourts, bakeries",
        image_url:"https://cdn.pixabay.com/photo/2015/11/19/10/38/food-1050813_960_720.jpg",
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
        image_url:"https://images.unsplash.com/photo-1576665012302-837d5fd0fb88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
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
        image_url:"https://cdn.pixabay.com/photo/2014/10/22/18/04/freerider-498473_960_720.jpg",
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
        image_url:"https://cdn.pixabay.com/photo/2016/11/22/22/21/adventure-1850912_960_720.jpg",
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
        image_url:"https://cdn.pixabay.com/photo/2019/11/11/16/49/la-4618922_960_720.jpg",
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
        description:"Bowling, Go Karting, Escape Rooms, among other social activities",
        image_url:"https://cdn.pixabay.com/photo/2017/08/03/14/45/nature-2576652_960_720.jpg",
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
        image_url:"https://cdn.pixabay.com/photo/2013/03/19/18/23/utah-95032_960_720.jpg",
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
        description:"Fashion, bags, shoes and jewelry Shops",
        image_url:"https://cdn.pixabay.com/photo/2017/12/26/09/15/woman-3040029_960_720.jpg",
        filters:`
            t["shop"]=="boutique"||
            t["shop"]=="clothes"||
            t["shop"]=="fashion_accessories"||
            t["shop"]=="jewelry"||
            t["shop"]=="leather"||
            t["shop"]=="shoes"||
            t["shop"]=="department_store"||
            t["shop"]=="mall"||
            t["shop"]=="bag"||
            t["shop"]=="tailor"
            `,
    },
    {
        id:15,
        name:"Popular",
        description:"Tourism destinations",
        image_url:"https://cdn.pixabay.com/photo/2018/07/27/00/37/munich-3564962_960_720.jpg",
        filters:`
            t["tourism"]
            `,
    },
    {
        id:16,
        name:"Car Enthusiast",
        description:"Snob that loves art",
        image_url:"https://cdn.pixabay.com/photo/2016/03/11/02/08/speed-1249610_960_720.jpg",
        filters:`
            t["highway"]=="raceway"||
            t["sport"]=="karting" ||
            t["shop"]=="car_parts"
            `,
    },
    {
        id:17,
        name:"Thirsty",
        description:"Public drinking water around you",
        image_url:"https://cdn.pixabay.com/photo/2016/09/21/14/46/faucet-1684902_960_720.jpg",
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
        image_url:"https://cdn.pixabay.com/photo/2016/04/18/23/37/man-1337750_960_720.jpg",
        filters:`
            t["amenity"]=="toilets"
            `,
    }      
];

export default STEREOTYPES;