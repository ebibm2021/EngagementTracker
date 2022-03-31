from configparser import ConfigParser
import os


# def config(filename='database.ini', section='postgresql'):
#     # create a parser
#     parser = ConfigParser()
#     # read config file
#     parser.read(filename)

#     # get section, default to postgresql
#     db = {}
#     if parser.has_section(section):
#         params = parser.items(section)
#         for param in params:
#             db[param[0]] = param[1]
#     else:
#         raise Exception('Section {0} not found in the {1} file'.format(section, filename))

#     return db

def config():
    conf = {}
    conf["host"]=os.environ.get("host")
    conf["database"]=os.environ.get("database")
    conf["user"]=os.environ.get("user")
    conf["password"]=os.environ.get("password")
    conf["port"]=os.environ.get("port")
    return conf