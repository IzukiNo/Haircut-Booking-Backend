# Haircut-Booking-Backend

Project cho Nhập Môn Công Nghệ Phần Mềm

## Key Features & Benefits

*   **User Authentication:** Secure user registration and login functionality.
*   **Appointment Management:** Create, cancel, and manage haircut appointments.
*   **Branch Handling:** Manage multiple branches with associated details.
*   **Service Management:** Define and manage various haircut services.
*   **Review System:** Allow users to submit reviews for services.

### Languages

*   JavaScript

### Tools & Technologies

*   Node.js
*   Express.js
*   Mongoose
*   dotenv
*   cors

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:**  (v14 or higher recommended) - [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Node Package Manager) - Usually comes with Node.js installation.
*   **MongoDB:** Ensure you have a MongoDB instance running or accessible.  You can use MongoDB Atlas (cloud-based) or install it locally. - [https://www.mongodb.com/](https://www.mongodb.com/)

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/IzukiNo/Haircut-Booking-Backend.git
    cd Haircut-Booking-Backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    *   Create a `.env` file in the root directory of the project.
    *   Add the following environment variables to the `.env` file:

        ```
        PORT=3000
        MONGODB_URI=<Your MongoDB Connection URI>
        JWT_SECRET=<Your Secret Key for JWT>
        ```

        Replace `<Your MongoDB Connection URI>` with the connection string to your MongoDB database.
        Replace `<Your Secret Key for JWT>` with a secure, randomly generated secret key.

4.  **Run the application:**

    ```bash
    npm start
    ```

    or

    ```bash
    node app.js
    ```

    The server should now be running on `http://localhost:3000`

## Configuration Options

*   **PORT:**  The port on which the server listens (default: 3000). Configured in the `.env` file.
*   **MONGODB_URI:** The connection string to the MongoDB database. Configured in the `.env` file.
*   **JWT_SECRET:** A secret key used for signing JSON Web Tokens (JWTs). Configured in the `.env` file.  This should be a strong, randomly generated string.
