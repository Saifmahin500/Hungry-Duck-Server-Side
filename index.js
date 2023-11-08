const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5500;

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r2uistf.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const userCollection = client.db("FoodUser").collection("user")
        const foodCollection = client.db("foodItems").collection("food")
        const allFoodItemsCollection = client.db("AllFoodItems").collection("AllFood")
        const PurchaseCollection = client.db("purchaseItems").collection("order")

        // 
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
          });


        app.get("/foodItems", async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/allFoodItems", async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const cursor = allFoodItemsCollection.find().skip(page * size).limit(size);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/foodItems/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result);

        })

        app.get("/allFoodItems/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allFoodItemsCollection.findOne(query)
            res.send(result);

        })

        app.get('/FoodItemsCount', async(req,res) => {
            
            const count = await allFoodItemsCollection.estimatedDocumentCount();
            res.send({ count });
        })

        app.get("/FoodPurchases/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result);

        })

        app.get("/FoodPurchase/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allFoodItemsCollection.findOne(query)
            res.send(result);

        })

        //Purchase Items

        app.get("/purchaseConfirm", async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await PurchaseCollection.find(query).toArray();
            res.send(result)
        })


        app.post("/purchaseConfirm", async (req, res) => {
            const purchase = req.body;
            const result = await PurchaseCollection.insertOne(purchase)
            res.send(result);
        })

        app.delete("/purchaseConfirm/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
              _id: new ObjectId(id),
            };
            const result = await PurchaseCollection.deleteOne(query);
            console.log(result);
            res.send(result);
          });

        //   ADD FOOD ITEMS
        app.post("/AddFoodItems", async (req, res) => {
            const addFood = req.body;
            const result = await allFoodItemsCollection.insertOne(addFood)
            res.send(result);
        })

         app.get("/AddFoodItems", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await  allFoodItemsCollection.find(query).toArray();
            res.send(result)
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



app.get("/", (req, res) => {
    res.send("server is running...");
});


app.listen(port, () => {
    console.log(`server is Running on port ${port}`);
});







