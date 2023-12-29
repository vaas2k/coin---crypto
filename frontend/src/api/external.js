
import { applyMiddleware } from "@reduxjs/toolkit";
import axios from "axios";

const NEWS_API_ENDPOINT =
  "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json";

const CRYPTO_API_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";



const news_details = async () => {

    let responce;
    try{
        responce = await axios.get(NEWS_API_ENDPOINT);

        responce = responce.data.articles.slice(0,15)
    }catch(error){
        return error;
    }

    return responce;
}

const crypto_details = async () => {
    let responce ;
    try{
        responce = await axios.get(CRYPTO_API_ENDPOINT);
        responce = responce.data;

    }catch(error){
        return error;
    }

    return responce;
}

export {
    crypto_details,
    news_details
}
