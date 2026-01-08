const smtp = require("../libs/emailer/smtp");
const mailinfo = require("../libs/emailer/info");
const Mail = new smtp(mailinfo);

module.exports = ( fear ) => {
    const router = fear.createRouter();

    router.get('/', (req, res) => {
        Mail.sendEmail()
            .then((response) => res.send(response.message))
            .catch((error) => res.status(500).send(error.message));
    });

    router.post('/contact', (req, res) => {
        Mail.sendContactEmail(req.body)
            .then((response) => res.json({ success: true, message: response.message }))
            .catch((error) => res.status(500).json({ success: false, message: error.message }))
    });

    router.post("/project", (req, res) => {
        Mail.sendProjectEmail(req.body)
            .then((response) => res.json({ success: true, message: response.message }))
            .catch((error) => res.status(500).json({ success: false, message: error.message }))
    })

    router.post("/subscribe", (req, res) => {
        Mail.sendSubscriptionEmail(req.body)
            .then((resp) => res.status(200).json({ success: true, result: resp.message })
            .catch((error) => res.status(500).json({success: false, result: error.message })
        ))
    })

    return router;
};

/*
router.get("/mailboxes", async (req, res) => {
    const imapWorker = new imap.Worker(ServerInfo);
    
    await imapWorker.listMailboxes()
        .then((response) => { return res.status(200).json(response); })
        .catch((error) => { throw new Error(error); })
);

// REST Endpoint: List Messages
router.get("/mailboxes/:mailbox", // specify the name of the mailbox to get messages for
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
router.get("/messages/:mailbox/:id",
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
router.delete("/messages/:mailbox/:id",
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
router.post("/messages",
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
router.get("/contacts",
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
router.post("/contacts",
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
router.put("/contacts",
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
router.delete("/contacts/:id",
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

