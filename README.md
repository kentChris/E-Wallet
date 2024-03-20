PreRequesit:
Install: - nodejs v20.4.0
         - nest v10.3.2
         - mysql server

Step:
git clone from https://github.com/kentChris/E-Wallet

type "npm install" in terminal

create .env file with field of (can change accordingly)
    - PORT = 3000
    - MYSQL_USERNAME = 'root'
    - MYSQL_PASSWORD = ''
    - MYSQL_DATABASE = 'julo'
    - JWT_SECRET = 'bXlfc2VjcmV0X2tleQ=='

for the first run. change "app.module.ts (line 26: synchronize: false,)" to true (synchronize: false) this way we dont need to create the table manually.

Notes: change back to false after running the second time

type "npm run start:dev" in terminal
