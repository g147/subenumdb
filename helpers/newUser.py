import requests
import json

user = 'glat'
password = 'iwonttell'
admin = 'false'
firstname = 'ayush'
lastname = 'singh'
endpoint = 'http://localhost:3000/users/register'
data = {'username': user, 'password': password, 'firstname':firstname, 'lastname':lastname, 'admin':admin}

response = requests.post(endpoint, data=data)
print(json.dumps(response.json(), indent=3))
