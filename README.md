# Soma Project Setup

[Entity relation diagram](https://drive.google.com/file/d/1Y6G4o-uO82HyvormPc28FqTLDdJbuopT/view?usp=drive_link)
![Entity relation diagram](docs/soma.webp)

This guide will help you set up both the API and client servers for the Soma project.

## API Server Setup

### 1. Clone the API Server Repository

```bash
git clone https://github.com/djimrangarleita/soma.git
```

- The root folder will be named `soma`.

### 2. Configure Environment Variables

- Copy the `.env` file into `.env.local`:

```bash
cp .env .env.local
```

- Update `.env.local` with the necessary values.

### 3. Start Redis and PostgreSQL Containers

Ensure that Docker is installed. Run the following command to start Redis and PostgreSQL containers:

```bash
./bin/start.sh
```

- **Note:** If Docker is not installed, either install it or set up Redis and PostgreSQL manually on your local machine.

### 4. Install Project Dependencies

Install the required dependencies for the project:

```bash
npm install
```

### 5. Load Fixture Data

Run the following command to populate the database with fixture data:

```bash
npm run fixtures:load
```

### 6. Start the API Server

Run the server in development mode:

```bash
npm run start:dev
```

- The API server will be available at: `http://localhost:3000/api`.

---

## Client Server Setup

### 1. Clone the Client Repository

From the same folder containing the `soma` directory, clone the client repository:

```bash
git clone https://github.com/djimrangarleita/soma-client.git
```

### 2. Install Client Dependencies

Navigate to the client directory and install the required dependencies:

```bash
npm install
```

### 3. Ensure API Server is Running

Make sure the API server is running at `http://localhost:3000/api`.

### 4. Run the Client

Access the client by visiting the URL provided in the terminal once the client server starts.

---

Enjoy the application!

---

This README provides a streamlined setup process for developers who want to get the Soma API and client servers up and running quickly.
