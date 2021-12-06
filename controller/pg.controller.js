
let instana = require('@instana/collector')({
  serviceName: process.env.INSTANA_SERVICE_NAME,
  agentHost: process.env.INSTANA_AGENT_HOST,
  reportUncaughtException: true
});

let bunyan = require('bunyan');
// Create your logger(s).
let bunyanLogger = bunyan.createLogger({ name: process.env.INSTANA_SERVICE_NAME });
// Set the logger Instana should use.
instana.setLogger(bunyanLogger);

require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DB,
  password: process.env.POSTGRESQL_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_PORT),
})

var util = require('./util.controller');
var schemaName = process.env.POSTGRESQL_SCHEMA;

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
    client.query(`SELECT * FROM ` + schemaName + `."ACTIVITY" where "ENGAGEMENTID" = ` + engagementId + ' ;', function (err, result) {
      release();
      console.log(result)
      if (err) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err.stack
        })
        return console.log('Error executing query', err.stack);
      }
      else {
        if (result.rows.length > 0) {
          resp.status(200).send({
            info: "success",
            data: util.convertKeyToLowerCase(result.rows),
            message: "success"
          })
        } else {
          resp.status(200).send({
            info: "success",
            data: [],
            message: "success"
          })
        }
        return console.log(JSON.stringify(result));
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
    max(e."CUSTOMER") AS "customer", 
    max(e."OPPORTUNITY") AS "opportunity", 
    max(e."SELLER/EXEC") AS "seller/exec", 
    max(e."CTP/SCA") AS "ctp/sca",
    max(e."PARTNER") AS "partner", 
    max(e."CATEGORY") AS "category", 
    max(e."PRODUCT") AS "product", 
    max(e."DESCRIPTION") AS "description",
    max(e."STATUS") AS "status", 
    max(e."LABSME") AS "labsme", 
    max(e."REQUESTEDON") AS "requestedon", 
    max(e."COMPLETEDON") AS "completedon",
    max(e."RESULT") AS "result",
    max(e."EFFORT") AS "effort",
    max(e."COMMENTS") AS "comments",
    max(e."ID") AS "id",
    array_agg(ac.ACTIVITYDATA) AS "activitydata",
    CASE WHEN max(ac.ACTEDON) IS NULL THEN (CASE WHEN max(e."COMPLETEDON") IS NULL THEN max(e."REQUESTEDON") ELSE max(e."COMPLETEDON") END ) ELSE max(ac.ACTEDON) end AS "lastupdatedon"
    FROM ` + schemaName + `."ENGAGEMENT" e LEFT OUTER JOIN (
      select a."ID" as ID, 
      a."ACT" as ACT,
      a."ACTEDON" as ACTEDON,
      a."ACT" || '#' || a."ACTEDON" as ACTIVITYDATA, 
      a."ENGAGEMENTID" as ENGAGEMENTID 
      from ` + schemaName + `."ACTIVITY" a
    ) as ac ON ac.ENGAGEMENTID  = e."ID"
    GROUP BY e."ID";`

    bunyanLogger.info('get engagement - ' + query);
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
  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    const { market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments } = req.body
    var query = `INSERT INTO ` + schemaName + `."ENGAGEMENT" 
    ("MARKET", "CUSTOMER", "OPPORTUNITY", "SELLER/EXEC", "CTP/SCA", "PARTNER", "CATEGORY", "PRODUCT", "DESCRIPTION", "STATUS", "LABSME", "REQUESTEDON", "COMPLETEDON", "RESULT", "EFFORT", "COMMENTS", "ID")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, nextval('` + schemaName + `.ENGAGEMENT_SEQ')) returning *`

    bunyanLogger.info('create engagement - ' + query);
    client.query(query, [market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments], (error, results) => {
      release()
      if (error) {
        bunyanLogger.error('create engagement - ' + error);
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
  })
}

exports.updateEngagement = (req, resp) => {
  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    let { market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id } = req.body;
    // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id)

    let query = 'update ' + schemaName + '."ENGAGEMENT" set "MARKET" = $1, "CUSTOMER" = $2, "OPPORTUNITY" = $3, "SELLER/EXEC" = $4, "CTP/SCA" = $5, "PARTNER" = $6, "CATEGORY" = $7, "PRODUCT" = $8, "DESCRIPTION" = $9, "STATUS" = $10, "LABSME" = $11, "REQUESTEDON" = $12, "COMPLETEDON" = $13, "RESULT" = $14, "EFFORT" = $15, "COMMENTS" = $16 WHERE "ID" = $17;'
    bunyanLogger.info('update engagement - ' + query);

    client.query(query, [market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id], (error, results) => {
      release()
      if (error) {
        bunyanLogger.error('update engagement - ' + error);
        resp.status(403).send({
          info: "failure",
          data: [],
          message: error.stack
        })
      } else {
        console.log(JSON.stringify(results));

        resp.status(200).send({
          info: "success",
          data: results,
          message: "success"
        })

      }
    });
  });
}


exports.deleteEngagement = (req, resp) => {
  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    let id = req.query.id;
    console.log(id);

    let query = 'DELETE FROM ' + schemaName + '.engagement WHERE ID = $1;'
    bunyanLogger.info('delete engagement - ' + query);

    client.query(query, [id], (error, results) => {
      release();
      if (error) {
        bunyanLogger.error('delete engagement - ' + error);
        resp.status(403).send({
          info: "failure",
          data: [],
          message: error.stack
        })
      } else {
        console.log(JSON.stringify(results));

        resp.status(200).send({
          info: "success",
          data: results,
          message: "success"
        })

      }
    });
  });
}

exports.createActivity = (req, resp) => {

  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    const { engagementid, actedon, act } = req.body
    var query = `INSERT INTO ` + schemaName + `."ACTIVITY" ("ENGAGEMENTID", "ACTEDON", "ACT", "ID")
    VALUES($1, $2, $3, nextval('` + schemaName + `.ACTIVITY_SEQ'))  returning *`
    console.log(query);
    bunyanLogger.info('create activity - ' + query);
    var id = 0;
    client.query(query, [engagementid, actedon, act], (error, results) => {
      release();
      if (error) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: error.stack
        })
      }
      else {
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
      }
    })
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
    let query = 'update ' + schemaName + '."ACTIVITY" set "ACT" = $1, "ACTEDON" = $2 WHERE "ID" = $3 and "ENGAGEMENTID" = $4;'
    client.query(query, [act, actedon, id, engagementid], (err2, updateResult) => {
      if (err2) {
        release();
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        return console.log(err2);
      }
      else {
        client.query(`SELECT * FROM  ` + schemaName + `."ACTIVITY" where "ENGAGEMENTID" = $1 ;`, [engagementid], (err4, resultdata) => {
          release();
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
  });
};

exports.deleteActivity = (req, resp) => {

  pool.connect((err, client, release) => {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err.stack
      })
      return console.error('Error acquiring client', err.stack)
    }
    let id = req.query.id;

    let query = 'DELETE FROM ' + schemaName + '."ACTIVITY" WHERE "ID" = $1;'
    bunyanLogger.info('delete activity - ' + query);

    client.query(query, [id], (error, results) => {
      release();
      if (error) {
        bunyanLogger.error('delete activity - ' + error);
        resp.status(403).send({
          info: "failure",
          data: [],
          message: error.stack
        })
      } else {
        // console.log(JSON.stringify(results));

        resp.status(200).send({
          info: "success",
          data: results,
          message: "success"
        })
      }
    });
  });
};