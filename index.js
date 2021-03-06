const axios = require("axios");
const cluster = require("cluster");
const numCPUs = require('os').cpus().length;
const fetch = require('node-fetch');
const hugeData = [];

let i2
async function status() {
    const url = "https://jobstream.api.jobtechdev.se/stream?date=2021-01-24T10:00:00";
    let response = await axios.get(url,{
        headers: {
          'api-key': 'YidMXHhlN1x4OTF7Vlx4Y2FceGU3XHg5Zlx4OWFceGE1aFx4OWJOa3ZGXHgxOFx4ZDNcbnUn'
        }});
    return response.data;
  }
  
 i2 = status().then((data) => {return data});

 for (let i = 1; i < 2000000; i++) {
    hugeData.push(i);
  }

 const main = async () => {
     const files = hugeData;
     console.log(files.length)
     const clusterFiles = files.filter(
         (_, index) => index % numCPUs === cluster.worker.id - 1
     );

     for (const file of clusterFiles) {
        //   console.log(file, process.pid)
     }
 };

 if (cluster.isMaster) {
     console.log(`[${process.pid}] I am master`);

     for (let i = 0; i < numCPUs; i++) {
         cluster.fork();
     }
 } else {
     console.log(`[${process.pid}] I am worker ${cluster.worker.id}`);
     main()
         .then(() => process.exit(0))
         .catch((err) => {
             console.error(err);
             process.exit(1);
         });
 }
