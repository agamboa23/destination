import { truncate } from "fs";

const EARTH_RADIUS = 6371;
const Bayern_lat_max=50.165420;
const Bayern_lat_min=47.603457;
const Bayern_lon_max=12.566013;
const Bayern_lon_min=9.801426;
const BEARING = Object.freeze({
  north:degrees_to_radians(0), 
  east:degrees_to_radians(90), 
  south:degrees_to_radians(180), 
  west:degrees_to_radians(270)
 });

export function get_bbox_string(lat,lon,DistanceKm){
  lat = Number(lat);
  lon = Number(lon);
  DistanceKm = Number(DistanceKm);
  var result_list = calculate_bounding_box(degrees_to_radians(lat), degrees_to_radians(lon),DistanceKm);
  return result_list.map(x=> radians_to_degrees(x)).toString();
}

// Extracted from https://www.movable-type.co.uk/scripts/latlong.html
function calculate_bounding_box(lat,lon,DistanceKm) {
  var distance_delta,root_lat, north_lat, south_lat, east_lon, west_lon;

  root_lat =  Math.sin(lat)*Math.cos(DistanceKm/EARTH_RADIUS);
  distance_delta = Math.cos(lat)*Math.sin(DistanceKm/EARTH_RADIUS);
  north_lat = Math.asin(root_lat + distance_delta * Math.cos(BEARING.north));
  south_lat = Math.asin(root_lat + distance_delta * Math.cos(BEARING.south));

  east_lon = lon + Math.atan2(Math.sin(BEARING.east)*Math.sin(DistanceKm/EARTH_RADIUS)*Math.cos(lat),
    Math.cos(DistanceKm/EARTH_RADIUS)-Math.sin(lat)*Math.sin(lat));
  
  west_lon = lon + Math.atan2(Math.sin(BEARING.west)*Math.sin(DistanceKm/EARTH_RADIUS)*Math.cos(lat),
    Math.cos(DistanceKm/EARTH_RADIUS)-Math.sin(lat)*Math.sin(lat));
  return [south_lat, west_lon, north_lat, east_lon];
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

export function is_Bayern(coords){
  var [lat,lon] = coords;
  if (Bayern_lat_min<lat&&lat<Bayern_lat_max && Bayern_lon_min<lon&&lon<Bayern_lon_max){
    return true;
  }
  else{
    return false;
  }

}