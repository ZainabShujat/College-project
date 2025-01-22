# College-mini-project
# TEsting the quality of medicines 

A detailed web-based application that educates users about the process of medicine testing, its importance, and provides an analysis of 20 tested medicines. The platform highlights how the quality of medicines varies by brand, helping users make informed decisions.

---

## Features

- User and Admin role-based login system.
- Frontend with multiple pages (Home, About, Contact, Registration, etc.).
- Backend API connected to MySQL for database operations.

---

## Technologies Used

### Frontend

- HTML, CSS, JavaScript

### Backend

- Node.js

### Database

- MySQL

---

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/): For running the backend and installing dependencies.
- [MySQL](https://www.mysql.com/): For the database.

### Steps

1. **Clone the repository**:

   ```bash
   git clone [repository_url]
   cd [project_directory]
   ```

2. **Install dependencies**:
   Navigate to the backend folder (if separated) and run:

   ```bash
   npm install
   ```

3. **Set up the environment variables**:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=yourdatabasename
     ```

4. **Set up the database**:

   - Import the provided `schema.sql` file into your MySQL instance:
     ```bash
     mysql -u [username] -p [database_name] < schema.sql
     ```

5. **Run the backend server**:

   ```bash
   node server.js
   ```

   - The backend will run at `http://localhost:5000` (or as configured).

6. **Access the application**:
   Open the `landingpagebeforelogin.html` in your browser to start interacting with the app.

---

## Folder Structure

```
project-root/
|-- model/
|   |-- admin.js       # Admin-related database operations
|   |-- user.js        # User-related database operations
|
|-- node_modules/      # Node.js dependencies
|-- public/            # Frontend static files (if any)
|-- .env               # Environment variables (ignored in Git)
|-- .gitignore         # Git ignore rules
|-- about.html         # About page
|-- contact.html       # Contact page
|-- homepage.html      # Main homepage
|-- landingpagebeforelogin.html  # Landing page for unauthenticated users
|-- loginpage.html     # Login page
|-- register.html      # Registration page
|-- server.js          # Backend server file
|-- package.json       # Node.js configuration file
```

---

## API Endpoints (Optional Section)

Here are the backend API endpoints (if applicable):

### User Authentication

1. **Register**

   - URL: `/api/register`
   - Method: `POST`
   - Body:
     ```json
     {
       "username": "example",
       "password": "example123",
       "email": "example@example.com"
     }
     ```

2. **Login**

   - URL: `/api/login`
   - Method: `POST`
   - Body:
     ```json
     {
       "username": "example",
       "password": "example123"
     }
     ```

### User Profile

1. **Get User Info**
   - URL: `/api/user`
   - Method: `GET`

---

## Notes

- Ensure that the MySQL server is running before starting the backend.
- The frontend is static; it communicates with the backend via configured API endpoints.
- The `.env` file should never be committed to GitHub.

---

## Contact

For any issues or questions, contact:

- Zainab shujat

