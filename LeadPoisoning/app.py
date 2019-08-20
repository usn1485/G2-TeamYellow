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
   
    return render_template("index.html")

@app.route("/years")
def getAllYears():
    #Mongo query to get unique years from the document
    data = mongo.db.AllStates.distinct('year')
    #Filter(None,data) removes all empty strings
    return jsonify(list(filter(None, data)))

def getMongoData(query):
     resp = mongo.db.AllStates.find(query, {'_id': False})
     data = []
     for doc in resp:
        data.append(doc)
     print("getmongodata",data)
     return data

@app.route("/states/<year>")
def getTopStates(year):
#find bll for missouri for a given year

    missouri_lead_level_data = getMongoData({"state":"Missouri","year":year})
    top_ten_lead_level_resp=mongo.db.AllStates.find({'state':{'$ne':"Missouri"},'year':year},{'_id':False}).sort([("prct_chldrn_confirbill_5ugdl",-1)]).limit(10)
    
    combined_data = []
    combined_data.append(missouri_lead_level_data[0])
    #combined_data.append(top_ten_lead_level_data)
    for doc in top_ten_lead_level_resp:
        combined_data.append(doc)
    
    return jsonify(combined_data)

    # top_ten_lead_level_data = []
    # for doc in top_ten_lead_level_resp:
    #     top_ten_lead_level_data.append(doc)
    

    # response = {
    #     'Missouri' : missouri_lead_level_data[0],
    #     'OtherTopTenStates':  top_ten_lead_level_data   
    # }
    
    # return jsonify(response)
    # First sort all the docs by BLL 5mg
    

@app.route("/years/<year>")
def getLeadLevelsForYear(year):
    query = { "year" : year }
   # data = getMongoData(query)
    bllByStateData = mongo.db.AllStates.find(query, {'_id': False})
    #bllByStateData = mongo.db.AllStates.find(query, {'_id': False,"state":1,"PRCT_chldrn_confirbill_10ugdl":1}).limit(10)
    data = []
    for doc in bllByStateData:
        data.append(doc)
    
    return jsonify(data)

# @app.route("/year")
# def getYear():
#     print(" I am in get year Method")
#     myquery={"prct_chldrn_confirbill_5ugdl":{ "$gt": "3" }}
#     bllByStateData = mongo.db.AllStates.find(myquery, {'_id': False})
#     #for yearData in bllByStateData.find({},{"year":1,"prct_chldrn_confirbill_5ugdl":1,"PRCT_chldrn_confirbill_10ugdl":1,"state":1}):
    
#     data = []
#     for doc in bllByStateData:
#         data.append(doc)
    
#     return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)