import requests

user = 'g147'
password = 'iwonttell'
endpoint = 'http://localhost:3000/users/login'
data = {'username': user, 'password': password}
domain = "youla.ru"

response = requests.post(endpoint, data=data)
token = response.json()['token']

endpoint = 'http://localhost:3000/domains'
data = {'token': token, 'domain':domain}

response = requests.post(endpoint, data=data)
print(response)