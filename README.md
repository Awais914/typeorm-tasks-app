# Tasks app API Build with TypeORM & Express
## Technology

- 🟦 [TypeScript](https://www.typescriptlang.org/)
- ⌨️ [Express](https://expressjs.com/)
- ▲ [TypeORM](https://typeorm.io/)
- ⚡️ [Swagger](https://swagger.io/)
- 🐘 [PostgreSQL](https://www.postgresql.org/)

## Getting Started

Clone the repository and navigate to the folder:

```bash
git clone https://github.com/Awais914/typeorm-tasks-app.git
cd typeorm-tasks-app
```
Create `.env` file in the root folder and set variables as in `.env.example`:
```bash
PORT=5000
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=tasks_app
```
Create Postgres Database name `tasks_app`:
```bash
psql
> CREATE DATABASE tasks_app
```
## Development
```bash
npm install
npm run migration:up
npm start
```
Once the migration is up, an Admin user will create with email: `admin@gmail.com`, password: `admin`
and the server started at PORT 5000![image](https://github.com/Awais914/typeorm-tasks-app/assets/40486209/8ec4d419-58ed-4155-9877-77cdbb95a619)

To check the API Swagger Documentation, go to `http://localhost:5000/api-docs/`, you'll see SwaggerUI:
![image](https://github.com/Awais914/typeorm-tasks-app/assets/40486209/bbac6dbf-61dd-42b8-a3df-14cbcb1fdcc2)

🔓 icon shows you need a JWT token to access the route that you set in the Authorize tab.
