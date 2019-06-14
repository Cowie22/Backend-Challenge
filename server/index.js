const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../client/public')));


const PORT = process.env.PORT || 2222;


// Step 1 of challenge
app.get('/api/ping', (req, res) => {
  res.status(200).send({
    success: 'true',
  })
})

// Step 2 of challenge
// I believe the solution branch is wrong or that they are not specific enough
// The prompt says to gather all blog posts that have at least one tag
// However the solution branch contains blog post that only have Tech and or History tags (At least one of each).
// Here I have gathered all of the posts with at least one tag and filtered out the repeated ones.

app.get('/api/posts', (req, res) => {
  // Gets all posts with at least one tag from the API using axios
  axios.all([
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=tech'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=history'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=health'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=startups'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=science'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=design'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=culture'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=politics'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=science')
  ])
  .then(axios.spread((response1, response2, response3, response4, response5, response6, response7, response8, response9) => {
    // Organizes data into an array
    let data = [
      response1.data.posts,
      response2.data.posts,
      response3.data.posts,
      response4.data.posts,
      response5.data.posts,
      response6.data.posts,
      response7.data.posts,
      response8.data.posts,
      response9.data.posts
    ];
    // Object so that a hash can be made on the id of the post and remove duplicates
    let post = {};
    let posts = [];
    for (let i = 0; i < data.length; i++) {
      let blog = data[i];
      for (let i = 0; i < blog.length; i++) {
        post[blog[i].id] = blog[i];
      }
    }
    // Create response object so that the result of the request is in the correct format
    for (let key in post) {
      posts.push(post[key]);
    }
    let response = {
      posts,
    }
    res.status(200).send(response);
  }))
  .catch(error => {
    res.status(400).send({
      error: 'Tags parameter is required'
    })
    console.log(error)
  });
})

// Step 3 of Challenge
// I'm going to make a third route /api/posts/SortBy, do to the confusion from the previous step
// I will repeat what is show in the solution branch for step 3
// Gather all posts with at least one tag from history and tech
// And then sort by likes with the most likes on top
app.get('/api/posts/sortBy', (req, res) => {
  axios.all([
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=tech'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=history')
  ])
  .then(axios.spread((response1, response2) => {
    let data = [
      response1.data.posts,
      response2.data.posts
    ];
    // Object so that a hash can be made on the id of the post and remove duplicates
    let post = {};
    let posts = [];
    for (let i = 0; i < data.length; i++) {
      let blog = data[i];
      for (let i = 0; i < blog.length; i++) {
        post[blog[i].id] = blog[i];
      }
    }
    // Create response object so that the result of the request is in the correct format
    for (let key in post) {
      posts.push(post[key]);
    }

    // Merge Sort function so that the data is sorted quickly
    // Sorting is notoriously slow so this is a great place to optimize code
    const merge = (arr1, arr2) => {
      let result = [];
      var i = 0;
      var j = 0;
      while(i < arr1.length && j < arr2.length) {
        if (arr2[j].likes < arr1[i].likes) {
          result.push(arr1[i]);
          i++;
        } else {
          result.push(arr2[j]);
          j++;
        }
      }
      while(i < arr1.length) {
        result.push(arr1[i]);
        i++
      }
      while(j < arr2.length) {
        result.push(arr2[j]);
        j++
      }
      return result;
    }
    const mergeSort = (arr) => {
      if (arr.length <= 1) {
        return arr;
      }
      let mid = Math.floor(arr.length / 2);
      let left = mergeSort(arr.slice(0, mid));
      let right = mergeSort(arr.slice(mid));
      return merge(left, right);
    }
    // Calling Merge sort on the retrieved data
    let sortedPosts = mergeSort(posts);
    let response = {
      posts: sortedPosts
    }
    res.status(200).send(response);
  }))
  .catch(error => {
    res.status(400).send({
      error: 'sortBy parameter is invalid'
    })
    console.log(error)
  });
})


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});