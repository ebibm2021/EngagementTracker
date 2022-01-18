const client = require('prom-client')
// Create a Registry which registers the metrics
const register = new client.Registry()
// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'engagement-tracker-app'
})

// Enable the collection of default metrics

client.collectDefaultMetrics({ register })

exports.getMetrics = (req, res) => {
    let prom =new Promise((resolve,reject)=>{
        register.metrics().then((data) =>{
           resolve(data)
        })
    })
    prom.then((data) =>{
        res.setHeader('Content-Type', register.contentType)
        res.status(200).send(data)
    });
    }
