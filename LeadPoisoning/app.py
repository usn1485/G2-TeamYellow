from flask import Flask, render_template,redirect,jsonify
from flask_pymongo import PyMongo
import sys

app = Flask(__name__)

# setup mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/LeadDB"
mongo = PyMongo(app)

# print(mongo.db.AllStates.find({"year":2017}).count())

@app.route("/")
def index():
    print("I am on index.html")
    lead_data=list(mongo.db.year_17.find())
    #print(lead_data)
    # write a statement that finds all the items in the db and sets it to a variable
    
    # render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html", data=lead_data)

# @app.route("/counties")
# def getCounties():
    
#     #myquery = { "County Name": { "$regex": "^S" } }
#     county_data=list(mongo.db.year_17.find({}))
#     print("CountyData", county_data)
#        # Return a list of the column names (sample names)
#     return jsonify("index.html",data=county_data)

@app.route("/barGraph")
def getBarData():
    print("I am on barGraph")
    myquery={"prct_chldrn_confirbill_5ugdl":{ "$gt": "3" }}
    bllByStateData=list(mongo.db.AllStates.find(myquery))
    print(bllByStateData)
    return jsonify(bllByStateData)

@app.route("/years")
def getAllYears():
    data = mongo.db.AllStates.distinct('year')
    return jsonify(list(filter(None, data)))

def getMongoData(query):
     resp = mongo.db.AllStates.find(query, {'_id': False})
     data = []
     for doc in resp:
        data.append(doc)
     return data

@app.route("/years/<year>")
def getLeadLevelsForYear(year):
    query = { "year" : year }
    data = getMongoData(query)
    return list(jsonify(query))

@app.route("/year")
def getYear():
    print(" I am in get year Method")
    myquery={"prct_chldrn_confirbill_5ugdl":{ "$gt": "3" }}
    bllByStateData = mongo.db.AllStates.find(myquery, {'_id': False})
    #for yearData in bllByStateData.find({},{"year":1,"prct_chldrn_confirbill_5ugdl":1,"PRCT_chldrn_confirbill_10ugdl":1,"state":1}):
    
    data = []
    for doc in bllByStateData:
        data.append(doc)
    
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)