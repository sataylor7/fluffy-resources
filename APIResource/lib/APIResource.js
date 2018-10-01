const axios = require("axios");
const _get = require("lodash/get");

/**
 *
 */
function APIResource(configOptions) {
  this.HEADERS = configOptions.headers || {};
  this.ENV_CONFIG = configOptions.envConfig || {};
  this.PROXIES = configOptions.proxies || {};
  this.BBU_ENV = configOptions.bbu_env || "stg";
}

/**
 * @description getHeaders - a simple way to return the headers that were set when the resource was initialized
 */
APIResource.prototype.getHeaders = () => {
  return this.HEADERS;
};

/**
 * @description setter for the BBU_ENV property - this is needed if proxies are going to be used
 * @param {string} environment - this will be the environment to look up the proxy configs for
 */
APIResource.prototype.setBBUEnv = environment => {
  this.BBU_ENV = environment;
  return true;
};

/**
 * @description Construct a URL to help with proxy routing
 * @param {object} req - the request object from the express server
 * @param {string} endpoint - the endpoint to hit
 */
APIResource.prototype.buildURL = (req, endpoint) => {
  const proxieApiEnv = _get(this.ENV_CONFIG, [this.BBU_ENV, "api"], "local");
  const hostname = this.PROXIES[proxieApiEnv].api || "localhost:3100";
  const host = `${req.protocol}://${hostname}`;
  return `${host}${endpoint}`;
};

/**
 * @private
 * @description wrapper around axios main request library
 * @param {string} url - url to look up/hit
 * @param {string} method - POST/PUT/GET/DELETE
 * @param {object} headers - headers for the request
 * @param {*} body - information to pass along with the request
 */
APIResource.prototype._request = (url, method, headers, body) => {
  const options = {
    url,
    method,
    headers,
    data: body
  };
  return axios(options)
    .then(response => Promise.resolve(response.data))
    .catch(error => {
      console.log(`Error when making an http request to url: ${url}`, error);
      return Promise.reject(error);
    });
};

/**
 * GET Wrapper for our 3rd part http request resource - this way the feature using the resources
 * just has to do APIClientResource.fetch (it isnt called "get" as that is a reserved word)
 * @param  {string} url  the url/endpoint you are trying to hit
 * @param  {object} headers *optional, if headers are passed they will over ride the existing headers
 * @return {promise}      return a promise so that the feature can chain to it
 */
APIResource.prototype.fetch = ({ url, headers }) => {
  const newHeaders = headers || this.HEADERS;
  return request(url, "GET", newHeaders);
};

/**
 * POST Wrapper for our 3rd part http request resource - this way the feature using the resources
 * just has to do APIClientResource.post
 * @param  {string} url  the url/endpoint you are trying to hit
 * @param  {[type]} body the body of the request that you want to send to have created
 * @param  {object} headers *optional, if headers are passed they will over ride the existing headers
 * @return {promise}      return a promise so that the feature can chain to it
 */
APIResource.prototype.post = ({ url, body, headers }) => {
  const newHeaders = headers || this.HEADERS;
  return request(url, "POST", newHeaders, body);
};

/**
 * PUT Wrapper for our 3rd part http request resource - this way the feature using the resources
 * just has to do APIClientResource.post
 * @param  {string} url  the url/endpoint you are trying to hit
 * @param  {[type]} body the body of the request that you want to send to have created
 * @param  {object} headers *optional, if headers are passed they will over ride the existing headers
 * @return {promise}      return a promise so that the feature can chain to it
 */
APIResource.prototype.put = ({ url, body = null, headers }) => {
  const newHeaders = headers || this.HEADERS;
  return request(url, "PUT", newHeaders, body);
};

/**
 * OPTIONS Wrapper for our 3rd part http request resource - this way the feature using the resources
 * just has to do APIClientResource.options -> this can be used for PUT/PATCH
 * @param  {string} url  the url/endpoint you are trying to hit
 * @param  {[type]} body the body of the request that you want to send to have updated
 * @param  {object} headers *optional, if headers are passed they will over ride the existing headers
 * @return {promise}      return a promise so that the feature can chain to it
 */
APIResource.prototype.options = ({ url, body, headers }) => {
  const newHeaders = headers || this.HEADERS;
  return request(url, "OPTIONS", newHeaders, body);
};
/**
 * DELETE Wrapper for our 3rd part http request resource - this way the feature using the resources
 * just has to do APIClientResource.destroy (it isnt called "delete" as that is a reserved word)
 * WE MAY HAVE TO UPDATE THIS TO HAVE A BODY - BUT I DONT THINK THIS SHOULD BE USED THAT OFTEN
 * @param  {string} url  the url/endpoint you are trying to hit
 * @param  {object} headers *optional, if headers are passed they will over ride the existing headers
 * @return {promise}      return a promise so that the feature can chain to it
 */
APIResource.prototype.destroy = ({ url, headers }) => {
  const newHeaders = headers || this.HEADERS;
  return request(url, "DELETE", newHeaders, null);
};

module.exports = APIResource;
