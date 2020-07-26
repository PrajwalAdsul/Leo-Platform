#!/usr/bin/env python3

from os import getenv

from dotenv import load_dotenv
from pymongo import MongoClient


def new_connection(collection):
    """
    Returns a connection to the mongo collection.
    """
    load_dotenv()
    host = getenv("HOST")
    username = getenv("USERNAME")
    password = getenv("PASSWORD")
    database = getenv("DATABASE")
    client = MongoClient(host, serverSelectionTimeoutMS=6000)
    data_base = client[database]
    if data_base.authenticate(username, password, mechanism="SCRAM-SHA-1"):
        return data_base[collection]
    return None
