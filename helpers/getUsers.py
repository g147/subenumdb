import requests

user = 'g147'
password = 'iwonttell'
endpoint = 'http://localhost:3000/users/login'
data = {'username': user, 'password': password}

response = requests.post(endpoint, data=data)
token = response.json()['token']

endpoint = 'http://localhost:3000/users/'
data = {'token': token}

response = requests.get(endpoint, data=data)
print(response.json())