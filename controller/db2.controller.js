
var ibmdb = require('ibm_db');
var util = require('./util.controller');
var connStr = "DATABASE=ONE;HOSTNAME=9.46.67.53;PORT=50000;PROTOCOL=TCPIP;UID=db2inst1;PWD=i am using db2;";
var schemaName = "db2inst1";

exports.getActivity = (req, resp) => {
  let engagementId = req.query.engagement_id;
  console.log(engagementId);
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err
      })
      return console.log(err);
    }
    conn.query('SELECT * FROM ' + schemaName + '.ACTIVITY where ENGAGEMENTID = ' + engagementId + ' ;', function (err, data) {
      conn.closeSync();
      if (err) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err.stack
        })
        return console.log(err);
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
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err
      })
      return console.log(err);
    }
    let query = `SELECT max(e.MARKET) AS MARKET, 
    max(e.CUSTOMER) AS CUSTOMER, 
    max(e.OPPORTUNITY) AS OPPORTUNITY, 
    max(e."SELLER/EXEC") AS "SELLER/EXEC", 
    max(e."CTP/SCA") AS "CTP/SCA", 
    max(e.PARTNER) AS PARTNER, 
    max(e.CATEGORY) AS CATEGORY, 
    max(e.PRODUCT) AS PRODUCT, 
    max(e.DESCRIPTION) AS DESCRIPTION,
    max(e.STATUS) AS STATUS, 
    max(e.LABSME) AS LABSME, 
    max(e.REQUESTEDON) AS REQUESTEDON, 
    max(e.COMPLETEDON) AS COMPLETEDON,
    max(e."RESULT") AS "RESULT",
    max(e.EFFORT) AS EFFORT,
    max(e.COMMENTS) AS COMMENTS,
    max(e.ID) AS ID,
    LISTAGG(ac.ACTIVITYDATA,'$') AS ACTIVITYDATA,
    CASE WHEN max(ac.ACTEDON) IS NULL THEN (CASE WHEN max(e.COMPLETEDON) IS NULL THEN max(e.REQUESTEDON) ELSE max(e.COMPLETEDON) END ) ELSE max(ac.ACTEDON) end AS LASTUPDATEDON
    FROM ` + schemaName + `.ENGAGEMENT e LEFT OUTER JOIN (
      select a.ID as ID, 
      a.ACT as ACT,
      a.ACTEDON as ACTEDON,
      a.ACT || '#' || a.ACTEDON as ACTIVITYDATA, 
      a.ENGAGEMENTID as ENGAGEMENTID 
      from ` + schemaName + `.ACTIVITY a
    ) as ac ON ac.ENGAGEMENTID  = e.ID
    GROUP BY e.ID;`
    console.log(query)
    conn.query(query, function (err, data) {
      conn.closeSync();
      if (err) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err.stack
        })
        return console.log(err);
      }
      else {
        resp.status(200).send({
          info: "success",
          data: util.convertKeyToLowerCase(data),
          message: "success"
        })
        return JSON.stringify(data);
      }
    });
  });
}

exports.createEngagement = (req, resp) => {
  let { market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments } = req.body;
  // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments)
  requestedon = util.parseDate1(requestedon, 'MM/DD/yyyy')
  completedon = util.parseDate1(completedon, 'MM/DD/yyyy')
  // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments)
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'SELECT ID FROM FINAL TABLE (INSERT INTO ' + schemaName + '.engagement ("MARKET", "CUSTOMER", "OPPORTUNITY", "SELLER/EXEC", "CTP/SCA", "PARTNER", "CATEGORY", "PRODUCT", "DESCRIPTION", "STATUS", "LABSME", "REQUESTEDON", "COMPLETEDON", "RESULT", "EFFORT", "COMMENTS", "ID") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ' + schemaName + '.ENGAGEMENT_SEQ.nextval))'

    
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
        return console.log(err2);
      }
      else {
        stmt.execute([market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments], function (err3, result) {
          if (err3) {
            conn.closeSync();
            resp.status(403).send({
              info: "failure",
              data: [],
              message: err3.stack
            })
            return console.log(err3);
          }
          else {
            result.fetch(function (err4, resultdata) {
              conn.closeSync();
              console.log("Result Data => " + resultdata);
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
                return JSON.stringify(resultdata);
              }
            });
          }
        });
      }
    });
  });
}

