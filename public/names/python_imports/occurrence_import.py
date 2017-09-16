import psycopg2
import requests
import json
import csv

database = psycopg2.connect (database = "geodevdb", user="geodevdb", password="admin123", host="127.0.0.1", port="5432")

i = 1

def create_occurrence_table ():
    delete = """drop table if exists public.occurrence"""
    print (delete)
    cursor = database.cursor()
    mydata = cursor.execute(delete)
    cursor.execute("""create table public.occurrence
                      (
                        name varchar(255),
                        sex varchar(2),
                        occurrences text
                      )
                      WITH (
                        OIDS=FALSE
                      );
                      ALTER TABLE public.occurrence OWNER TO geodevdb;""")

    print("table created successfully")
    database.commit()

def create_piped_data ( name, sex ):
    delim = "|"
    piped_data = "name,sex,occurrences"

    url = "http://127.0.0.1:8643/popular_name/d/" + str(name) + "/" + str(sex)
    print(url)
    the_json = requests.get(url).json()
    if str(the_json) != str('[]'):
        line = str(name) + delim + str(sex) + delim + str(the_json)
        print(line)
        piped_data = piped_data + "\n" + line

    results = open("/tmp/occurrence_import.txt", "w")
    results.write(piped_data)
    results.close()

def copy_piped_data_to_occurrence_table ():

    cursor = database.cursor()

    cursor.execute("""copy occurrence from '/tmp/occurrence_import.txt' DELIMITER '|' CSV HEADER;""")
    cursor.execute("""update occurrence set occurrences = replace(occurrences, '''', '"' );""")
    cursor.execute("""update occurrence set occurrences = replace(occurrences, ' ', '' );""")

    database.commit()
    cursor.close()
    print("csv data imported")

def populate (name, sex):
    create_piped_data (name, sex)
    copy_piped_data_to_occurrence_table ()

#----------------------------------------------

create_occurrence_table ()

females = ["Mary","Patricia","Elizabeth","Jennifer","Linda","Barbara","Margaret","Susan","Dorothy","Jessica","Sarah","Nancy","Betty","Karen","Lisa","Helen","Sandra","Ashley","Kimberly","Donna","Emily","Carol","Michelle","Amanda","Melissa","Laura","Deborah","Stephanie","Anna","Rebecca","Ruth","Sharon","Cynthia","Kathleen","Shirley","Amy","Angela","Virginia","Catherine","Brenda","Katherine","Pamela","Nicole","Christine","Samantha","Emma","Rachel","Janet","Carolyn","Debra","Frances","Maria","Evelyn","Heather","Diane","Julie","Joyce","Martha","Alice","Joan","Victoria","Kelly","Christina","Lauren","Marie","Ann","Doris","Judith","Jean","Cheryl","Megan","Kathryn","Andrea","Jacqueline","Rose","Grace","Julia","Sara","Hannah","Olivia","Gloria","Teresa","Janice","Mildred","Theresa","Judy","Beverly","Denise","Marilyn","Amber","Madison","Danielle","Lillian","Brittany","Jane","Diana","Abigail","Lori","Natalie","Tiffany"]

females = ["Jennifer"]
sex = "F"
for name in females:
    populate(name, sex)

# males = ["James","John","Robert","Michael","William","David","Richard","Joseph","Charles","Thomas","Christopher","Daniel","Matthew","Anthony","Donald","Paul","Mark","George","Steven","Kenneth","Andrew","Edward","Joshua","Kevin","Brian","Ronald","Timothy","Jason","Jeffrey","Ryan","Gary","Jacob","Nicholas","Eric","Stephen","Jonathan","Frank","Larry","Scott","Justin","Brandon","Raymond","Samuel","Benjamin","Gregory","Patrick","Jack","Alexander","Dennis","Jerry","Henry","Tyler","Aaron","Walter","Peter","Douglas","Jose","Adam","Nathan","Zachary","Harold","Carl","Arthur","Kyle","Gerald","Albert","Lawrence","Roger","Keith","Jeremy","Joe","Terry","Sean","Willie","Christian","Ethan","Austin","Jesse","Ralph","Billy","Bruce","Roy","Bryan","Louis","Eugene","Jordan","Harry","Noah","Dylan","Wayne","Russell","Alan","Juan","Philip","Vincent","Randy","Gabriel","Howard","Bobby","Johnny"]
#
# sex = "M"
# for name in males:
#     populate(sex, name, min_year, max_year)

database.close()
