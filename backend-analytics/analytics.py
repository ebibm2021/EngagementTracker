from flask import render_template, jsonify
from flask import Flask
from flask import request
import psycopg2
from config import config
import json

schemaName = "public"

def generateResponse(data):
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    return response

def getHealth():
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')
        db_version = cur.fetchone()
        print(db_version)
        cur.close()
        return generateResponse({"info":"success","message":"success"})
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return generateResponse({"info":"failure","message":""+ error})
    finally:
        if conn is not None:
            conn.close()
    return generateResponse({"info":"failure","data":{}, "message": "No result, No error, Check Logs"})

def getFilterGroups():
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        
        queries = [
            ["market", 'SELECT DISTINCT "MARKET" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["category", 'SELECT DISTINCT "CATEGORY" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["product", 'SELECT DISTINCT "PRODUCT" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["result", 'SELECT DISTINCT "RESULT" FROM ' + schemaName + '."ENGAGEMENT" ;'],
            ["status", 'SELECT DISTINCT "STATUS" FROM ' + schemaName + '."ENGAGEMENT" ;']
        ]

        compositeResult = {}
        for query in queries:
            cur.execute(query[1])
            queryResult = cur.fetchall()
            tempresult = []
            for resultUnit in queryResult:
                tempresult.append(resultUnit[0])
            compositeResult[query[0]] = tempresult
       
        cur.close()
        return generateResponse({"info":"success","data":compositeResult, "message": "success"})

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return generateResponse({"info":"failure","data":{},"message":""+ error})
    finally:
        if conn is not None:
            conn.close()

    return generateResponse({"info":"failure","data":{}, "message": "No result, No error, Check Logs"})

def searchAnalytics(self, data):
    

    return "Congratulations, it's a web app!"
