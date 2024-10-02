This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Firstly run NPM install to install all required dependencies
Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

HOW TO RUN BACKEND SERVER
to run the server put your mongodb api key in the url string as well as database and cluster name

mongodb+srv://<Put UserName Here>:<Put Password Here>@<Put ClusterName Here>.bgjwczk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongodb user name mongodb password here cluster name here

Put your weatherbit Api name in the url string

http://api.weatherbit.io/v2.0/current?city=${searchTerm}&key=<Put API Key Here>
Api goes here

https://api.weatherbit.io/v2.0/forecast/daily?city=${searchTerm}&days=16&key=<Put API Key Here>
Api key goes here
change Axios url ip address to your machines ip adress

http://192.168.124.21:3001/insertSearchTerm
inser your local machine api address here

Now run node ServerRout.js to run the backend server
