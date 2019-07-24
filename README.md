# Backend-Challenge
```
Backend Challenge for a potential position at Hatchways
```
### Summary

```
This application contains the results of a challenge for a potential position at Hatchways.
The challenge is entirely focused on the backend and uses an external API, as a result I have not used my own database.
The bulk of the work is done in server/controller/controller.js
tests are found in test/test-page.js

The main focus of this project deals with the second of two routes.  The routes are dynamic, depending on the user input
the begining of the route is /api/posts.  Then the user must input at least one tag into the route, but they can use more,
for example /api/posts/tech,health/ .

The next two route parameters are optional and deal with sorting the information given to the user.
The first is sortBy, which allows a user to sort by any field in the post, for example likes.
The second is the order of the sorting, either ascending or descending.
Thus giving the user a full route, such as /api/posts/tech,health/likes/desc.  This will give all posts
That contain at least one health or tech tag, and ordered with the most likes at the top of the result.
```

### Requirements

Node 10.15.0
Nodemon

### Usage

```
1. In the terminal and within the project directory run 'npm install'
2. Run npm start to start the server, which will be at localhost:2222
3. I used postman to verify all of my solutions and checked the response times in the console to ensure the cache was functioning properly
4. step 1 solution will be found at localhost:2222/api/ping
5. step 2 solution will be found at localhost:2222/api/posts/:tags/:sortBy?/:direction?
6. For example you main insert http://localhost:2222/api/posts/history,tech/likes/desc to get a result.
Or simply http://localhost:2222/api/posts/history,tech
7. run npm test to see the passing tests in the terminal
```