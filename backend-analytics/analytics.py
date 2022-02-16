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
            tempresult = []
            for resultUnit in queryResult:
                tempresult.append(resultUnit[0])
            compositeResult[query[0]] = tempresult
       
	    # close the communication with the PostgreSQL
        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        compositeResult = {"info":"failure","data":{},"message":""+ error}
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

    return {"info":"success","data":compositeResult, "message": "success"}

def searchAnalytics(self, data):
    

    return "Congratulations, it's a web app!"
