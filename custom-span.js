let instana = require('@instana/collector')({
    serviceName: 'CustomSpanService',
    agentHost: 'localhost'
});

let bunyan = require('bunyan');
// Create your logger(s).
let bunyanLogger = bunyan.createLogger({ name: "CustomSpanService" });
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

// async function someFunc1() {
//     await instana.sdk.async.startEntrySpan('my-custom-span');
//     console.log("async style entry span")
//     instana.sdk.async.completeEntrySpan();
// }
// someFunc1();

// async function someFunc2() {
//     await instana.sdk.async.startExitSpan('my-custom-span');
//     console.log("async style exit span")
//     instana.sdk.async.completeExitSpan();
// }
// someFunc2();

// instana.sdk.callback.startEntrySpan('custom-21-Nov', () => {
//     // The actual work needs to happen inside this callback (or in the callback
//     // of any asynchronous operation transitively triggered from this callback).
//     var span = instana.currentSpan();

//     console.log("The current span, if any, is - ", span.getName())

//     bunyanLogger.info('Yay! 🎉');

//     setTimeout(() => {

//         bunyanLogger.info('Yay! 🎉');
//         bunyanLogger.error("Awwwwwww - Error");
//         instana.sdk.callback.completeEntrySpan();
//     }, 10000);
// });

console.log('hello')
let postgresCallingFunc = () => {

    instana.sdk.callback.startEntrySpan('custom-22-Nov', () => {
        pool.connect((err, client, release) => {
            if (err) {
                bunyanLogger.info('Error acquiring client', err.stack);
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

            bunyanLogger.info('get engagement query is - ' + query);
            client.query(query, (err, result) => {
                release();
                    var mySpan = instana.currentSpan();
                    console.log("The current span, if any, is - ", mySpan.getName())
                
                if (err) {
                    bunyanLogger.error('Error executing query' + err.stack);
                    return console.error('Error executing query', err.stack)
                }
                bunyanLogger.info('get engagement result is' + JSON.stringify(result.rows));
                return console.log('get engagement query is', JSON.stringify(result.rows))
            })
        });
        instana.sdk.callback.completeEntrySpan();
    });
}
setTimeout(()=>{

    postgresCallingFunc();

},5000)





