const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fyera.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
app.use(cors())
app.use(express.json())


async function run() {
    try {
        await client.connect();
        console.log("successfully connected");

        const database = client.db('car-mechanics')
        const userCollection = database.collection('services')

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await userCollection.insertOne(service)

            res.send(JSON.stringify(result))

            console.log("post hitted", service)
        })

        // get api
        app.get('/services', async (req, res) => {
            const cursor = userCollection.find({});
            const services = await cursor.toArray();

            res.send(services);
        })
        //get single services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) }
            const service = await userCollection.findOne(query)
            res.send(service)

        })

        //delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) }
            const service = await userCollection.deleteOne(query)

            res.send(JSON.stringify(service))
        })

    }



    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hello from node')

})

app.listen(port, () => {
    console.log(port)
})