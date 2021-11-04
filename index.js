const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware 
app.use(cors());
app.use(express.json());

//connect to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qemuh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const db = client.db('travel-solo');
    const tourPackageCollection = db.collection("toursPackage");
    const bookingsCollection = db.collection("bookings");
    const testimonialCollection = db.collection("testimonials");

    // ==============GET API ==================== 
    //GET API
    app.get('/', (req, res) => {
        res.send('Welcome to Travel Solo');
    })
    //GET API (Tours Package)
    app.get('/tours', async (req, res) => {
        const result = await tourPackageCollection.find({}).toArray();
        res.send(result);
    })

    //GET API (Bookings)
    app.get('/bookings', async (req, res) => {
        let query = {}
        const email = req.query.email;
        if(email){
            query ={email: email}
        }
        const result = await bookingsCollection.find(query).toArray();
        res.send(result);
    })

    //GET Dynamic (Bookings)
    app.get('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await bookingsCollection.findOne(query);
        res.send(result);
    })

    //GET Dynamic (Tours)\
    app.get('/tours/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await tourPackageCollection.findOne(query);
        res.send(result);
    })

    //GET (testimonials)
    app.get('/testimonials', async (req, res) => {
        const result = await testimonialCollection.find({}).toArray();
        res.send(result);
    })

    // ==========================POST API========================= 
    //POST API (Tours Package)
    app.post('/tours', async (req, res) => {
        const newTours = req.body;
        const result = await tourPackageCollection.insertOne(newTours);
        res.send(result);
    })

    //POST API (Bookings )
    app.post('/bookings', async (req, res) => {
        const newBooking = req.body;
        const result = await bookingsCollection.insertOne(newBooking);
        res.send(result);
    })

    // ======================DELETE API ======================== 
    //DELETE API(Bookings)
    app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await bookingsCollection.deleteOne(query);
        res.send(result);
    })


    // =================Update API====================
    app.put('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const newStatus = req.body;
        const query = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                data: newStatus.newData
            }
        }
        const result = await bookingsCollection.updateOne(query, updateDoc, options);
        res.send(result);
    })


});

//run the server
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
})