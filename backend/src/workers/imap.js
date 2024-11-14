const ImapClient = require("emailjs-imap-client");
const { ParsedMail, simpleParser } = require("mailparser");


module.exports = class Worker {
    constructor (serverInfo) {
        this.serverinfo = serverInfo;
    }

    connectToServer = async (req, res) => {
        const client = new ImapClient.default(
            this.serverInfo.imap.host,
            this.serverInfo.imap.port,
            { auth: this.serverInfo.imap.auth } 
        );

        client.logLevel = client.LOG_LEVEL_NONE; // keep the output logging
        client.onerror = (error) => {
            console.log("IMAP.Worker.listMailboxes(): Connection error", error);
        }; 
        
        await client.connect();
        
        return client;
    }

    listMailboxes = async (req, res) => {
        const client = await this.connectToServer();
        const mailboxes = await client.listMailboxes();
        await client.close();

        const iterateChildren = (inArray) => {
    
            inArray.forEach((inValue: any) => {
                finalMailboxes.push({
                    name: inValue.name,
                    path: inValue.path
                });
                iterateChildren(inValue.children); 
            });
        };
        iterateChildren(mailboxes.children);

        return finalMailboxes;
    }

    listMessages = async (options) => {
        const client = await this.connectToServer();
        const mailbox = await client.selectMailbox(options.mailbox);

        if (mailbox.exists === 0) {
            await client.close();
            return [];
        }

        const messages = await client.listMessages(
            options.mailbox, "1:*", ["uid", "envelope"] 
        );

        await client.close();
        const finalMessages = [];
        messages.forEach((value) => { 
            finalMessages.push({
                id: value.uid, 
                date: value.envelope.date, 
                from: value.envelope.from[0].address,
                subject: value.envelope.subject 
            });
        });

        return finalMessages;
    } 


    /**
     * Gets the plain text body of a single message.
     *
     * @param  options An object implementing the ICallOptions interface.
     * @return               The plain text body of the message.
     */
    getMessageBody = async (options) => {
        const client = await this.connectToServer();
        const messages = await client.listMessages(
            options.mailbox,
            options.id,
            { byUid: true } 
        );
        const parsed = await simpleParser(messages[0]["body[]"]);
        await client.close();

        return parsed?.text; 
    } 


    /**
     * Deletes a single message.
     *
     * @param options An object implementing the ICallOptions interface.
     */
    deleteMessage = async (options) => {
        const client = await this.connectToServer();
        const messages = await client.listMessages(
            options.mailbox,
            options.id, // specifying a specific message ID 
            ["uid"], // body can be in multiple parts, it’s actually an array
            { byUid: true } // listing messages based on a specific ID
        );
        if (options.mailbox !== 'Deleted'){
            await client.copyMessages(
                options.mailbox,
                messages[0]['uid'],
                'Deleted',
                { byUid: true } // tell the method that we are passing a unique ID
            );
        }
        await client.deleteMessages(
            options.mailbox,
            messages[0]['uid'],
            // inCallOptions.id,
            { byUid: true } // tell the method that we are passing a unique ID
        );
        await client.close(); // no return
    }


} 