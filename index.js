const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vweq3se.mongodb.net/?retryWrites=true&w=majority`;

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
        const collegesCollection = client.db("studyCamp").collection("colleges");

        // colleges  apis
        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray();
            res.send(result);
        })

        app.get('/best-colleges', async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            const result = await collegesCollection.find().limit(limit).toArray();
            res.send(result);
        });

        app.get('/users/colleges/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const colleges = await collegesCollection.findOne({ _id: new ObjectId(id) });
                if (!colleges) {
                    return res.status(404).json({ error: true, message: 'colleges not found' });
                }

                res.json(colleges);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: true, message: 'Server error' });
            }
        });




        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('StudyCamp server is running')
})

app.listen(port, () => {
    console.log(`StudyCamp server is running on port: ${port}`)
})