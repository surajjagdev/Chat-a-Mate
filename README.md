#Chat-a-mate

##Description
Social media application; Homage to Facebook, for developement purposes only

##Installation and Use
Need a code editor,node.js and PostgresSQL installed. Clone source file, then cd into the project. Next run command 'npm install' or 'yarn install'. Create a database in MySQL then make a .env file and add in the parameters listed from config/config.js. Then run 'npm start' or 'yarn start'. The application will start in browser at 'http://localhost:3000/' and server will start at 'http://localhost:3001/' Alternatively to view live site go to: (https://chat-a-mate.herokuapp.com/) The site is slow to load, because a free heroku dyno is used.Also, images can't be displayed on heroku. Will link Amazon S3 soon after to heroku.

##Build Status
This application is building in progress.

##Tech/Framework Used
React, JavaScript, NodeJs, HTML5, CSS3, Axios, MySQL Database, Sequelize ORM

##Features
Authentication and Authorization using combination of bycrpt and passport npm packages. Session storage in browser and database using express-session and mysql-session, respectively.
