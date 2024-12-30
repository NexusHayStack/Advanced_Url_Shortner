# Advanced URL Shortener

An advanced URL shortening application with features like Google Sign-In, detailed analytics, rate limiting, and secure HTTPS implementation.

---

## Table of Contents

1. [Features](#features)  
2. [Installation](#installation)  
3. [Environment Variables](#environment-variables)  
4. [Usage](#usage)  
5. [Project Structure](#project-structure)  
6. [Contributing](#contributing)  

---

## Features

- **Google Sign-In** for user authentication.  
- **Shorten URLs** and organize them under specific topics.  
- **Detailed Analytics** for individual and overall URLs.  
- **Rate Limiting** to prevent abuse.  
- **Redis Integration** for caching.  
- **HTTPS** for secure connections.  

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed.  
- [Docker](https://www.docker.com/) installed.  

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/advanced-url-shortener.git
   cd advanced-url-shortener
   ```

2. Install dependencies:
   ```bash
   xyz@XYZ MINGW64 ~/path/to/Advanced_Url_Shortner
   npm install
   ```

3. #### Create or signin into your Firebase Account and create a project named "advancedUrlShortner"

  ![Firebase console](<Firebase console - Google Chrome 12_30_2024 6_56_32 PM-1.png>)

4. Then add a Web App

  ![Add Web App from Firebase console](<Firebase console - Google Chrome 12_30_2024 6_57_41 PM.png>)

  Follow the instructions and then copy the firebaseConfig from SDK

  ![Copy firebaseConfig from SDK](<Captures - File Explorer 12_30_2024 7_16_38 PM-1.png>)
  No need to install firebase explicitly but there is no harm in installing it again

  Then just navigate to frontend/app.js, in my project, and open it in your editor
  Then replace MY firebaseConfig with the YOUR copied one
  ![Copy firebaseConfig on frontend/app.js](<app.js - Advanced_Url_Shortner - Visual Studio Code 12_30_2024 7_52_07 PM.png>)

5. Then go to the Project Overview in your Firebase console > Project Settings
  ![Navigate to Project Settings](<app.js - Advanced_Url_Shortner - Visual Studio Code 12_30_2024 7_54_07 PM.png>)

  Navigate to Service Account
  ![Navigate to Service Account](<advancedUrlShortner - Overview - Firebase console - Google Chrome 12_30_2024 7_56_32 PM.png>)

  And generate the key which will download the key in your system
  ![Generate Key](<advancedUrlShortner - Overview - Firebase console - Google Chrome 12_30_2024 7_58_33 PM.png>)
  
  Then run the following command on the root directory
  ```bash
  xyz@XYZ MINGW64 ~/path/to/Advanced_Url_Shortner
   mkdir secret
   touch .env
   ```
   ..then move your downloaded file to the secret directory

  copy the file name with '.json' extensions and paste it onto the FIREBASE_SERVICE_ACCOUNT_KEY variable in .env file
  ```.env
   FIREBASE_SERVICE_ACCOUNT_KEY="./secret/<your-advancedurlshortner-firebase-adminsdk.json>"
   ```
   
6. Create MongoDB Account or signin
  Then create a project
  ![Create Project](<Screenshot 2024-12-30 201005.png>)

  Create your atlasAdmin User profile by entering name and a password then copy the password
  ![Copy password](<● README.md - Advanced_Url_Shortner - Visual Studio Code 12_30_2024 8_20_40 PM.png>)
  Make sure to save it some place (in a text editor or something)

  Connect to your application using Drivers option
  ![Connect Drivers](<Clusters _ Cloud_ MongoDB Cloud - Google Chrome 12_30_2024 8_13_32 PM-1.png>)
  ![Connect Drivers](<● README.md - Advanced_Url_Shortner - Visual Studio Code 12_30_2024 8_13_21 PM.png>)

  Make sure to connect to your current IP Address
  ![IP ADDRESS](<● README.md - Advanced_Url_Shortner - Visual Studio Code 12_30_2024 8_22_58 PM.png>)

  Copy the Connection String
  ![Copy URL](<Project Overview _ Cloud_ MongoDB Cloud - Google Chrome 12_30_2024 8_24_19 PM.png>)

  Paste the copied String in .env file like this:
  ```.env
   MONGODB_URI="mongodb+srv://your-name:<db_password>@cluster0.li6nb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   ```

  Then replace the "<db_password>" with your saved password
  ```.env
   MONGODB_URI="mongodb+srv://your-name:dq6tpg!2G5MNUZ8@cluster0.li6nb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   ```


7. Start Redis and the backend application using Docker Compose:
   ```bash
   xyz@XYZ MINGW64 ~/path/to/Advanced_Url_Shortner
   docker-compose up
   ```

8. Your app should now be running at `http://localhost:5000`.

9.  Start frontend application by running this command in separate root terminal of the project:
   ```bash
   xyz@XYZ MINGW64 ~/path/to/Advanced_Url_Shortner
   cd frontend
   http-server .
   Available on:
  http://192.168.1.6:8080
  http://127.0.0.1:8080
   ```
10. Your frontend app should show some link like:
  ```bash
    Available on:
   http-server .
   Available on:
  http://192.168.1.6:8080
  http://127.0.0.1:8080
   ```
   Ctrl+Click to redirect yourself to the link in your browser

---


## Usage
1. When on the browser 
  Open the "Inspect Mode"> Console
  ![127.0.0.1:8080](<Captures - File Explorer 12_29_2024 4_44_13 PM.png>)

  And Hit the "Sign in with Google" button and type in your google credentials

  Then you will see the following messages in your dev console
  ![Console](<Google Sign-In - Google Chrome 12_29_2024 4_51_37 PM.png>)
  Paste the ID Token as shown in the picture

  Install Postman Desktop or sign in into your Postman account and import the Advanced_URL_Shortner.postman_collection.json into your Postman by clicking on import
  ![Import](<Project Overview _ Cloud_ MongoDB Cloud - Google Chrome 12_30_2024 8_49_56 PM.png>)

  ..then drag and drop the Advanced_URL_Shortner.postman_collection.json file from the project:
  ![Drag & Drop](<New Request - My Workspace 12_30_2024 8_52_01 PM.png>) 

  Make sure to paste the copied ID Token into each request's Header, by Creating variable "Authorization" (If not already) in the Header and pasting the ID Token after "Bearer " like in the picture
  ![Paste ID Token](<New Request - My Workspace 12_30_2024 8_56_17 PM.png>)

  Then it should work allright
  ![Works!!](<● README.md - Advanced_Url_Shortner - Visual Studio Code 12_30_2024 9_00_20 PM.png>)

---

### Access API Documentation

- Swagger API documentation is accessible at `http://localhost:5000/api-docs`.

### Postman Collection

To use the Postman collection, import the file `postman_collection.json` into Postman:

1. Open Postman.
2. Click on **Import**.
3. Select `Advanced_URL_Shortner.postman_collection.json` from this repository.
4. Use the available endpoints for testing.

---

## Project Structure

```plaintext
.
|-- Dockerfile
|-- README.md
|-- docker-compose.yml
|-- firebase-admin.js
|-- frontend
|   |-- app.js
|   `-- index.html
|-- https
|   |-- cert.pem
|   `-- key.pem
|-- index.js
|-- lib
|   |-- database.js
|   |-- handlers.js
|   |-- helpers.js
|   `-- server.js
|-- middleware
|   |-- authMiddleware.js
|   `-- rateLimiter.js
|-- models
|   |-- Url.js
|   `-- Users.js
|-- package-lock.json
|-- package.json
|-- routes
|   |-- shortnerRoutes.js
|   |-- urlAnalyticsRoutes.js
|   `-- userRoutes.js
|-- secret
|   `-- advancedurlshortner-firebase-adminsdk-t8077-1f58304b39.json
`-- swagger-config.js
```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.  
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
---

**Note:** The `Advanced_URL_Shortner.postman_collection.json` file must be placed in the repository root for proper Postman integration. Ensure your `.env` file is correctly configured before running the application.

