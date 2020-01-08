const express = require('express'), path = require('path');
const app = express();

//var customerAPI_URL = process.env.CUSTOMER_API_URL || 'http://localhost:8083/ws/pg/customer';
var profileAPI_URL = process.env.PROFILE_API_URL || 'http://localhost:8081/ws/pg/account';
var customerList;
var cust;

const axios = require('axios');

//setup our app to use handlebars.js for templating
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// Display list of all customers.
exports.index = function (req, res) {
    //console.log("--> here 1");
    cust = null;
    axios.get(profileAPI_URL + '/all')
        .then(response => {
            //console.log("--> here 2");
            customerList = response.data;
            //console.log("--> here 3");
            res.render('index', { customer: customerList });
            //console.log("--> here 4");
        })
        .catch(error => {
            console.log("Error:" + error);
        });
};

// Display customer view
exports.customer = function (req, res) {
    let title;
    console.log("--> here 1");
    if (typeof req.query.custid == 'undefined') {
        title = "New Customer Account";
        console.log("--> here 2");
        res.render('customer', { customer: null, title: title });
        console.log("--> here 3");
    }
    else {
        console.log("--> here 4");
        title = "Update Customer Account";
        axios.get(profileAPI_URL + '/' + req.query.custid)
            .then(response => {
                console.log("--> here 5");
                cust = response.data;
                //console.log("cust : " + cust);
                //console.log("cust.accountId : " + cust.accountId);
                res.render('customer', { customer: cust, title: title });
                console.log("--> here 6");
            })
            .catch(error => {
                console.log("Error:" + error);
            });
    }


};

// Display update customer view
exports.customer_update = function (req, res) {
    res.send('NOT IMPLEMENTED: Author list');
};