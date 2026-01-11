# Authentication & Authorization Concepts

## 🔐 Authentication vs Authorization

### **Authentication (Who are you?)**

The process of **verifying the identity** of a user. It answers: "Are you who you claim to be?"

**Example:** When you login with email/password, the system authenticates you by:

1. Checking if the email exists in the database
2. Comparing the provided password with the hashed password
3. Issuing a JWT token if credentials are valid

**Implementation:** `authenticate` middleware in `src/middleware/auth.ts`

### **Authorization (What can you do?)**

The process of **verifying permissions**. It answers: "Are you allowed to do this action?"

**Example:** After logging in (authenticated), authorization checks:

- Can you view all users? (Admin only)
- Can you edit this user profile? (Owner or Admin)
- Can you delete users? (Admin only)

**Implementation:** `requireAdmin` and `requireOwnerOrAdmin` middleware

---

## 🔑 How JWT Authentication Works

### 1. **Login Process**

```
User sends credentials (email + password)
    ↓
Server verifies credentials
    ↓
Server generates JWT token
    ↓
Client stores token (localStorage/sessionStorage)
    ↓
Client includes token in subsequent requests
```

### 2. **JWT Token Structure**

```javascript
{
  "userId": 1,
  "email": "admin@suhtech.com",
  "iat": 1736406000,  // Issued at
  "exp": 1737011600   // Expires in 7 days
}
```

### 3. **Authenticated Request Flow**

```
Client → Request with "Authorization: Bearer <token>"
    ↓
authenticate middleware extracts & verifies token
    ↓
Attaches user info to req.user
    ↓
Route handler or next middleware
```

---

## 🛡️ Middleware Chain Examples

### Example 1: Public Route (No auth needed)

```typescript
router.post("/login", loginHandler);
// Anyone can access - no middleware
```

### Example 2: Authenticated Route

```typescript
router.get("/me", authenticate, getCurrentUser);
// Only logged-in users can access
```

### Example 3: Admin-Only Route

```typescript
router.get("/users", authenticate, requireAdmin, getAllUsers);
// Must be authenticated AND admin
```

### Example 4: Owner or Admin Route

```typescript
router.get("/users/:id", authenticate, requireOwnerOrAdmin, getUser);
// User can access their own profile OR admin can access any profile
```

---

## 📋 Available Endpoints

### **Authentication Endpoints** (Public)

- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### **User Endpoints** (Protected)

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Owner or Admin)
- `PUT /api/users/:id` - Update user (Owner or Admin)
- `DELETE /api/users/:id` - Delete user (Admin only)

---

## 🧪 Testing with cURL or Postman

### 1. Login

```bash
curl -X POST http://localhost:4004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@suhtech.com","password":"Admin@123"}'
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "email": "admin@suhtech.com", "admin": true }
  }
}
```

### 2. Access Protected Route

```bash
curl -X GET http://localhost:4004/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Access Own Profile (No admin needed)

```bash
curl -X GET http://localhost:4004/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔒 Security Best Practices Implemented

1. ✅ **Password Hashing** - Uses bcrypt with salt rounds
2. ✅ **JWT Expiration** - Tokens expire after 7 days
3. ✅ **Token Verification** - Validates token on every request
4. ✅ **Active User Check** - Verifies user is active and not deleted
5. ✅ **SQL Injection Prevention** - Uses parameterized queries
6. ✅ **Soft Delete** - Users marked as deleted, not removed from DB
7. ✅ **Admin Self-Protection** - Admins can't delete themselves
8. ✅ **Ownership Validation** - Users can only modify their own data (unless admin)

---

## 🎯 Authorization Levels

### Level 1: **Public** (No authentication)

- Login endpoint
- Health check

### Level 2: **Authenticated** (Any logged-in user)

- View own profile
- Update own profile
- Change own password

### Level 3: **Owner or Admin** (Resource owner or admin)

- View specific user details
- Update specific user details

### Level 4: **Admin Only** (Super user)

- List all users
- Delete users
- Update any user's admin status

---

## 🚀 How to Use

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Login with seeded admin:**

   - Email: `admin@suhtech.com`
   - Password: `Admin@123`

3. **Copy the JWT token from response**

4. **Use token in Authorization header:**

   ```
   Authorization: Bearer <your-token>
   ```

5. **Test different authorization levels**

---

## 🔧 Environment Variables Required

Add to your `.env` file:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
```

**⚠️ IMPORTANT:** Change the JWT_SECRET in production to a strong random string!

---

## 📚 Key Concepts Summary

| Concept              | Explanation                             | Middleware                                   |
| -------------------- | --------------------------------------- | -------------------------------------------- |
| **Authentication**   | Verify who the user is                  | `authenticate`                               |
| **Authorization**    | Verify what user can do                 | `requireAdmin`, `requireOwnerOrAdmin`        |
| **JWT Token**        | Secure way to transmit user identity    | Created in login, verified in `authenticate` |
| **Bearer Token**     | Standard way to pass JWT in HTTP header | `Authorization: Bearer <token>`              |
| **Middleware Chain** | Sequential checks before handler        | `authenticate → requireAdmin → handler`      |
| **Soft Delete**      | Mark as deleted, don't remove           | `is_deleted = true` in database              |
