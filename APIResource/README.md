# OVERVIEW

- unicorns exist and they're awesome

## INSTRUCTIONS

---

Link the modules to the particular project

1. in the terminal type `npm link`
2. navigate the the particular project that you want to link
3. in the terminal type `npm link APIResource` <-- this will symlink the two modules together allowing you to do the following

Create a `new APIResource` instance and pass in the configurations for your particular project.

EXAMPLE FOR BBU-ADMIN (update resources/APIResource.js to the following - then continue to use the rest as normal)

```
// admin configurations
const envConfig = require("./../config/env-config.json");
const proxies = require("./../config/proxies");
const { key } = require("./../config/apiSecureKey");

const APIResource = require("APIResource");

const myAPIResource = new APIResource({
  headers: {
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Content-Type": "application/json",
    "BBC-API-ACCESS-KEY": key
  },
  envConfig,
  proxies,
  bbu_env : process.env.BBU_ENV
});


module.exports = myAPIResource;
```
