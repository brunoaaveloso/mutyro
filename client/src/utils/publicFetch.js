import axios from "axios";

const publicFetch = axios.create({
  baseURL: "/api",
  withCredentials: false,
});

export default publicFetch;
