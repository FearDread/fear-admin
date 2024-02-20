const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + ".env" });

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
