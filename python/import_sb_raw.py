import psycopg2
import requests
import json
import csv

database = psycopg2.connect (database = "geodevdb", user="geodevdb", password="admin123", host="127.0.0.1", port="5432")

def create_starbucks_raw_table ():
    delete = """drop table if exists public.sb_raw"""
    print (delete)
    cursor = database.cursor()
    mydata = cursor.execute(delete)
    cursor.execute("""create table public.sb_raw
                      (
                        open_date date,
                        address varchar(500)
                      )
                      WITH (
                        OIDS=FALSE
                      );
                      ALTER TABLE public.occurrence OWNER TO geodevdb;""")

    print("table created successfully")
    database.commit()

def copy_piped_data_to_starbucks_raw ():

    cursor = database.cursor()

    cursor.execute("""copy sb_raw from '/mnt/workspace_2TBSG/programming_workspace/maps/starbucks-map/starbucks_data/sb_v3.txt' DELIMITER '|' CSV HEADER;""")

    database.commit()
    cursor.close()
    print("csv data imported")

#----------------------------------------------
create_starbucks_raw_table ()
copy_piped_data_to_starbucks_raw ()
