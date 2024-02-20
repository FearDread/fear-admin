const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: __dirname + "/../config/config.env" });

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
