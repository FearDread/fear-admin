const config = require("../config");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: __dirname + "/../config/config.env" });
const Database = "mongodb+srv://feardread:S3W2pCIip3@fearcluster01.yzzupeq.mongodb.net/fear_master_api?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_LINK,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

exports.run = async () => {
    try {

        await client.connect();

        await client.db("fear_master_api").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      
      } finally {

        await client.close();
      }
}
