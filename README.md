# FlyBook

FlyBook is a simple e-commerce web application for browsing and purchasing books online. Built with Node.js, Express, and EJS, it demonstrates user authentication, shopping cart functionality, and order management using an in-memory database. This project is intended for educational purposes and UI prototyping.

## Features

- User registration and login
- Shopping cart (add/remove books)
- Checkout and order summary
- Book search and filtering
- Responsive UI with Bootstrap and custom CSS
- In-memory "database" for users and books


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/Lmar-O/FlyBook
    cd FlyBook
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Start the server:
    ```
    node server.js
    ```

4. Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Usage

- **Sign Up:** Create a new user account.
- **Login:** Log in with your credentials.
- **Browse Books:** Search and filter books, add them to your cart.
- **Cart:** View and manage your shopping cart.
- **Checkout:** Place an order.

## Notes

- All data is stored in memory and will reset when the server restarts.
- Passwords are stored in plain text for demonstration only. **Do not use this code in production.**
- The UI uses Bootstrap and custom CSS.
