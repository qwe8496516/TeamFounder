# TeamFounder Project

This is a full-stack project with separated frontend and backend. The frontend is built with React.js + Vite, and the backend uses Spring Boot.

## Prerequisites

- Node.js (Recommended v18.x or higher)
- Java JDK 17 or higher
- Maven 3.8.x or higher
- Git
- MySQL 

## Project Structure

```
TeamFounder/
├── frontend/        # Frontend project
└── backend/         # Backend project
```

## Environment Setup

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend service will run at http://localhost:5173

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file in the backend directory with the following content:
```env
DB_URL=jdbc:mysql://localhost:3306/your_dbname
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

3. Install dependencies using Maven:
```bash
mvn clean install
```

4. Start the backend service:
```bash
mvn spring-boot:run
```

The backend service will run at http://localhost:8080

## Database Setup

1. Create a MySQL database 
2. Update the `.env` file with your database credentials
3. The backend will automatically create necessary tables on startup

## Recommended Development Tools

- IDE: IntelliJ IDEA or VSCode
- Database Tools: MYSQL
- API Testing Tools: Postman & Swagger UI

## Important Notes

1. Ensure all required dependencies are installed
2. Install all dependencies before first run
3. If you encounter port conflicts, you can modify the port numbers in the configuration files
4. Make sure to keep your `.env` file secure and never commit it to version control
5. The `.env` file should be added to `.gitignore`