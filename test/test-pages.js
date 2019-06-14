const expect  = require('chai').expect;
const request = require('request');
const axios = require('axios');

describe('Back-End Challenge', function() {
  describe('Step 1', function() {
    it('Should return the correct body for step 1', function(done) {
        request('http://localhost:2222/api/ping', function(error, response, body) {
            expect(body).to.equal('{"success":"true"}');
            done();
        });
    });
    it('Should return the correct status for step 1 where route is correct', function(done) {
      request('http://localhost:2222/api/ping', function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
      });
    });
    it('Should return the correct status for step 1 where route is incorrect', function(done) {
      request('http://localhost:2222/api/pings', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
  })
  describe('Step 2', function() {
    it('Should return the proper status for step 2 for the correct route', function(done) {
      request('http://localhost:2222/api/posts', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('Should return the correct status for step 2 where route is incorrect', function(done) {
      request('http://localhost:2222/api/post', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Should pass the test if all posts have at least one tag', function(done) {
      axios.get('http://localhost:2222/api/posts')
      .then(res => {
        let tagsLength = true;
        let post = res.data.posts;
        // Grabs all posts and checks the length of the tags attribute array for each post
        for (let i = 0; i < post.length; i++) {
          if (post[i].tags.length < 1) {
            tagsLength = false;
            break;
          }
        }
        // Test will fail if the length of the tags array is less than 1
        expect(tagsLength).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Should pass the test if all posts are unique by checking unique ids', function(done) {
      axios.get('http://localhost:2222/api/posts')
      .then(res => {
        let post = res.data.posts;
        let postID = [];
        let postObj = {};
        let test = true;
        // Gets all post ids
        for (let i = 0; i < post.length; i++) {
          postID.push(post[i].id)
        }
        // Places ids in an object where the value of the key is the number of times it appears
        postID.forEach(blog => {
          postObj[blog] = postObj[blog] ? postObj[blog] + 1 : 1
        })
        // If greater than one then there are duplicates and test will fail
        for (let key in postObj) {
          if (postObj[key] > 1) {
            test = false
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
  })
  describe('Step 3', function() {
    it('Should return the proper status for step 3 for the correct route', function(done) {
      request('http://localhost:2222/api/posts/sortBy', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('Should return the correct status for step 3 where route is incorrect', function(done) {
      request('http://localhost:2222/api/posts/sortByAsc', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });
    it('Should pass the test if all posts are unique by checking unique ids', function(done) {
      axios.get('http://localhost:2222/api/posts/sortBy')
      .then(res => {
        let post = res.data.posts;
        let postID = [];
        let postObj = {};
        let test = true;
        // Gets all post ids
        for (let i = 0; i < post.length; i++) {
          postID.push(post[i].id)
        }
        // Places ids in an object where the value of the key is the number of times it appears
        postID.forEach(blog => {
          postObj[blog] = postObj[blog] ? postObj[blog] + 1 : 1
        })
        // If greater than one then there are duplicates and test will fail
        for (let key in postObj) {
          if (postObj[key] > 1) {
            test = false
          }
        }
        expect(test).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Should pass the test if all posts have at least one tag', function(done) {
      axios.get('http://localhost:2222/api/posts/sortBy')
      .then(res => {
        let tagsLength = true;
        let post = res.data.posts;
        // Grabs all posts and checks the length of the tags attribute array for each post
        for (let i = 0; i < post.length; i++) {
          if (post[i].tags.length < 1) {
            tagsLength = false;
            break;
          }
        }
        // Test will fail if the length of the tags array is less than 1
        expect(tagsLength).to.equal(true);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
    it('Should pass the test if all posts are ordered by likes in descending order', function(done) {
      axios.get('http://localhost:2222/api/posts/sortBy')
      .then(res => {
        let post = res.data.posts;
        let postLikes = [];
        // Grabs all posts and pushes likes to the postLikes array in the order that they appear
        for (let i = 0; i < post.length; i++) {
          postLikes.push(post[i].likes)
        }
        // Creates a sorted array from the array grabbed from the response
        // Sorts in descending order to check if they are equal
        let sortedLikes = postLikes.sort((a, b) => b - a);
        // console.log(sortedLikes);
        // Test will fail if the two arrays are not deeply equal
        expect(postLikes).to.deep.equal(sortedLikes);
        })
        .catch(error => {
          console.log(error)
        })
        done();
    });
  })
})
