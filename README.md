# MongoDB eCommerce reference web app – frontend

This is an example of how to build an eCommerce app using MongoDB Atlas and MongoDB Stitch/Realm.

[Try out the app](https://ecommerce-iukkg.mongodbstitch.com/#/) before recreating it for yourself.

## Stack

The backend doesn't require an application or web server.

The database is MongoDB Atlas, a fully managed cloud database.

Access to Atlas and other services is through MongoDB Stitch/Realm – the serverless platform from MongoDB.

The application frontend uses these technologies:

- Vue.js
- Bulmer
- Buefy
- SaaS

The frontend code can be hosted on Stich/Realm static hosting.

## Project setup
```
npm install
```
### Configure
Update `_config.js` with your own values and move to `config.js`.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
## The application backend
This project is the frontend application for an eCommerce site, it depends on a backend application running on MongoDB Stitch and Atlas. The code, sample data, and instructions for the backen can be found in the [eCommerce-Realm repo](https://github.com/am-MongoDB/eCommerce-Realm).