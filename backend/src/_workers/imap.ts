// talks to an IMAP server to list mailboxes and messages and to retrieve messages

// Library imports.
import { ParsedMail } from "mailparser";
const ImapClient = require("emailjs-imap-client");
import { simpleParser } from "mailparser";

// App imports.
import { IServerInfo } from "./ServerInfo";

// Define interface to describe a mailbox and optionally a specific message
// all functions require the mailbox name, but only retrieving and deleting a message requires the ID.
export interface ICallOptions {
    mailbox: string,
    id?: number
}

// Define interface to describe a received message.  
// Note that body is optional since it isn't sent when listing messages.
export interface IMessage {
    id: string,
    date: string,
    from: string,
    subject: string,
    body?: string
}

// Define interface to describe a mailbox.
export interface IMailbox {
    name: string,
    path: string // path is how code will identify a mailbox for operations
}

// Disable certificate validation (less secure, but needed for some servers).
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


// The worker that will perform IMAP operations and interact with main.ts.
export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    } // the server information is passed in to the constructor and stored.

    /**
     * Connect to the SMTP server and return a emailjs-imap-client object for operations to use.
     *
     * @return An ImapClient instance.
     */
    private async connectToServer(): Promise<any> {
        const client: any = new ImapClient.default(
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            { auth: Worker.serverInfo.imap.auth } // pass in a username and password
        );
        client.logLevel = client.LOG_LEVEL_NONE; // keep the output logging
        client.onerror = (inError: Error) => {
            console.log("IMAP.Worker.listMailboxes(): Connection error", inError);
        }; // error handler without re-trying
        await client.connect();
        return client;
    } /* End connectToServer(). */


    /**
     * Returns a list of all (top-level) mailboxes.
     *
     * @return An array of objects, on per mailbox, that describes the nmilbox.
     */
    public async listMailboxes(): Promise<IMailbox[]> {
        const client: any = await this.connectToServer(); // get a client
        const mailboxes: any = await client.listMailboxes(); // get the list
        await client.close();

        // Translate from emailjs-imap-client mailbox objects to app-specific objects. 
        // At the same time, flatten the list of mailboxes to a one-dimensional array of objects via iterateChildren function recursion.
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (inArray: any[]): void => {
            // For each mailbox encountered, added new object that contains jname and path to finalMailboxes
            inArray.forEach((inValue: any) => {
                finalMailboxes.push({
                    name: inValue.name,
                    path: inValue.path
                });
                iterateChildren(inValue.children); // handle with children property
            });
        };
        iterateChildren(mailboxes.children);
        return finalMailboxes;
    } /* End listMailboxes(). */


    /**
     * Lists basic information about messages in a named mailbox.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     * @return              An array of objects, one per message.
     */
    public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {
        const client: any = await this.connectToServer();
        // We have to select the mailbox first. This gives us the message count.
        // The inCallOptions object contain the name of the mailbox in mailbox field
        const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
        
        // If there are no messages then just return an empty array.
        if (mailbox.exists === 0) {
            await client.close();
            return [];
        }
        // Note that they are returned in order by uid, so it's FIFO.
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox, // mailbox name
            "1:*", // messages type: messages beginning with the first one and all messages after it. *: any value
            ["uid", "envelope"] // properties, envelope: metadata
        );
        await client.close();
        // Translate from emailjs-imap-client message objects to app-specific objects.
        const finalMessages: IMessage[] = [];
        messages.forEach((inValue: any) => { // For each message returned, an object is constructed
            finalMessages.push({
                id: inValue.uid, // the unique message id
                date: inValue.envelope.date, // the date it was sent
                from: inValue.envelope.from[0].address, // where it’s from
                subject: inValue.envelope.subject // subject
            });
        });
        return finalMessages;
    } /* End listMessages(). */


    /**
     * Gets the plain text body of a single message.
     *
     * @param  inCallOptions An object implementing the ICallOptions interface.
     * @return               The plain text body of the message.
     */
    public async getMessageBody(inCallOptions: ICallOptions): Promise<string> {
        const client: any = await this.connectToServer();
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            inCallOptions.id, // specifying a specific message ID 
            ["body[]"], // body can be in multiple parts, it’s actually an array
            { byUid: true } // listing messages based on a specific ID
        );
        const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]); // parses the message into a ParsedMail object
        await client.close();
        return parsed.text!; // return the text property of that object
    } /* End getMessageBody(). */


    /**
     * Deletes a single message.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     */
    public async deleteMessage(inCallOptions: ICallOptions): Promise<any> {
        const client: any = await this.connectToServer();
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            inCallOptions.id, // specifying a specific message ID 
            ["uid"], // body can be in multiple parts, it’s actually an array
            { byUid: true } // listing messages based on a specific ID
        );
        if (inCallOptions.mailbox !== 'Deleted'){
            await client.copyMessages(
                inCallOptions.mailbox,
                messages[0]['uid'],
                'Deleted',
                { byUid: true } // tell the method that we are passing a unique ID
            );
        }
        await client.deleteMessages(
            inCallOptions.mailbox,
            messages[0]['uid'],
            // inCallOptions.id,
            { byUid: true } // tell the method that we are passing a unique ID
        );
        await client.close(); // no return
    } /* End deleteMessage(). */

} /* End class. */