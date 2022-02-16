from flask import Flask
import analytics

app = Flask(__name__)
app.add_url_rule('/api/filter_groups', view_func=analytics.getFilterGroups, methods=['GET'])
app.add_url_rule('/api/search_analytics', view_func=analytics.searchAnalytics, methods=['POST'])

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
