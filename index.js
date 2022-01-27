const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.deaij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    client.connect();
    const database = client.db("trveller");
    const travelServiceCollection = database.collection("travel-Service");
    const myPostsCollection = database.collection("myPosts");
    const adminCollection = database.collection("admin");

    // post api
    app.get("/services", async (req, res) => {
      const result = await travelServiceCollection.find({}).toArray();
      res.json(result);
    });
    
    // add place post api
    app.post("/services/addPlace", async (req, res) => {
      const cursor = req.body;
      const result = await travelServiceCollection.insertOne(cursor);
      res.json(result);
    });

    // Delete manage order api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await travelServiceCollection.deleteOne(filter);
      console.log(result);
      res.json(result); 
    });

    // update post status
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const status = req.body;
      console.log(status);
      const options = { upsert: true };
      const updateStatus = {
        $set: {
          status: "Approved",
        },
      };
      const result = await travelServiceCollection.updateOne(
        query,
        updateStatus,
        options
      );
      res.json(result);
    });

    // post api
    app.get("/myOrder", async (req, res) => {
      const result = await myPostsCollection.find({}).toArray();
      res.json(result);
    });

    // admin post api
    app.post("/admin", async(req, res)=>{
      const cursor = req.body;
      const result = await adminCollection.insertOne(cursor);
      res.json(result);
    })
    // admin get api
    app.get("/admin", async(req, res)=>{
      const result = await adminCollection.find({}).toArray();
      res.json(result);
    })


    // placeorder post api
    // app.post("/placeOrder", async (req, res) => {
    //   const cursor = req.body;
    //   const result = await myPostsCollection.insertOne(cursor);
    //   console.log(result);
    //   res.json(result);
    // });

  
    // Delete post api
    // app.delete("/placeOrder/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) };
    //   const result = await travelServiceCollection.deleteOne(filter);
    //   res.json(result);
    // });
  } catch {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Server running port is", port);
});
