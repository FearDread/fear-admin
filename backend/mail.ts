// the main entry point and constitute the API the server presents to the client 

// core Node module imports.
import path from "path";
// Express and some Express-related things imports.
//import express, { Express, NextFunction, Request, Response } from "express";
// App imports.


// creates our Express app.
const express = require("express");
const app = require('./app');
// add some middleware to Express
// Handle JSON in request bodies.
app.use(express.json());


 
app.use(function (req, res, next) {
    Response.header("Access-Control-Allow-Origin", "*"); // asterisk means browser will allow the call regardless of where it’s launched from. 
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS"); // Http methods we will accept from clients
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept"); // accept additional header
    
    next(); // continue the middleware chain, so the request can continue to be processed as required
});


// REST Endpoint: List Mailboxes
// Express app is acting as a proxy to the IMAP (and also SMTP and Contacts) object


// REST Endpoint: List Messages



// Start app listening.
app.listen(80, () => {
    console.log("MailBag server open for requests");
});