# Axa API - NodeJS Asessment
## Create a Middleware for a REST API

1. Login to the app and save client data.
2. Get policies from clients.
3. Get policy linked to a clientId.
4. Get policy linked to a policyId.
5. Get clients data.
6. Get client data linked to client id.

## Geting started

1. Clone the repo
```
 $ git clone https://github.com/edalandete/axa-api-rest-node-assesment.git
```
2. Install dependencies
```
 npm install
```
3. Set environment variables following the example in ```.env.example```.
4. Run the server 
```
 $ npm start
```
5. Run the server in debug
```
 $ npm run debug
```

## Test
1. Run test
```
 $ npm test
 ```
2. See the coverage file in folder ```lcov_report```

## Endpoints
If you need more info, you can use the postman collection uploaded in the root of the project called ``` axa-assesment.postman_collection.json ```
### Authenticate user
1. POST /login

  Request
```
{
    "email": "merrillblankenship@quotezart.com",
    "password": "Axa12345"
}
```
  Response
  ```
   - 200: OK
   - 400: Bad Request
   - 401: Unauthorized
  ```
  
### Policies
1. GET /policies

  Request
  ```
  Query Params
   - limit: 10 by default
  Headers
   - type, token
   ```
   Response
   ```
   200: OK
   401: Unauthorized
   ```
2. GET /policies:id

 Request
  ```
  Query Params
   - limit: 10 by default
  Params
   - id
  Headers
   - type, token
   ```
   Response
   ```
   200: OK
   403: Forbidden if a client with user role tries to get data from a policy that doesn't belong to him
   401: Unauthorized
   ```
### Clients
1. GET /clients

Request
 ```
  Query Params
   - limit: 10 by default
   - page
   - name
  Headers
   - type, token
   ```
   Response
   ```
   200: OK
   401: Unauthorized
   ```
2. GET /clients:id

Request
 ```
  Params
   - id
  Headers
   - type, token
   ```
   Response
   ```
   200: OK
   401: Unauthorized
   403: Forbidden
   404: Not found
   ```
5. GET /clients:id/policies

Request
 ```
  Params
   - id
  Headers
   - type, token
   ```
   Response
   ```
   200: OK
   401: Unauthorized
   403: Forbidden
   404: Not found
   ```
   
## Architecture

### Project folders organization
The project is organized in a folder structure so it can be easy to find all the files related to an endpoint and every file has his own purpose. Also If we want to use one endpoint for another middleware or api, disengage them is very fast and easy.

### Testing
JEST testing library: it's very fast and very intuitive to use. You don't need any extra libraries to mock modules, with jest is already included. Also allows you to see the status of your test with a simple --watch parameter.
--collect-coverage: by doing so, you have an HTML interface that gives you a fast snapshot of your tests and also you can see what parts of your code it's not tested yet.

### AXIOS
AXIOS has many advantatges over Fetch integrated in JS. To sum up, has a wide browser support over conventional fetch and also has the data property that returns a JSON object and can intercept HTTP Requests.

### PassportJS
It's very flexible and it's documentation it's very intuitive. Gives you a complete set of authentications and you can configure them very fast. 

### Other Dependencies
 - Nodemon: every time you save, the server is restarted automatically so you can develop faster
 - Morgan: it's very flexible and gives you information of each call you make to the API
 - CRON: a simple way to schedule tasks and avoid token expiration
