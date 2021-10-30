const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId  = require("mongodb").ObjectId;
require('dotenv').config();

const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.deaij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        client.connect();
        const database = client.db("Travel");
        const travelServiceCollection = database.collection("travel Service");
        const placeOrderCollection = database.collection("Place order");
        const bookNowCollection = database.collection("BookNow");

        // post api
        app.post("/services", async(req, res)=>{
            const cursor = req.body;
            const result = await travelServiceCollection.insertOne(cursor);
            res.json(result);
        })
        app.get("/services", async(req, res)=>{
            const result = await travelServiceCollection.find({}).toArray();
            res.json(result)
        })

        //  place order post in data base
        app.post("/placeOrder", async(req, res)=>{
            const cursor = req.body;
            const result = await placeOrderCollection.insertOne(cursor);
            res.json(result)
        })

        // post data  in Book now collection
        app.post("/bookNow", async(req, res) =>{
            const cursor = req.body;
            const result = await bookNowCollection.insertOne(cursor)
            console.log(result)
            res.json(result)
        })

        // get api in book now in dashboard
        app.get("/bookNow", async(req, res)=>{
            const result = await bookNowCollection.find({}).toArray();
            // console.log(result)
            res.json(result)
        })

        // delete dashbard item
        app.delete("/dashboard/:id", async(req, res) =>{
            const id = req.params.id;
            const filter = {_id:id};
            const result = await bookNowCollection.deleteOne(filter);
            // console.log(result)
            res.send(result)
        })
        // Get my order 
        app.get("/bookNow/:email", async(req, res)=>{
            const email = req.params.email;
            const result = await bookNowCollection.find({email}).toArray();
            // console.log(email)
            res.json(result)
        })

        // add new tour list 
        app.post("/addservice", async(req, res) =>{
            const cursor = req.body;
            const result = await travelServiceCollection.insertOne(cursor);
            res.json(result);
        })

        // Delete my order item
        app.delete("/bookNow/:id", async(req, res) =>{
            const id = req.params.id;
            const filter = {_id:id};
            const result = await bookNowCollection.deleteOne(filter);
            // console.log(result);
            res.json(result);
        })

        
    } catch {
        // await client.close()
    }
}

run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log("Server running port is", port);
})

