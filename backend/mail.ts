// the main entry point and constitute the API the server presents to the client 

// core Node module imports.
import path from "path";
// Express and some Express-related things imports.
//import express, { Express, NextFunction, Request, Response } from "express";
// App imports.
import { serverInfo } from "./src/data/ServerInfo";
import * as IMAP from "./src/_workers/imap";
import * as SMTP from "./src/_workers/smtp";
import * as Contacts from "./src/_workers/Contacts";
import { IContact } from "./src/_workers/Contacts";

// creates our Express app.
const express = require("express");
const app = require('./app');
// add some middleware to Express
// Handle JSON in request bodies.
app.use(express.json());

// Serve the client to a requested browser.
// The static middleware is a built-in middleware for serving static resources. 
// __dirname is the directory the current script is in
app.use("/", express.static(path.join(__dirname, "../../client/dist")));
 
app.use(function (req, res, next) {
    Response.header("Access-Control-Allow-Origin", "*"); // asterisk means browser will allow the call regardless of where it’s launched from. 
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS"); // Http methods we will accept from clients
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept"); // accept additional header
    
    next(); // continue the middleware chain, so the request can continue to be processed as required
});


// REST Endpoint: List Mailboxes
// Express app is acting as a proxy to the IMAP (and also SMTP and Contacts) object
app.get("/mailboxes", // app.get() is used to register 'get' path, /mailboxes is a logical choice for the path
    async (req, res) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            res.status(200);
            res.json(mailboxes); // marshals array into JSON and returns to the caller
        } catch (inError) {
            res.status(400);
            res.send("error"); // send a plain text "error" response back if any exceptions be thrown
        }
    }
);

// REST Endpoint: List Messages
app.get("/mailboxes/:mailbox", // specify the name of the mailbox to get messages for
    async (inRequest: Request, inResponse: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox: inRequest.params.mailbox // access dynamic value after /mailboxes/
            });
            inResponse.status(200);
            inResponse.json(messages);
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: Get a Message
app.get("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody({
                mailbox: inRequest.params.mailbox, //  the name of the mailbox 
                id: parseInt(inRequest.params.id, 10) // the ID of the message (str -> int)
            });
            inResponse.status(200);
            inResponse.send(messageBody); // returned as plain text 
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: Delete a Message
// the app.delete() method is used to register this endpoint.
app.delete("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            inResponse.status(200);
            inResponse.send("ok");
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: Send a Message
// app.post() is used to send a message
// IMAP protocol: retrieving mailboxes and messages
// SMTP protocol: send messages
app.post("/messages",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(inRequest.body);
            inResponse.status(201);
            inResponse.send("ok");
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: List Contacts
app.get("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            inResponse.status(200);
            inResponse.json(contacts);
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: Add Contact
app.post("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.addContact(inRequest.body); // contain a unique identifier
            inResponse.status(201);
            inResponse.json(contact);
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: Update Contacts
app.put("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.updateContact(inRequest.body);
            inResponse.status(202);
            inResponse.json(contact);
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);

// REST Endpoint: Delete Contact
app.delete("/contacts/:id",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(inRequest.params.id); // includes the ID of the contact to delete
            inResponse.status(200);
            inResponse.send("ok");
        } catch (inError) {
            inResponse.status(400);
            inResponse.send("error");
        }
    }
);



// Start app listening.
app.listen(80, () => {
    console.log("MailBag server open for requests");
});