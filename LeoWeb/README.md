# Leo Web

Leo Web is a web-portal for Users and Designated Responsible Operators.

## Installation

For backend node server

```bash
cd LeoHelp/api
# Install the required dependencies
npm install
# Run the server
nodemon server.js
```

For frontend react app

```bash
cd LeoHelp/frontend
# Install the required dependencies
npm install
# Run the server
npm start
```

## Features

- About Leo Platform
- User :
  - Update personal information
  - Request for help
  - View latest crime news
- DRO :
  - View users who have requested for help
  - View/Modify crime news

## API Documentation

**Get OTP:**
Returns an OTP

- **URL:** /otp
- **Method:** `POST`
- **Data Params:**:
  - `user_name=[string]`
  - `email=[string]`
- **Success Response:**
  - **Code:** 200
    **Content:** `{"msg" : "otp sent successfully"}`
- **Error Response:**
  - **Code:** 400
    **Content:** `{"msg" : error }`

**Validate OTP:**
Validate the given OTP

- **URL:** /validate/otp
- **Method:** `POST`
- **Data Params:**
- `user_name=[string]`
   `email=[string]`
   `otp=[string]`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{Success : 1}`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{Success : 0 }`

**Add User:**
Add a new user

- **URL:** /user/add
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `password=[string]`
  - `name=[string]`
  - `phone=[string]`
  - `email=[string]`
- **Success Response:**
  - **Code:** 200
    **Content:** `{user}`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
    **Content:** `{"msg" : "incorrect OTP or OTP expired"}`
    OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{"msg" : "username already used"}`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{"msg" : "bad username or password \n phone number should be 10 in length \n no field can be empty\n"}`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{"msg" : error}`

**Login User:**
Login user if valid credentials

- **URL:** /user/login
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `password=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{user}`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "msg": " login unsuccessfull" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{"msg" : error}`

**Get User Information:**
Get all information of the user

- **URL:** /user/get
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `token=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{user}`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{"msg" : "No user with given user_name"}`

**User exists:**
Check if user with given user_name exists

- **URL:** /user/exists
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{Success : 1}`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{Success : 0 }`

**Get Emergency Contacts:**
Get emergency contacts of user

- **URL:** /user/emergency_contacts
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `token=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{user.emergency_contacts}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

**Update Emergency Contacts:**
Update emergency contacts of user

- **URL:** /user/update/emergency_contacts
- **Method:** `PUT`
- **Data Params:**
- `user_name=[string]`
- `token=[string]`
   `emergency_contacts=[string][5]`- **Success Response:**
  - **Code:** 200
  - **Content:* `{user}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

**Mark trouble:**
Mark user in trouble

- **URL:** /user/mark_trouble
- **Method:** `PUT`
- **Data Params:**
  - `user_name=[string]`
  - `token=[string]`
  - `phone=[string]`
  - `emergency_contacts=[string][5]`
  - `phone=[string]`
  - `latitude=[float]`
  - `longitude=[float]`
  - `type=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{user}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

**Unmark trouble:**
Unmark user from trouble

- **URL:** /user/unmark_trouble
- **Method:** `PUT`
- **Data Params:**
  - `user_name=[string]`
  - `token=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{user}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

**Logout user:**
Logout user

- **URL:** /user/logout
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `token=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{Success : 1}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

**SMS trouble:**
Mark a new user in trouble. Emergency notified via SMS.

- **URL:** /user/sms_trouble
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `area=[string]`
  - `phone=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{Success : 1}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "user not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "msg": error }`

**DRO Login:**
Login for DRO

- **URL:** /dro/login
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `password=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{Success : 1}`
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "msg": "login unsuccessfull" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{"msg" : error}`

**All Users:**
Get info of all users. Accesible only by DRO.

- **URL:** /dro/all_users
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `password=[string]`
  - `token=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{[user]}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "DRO not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

**All Marked Users:**
Get all marked users info. Accesible only by DRO.

- **URL:** /dro/all_marked_users
- **Method:** `POST`
- **Data Params:**
  - `user_name=[string]`
  - `password=[string]`
  - `token=[string]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{[user]}`
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:** `{ "msg": "DRO not authenticated" }`
  OR
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ msg: error }`

## Directory structure

For backend:

```text
├── db.model.js
├── Logo.png
├── package.json
├── package-lock.json
└── server.js
```

For frontend:

```text
Put something here
```

## Deployment

### Heroku

For node backend :

```bash
cd LeoHelp/api
vi package.json
```

Edit the package.json file by adding -

```json
{
  "main": "server.js" //name of the server file
}
```

and

```json
{
  "scripts": {
    "start": "node server.js" // command to run to start the server
  }
}
```

Following that

```bash
git init
heroku login
heroku create APPNAME
git add .
git commit -m "hosting code on heroku"
git push heroku master
```

For react frontend :

```bash
cd LeoHelp/frontend
vi package.json
```

Edit the `package.json` file by adding and save it

```json
"scripts": {
        "start": "node --max_old_space_size=2560 node_modules/.bin/react-scripts start",
        "build": "node --max_old_space_size=2560 node_modules/.bin/react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
}
```

Followed by

```bash
git init
heroku login
heroku create APPNAME
git add .
git commit -m "hosting code on heroku"
git push heroku master

```

## Built With

### Node

- [express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for node.
- [cors](https://www.npmjs.com/package/cors) - Provides a Connect/Express middleware that can be used to enable CORS with various options.
- [bcryptjs](https://www.npmjs.com/package/bcrypt) - Library to help you hash passwords.
- [mongoose](https://mongoosejs.com/docs/) - Object modeling tool designed to work in an asynchronous environment.
- [nodemailer](https://nodemailer.com/about/) - Email module
- [jsrasign](https://kjur.github.io/jsrsasign/api/) - JavaScript cryptographic library

### React

- [Axios](https://www.npmjs.com/package/axios) - Promise based HTTP client
- [react-bootstrap](https://react-bootstrap.github.io/) - Frontend styling framework
