const axios = require('axios');

const step1 = (req, res) => {
  res.status(200).send({
    success: 'true',
  })
}

const getTags = (req, res) => {
  const { tags } = req.params;
  console.log('params', tags);
  if (tags.indexOf(',') !== - 1) {
    console.log('one', tags)
    let multiTags = tags.slice(1)
    console.log('second', multiTags)
    let tagArray = multiTags.split(',');
    console.log('third', tagArray)
    let getPaths = tagArray.map((tag, i) => {
      return axios.all([
        console.log('this tag', tag),
        axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}`),
      ])
      // .then(request => {
      //   res.send([...getPaths])
      // })
      .then(axios.spread((getPaths) => {
        res.status(200).send(getPaths);
      }))
      .catch(error => {
        res.status(400).send({
          error: 'Tags parameter is required'
        })
        console.log(error)
      });
    })
  } else {
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags.slice(1)}`)
      .then(request => {
        res.status(200).send(request.data);
      })
      .catch(error => {
        res.status(400).send({
          error: 'Tags parameter is required'
        })
        console.log(error)
      });
  }
}

// const getTags = (req, res) => {
//   const { tags } = req.params;
//   console.log('params', req.params)
//   // sortBy = sortBy ? sortBy : id;
//   axios.all([
//     axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}`),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=history'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=health'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=startups'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=science'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=design'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=culture'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=politics'),
//     // axios.get('http://hatchways.io/api/assessment/blog/posts?tag=science')
//   ])
//   .then(axios.spread((response1, response2, response3, response4, response5, response6, response7, response8, response9) => {
//     // Organizes data into an array
//     let data = [
//       response1.data.posts,
//       response2.data.posts,
//       response3.data.posts,
//       response4.data.posts,
//       response5.data.posts,
//       response6.data.posts,
//       response7.data.posts,
//       response8.data.posts,
//       response9.data.posts
//     ];
//     // Object so that a hash can be made on the id of the post and remove duplicates
//     let post = {};
//     let posts = [];
//     for (let i = 0; i < data.length; i++) {
//       let blog = data[i];
//       for (let i = 0; i < blog.length; i++) {
//         post[blog[i].id] = blog[i];
//       }
//     }
//     // Create response object so that the result of the request is in the correct format
//     for (let key in post) {
//       posts.push(post[key]);
//     }
//     let response = {
//       posts,
//     }
//     res.status(200).send(response);
//   }))
  // .catch(error => {
  //   res.status(400).send({
  //     error: 'Tags parameter is required'
  //   })
  //   console.log(error)
  // });
// }

const sortPosts = (req, res) => {
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
}

module.exports = {
  step1,
  getTags,
  sortPosts,
}