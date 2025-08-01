# AR Plant Backend

A Node.js backend API for the AR Plant Identifier application with user authentication and plant management features.

## Features

- User authentication (register/login) with JWT tokens
- Plant management (add, get, update, delete plants)
- Plant identification
- Care tips and toxicity information
- Journal entries for plants
- Secure API endpoints with middleware protection

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd ar-plant-backend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
# Run the setup script
node setup.js
```

Or manually create `.env` with:
```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/ar-plant-app

# JWT Secret for token signing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL for CORS
CLIENT_URL=http://localhost:3000
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/getUserDetails` - Get user details (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Plants
- `GET /api/plants/getPlants` - Get all plants (requires auth)
- `POST /api/plants/addPlant` - Add a new plant (requires auth)
- `GET /api/plants/:id` - Get plant by ID (requires auth)
- `PUT /api/plants/:id` - Update plant (requires auth)
- `DELETE /api/plants/:id` - Delete plant (requires auth)
- `POST /api/plants/identify` - Identify plant (requires auth)
- `GET /api/plants/care/:species` - Get care tips (requires auth)
- `GET /api/plants/toxicity/:id` - Get toxicity info (requires auth)

### Journal
- `POST /api/plants/:plantId/journal` - Add journal entry (requires auth)
- `DELETE /api/plants/:plantId/journal/:entryId` - Delete journal entry (requires auth)

## Testing the API

Run the test script to verify all endpoints:
```bash
node test-api.js
```

## Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Get User Details (with auth)
```bash
curl -X GET http://localhost:5000/api/auth/getUserDetails \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid JSON requests
- Missing required fields
- Authentication failures
- Database connection issues
- Validation errors

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Error message sanitization

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration
   - Verify Authorization header format

3. **CORS Errors**
   - Update CLIENT_URL in .env
   - Check CORS configuration in index.js

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process on port 5000

### Getting Help

If you encounter issues:
1. Check the server logs for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Test with the provided test script
