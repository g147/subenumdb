import requests

user = 'glat'
password = 'iwonttell'
admin = 'false'
endpoint = 'http://localhost:3000/users/register'
data = {'username': user, 'password': password, 'admin':admin}

response = requests.post(endpoint, data=data)
print(response.json())
