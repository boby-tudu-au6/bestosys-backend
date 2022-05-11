# BestWishes
This is propject is basically an api for hotel management system

>[live preview](https://bestwishes-hotels.herokuapp.com/dashboard)

## Technology used:-
- node js (core langauage)
- express js (for routing purpose)
- mongodb (for database)
- nodemailer (for sending email)
- json web tokens (for authentication)
- bycrypt js (for password hashing)
- multer (for file uploading)
- razorpay api (for payment gateway)


## api endpoints

1. for user registration 
     >```POST /registeruser ```
     - required fields
        - name
        - email
        - password


2. for user login
    >```POST /loginuser```

    - required fields
        - email
        - password

3. forgot password for client
    >```POST /forgotClient```

    - required fields
        - email
4. reset password for client
    >``` POST /resestClient/:token```

    - required fields
        - password
5. Home route to view all hotel (no need to login)
    >```GET /dashboard```

6. For placing order
    >```POST /order```
    - required fields
        - venueid

7. For adding venue for providers
    >```POST /addvenue```
    - required fields
        - venuename
        - location
        - charges
        - category
        - review
        - venueimg
        - capacity
        - provider

8. Delete venue for provider
    >```GET /provider/removevenue/:id```
9. Remove user for admin
    >```GET /admin/removeuser/:id```
10. Remove provider for admin
    >```GET /admin/removeprovider/:id```
