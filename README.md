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
