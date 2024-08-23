// dealing with contacts (listing, adding, and deleting them)
// store data in a ole’ database on a server.

// Node imports.
import * as path from "path";
// Library imports.
const Datastore = require("nedb")

// Define interface to describe a contact. 
// Note that we'll only have an _id field when retrieving or adding, so it has to be optional.
export interface IContact {
    _id?: number,
    name: string,
    email: string
}

// The worker that will perform contact operations.
export class Worker {
    // The Nedb Datastore instance for contacts.
    private db: Nedb;
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"), // db path
            autoload: true // load automatically
        });
    } 


    /**
     * Lists all contacts.
     *
     * @return A promise that eventually resolves to an array of IContact objects.
     */
    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find( // returns all the records in the contacts.db file
                {},
                (inError: Error, inDocs: IContact[]) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inDocs);
                    }
                }
            );
        });

    } /* End listContacts(). */


    /**
     * Add a new contact.
     *
     * @param  inContact The contact to add.
     * @return           A promise that eventually resolves to an IContact object.
     */
    public addContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            // insert method passes the added object to the callback, which include an _id field
            this.db.insert(
                inContact, // the contact to add
                (inError: Error | null, inNewDoc: IContact) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inNewDoc);
                    }
                }
            );
        });
    } /* End addContact(). */

    /**
     * Update a contact.
     *
     * @param  inContact The contact to update.
     * @return           A promise that eventually resolves to an IContact object.
     */
     public updateContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            this.db.update(
                {_id : inContact._id},
                inContact,
                {returnUpdatedDocs: true},
                (inError: Error | null, numberOfUpdated: number, inDocs: IContact, upsert: boolean) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inDocs);
                    }
                }
            );
        });
    } /* End updateContact(). */


    /**
     * Delete a contact.
     *
     * @param  inID The ID of the contact to delete.
     * @return      A promise that eventually resolves to a string (null for success, or the error message for an error).
     */
    public deleteContact(inID: string): Promise<string | void> {
        return new Promise((inResolve, inReject) => {
            this.db.remove(
                { _id: inID },
                {},
                (inError: Error | null, inNumRemoved: number) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });
    } /* End deleteContact(). */

} /* End class. */