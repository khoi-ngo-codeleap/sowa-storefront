import axios from "axios";

const API_URL = 'https://api.dev.jtl-cloud.com'

const client = axios.create({
    baseURL: API_URL
});

export default client;
