# DevTinder APIs

## Authentication API
- POST /signup
- POST /login
- POST /logout

## Profile API
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot Password API


## Connections API
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

status: ignore,interested,accepted,rejected.


## User Data
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profile of other users.



