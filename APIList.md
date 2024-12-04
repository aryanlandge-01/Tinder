# DevTinder APIs

## Authentication API
- POST /signup
- POST /login
- POST /logout

## Profile API
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connections API
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User Data
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profile of other users.


status: ignore,interested,accepted,rejected.
