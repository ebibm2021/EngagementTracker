
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

exports.getActivity = (req, resp) => {
  var activites = []
  return activites;
}

exports.getEngagement = (req, resp) => {
  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT * FROM public.engagement;', (err, result) => {
      release();
      if (err) {

        resp.status(403).send({
          info: "failure",
          data: [],
          message: err.stack
        })
        return console.error('Error executing query', err.stack)
      }
      resp.status(200).send({
        info: "success",
        data: result.rows,
        message: "success"
      })
    })
  });
}

exports.createEngagement = (req, resp) => {
  const { market, customer, opportunity, seller, ctpa, partner, category, product, description, status, labsme, requestedon, completedon, results, effort, comment } = req.body
  var query = 'INSERT INTO public.engagement' +
    '(market, customer, opportunity, "seller/exec", "ctp/sca", partner, category, product, description, status, labsme, requestedon, completedon,result, effort, comment)' +
    'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15, $16) returning *'

  pool.query(query, [market, customer, opportunity, seller, ctpa, partner, category, product, description, status, labsme, requestedon, completedon, results, effort, comment], (error, results) => {
    if (error) {
      throw error
    }
    console.log(JSON.stringify(results));
    var id = 0;
    if (results.rows.length > 0) {
      id = results.rows[0].id
    }
    resp.status(201).send(`Engagement added with ID: ` + id)
  })
}

exports.createActivity = (req, resp) => {
  const { engagementid, actedon, action } = req.body
  var query = "INSERT INTO public.activity" +
    "(engagementid, actedon, action) " +
    "VALUES($1, $2, $3)"
  console.log(query);
  var id = 0;
  pool.query(query, [engagementid, actedon, action], (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length > 0) {
      id = results.rows[0].id
    }
    resp.status(201).send(`Activity added with ID: ` + id)
  })
}