 #!/bin/python

from flask import Flask, jsonify, request, make_response
from sentence_transformers import SentenceTransformer
import requests
import os

app = Flask(__name__)

def text_to_embedding(text):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding = model.encode(text, convert_to_tensor=False).tolist()
    
    # Convert the embedding to the expected format
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    return embedding_str

def create_solr_knn_query(endpoint, collection, embedding, query, limit, offset):
    url = f"{endpoint}/{collection}/select"

    data = {
        "q": query,
        "rq": "{!rerank reRankQuery=$rqq reRankDocs={limit} reRankWeight=1}",
        "rqq": f"{{!knn f=university_vector topK=10}}{embedding}",
        "fl": "institution_name,wikipedia_text,city_name,country,id,url",
        "start": offset,
        "rows": limit,
        "wt": "json",
        "defType": "edismax",
        "indent": "true",
        "qf": "country^4 wikipedia_text^3 city_wikipedia_text^2 size",
        "q.op":"OR",
        "hl":"true",
        "hl.fl":"wikipedia_text",
        "hl.method":"fastVector",
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    response = requests.post(url, data=data, headers=headers)
    response.raise_for_status()
    return response.json()

def create_solr_query_from_text(text):
    defined_solr_query_params = ["country", "wikipedia_text", "city_wikipedia_text", "size"]
    
    words_array = text.split(" ")
    query = ""
    
    for param in defined_solr_query_params:
        for word in words_array:
            query += param + ":" + word + " "

    return query

def query_solr(search_text, limit, offset):
    solr_endpoint = (os.environ["SOLR_DOCKER_URL"] or "http://localhost:8983") + "/solr"
    collection = "universities"
    
    embedding = text_to_embedding(search_text)
    query = create_solr_query_from_text(search_text)
    
    print("QUERY", query)

    try:
        results = create_solr_knn_query(solr_endpoint, collection, embedding, query, limit, offset)
        docs = results.get("response", {}).get("docs", [])
        highlights = results.get("highlighting", [])
        
        temp_docs = []
        
        for doc in docs:
            found_highlight = False
            for h in highlights:
                if(doc.get("id") == h):
                    found_highlight = highlights.get(h).get("wikipedia_text", [])

            found_highlight = found_highlight or False
            
            temp_docs.append({
                "institution_name": doc.get("institution_name"),
                "country": doc.get("country"), 
                "wikipedia_text": doc.get("wikipedia_text")[:300] + "...", 
                "city_name": doc.get("city_name")[0], 
                "url": doc.get("url"),
                "highlights": found_highlight
            })
        
        return {
            "status": "OK",
            "results": temp_docs
        }
    except requests.HTTPError as e:
        print(f"Error {e.response.status_code}: {e.response.text}")
        return {
            "status": "ERROR",
            "results": False
        }

# expected params - search, offset, limit
@app.route('/semantic-query', methods=["GET"])
def search_solr():
    args = request.args
    search_query = args.get("search")
    limit = args.get("limit") or 10
    offset = args.get("offset") or 0
    
    if(search_query == None):
        return make_response(jsonify({"message":"MISSING_PARAMETERS"}), status=400)
    
    result = query_solr(search_text=search_query, limit=limit, offset=offset) 
    
    if(result.get("status") == "ERROR"):
        res_data = jsonify(result)
        return make_response(res_data, 400)

    return jsonify(result)

########################################################

if __name__ == "__main__":
    if(os.environ["BACKEND_DOCKER_PORT"]):
        # PRODUCTION
        from waitress import serve
        print("STARTING PRODUCTION SERVER on port 127.0.0.1:" + os.environ["BACKEND_DOCKER_PORT"] + "\n\n----------------------------------\n\n")
        serve(app, host="0.0.0.0", port=os.environ["BACKEND_DOCKER_PORT"] or 5000)
    else:
        # DEVELOPMENT
        app.run(debug=True)

    # Example url = localhost:5000/semantic-query?limit=10&offset=10&search=top%20universities%20in%20united%20kingdom%20biology%20courses
    