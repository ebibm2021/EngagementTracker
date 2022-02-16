from flask import render_template
from flask import Flask
from flask import request
import psycopg2
from config import config
import json
schemaName = "public"

def connect():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
		
        # create a cursor
        cur = conn.cursor()
        
	# execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version)
       
	# close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')



def getFilterGroups():
    print(request.method)
    # print(request.body)
    compositeResult = {}
    compositeResult['hello'] = 'Hello'
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
		
        # create a cursor
        cur = conn.cursor()
        
        queries = [
            ["market", 'SELECT DISTINCT "MARKET" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["category", 'SELECT DISTINCT "CATEGORY" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["product", 'SELECT DISTINCT "PRODUCT" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["result", 'SELECT DISTINCT "RESULT" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["status", 'SELECT DISTINCT "STATUS" FROM ' + schemaName + '."ENGAGEMENT" ;']
        ]

        for query in queries:
            cur.execute(query[1])

            # display the PostgreSQL database server version
            queryResult = cur.fetchall()
            print(query[0])
            print(queryResult)
            print(compositeResult)
            compositeResult[query[0]] = queryResult
            print(compositeResult)
       
	    # close the communication with the PostgreSQL
        cur.close()



#     let promises = [];
#     queries.forEach((query, index) => {
#       promises.push(new Promise((resolve, reject) => {

#         client.query(query[1], [], (error, data) => {

#           console.log(query[1])
#           console.log(data.rows)
#           let key = query[0];
#           if (err) {
#             reject({
#               [key]: []
#             });
#           }
#           else {
#             resolve({
#               [key]: util.groupByResponseObjectToArray(util.convertKeyToLowerCase(data.rows), key)
#             })
#           }
#         });
#       }));
#     });
#     Promise.all(promises).then((values) => {
#       release();
#       values = values.reduce((value, accumulator) => {
#         for (var key in value) {
#           if (value.hasOwnProperty(key)) {
#             accumulator[key] = value[key]
#           }
#         }
#         return accumulator;
#       }, {});
#       // console.log(JSON.stringify(values));
#       resp.status(200).send({
#         info: "success",
#         data: values,
#         message: "success"
#       })
#       return console.log(JSON.stringify(values));
#     })
#   });

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

    return compositeResult

def searchAnalytics(self, data):
    

    return "Congratulations, it's a web app!"
