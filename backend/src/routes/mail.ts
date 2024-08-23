import express, { Request, Response } from 'express';
import { serverInfo } from "../data/ServerInfo";
import * as IMAP from "../_workers/imap";
import * as SMTP from "../_workers/smtp";
import * as Contacts from "../_workers/Contacts";
import { IContact } from "../_workers/Contacts";

const app: express.Application = express();

app.get("/mailboxes", async (req: Request, res: Response): Promise<void> => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const mailboxes: Array[] = await imapWorker.listMailboxes();
        
        res.status(200).json(mailboxes); 

    } catch (error: unknown) {
        res.status(400).send("error");
    }
});

app.get("/mailboxes/:mailbox", async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messages: any[] = await imapWorker.listMessages({
            mailbox: req.params.mailbox
        });

        res.status(200).json(messages);
    
    } catch (error: unknown) {
        res.status(400).send("error");
    }
});

app.get("/messages/:mailbox/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messageBody: string = await imapWorker.getMessageBody({
            mailbox: req.params.mailbox,
            id: parseInt(req.params.id, 10)
        });

        res.status(200).send(messageBody);

    } catch (err: unknown) {
        res.status(400).send("error");
    }
});

app.delete("/messages/:mailbox/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox: req.params.mailbox,
            id: parseInt(req.params.id, 10)
        });

        res.status(200).send("ok");

    } catch (err: unknown) {
        res.status(400).send("error");
    }
});

app.post("/messages", async (inRequest: Request, inResponse: Response): Promise<void> => {
    try {
        const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
        await smtpWorker.sendMessage(inRequest.body);
        inResponse.status(201);
        inResponse.send("ok");
    } catch (inError: unknown) {
        inResponse.status(400);
        inResponse.send("error");
    }
});

app.get("/contacts", async (inRequest: Request, inResponse: Response): Promise<void> => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contacts: IContact[] = await contactsWorker.listContacts();
        inResponse.status(200);
        inResponse.json(contacts);
    } catch (inError: unknown) {
        inResponse.status(400);
        inResponse.send("error");
    }
});

app.post("/contacts", async (inRequest: Request, inResponse: Response): Promise<void> => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: IContact = await contactsWorker.addContact(inRequest.body);
        inResponse.status(201);
        inResponse.json(contact);
    } catch (inError: unknown) {
        inResponse.status(400);
        inResponse.send("error");
    }
});

app.put("/contacts", async (inRequest: Request, inResponse: Response): Promise<void> => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: IContact = await contactsWorker.updateContact(inRequest.body);
        inResponse.status(202);
        inResponse.json(contact);
    } catch (inError: unknown) {
        inResponse.status(400);
        inResponse.send("error");
    }
});

app.delete("/contacts/:id", async (inRequest: Request, inResponse: Response): Promise<void> => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        await contactsWorker.deleteContact(inRequest.params.id);
        inResponse.status(200);
        inResponse.send("ok");
    } catch (inError: unknown) {
        inResponse.status(400);
        inResponse.send("error");
    }
});