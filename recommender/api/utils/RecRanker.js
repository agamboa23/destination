import axios from "axios";
import tm from "text-miner";
const util = require('util');
var lancasterStemmer = require('lancaster-stemmer')

const YANDEXKEY = 'trnsl.1.1.20200404T180324Z.ff6dd6fd7d6572f1.1bd83273a39201564029ab25e0b4d53c892dae50';
import YandexTranslate from 'yet-another-yandex-translate';
const YandexTranslator = new YandexTranslate(YANDEXKEY);

const fb_api = "https://graph.facebook.com/v6.0/";
const cursor_iterator = 1;


export async function rank_destinations(destinations,rank_type) {
    destinations.forEach(element => {
        console.log(element);
    });
}