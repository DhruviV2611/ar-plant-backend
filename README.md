# AR Plant Backend

A Node.js backend for an AR Plant Identification application.

## Recent Fixes

### JSON Parsing Error Resolution

The application has been updated to handle JSON parsing errors gracefully. The following improvements were made:

1. **Enhanced Body Parser Configuration**: Added proper error handling for malformed JSON requests
2. **Improved Auth Middleware**: Fixed Bearer token extraction and added better error handling
3. **Input Validation**: Added comprehensive validation to all endpoints
4. **Error Handling**: Added global error handlers to prevent server crashes

### Key Changes

- **`index.js`**: Added JSON parsing error handling and improved middleware configuration
- **`src/middleWare/authMiddleware.js`**: Fixed Bearer token extraction and added better error handling
- **`src/controllers/plantController.js`**: Added input validation for plant-related endpoints
- **`src/controllers/authController.js`**: Added input validation for authentication endpoints

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Testing

Run the test script to verify the fixes:

```bash
node test-api.js
```

This will test:
- User registration and login
- Plant addition and retrieval
- Malformed JSON handling
- Authentication middleware

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Plants
- `GET /api/plants/getPlants` - Get all plants for authenticated user
- `POST /api/plants/addPlant` - Add a new plant (requires auth)
- `GET /api/plants/:id` - Get specific plant (requires auth)
- `PUT /api/plants/:id` - Update plant (requires auth)
- `DELETE /api/plants/:id` - Delete plant (requires auth)
- `POST /api/plants/identify` - Identify plant from image (requires auth)
- `GET /api/plants/care/:species` - Get care tips (requires auth)
- `GET /api/plants/toxicity/:id` - Get toxicity info (requires auth)
- `POST /api/plants/:plantId/journal` - Add journal entry (requires auth)
- `DELETE /api/plants/:plantId/journal/:entryId` - Delete journal entry (requires auth)

## Error Handling

The application now properly handles:
- Malformed JSON requests
- Invalid authentication tokens
- Missing required fields
- Validation errors
- Server errors

All errors return appropriate HTTP status codes and descriptive error messages.
