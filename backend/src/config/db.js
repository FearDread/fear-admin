const config = require("./config");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(config.url,  {
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
