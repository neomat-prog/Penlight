# Penlight - A BlogSpace App 🌟

Ever wanted to express your thoughts and feelings? Well, this app is for you! Penlight is a modern blogging platform built with the latest technologies to help you share your ideas with the world.

## Tech Stack 🛠️

- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) **Node.js** - Backend runtime environment.
- ![React.js](https://img.shields.io/badge/-React.js-61DAFB?logo=react&logoColor=white) **React.js** - Frontend library for building user interfaces.
- ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) **JavaScript** - Programming language for both frontend and backend.
- ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first CSS framework for styling.
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) **MongoDB** - NoSQL database for storing your blog data.

## Features ✨

- **User Authentication**: Sign up, log in, and manage your profile using **JWT (JSON Web Tokens)** for secure authentication.
- **Password Encryption**: Passwords are securely encrypted using **Bcrypt** to ensure user data safety.
- **Create & Edit Blogs**: Write and edit your blogs with a rich text editor for a seamless writing experience.
- **Responsive Design**: Enjoy a seamless experience on any device, from desktops to mobile phones.
- **Search & Filter**: Easily find blogs by keywords, making it simple to discover content.



## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/penlight.git
2. cd ./penlight/Server  | cd ./penlight/blogspace
   ```bash
   npm install
3. Run the front end seamlessly with the backend
   ```bash
   npm run dev
4. Set up environment variables:
   ```bash
   Create a .env file in the Server directory.
   Add the following variables:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000

### Testing 🧪
To ensure the quality of the application, you can run the following tests:
1. Enter the backend directory
   ```bash
   cd ./Server
2. Prerequisites
   ```bash
   npm install --save-dev jest supertest mongodb-memory-server
3. Unit Testing e.g
4. ````bash
   npm run test:register



### License 🔒
This project is licensed under the MIT License - see the LICENSE file for details
   
