import axios from "axios";

export const BASE_URL = "http://localhost:5000"

export const apiServer =  axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

export const apiServerAuth = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})


