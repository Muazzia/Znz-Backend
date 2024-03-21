# Project Information

## npm modules used in it

- **bcrypt**: for hashing the password
- **cors**: as a middleware for express application
- **bodyParser**: as a middleware for express application
- **jsonwebtoken (jwt)**: for authentication and authorization
- **nodeMailer**: email sending services
- **bcrypt**: hashing for the password
- **passport.js**: for google signin
- **google oauth20**: strategy used for google oauth
- **sequelize**: sequelize orm for working with the mysql
- **ejs**: embedded javascript for frontend
- **bull**: for queueing the tasks
- **dotenv**: to store sensitive information
- **joi**: for validations
- **multer**: for image uploading middlware
- **cloudinary**: for uploading images on cloudinary cloud images

### Endpoints

- [Register User](http://192.168.1.64:8080/api/auth/user/register-user)
- [Login](http://192.168.1.64:8080/api/auth/user/login)
- [Google Login](http://192.168.1.64:8080/api/auth/user/google/login)
- [Forgot Password](http://192.168.1.64:8080/api/user/forgot-password)
- [Set Password](http://192.168.1.64:8080/api/user/setnew-password) (token to be to be passed in headers)
- [Change Password](http://192.168.1.64:8080/api/user/change-password) (token to be to be passed in headers)
- [Google OAuth](http://localhost:8080/api/auth/user/auth/google)
- [Add User Details](http://localhost:8080/api/user/add-extradetails) (when the user is logged in, a pop-up will appear for additional information)
- [Get User Details](http://localhost:8080/api/user/user-extradetails)
- [Add User Details(Bio,dob,phonenumber,address)](http://localhost:8080/api/user/user-details)
- [Update User Personal Info](http://localhost:8080/api/user/user-personal)
- [add Post](http://localhost:8080/api/user/add-post)
- [Get Commests of Specific Post](http://localhost:8080/api/user/post/comment)(postId is req in body)
- [Create Comment](http://localhost:8080/api/user/post/comment)(commentText & postId is required)
- [Delete Comment](http://localhost:8080/api/user/post/comment/:postId)
- [Update Commnet](http://localhost:8080/api/user/post/comment/:postId)
- [Like Comment](http://localhost:8080/api/user/post/like)

# Admin Routes

- [Gell All Users](http://localhost:8080/api/admin/user)

-[Update User Blocked Status](http://localhost:8080/api/admin/user)
