export function get_around_query(location,filters,maxDistanceKm,isReachableByBT){
  var queryString;
  filters= "(if:("+filters+"))";
  if (isReachableByBT){
    queryString = `
    [out:json][timeout:800];
    area(3602145268);
    (nwr[public_transport=station](area)(around:`+maxDistanceKm+`,`+location+`);)->.big_area;
    (nwr`+filters+`[name](around.big_area:1000);)->.items;
    (.items;);
    out tags center;
    `;
  }
  else{
    queryString = `
    [out:json][timeout:800];
    area(3602145268);
    (nwr`+filters+`[name](area)(around:`+maxDistanceKm+`,`+location+`);)->.items;
    (.items;);
    out tags center;
    `;
  }
  return queryString;
}

export function get_ring_query(location,filters,maxDistanceKm, minDistanceKm,isReachableByBT){
  var queryString;
  filters= "(if:("+filters+"))";
  if (isReachableByBT){
    queryString = `
    [out:json][timeout:800];
    area(3602145268);
    (nwr[public_transport=station](area)(around:`+maxDistanceKm+`,`+location+`);)->.big_area;
    (nwr.big_area(around:`+minDistanceKm+`,`+location+`);)->.small_area;
    (.big_area; - .small_area;)->.stops;
    (nwr`+filters+`[name](around.stops:1000);)->.items;
    (.items;);
    out tags center;
    `;
  }
  else{
    queryString = `
    [out:json][timeout:800];
    area(3602145268);
    (nwr`+filters+`(area)(around:`+maxDistanceKm+`,`+location+`);)->.big_area;
    (nwr.big_area(around:`+minDistanceKm+`,`+location+`);)->.small_area;
    (.big_area; - .small_area;)->.items;
    (.items;);
    out tags center;
    `;
  }  
  return queryString;
}

export function get_area_query(area,filters,isReachableByBT){
  var queryString;
  filters= "(if:("+filters+"))";
  if (isReachableByBT){
    queryString = `
    [out:json][timeout:800];
    (nwr[public_transport=station](area:`+area+`);)->.big_area;
    (nwr`+filters+`[name](around.big_area:1000);)->.items;
    (.items;);
    out tags center;
    `;
  }
  else{
    queryString = `
    [out:json][timeout:800];
    (nwr`+filters+`(area:`+area+`);)->.items;
    (.items;);
    out tags center;
    `;   
  }
  return queryString;
}