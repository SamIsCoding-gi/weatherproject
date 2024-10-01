import express from 'express';
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
app.use(express.json());

const uri = "mongodb+srv://<Put UserName Here>:<Put Password Here>@<Put ClusterName Here>.bgjwczk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Use the cors middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from this origin change to the one that your machine is running on
}));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// gets daily and 16 day forecast as well as saving search terms
app.put("/insertSearchTerm", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("searchTerms");
    const collection = database.collection("searchTerm");

    const currentDate = new Date().toISOString().split('T')[0];
    const searchTerm = req.body.searchTerm;

    const result = await collection.updateOne(
      { date: currentDate },
      { $push: { searchTerms: searchTerm } },
      { upsert: true } 
    );

    // get daily and 16 day forecast
    const dailyForecast = await fetch(
      `http://api.weatherbit.io/v2.0/current?city=${searchTerm}&key=<Put API Key Here>`);
      if (!dailyForecast.ok) {
        throw new Error("City not found");
      }
      const dailyForecastData = await dailyForecast.json();
      console.log("Daily weather: ",dailyForecastData);

      const sixteenDayForecast = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchTerm}&days=16&key=<Put API Key Here>`);  
      if (!sixteenDayForecast.ok) {
        throw new Error("City not found");
      }
      const sixteenDayForecastData = await sixteenDayForecast.json();
      console.log("16 day weather: ",sixteenDayForecastData);

      res.status(200).send({ dailyForecastData, sixteenDayForecastData, result });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error inserting search term");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
