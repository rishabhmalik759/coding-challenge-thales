# Assessment

Create an application on **NestJS** with CRUD resources for the **users** module.

## Predefined Data

### Users

```ts
[
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 3, name: "Alex Xavier", roles: ["PERSONAL"], groups: ["GROUP_2"] },
  { id: 4, name: "Jarvis Khan", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_2"] },
  { id: 5, name: "Martines Polok", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1"] },
  { id: 6, name: "Gabriela Wozniak", roles: ["VIEWER", "PERSONAL"], groups: ["GROUP_1"] }
]
```

### Groups

```ts
["GROUP_1", "GROUP_2"]
```

### Roles

```ts
["ADMIN", "PERSONAL"]
```

## Endpoints

### POST `/users`

DTO validation:
```ts
name: required, string, maximum characters of 100
roles: required, at least one, should be only from the predefined roles
groups: required, at least one, should be only from the predefined groups
```

### PATCH `/users/:id`

Partially updates a user from the predefined array.

### GET `/users`

Retrieves all users.

### DELETE `/users/:id`

Deletes the user from the predefined array.

### GET `/users/managed/:id`

Retrieves all the users that the user with the given `id` can manage (users with ADMIN role can manage users within their groups).

#### Example Responses:

```http
GET /users/managed/5

# RETURNS
[
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] }
]
```

```http
GET /users/managed/4

# RETURNS
[
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 3, name: "Alex Xavier", roles: ["PERSONAL"], groups: ["GROUP_2"] }
]
```

```http
GET /users/managed/3

# RETURNS
[]
```

---

## BONUS

### Predefined Permissions

```ts
["CREATE", "VIEW", "EDIT", "DELETE"]
```

### Modified Roles

```ts
[
  { name: "Admin", code: "ADMIN", permissions: ["CREATE", "VIEW", "EDIT", "DELETE"] },
  { name: "Personal", code: "PERSONAL", permissions: [] },
  { name: "Viewer", code: "VIEWER", permissions: ["VIEW"] }
]
```

### Permission Guard

Create a permission guard that checks whether the user making the request has the permissions to perform the action based on their roles.

| Permission | Endpoint            |
|------------|---------------------|
| CREATE     | POST `/users`       |
| VIEW       | GET `/users`        |
| EDIT       | PATCH `/users/:id`  |
| DELETE     | DELETE `/users/:id` |

**User ID** is identified from the `Authorization` header.

### Example Requests

#### ✅ Allowed Request (has ADMIN role with "CREATE" permission)
```bash
curl --location --request POST 'http://localhost:3000/users' \
--header 'Authorization: 1' \
--data '{
  "name": "Test User",
  "roles": ["PERSONAL"],
  "groups": ["GROUP_1"]
}'
```

#### ❌ Not Allowed Request (VIEWER role does not have "CREATE" permission)
```bash
curl --location --request POST 'http://localhost:3000/users' \
--header 'Authorization: 6' \
--data '{
  "name": "Test User",
  "roles": ["PERSONAL"],
  "groups": ["GROUP_1"]
}'
```

**Response:**  
`ERROR: Not allowed to perform action due to insufficient permissions.`