exports.updateEngagement = (req, resp) => {
  let { market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id } = req.body;
  // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id)
  requestedon = util.parseDate1(requestedon, 'MM/DD/yyyy')
  completedon = util.parseDate1(completedon, 'MM/DD/yyyy')
  // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id)
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'update ' + schemaName + '.engagement set "MARKET" = ?, "CUSTOMER" = ?, "OPPORTUNITY" = ?, "SELLER/EXEC" = ?, "CTP/SCA" = ?, "PARTNER" = ?, "CATEGORY" = ?, "PRODUCT" = ?, "DESCRIPTION" = ?, "STATUS" = ?, "LABSME" = ?, "REQUESTEDON" = ?, "COMPLETEDON" = ?, "RESULT" = ?, "EFFORT" = ?, "COMMENTS" = ? WHERE "ID" = ?;'
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
        return console.log(err2);
      }
      else {
        stmt.execute([market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments, id], function (err3, result) {
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
}

exports.deleteEngagement = (req, resp) => {
  let id = req.query.id;
  console.log(id);
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'DELETE FROM ' + schemaName + '.engagement WHERE ID = ?;'
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
        return console.log(err2);
      }
      else {
        stmt.execute([id], function (err3, result) {
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
}

exports.updateActivity = (req, resp) => {
  
  let { act, engagementid, actedon, id } = req.body;
  actedon = util.parseDate1(actedon, 'MM/DD/yyyy')
  console.log(act, actedon, id)
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'update ' + schemaName + '.activity set "ACT" = ?, "ACTEDON" = ? WHERE "ID" = ? and "ENGAGEMENTID" = ?;'
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
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

exports.deleteActivity = (req, resp) => {
  let id = req.query.id;
  console.log(id);
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'DELETE FROM ' + schemaName + '.activity WHERE ID = ?;'
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
        return console.log(err2);
      }
      else {
        stmt.execute([id], function (err3, result) {
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

exports.deleteActivities = (req, resp) => {
  let engagementId = req.query.engagementid;
  console.log(engagementId);
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'DELETE FROM ' + schemaName + '.activity WHERE ENGAGEMENTID = ?;'
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
        return console.log(err2);
      }
      else {
        stmt.execute([engagementId], function (err3, result) {
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

exports.createActivity = (req, resp) => {
  let { engagementid, act, actedon } = req.body;
  console.log(engagementid, act, actedon)
  actedon = util.parseDate1(actedon, 'MM/DD/yyyy')
  console.log(engagementid, act, actedon)
  ibmdb.open(connStr, function (err1, conn) {
    if (err1) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err1
      })
      return console.log(err1);
    }
    let query = 'SELECT ID FROM FINAL TABLE ( INSERT INTO ' + schemaName + '.activity ("ENGAGEMENTID", "ACT", "ACTEDON", "ID") VALUES (?, ?, ?, ACTIVITY_SEQ.nextval));'
    conn.prepare(query, function (err2, stmt) {
      if (err2) {
        resp.status(403).send({
          info: "failure",
          data: [],
          message: err2.stack
        })
        conn.closeSync();
        return console.log(err2);
      }
      else {
        stmt.execute([engagementid, act, actedon], function (err3, result) {
          if (err3) {
            conn.closeSync();
            resp.status(403).send({
              info: "failure",
              data: [],
              message: err3.stack
            })
            return console.log(err3);
          }
          else {
            result.fetch(function (err4, resultdata) {
              conn.closeSync();
              if (err4) {
                resp.status(403).send({
                  info: "failure",
                  data: [],
                  message: err4.stack
                })
                return console.log(err4);
              }
              else {
                console.log("Result Data =>" + resultdata)
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
}

exports.getFilterGroups = (req, resp) => {
  let queries = [
    ["market", "SELECT DISTINCT MARKET FROM " + schemaName + ".ENGAGEMENT ;"],
    ["category", "SELECT DISTINCT CATEGORY FROM " + schemaName + ".ENGAGEMENT ;"],
    ["product", "SELECT DISTINCT PRODUCT FROM " + schemaName + ".ENGAGEMENT ;"],
    ["result", "SELECT DISTINCT RESULT FROM " + schemaName + ".ENGAGEMENT ;"],
    ["status", "SELECT DISTINCT STATUS FROM " + schemaName + ".ENGAGEMENT ;"]
  ]
  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err
      })
      return console.log(err);
    }
    let promises = [];
    queries.forEach((query, index) => {
      promises.push(new Promise((resolve, reject) => {
        conn.query(query[1], function (err, data) {
          let key = query[0];
          if (err) {
            reject({
              [key]: []
            });
          }
          else {
            resolve({
              [key]: util.groupByResponseObjectToArray(util.convertKeyToLowerCase(data), key)
            })
          }
        });
      }));
    });
    Promise.all(promises).then((values) => {
      conn.closeSync();
      values = values.reduce((value, accumulator) => {
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            accumulator[key] = value[key]
          }
        }
        return accumulator;
      }, {});
      console.log(JSON.stringify(values));
      resp.status(200).send({
        info: "success",
        data: values,
        message: "success"
      })
      return console.log(JSON.stringify(values));
    })
  });
}

exports.searchAnalytics = (req, resp) => {
  console.log("Hello the filters are");
  console.log(req.body.filters);

  dateStart = util.parseDate1(req.body.filters.dateStart, 'MM/DD/yyyy')
  dateEnd = util.parseDate1(req.body.filters.dateEnd, 'MM/DD/yyyy')

  console.log(dateStart);
  console.log(dateEnd);

  let queryBody = `( SELECT 
    max(e.MARKET) AS MARKET, 
    max(e.CUSTOMER) AS CUSTOMER, 
    max(e.OPPORTUNITY) AS OPPORTUNITY, 
    max(e."SELLER/EXEC") AS "SELLER/EXEC", 
    max(e."CTP/SCA") AS "CTP/SCA", 
    max(e.PARTNER) AS PARTNER, 
    max(e.CATEGORY) AS CATEGORY, 
    max(e.PRODUCT) AS PRODUCT, 
    max(e.DESCRIPTION) AS DESCRIPTION,
    max(e.STATUS) AS STATUS, 
    max(e.LABSME) AS LABSME, 
    max(e.REQUESTEDON) AS REQUESTEDON, 
    max(e.COMPLETEDON) AS COMPLETEDON,
    max(e."RESULT") AS "RESULT",
    max(e.EFFORT) AS EFFORT,
    max(e.COMMENTS) AS COMMENTS,
    max(e.ID) AS ID,
    LISTAGG(ac.ACTIVITYDATA,'$') AS ACTIVITYDATA,
    CASE WHEN max(ac.ACTEDON) IS NULL THEN (CASE WHEN max(e.COMPLETEDON) IS NULL THEN max(e.REQUESTEDON) ELSE max(e.COMPLETEDON) END ) ELSE max(ac.ACTEDON) end AS LASTUPDATEDON
  FROM ` + schemaName + `.ENGAGEMENT e LEFT OUTER JOIN (
    select a.ID as ID, 
    a.ACT as ACT,
    a.ACTEDON as ACTEDON,
    a.ACT || '#' || a.ACTEDON as ACTIVITYDATA, 
    a.ENGAGEMENTID as ENGAGEMENTID 
    from ` + schemaName + `.ACTIVITY a
  ) as ac ON ac.ENGAGEMENTID  = e.ID
  GROUP BY e.ID ) as w `

  let queryFilter = "";
  queryFilter = queryFilter + " where ( ( w.REQUESTEDON >= '" + dateStart + "' and w.REQUESTEDON <= '" + dateEnd + "' ) or ( w.COMPLETEDON >= '" + dateStart + "' and w.COMPLETEDON <= '" + dateEnd + "' ) or ( w.LASTUPDATEDON >= '" + dateStart + "' and w.LASTUPDATEDON <= '" + dateEnd + "' ) ) "
  if (req.body.filters.status.toLowerCase().trim() != "all") {
    queryFilter = queryFilter + " and lower(w.STATUS) = '" + req.body.filters.status.toLowerCase().trim() + "' ";
  }
  if (req.body.filters.result.toLowerCase().trim() != "all") {
    queryFilter = queryFilter + " and lower(w.RESULT) = '" + req.body.filters.result.toLowerCase().trim() + "' ";
  }
  if (req.body.filters.category.toLowerCase().trim() != "all") {
    queryFilter = queryFilter + " and lower(w.CATEGORY) = '" + req.body.filters.category.toLowerCase().trim() + "' ";
  }
  if (req.body.filters.product.toLowerCase().trim() != "all") {
    queryFilter = queryFilter + " and lower(w.PRODUCT) = '" + req.body.filters.product.toLowerCase().trim() + "' ";
  }

  // let querySelect = " select w.status as STATUS, count(1) as COUNT from ";
  // let queryGrouping = " group by w.status "

  let queryStructures = [
    { name: "Status Distribution", querySelect: " select w.status as STATUS, count(1) as COUNT from ", queryGrouping: " group by w.status " },
    { name: "Result Distribution", querySelect: " select w.result as RESULT, count(1) as COUNT from ", queryGrouping: " group by w.result " },
    { name: "Category Distribution", querySelect: " select w.category as CATEGORY, count(1) as COUNT from ", queryGrouping: " group by w.category " },
    { name: "Market Distribution", querySelect: " select w.market as MARKET, count(1) as COUNT from ", queryGrouping: " group by w.market " },
    { name: "Customer Distribution", querySelect: " select w.customer as CUSTOMER, count(1) as COUNT from ", queryGrouping: " group by w.customer " }
  ]

  ibmdb.open(connStr, function (err, conn) {
    if (err) {
      resp.status(403).send({
        info: "failure",
        data: [],
        message: err
      })
      return console.log(err);
    }
    let promises = [];
    queryStructures.forEach((queryStructure, index) => {
      promises.push(new Promise((resolve, reject) => {

        let query = queryStructure.querySelect + queryBody + queryFilter + queryStructure.queryGrouping;

        console.log(query)
        conn.query(query, function (err, data) {
          var key = queryStructure.name;
          if (err) {
            reject({
              [key]: []
            });
          }
          else {
            resolve({
              [key]: util.convertKeyToLowerCase(data)
            })
          }

          // if (err) {
          //   resp.status(403).send({
          //     info: "failure",
          //     data: [],
          //     message: err.stack
          //   })
          //   return console.log(err);
          // }
          // else {
          //   resp.status(200).send({
          //     info: "success",
          //     data: util.convertKeyToLowerCase(data),
          //     message: "success"
          //   })
          //   return console.log(JSON.stringify(data));
          // }
        });
      }));
    });
    Promise.all(promises).then((values) => {
      conn.closeSync();
      values = values.reduce((value, accumulator) => {
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            accumulator[key] = value[key]
          }
        }
        return accumulator;
      }, {});
      console.log(JSON.stringify(values));
      resp.status(200).send({
        info: "success",
        data: values,
        message: "success"
      })
      return console.log(JSON.stringify(values));
    })
  });
}

let retrieveValue = (anObject, style) => {
  if (style == "text") {
    if (anObject == undefined || anObject == null || anObject == "") {
      return null;
    } else {
      return "" + anObject;
    }
  }
  if (style == "number") {
    if (anObject == undefined || anObject == null || anObject == "") {
      return 0;
    } else {
      if (typeof (anObject) == "string") {
        return parseInt(anObject)
      }
      else {
        return anObject;
      }
    }
  }
}

exports.bulkUpload = async (req, resp) => {
  console.log(req.body);
  let engagementValues = []
  for (let i = 0; i < req.body.length; i++) {
    let engagementActivityUnit = req.body[i];
    //req.body.forEach((engagementActivityUnit) => {
    let promise = new Promise((resolveEngagement, rejectEngagement) => {
      let market = retrieveValue(engagementActivityUnit['market'], 'text');
      let customer = retrieveValue(engagementActivityUnit['customer'], 'text');
      let opportunity = retrieveValue(engagementActivityUnit['opportunity'], 'text');
      let sellerexec = retrieveValue(engagementActivityUnit['seller/exec'], 'text');
      let ctpsca = retrieveValue(engagementActivityUnit['ctp/sca'], 'text');
      let partner = retrieveValue(engagementActivityUnit['partner'], 'text');
      let category = retrieveValue(engagementActivityUnit['category'], 'text');
      let product = retrieveValue(engagementActivityUnit['product'], 'text');
      let description = retrieveValue(engagementActivityUnit['description'], 'text');
      let status = retrieveValue(engagementActivityUnit['status'], 'text');
      let labsme = retrieveValue(engagementActivityUnit['labsme'], 'text');
      let requestedon = retrieveValue(engagementActivityUnit['requestedon'], 'text');
      let completedon = retrieveValue(engagementActivityUnit['completedon'], 'text');
      let result = retrieveValue(engagementActivityUnit['result'], 'text');
      let effort = retrieveValue(engagementActivityUnit['effort'], 'number');
      let comments = retrieveValue(engagementActivityUnit['comments'], 'text');
      let activitiesFromThisEngagement = engagementActivityUnit['activities'];

      // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments)
      // console.log(opportunity, requestedon, completedon)
      if (requestedon == null || requestedon == "") {
        requestedon = null;
      } else {
        requestedon = util.parseDate2(requestedon, 'DD-MMM-yyyy', 'MM/DD/yyyy')
      }
      if (completedon == null || completedon == "") {
        completedon = null;
      } else {
        completedon = util.parseDate2(completedon, 'DD-MMM-yyyy', 'MM/DD/yyyy')
      }
      // console.log(market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments)
      // console.log(opportunity, requestedon, completedon)
      ibmdb.open(connStr, function (errEngagement1, connEngagement) {
        if (errEngagement1) {
          rejectEngagement(errEngagement1);
        }
        let queryEngagement = 'SELECT ID FROM FINAL TABLE (INSERT INTO ' + schemaName + '.engagement ("MARKET", "CUSTOMER", "OPPORTUNITY", "SELLER/EXEC", "CTP/SCA", "PARTNER", "CATEGORY", "PRODUCT", "DESCRIPTION", "STATUS", "LABSME", "REQUESTEDON", "COMPLETEDON", "RESULT", "EFFORT", "COMMENTS", "ID") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ENGAGEMENT_SEQ.nextval)); '
        connEngagement.prepare(queryEngagement, function (errEngagement2, stmtEngagement) {
          if (errEngagement2) {
            rejectEngagement(errEngagement2);
          }
          else {
            stmtEngagement.execute([market, customer, opportunity, sellerexec, ctpsca, partner, category, product, description, status, labsme, requestedon, completedon, result, effort, comments], function (errEngagement3, resultEngagement) {
              if (errEngagement3) {
                connEngagement.closeSync();
                rejectEngagement(errEngagement3);
              }
              else {
                resultEngagement.fetch(function (errEngagement4, resultDataEngagement) {
                  connEngagement.closeSync();
                  if (errEngagement4) {
                    rejectEngagement(errEngagement4);
                  }
                  else {
                    console.log("Engagement Result Data => " + JSON.stringify(resultDataEngagement));
                    let engagementId = resultDataEngagement["ID"];

                    let bulkActivityPromises = [];
                    activitiesFromThisEngagement.forEach((activityFromThisEngagement) => {
                      bulkActivityPromises.push(new Promise((resolveActivity, rejectActivity) => {

                        let { act, actedon } = activityFromThisEngagement;
                        console.log(engagementId, act, actedon)
                        actedon = util.parseDate2(actedon, 'DD-MMM-yyyy', 'MM/DD/yyyy')
                        console.log(engagementId, act, actedon)
                        ibmdb.open(connStr, function (errActivity1, connActivity) {
                          if (errActivity1) {
                            rejectActivity(errActivity1);
                          }
                          let queryActivity = 'SELECT ID FROM FINAL TABLE ( INSERT INTO ' + schemaName + '.activity ("ENGAGEMENTID", "ACT", "ACTEDON", "ID") VALUES (?, ?, ?, ACTIVITY_SEQ.nextval));'
                          connActivity.prepare(queryActivity, function (errActivity2, stmtActivity) {
                            if (errActivity2) {
                              connActivity.closeSync();
                              rejectActivity(errActivity2);
                            }
                            else {
                              stmtActivity.execute([engagementId, act, actedon], function (errActivity3, resultActivity) {
                                if (errActivity3) {
                                  connActivity.closeSync();
                                  rejectActivity(errActivity3);
                                }
                                else {
                                  resultActivity.fetch(function (errActivity4, resultDataActivity) {
                                    connActivity.closeSync();
                                    if (errActivity4) {
                                      rejectActivity(errActivity4);
                                    }
                                    else {
                                      console.log("Activity Result Data => " + resultDataActivity)
                                      let activityId = resultDataActivity['ID'];
                                      resolveActivity(activityId);
                                    }
                                  });
                                }
                              });
                            }
                          });
                        });
                      }));
                    });
                    Promise.all(bulkActivityPromises).then((activityValues) => {
                      console.log(activityValues);
                      resolveEngagement({ parent: engagementId, children: activityValues });
                    }).catch((errActivities) => {
                      console.log(errActivities);
                      rejectEngagement({ parent: engagementId, children: errActivities });
                    });
                  }
                });
              }
            });
          }
        });
      });
    });
    let result = await promise;
    engagementValues.push(result)
  }
  console.log(engagementValues);
  resp.status(200).send({
    info: "success",
    data: engagementValues,
    message: "success"
  });
}