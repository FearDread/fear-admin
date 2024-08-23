// a configuration file that provides the IMAP and SMTP server(s) 
// the server will connect to and where that information will be stored.

// Node path module imports.
const path = require("path");
const fs = require("fs"); // File System module

// Define interface for server information.
export interface IServerInfo {
    smtp: {
        host: string,
        port: number,
        auth: {
            user: string,
            pass: string
        }
    },
    imap: {
        host: string,
        port: number,
        auth: {
            user: string,
            pass: string
        }
    }
}

// The configured and variable typed server info.
export let serverInfo: IServerInfo

// Read in the serverInfo.json file and create an object
// The file is read in as a plain string with the fs.readFileSync() function
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);
// After that, we have an object in memory that contains the information needed to connect to the server
// MailBag is a single-user webmail application