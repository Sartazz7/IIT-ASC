# IIT ASC

A plaform to manage all your academic activities. Get all the information about courses, departments and instructors. Register or deregister for any running courses and view all the status of all your previous courses too.

## Assignment 4

This is a part of lab 4 of the Database and Information Systems course CS 387. This is the [link](https://docs.google.com/document/d/1Nyfxgeh0ZIxUICmX9Qq3v9JfCLjH0NjrCL_nalfbGYM/edit) to the problem statement.

## Quick Start

- Clone this repo into IITASC folder
- Go to backend directory and create a config.txt file.
- Copy the config.txt.template file variables and put all the variable values.
- Run `npm install` to install all the packages.
- Run `npm run server`. Backend will start running at localhost port 5000.
- Go to the frontend directory and run `npm install` then `npm start`. The frontend will be up on port 3000.
- You can go to the link `http://localhost:3000/` and use the website.

## Key Features

### React

- Created custom components for react and used them populated with the data fetched from the server.
- The components were: InfoComponent, TabsComponent, TableComponent and SubTableComponent
- This reduced the repetitive code in react side and completed the frontend with minimal number of files and lines of code.

### Node

- All the query made to database is in services folder with proper exception handling.
- Made a authorize middleware which does the job of authorization for a particular request.
- Middlewares studentAuthorize and instructorAuthorize are written for student's and instructor's authorization respectively.
- Created a error middileware which formats the thrown error from the server and sends it in the response with error stack info.

## References

- Used sessions for authorization - [link](https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/)
- Used react template from the bloomui - [link](https://bloomui.com/product/tokyo-free-black-react-javascript-material-ui-admin-dashboard/)
- Used node-postgres module to connect and query to database - [link](https://node-postgres.com/)
- Used some insights from our previous projects.
