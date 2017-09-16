import psycopg2
import csv

database = psycopg2.connect (database = "geodevdb", user="geodevdb", password="admin123", host="127.0.0.1", port="5432")

def create_popular_name ():

  delete = """drop table if exists public.popular_name"""
  print (delete)
  cursor = database.cursor()
  mydata = cursor.execute(delete)
  cursor.execute("""create table public.popular_name
                      (
                      id serial primary key,
                      state varchar(255),
                      sex varchar(255),
                      year varchar(255),
                      name varchar(255),
                      occurrences varchar(255)
                      );""")
  print "table created successfully"
  database.commit()
  cursor.close()

def insert_popular_names_for ( state ):

  path_root = "/mnt/workspace_2TBSG/programming_workspace/maps/names-data/namesbystate/"

  csv_data = csv.reader(file(path_root + state + ".TXT"))

  cursor = database.cursor()

  for row in csv_data:
    print row
    cursor.execute("INSERT INTO public.popular_name (state, sex, year, name, occurrences) VALUES (%s,%s,%s,%s,%s)", row)

  database.commit()
  cursor.close()

#---------------------------------------------

create_popular_name()

states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

#states = ["AL", "AK"]

for state in states:
    insert_popular_names_for(state)

database.close()
print "csv data imported"
