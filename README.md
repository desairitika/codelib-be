# CodeLib Backend - API Server

A robust Node.js/Express backend application for a code library platform with user authentication, problem management, and community features.

## Features

- ✅ **User Authentication** - JWT-based with rate limiting
- ✅ **Security** - Input validation, sanitization, token blacklist
- ✅ **Role-based Access** - Admin and user roles
- ✅ **Problem Management** - Create, read, update problems
- ✅ **Solutions & Comments** - Community-driven solutions
- ✅ **Support Tickets** - User support system
- ✅ **Email Notifications** - OTP and password reset
- ✅ **API Documentation** - Swagger UI
- ✅ **Comprehensive Logging** - File-based logging system
- ✅ **Error Handling** - Structured error responses

## Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-lib-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Start the server**
   ```bash
   # Development with nodemon
   npm run mon

   # Production
   npm start
   ```

The server will start on the configured PORT (default: 3001)

## Environment Variables

See `.env.example` for all available configuration options.

**Required variables:**
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port number
- `MONGODB_URI` - MongoDB connection string
- `SECRET_KEY` - JWT secret key
- `GMAIL_USER` - Gmail address for sending emails

> The app uses `dotenv-safe` to ensure all required environment variables defined in `.env.example` are present at startup. Missing any of these will cause the server to exit with an error, preventing misconfiguration.

## API Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:3001/api-docs

> **Client timeout:** the front-end applies a 10‑second timeout to all HTTP requests.  Ensure any route handlers respond within that window or implement streaming/heartbeat logic for long‑running operations, otherwise the client may give up and leave the request hanging.

## Project Structure

> Additional documentation files live under the `docs/` directory. See `docs/` for improvements, deployment checklists, and detailed change logs.


```
src/
├── app.js                 # Express app configuration
├── controllers/           # Route controllers
├── routes/               # Route definitions
├── services/             # Business logic
├── middleware/           # Custom middleware
├── models/              # Mongoose schemas
├── data/                # Data access layer (DAL)
├── utils/               # Utility functions
├── validators/          # Input validators
├── constants/           # Application constants
├── views/              # Pug templates
└── public/             # Static files

config/
├── env.js              # Environment variables
├── db.js               # Database connection
├── validateEnv.js      # Environment validation
└── passport.js         # Passport configuration

logs/                    # Application logs (created at runtime)
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Initiate password reset
- `POST /api/v1/auth/reset-password` - Complete password reset
- `GET /api/v1/auth/logout` - User logout (requires authentication)

### Users
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user account

### Problems
- `GET /api/v1/problems` - List all problems
- `POST /api/v1/problems` - Create new problem
- `GET /api/v1/problems/:id` - Get problem details
- `PUT /api/v1/problems/:id` - Update problem
- `DELETE /api/v1/problems/:id` - Delete problem

### Solutions
- `GET /api/v1/solutions` - List all solutions
- `POST /api/v1/problems/:id/solutions` - Add solution to problem
- `PUT /api/v1/solutions/:id` - Update solution
- `DELETE /api/v1/solutions/:id` - Delete solution

### Comments
- `GET /api/v1/comments` - List all comments
- `POST /api/v1/solutions/:id/comments` - Add comment to solution
- `PUT /api/v1/comments/:id` - Update comment
- `DELETE /api/v1/comments/:id` - Delete comment

### Support
- `GET /api/v1/support` - List support tickets
- `POST /api/v1/support` - Create support ticket

### Public Constants Endpoint
- `GET /api/v1/constants` - Retrieve application constants. **This route is intentionally public** and does not require authentication. The front-end uses a `publicGet` helper which attaches `skipAuth=true` to the request; the server must therefore avoid returning 401 unless the caller genuinely needs to be authenticated.  (Clients running with the normal `http.get` include an `Authorization` header and may still receive 401 if the token is invalid.)
- `POST`, `PUT`, `DELETE` on `/api/v1/constants` remain protected and require a valid JWT.

> ⚠️ If the constants become sensitive, update the front-end to stop using `publicGet` and the server to re‑enable auth on GET.  See the `src/routes/commonRoutes.js` comment for more details.

## Security Features

### Rate Limiting
- Auth endpoints are rate-limited to **5 requests per 15 minutes** per IP
- Returns 429 status when limit is exceeded

### Input Validation & Sanitization
- All user inputs are validated
- XSS prevention through HTML entity encoding
- Email and username format validation

### Authentication
- JWT-based token authentication
- Token blacklist for logout
- Role-based access control

### Error Handling
- Comprehensive error messages
- Proper HTTP status codes
- Secure error responses (no sensitive info in production)

## Logging

Application logs are stored in the `logs/` directory with daily rotation:
- `YYYY-MM-DD-info.log` - Application information
- `YYYY-MM-DD-warn.log` - Warnings
- `YYYY-MM-DD-error.log` - Errors
- `YYYY-MM-DD-debug.log` - Debug information (development only)

View logs:
```bash
tail -f logs/$(date +%Y-%m-%d)-info.log
```

## Development

### Scripts
```bash
# Start with nodemon (auto-reload)
npm run mon

# Start production server
npm start
```

### Code Quality Improvements
See `IMPROVEMENTS.md` for detailed information about:
- Security enhancements
- Code quality improvements
- Bug fixes
- Best practices implemented

## Error Handling

The application uses structured error responses:

```json
{
  "code": 400,
  "success": false,
  "error": "Validation failed",
  "data": {}
}
```

## Testing

### Test Rate Limiting
```bash
# Run multiple login attempts (6th will be rate limited)
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}'
  echo "\nAttempt $i"
done
```

### Test Input Validation
```bash
# Test with invalid email
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"invalid","password":"Test123!"}'
```

## Troubleshooting

### Database Connection Error
```
Error: ECONNREFUSED
```
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### Missing Environment Variables
```
❌ Missing required environment variables: ...
```
- Copy `.env.example` to `.env`
- Fill in all required values

### Port Already in Use
```
Error: EADDRINUSE
```
- Change PORT in .env
- Or kill process using the port

## Contributing

1. Follow the existing code structure
2. Add validation for all inputs
3. Log important operations
4. Add error handling
5. Update documentation

## Performance Considerations

- Database indexes on frequently queried fields
- Connection pooling (MongoDB)
- Request logging for monitoring
- Rate limiting to prevent abuse
- Input validation to reduce invalid requests

## License

Private Project

## Support

For issues and questions, please create a support ticket through the application.

---

**Last Updated:** 2026-02-27
**Status:** Production Ready
**Version:** 0.1.0
CodeLib - Backend
==================

Developer setup
---------------

1. Copy the example env file and fill real values (do NOT commit `.env`):

```powershell
copy .env.example .env
notepad .env
```

2. Optional per-developer overrides

- Create `.env.local` for machine-specific overrides (this file should remain local and is ignored by `.gitignore`).
- Use environment-specific files for reproducible configurations: `.env.development`, `.env.test`, `.env.production`.

Loading priority (applied in this order):

1. `.env` (base)
2. `.env.<NODE_ENV>` (e.g. `.env.production`) — overrides base
3. `.env.local` — overrides the above and is intended for local developer secrets

Note: In production prefer a secrets manager and set env vars through the infrastructure (Docker secrets, CI/CD, Kubernetes, etc.).

Run the server
--------------

```powershell
npm install
npm run start
```

Set `NODE_ENV` for environment-specific loading:

```powershell
#$env:NODE_ENV='production'; npm run start
```

Further improvements
--------------------

- Consider using `dotenv-safe` or `dotenv-flow` for stricter environment validation and deterministic loading.
- Use a secrets manager for production deployments.

 
