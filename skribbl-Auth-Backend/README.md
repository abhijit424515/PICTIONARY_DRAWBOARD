# skribbl Auth Backend

For testing this code,

1. Clone this repository.
2. Create your own .env file with the following environment variables:
   
- PORT 
- MONGO_URI
- DB_NAME 
- SECRET_KEY 
- OTP_EXPIRY_TIME 
- ZOHO_MAIL
- ZOHO_PASSWORD
- HASH_SALT 

1. Run `npm install` to install the required node modules.
2. Run `npm start` to start the server.

---

## Technicals
- For the timestamp objects, we have used `(new Date()).toLocaleString()`