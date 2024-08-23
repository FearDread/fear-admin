const app = require('../../app');
const IMAP = require("../_workers/imap");

/*
import { serverInfo } from "../data/ServerInfo";
import * as IMAP from "../_workers/imap";
import * as SMTP from "../_workers/smtp";
import * as Contacts from "../_workers/Contacts";
import { IContact } from "../_workers/Contacts";
*/
//const IMAP = require("../_workers/imap");

app.get("/mailboxes", async (req, res) => {
        try {
            const imapWorker = new IMAP.Worker(serverInfo);
            const mailboxes = await imapWorker.listMailboxes();
            
            res.status(200).json(mailboxes); 

        } catch (error) {
            res.status(400).send("error", error); // send a plain text "error" response back if any exceptions be thrown
        }
    }
);

app.get("/mailboxes/:mailbox", async (req, res, next) => {
        try {
            const imapWorker = new IMAP.Worker(serverInfo);
            const messages = await imapWorker.listMessages({
                mailbox: req.params.mailbox // access dynamic value after /mailboxes/
            });

            res.status(200).json(messages);
        
        } catch (error) {
            res.status(400).send("error", error);
        }
    }
);

// REST Endpoint: Get a Message
/*
app.get("/messages/:mailbox/:id", async (req, res) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody({
                mailbox: req.params.mailbox, //  the name of the mailbox 
                id: parseInt(req.params.id, 10) // the ID of the message (str -> int)
            });

            res.status(200).send(messageBody);

        } catch (err) {
            res.status(400).send("error", err);
        }
    }
);

// REST Endpoint: Delete a Message
// the app.delete() method is used to register this endpoint.
app.delete("/messages/:mailbox/:id", async (req, res) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: req.params.mailbox,
                id: parseInt(req.params.id, 10)
            });

            res.status(200).send("ok");

        } catch (err) {
            res.status(400).send("error", err);
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
*/
module.exports = app;