## authRouter
    - post /signup
    - post /login
    - post /logout

## profileRouter
    - Get /profile/view
    - patch /profile/edit
    - patch /profile/password


## connectionRequestRouter
    - post /request/send/intrested/:userId
    - post /request/send/ignored/:userId
    - post /request/review/accepted/:requestId
    - post /request/review/rejected/:requestId


## userRouter
    - Get /user/connection
    - Get /user/requests
    - Get /user/feed - Get you the profiles of other users on plateform


    Status: ignore, interested, accepeted, rejected