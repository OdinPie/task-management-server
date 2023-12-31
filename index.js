const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
//
//
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Task server is eating tasks :v');
})
app.listen(port, ()=>{
    console.log(`listening on port : ${port}`);
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@odinpiesdatabase.beom3yx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db('taskDB');
    const taskCollection = database.collection('taskCollection');
    const userCollection = database.collection('userCollection');

    app.post('/tasks', async(req,res)=>{
        const article = req.body;
        const result = await taskCollection.insertOne(article);
        res.send(result);
    })

    app.get('/tasks', async(req,res)=>{
      const query = req.query;
        const cursor = await taskCollection.find(query).toArray();
        res.send(cursor);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

