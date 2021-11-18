
let instana = require('@instana/collector')({
  serviceName: 'EngagementTrackerService',
  agentHost: 'localhost',
  reportUncaughtException: true
});

let bunyan = require('bunyan');
// Create your logger(s).
let bunyanLogger = bunyan.createLogger({name:"EngagementTrackerService"});
// Set the logger Instana should use.
instana.setLogger(bunyanLogger);

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

exports.getActivity = (req, resp) => {
  let engagementId = req.query.engagement_id;
  console.log(engagementId);
  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    pool.query('SELECT * FROM  ACTIVITY where ENGAGEMENTID = ' + engagementId + ' ;', function (err, data) {
      release();
      if (err) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err.stack
        })
        return console.log('Error executing query', err.stack);
      }
      else {
        resp.status(200).send({
          info: "success",
          data: util.convertKeyToLowerCase(data),
          message: "success"
        })
        return console.log(JSON.stringify(data));
      }
    });
  });
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
    let query = `SELECT max(e."MARKET") AS MARKET, 
    max(e."CUSTOMER") AS CUSTOMER, 
    max(e."OPPORTUNITY") AS OPPORTUNITY, 
    max(e."SELLER/EXEC") AS "SELLER/EXEC", 
    max(e."CTP/SCA") AS "CTP/SCA", 
    max(e."PARTNER") AS PARTNER, 
    max(e."CATEGORY") AS CATEGORY, 
    max(e."PRODUCT") AS PRODUCT, 
    max(e."DESCRIPTION") AS DESCRIPTION,
    max(e."STATUS") AS STATUS, 
    max(e."LABSME") AS LABSME, 
    max(e."REQUESTEDON") AS REQUESTEDON, 
    max(e."COMPLETEDON") AS COMPLETEDON,
    max(e."RESULT") AS "RESULT",
    max(e."EFFORT") AS EFFORT,
    max(e."COMMENTS") AS COMMENTS,
    max(e."ID") AS ID,
    array_agg(ac.ACTIVITYDATA) AS ACTIVITYDATA,
    CASE WHEN max(ac.ACTEDON) IS NULL THEN (CASE WHEN max(e."COMPLETEDON") IS NULL THEN max(e."REQUESTEDON") ELSE max(e."COMPLETEDON") END ) ELSE max(ac.ACTEDON) end AS LASTUPDATEDON
    FROM public."ENGAGEMENT" e LEFT OUTER JOIN (
      select a."ID" as ID, 
      a."ACT" as ACT,
      a."ACTEDON" as ACTEDON,
      a."ACT" || '#' || a."ACTEDON" as ACTIVITYDATA, 
      a."ENGAGEMENTID" as ENGAGEMENTID 
      from public."ACTIVITY" a
    ) as ac ON ac.ENGAGEMENTID  = e."ID"
    GROUP BY e."ID";`
    
    bunyanLogger.info('get engagement - '+ query);
    client.query(query, (err, result) => {
      release();
      if (err) {

        resp.status(403).send({
          info: "failure",
          data: [],
          message: err.stack
        })
        bunyanLogger.error('Error executing query' + err.stack);
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
  const { market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments } = req.body
  var query = `INSERT INTO public."ENGAGEMENT" 
    ("MARKET", "CUSTOMER", "OPPORTUNITY", "SELLER/EXEC", "CTP/SCA", "PARTNER", "CATEGORY", "PRODUCT", "DESCRIPTION", "STATUS", "LABSME", "REQUESTEDON", "COMPLETEDON", "RESULT", "EFFORT", "COMMENTS", "ID")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, nextval('public.ENGAGEMENT_SEQ')) returning *`

  pool.query(query, [market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments], (error, results) => {
    if (error) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: error.stack
      })
    }
    console.log(JSON.stringify(results));
    var id = 0;
    if (results.rows.length > 0) {
      id = results.rows[0]['ID']
      resp.status(201).send({
        info: "success",
        data: results.rows[0],
        message: "success"
      })
    }
    else {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: "no data"
      })
    }
  })
}

exports.createActivity = (req, resp) => {
  const { engagementid, actedon, action } = req.body
  var query = "INSERT INTO activity" +
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


exports.updateActivity = (req, resp) => {
  
  let { act, engagementid, actedon, id } = req.body;
  actedon = util.parseDate1(actedon, 'MM/DD/yyyy')
  console.log(act, actedon, id)
  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    let query = 'update ' + schemaName + '.activity set "ACT" = ?, "ACTEDON" = ? WHERE "ID" = ? and "ENGAGEMENTID" = ?;'
    client.query(query, function (err2, stmt) {
      release();
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        return console.log(err2);
      }
      else {
        stmt.execute([act, actedon, id, engagementid], function (err3, result) {
          conn.closeSync();
          if (err3) {
            resp.status(403).send({
              info: "failure",
              data: [],
              message: err3.stack
            })
            return console.log(err3);
          }
          else {
            result.fetch(function (err4, resultdata) {
              if (err4) {
                resp.status(403).send({
                  info: "failure",
                  data: [],
                  message: err4.stack
                })
                return console.log(err4);
              }
              else {
                resp.status(200).send({
                  info: "success",
                  data: resultdata,
                  message: "success"
                })
                return console.log(JSON.stringify(resultdata));
              }
            });
          }
        });
      }
    });
  });
};