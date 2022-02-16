from flask import render_template, jsonify
from flask import Flask
from flask import request
import psycopg2
from config import config
import json

schemaName = "public"

def generateResponse(data):
    response = jsonify(data)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
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

def searchAnalytics():

    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        requestBody = request.json
        print(requestBody)

        dateStart = requestBody['filters']['dateStart']
        dateEnd = requestBody['filters']['dateEnd']

        queryBody = '''( SELECT 
            max(e."MARKET") AS "market", 
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
        FROM ''' + schemaName + '''."ENGAGEMENT" e LEFT OUTER JOIN (
            select a."ID" as ID, 
            a."ACT" as ACT,
            a."ACTEDON" as ACTEDON,
            a."ACT" || '#' || a."ACTEDON" as ACTIVITYDATA, 
            a."ENGAGEMENTID" as ENGAGEMENTID 
            from ''' + schemaName + '''."ACTIVITY" a
        ) as ac ON ac.ENGAGEMENTID  = e."ID"
        GROUP BY e."ID" ) as w '''

        queryFilter = ""
        queryFilter = queryFilter + " where ( ( w.REQUESTEDON >= '" + dateStart + "' and w.REQUESTEDON <= '" + dateEnd + "' ) or ( w.COMPLETEDON >= '" + dateStart + "' and w.COMPLETEDON <= '" + dateEnd + "' ) or ( w.LASTUPDATEDON >= '" + dateStart + "' and w.LASTUPDATEDON <= '" + dateEnd + "' ) ) "
        if requestBody['filters']['status'].strip().lower() != "all":
            queryFilter = queryFilter + " and lower(w.STATUS) = '" + requestBody['filters']['status'].strip().lower() + "' "
        if requestBody['filters']['result'].strip().lower() != "all":
            queryFilter = queryFilter + " and lower(w.RESULT) = '" + requestBody['filters']['result'].strip().lower() + "' "
        if requestBody['filters']['category'].strip().lower() != "all":
            queryFilter = queryFilter + " and lower(w.CATEGORY) = '" + requestBody['filters']['category'].strip().lower() + "' "
        if requestBody['filters']['product'].strip().lower() != "all":
            queryFilter = queryFilter + " and lower(w.PRODUCT) = '" + requestBody['filters']['product'].strip().lower() + "' "

        queryStructures = [
            { 'name': "Status Distribution", 'alias':"status", 'querySelect': " select w.status as STATUS, count(1) as COUNT from ", 'queryGrouping': " group by w.status " },
            { 'name': "Result Distribution", 'alias':"result", 'querySelect': " select w.result as RESULT, count(1) as COUNT from ", 'queryGrouping': " group by w.result " },
            { 'name': "Category Distribution", 'alias':"category", 'querySelect': " select w.category as CATEGORY, count(1) as COUNT from ", 'queryGrouping': " group by w.category " },
            { 'name': "Market Distribution", 'alias':"market", 'querySelect': " select w.market as MARKET, count(1) as COUNT from ", 'queryGrouping': " group by w.market " },
            { 'name': "Customer Distribution", 'alias':"customer", 'querySelect': " select w.customer as CUSTOMER, count(1) as COUNT from ", 'queryGrouping': " group by w.customer " }
        ]

        compositeResult = {}
        for queryStructure in queryStructures:
            cur.execute(queryStructure['querySelect'] + queryBody + queryFilter + queryStructure['queryGrouping'])
            queryResult = cur.fetchall()
            print(queryResult)
            tempResult = []
            for queryResultUnit in queryResult:
                tempResult.append({queryStructure['alias']:queryResultUnit[0], 'count':queryResultUnit[1]})
            compositeResult[queryStructure['name']] = tempResult

        cur.close()
        return generateResponse({"info":"success","data":compositeResult, "message": "success"})

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return generateResponse({"info":"failure","data":{},"message":""+ error})
    finally:
        if conn is not None:
            conn.close()

    return generateResponse({"info":"failure","data":{}, "message": "No result, No error, Check Logs"})
