// talks to an SMTP server to send messages

// Library imports.
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
// App imports.
import { IServerInfo } from "./ServerInfo";

// The worker class that will perform SMTP operations.
export class Worker {
    // Server information.
    private static serverInfo: IServerInfo;

    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }

    /**
     * Send a message.
     *
     * @param  inOptions An object containing to, from, subject and text properties (matches the IContact interface,
     *                   but can't be used since the type comes from nodemailer, not app code).
     * @return           A Promise that eventually resolves to a string (null for success, error message for an error).
     */
    public sendMessage(inOptions: SendMailOptions): Promise<string | void> { // string is the ultimate return from the functio
        // all the calls to nodemailer are wrapped up in the Promise object to implement async/await
        return new Promise((inResolve, inReject) => {
            // transport is an object that knows how to send mail with a particular protocol
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(
                inOptions, // contains the message details passed in from the client.
                (inError: Error | null, inInfo: SentMessageInfo) => { // error object can be null, so called a union type
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });

    }


} 