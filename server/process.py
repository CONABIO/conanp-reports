import csv
import json

def helper(name, anp_object, row, header):
    year_2008 = anp_object.get(name, [])
    year_2008.append(row[header.index(name)])
    anp_object.update({name: year_2008})
    return anp_object

data = {}

with open('2018-07-27_idoneidad_anp.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    header = next(reader)
    print(header)
    for row in reader:
        name = row[header.index("anp")]
        anp_object = data.get(name, {})
        anp_object = helper("anio_2008", anp_object, row, header)
        anp_object = helper("anio_2009", anp_object, row, header)
        anp_object = helper("anio_2010", anp_object, row, header)
        anp_object = helper("anio_2011", anp_object, row, header)
        anp_object = helper("anio_2012", anp_object, row, header)
        anp_object = helper("anio_2013", anp_object, row, header)
        anp_object = helper("anio_2014", anp_object, row, header)
        data.update({name: anp_object})
    
    with open('data_anps.json', 'w') as outfile:

        just_one = [{"id_07": "74850",
                     "nombre": "Bonampak",
                     "anp":
                     data["anp_terrestres_2017_NOMBRE_Bonampak"],
                     "ring":
                     data["anp_terrestres_2017_NOMBRE_Bonampak_ring"]}]


        json.dump(just_one, outfile)
    