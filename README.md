# ToDo-Manager

The ToDo-Management App is a web-based application designed to simplify project management tasks and facilitate collaboration among team members. With features like project creation, todo management, and export summary as Gist, this app provides a comprehensive solution for managing projects efficiently.

## Features

- **User Authentication**: Secure login functionality ensures that users can access their projects securely.
- **Project Management**:
  - Create new projects with a unique identifier, title, and creation date.
  - List all projects on the home page for easy access.
  - View detailed project information including title and list of todos.
- **Todo Management**:
  - Add new todos to a project with a unique identifier, description, status, creation date, and last updated date.
  - Edit existing todos to update their status.
  - Mark todos as complete or pending.
- **Export Summary as Gist**:
  - Generate project summary in markdown format.
  - Export the summary as a secret gist on GitHub with the following format:
    - File name: <Project title>.md
    - Project title as heading.
    - Summary: <No. of completed todos> / <No. of total todos> completed.
    - Section 1: Task list of pending todos (with an open checkbox).
    - Section 2: Task list of completed todos (with a checked box).
   
## Technologies Used
-  Backend: Node js , Express js
- Frontend: React js
- Database: MySQL
