# How to deploy a custom Spoke client

These steps have already been completed:

* Copy `scripts/deploy.js` from `mozilla/hubs` repo
* Remove parts for building and deploying the admin panel
* Change `npm` install and build commands into `yarn` equivalents
* Change `/hubs` URL suffixes to `/spoke`
* Create a `scripts/shim` file that adds `node-fetch` to global scope
* Copy `deploy` script entry from Hubs `package.json`

Now to deploy to a Hubs Cloud instance:

* `npm run login` in a Hubs project directory
* Copy the generated `.ret.credentials` file into the root of this Spoke project
* `yarn deploy`