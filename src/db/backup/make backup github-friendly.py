import base64
import json
from os import listdir
from os.path import isfile, join

select = input("Function (scan/read <file(s)>):")

if select.split(' ')[0] == "scan":
    with open(select.split(' ')[1], "rb") as file:
        encoded_string = base64.b64encode(file.read()).decode("utf-8")
        n = 98000000
        out = [encoded_string[i:i+n] for i in range(0, len(encoded_string), n)]

        for i, el in enumerate(out):
            with open(select.split(' ')[1]+"_base64_"+str(i)+".json", "w") as f:
                f.write('{"name":"'+select.split(' ')[1]+'","number":"'+str(i)+'","file":"'+el+'"}')

elif select.split(' ')[0]== "read":
    onlyfiles = [f for f in listdir(".") if isfile(join(".", f))]
    output=""
    
    for i, file in enumerate(onlyfiles):
        if select.split(' ')[1]+"_base64" in file:
            print(file)
            with open(file, "r") as f:
                _in = f.read()
                data = json.loads(_in)
                #print(data)
                output += data["file"]
                
    with open(select.split(' ')[1], "wb") as f:
        output=base64.b64decode(output)
        f.write(output)
                
