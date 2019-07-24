const axios = require('axios');

const step1 = (req, res) => {
  res.status(200).send({
    success: 'true',
  })
}

const getTags = (req, res) => {
  const { tags, sortBy, direction } = req.params;
  const validSortValues = ['id', 'author', 'authorId', 'likes', 'popularity', 'reads', 'tags', undefined];
  const validDirections = ['asc', 'desc', undefined];

  // Throws error if the sortBy/direction value are not valid.
  if (validSortValues.indexOf(sortBy) === - 1) {
    res.status(400).send({
      error: 'sortBy parameter is invalid',
    });
  }
  if (validDirections.indexOf(direction) === -1) {
    res.status(400).send({
      error: 'sortBy parameter is invalid',
    });
  }

  // If the user requests more than one tag, we will precede with the following
  if (tags.indexOf(',') !== - 1) {
    let tagArray = tags.split(',');
    let getPaths = tagArray.map((tag, i) => {
      return axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
    });
    // Axios uses axios.all and axios.spread in order to make congruent calls to an api
    axios.all([
      ...getPaths
    ])
    // There are nine possible tags that can be inputted by the user, so they all need to be considered and spread
    // If the value is not there, it will be ignored using an empty string
    // Null/undefined are not used because I use the length method below on the data array
      .then(axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
        let data = [
          tag1 ? tag1.data.posts : '',
          tag2 ? tag2.data.posts : '',
          tag3 ? tag3.data.posts : '',
          tag4 ? tag4.data.posts : '',
          tag5 ? tag5.data.posts : '',
          tag6 ? tag6.data.posts : '',
          tag7 ? tag7.data.posts : '',
          tag8 ? tag8.data.posts : '',
          tag9 ? tag9.data.posts : ''
        ]
        // Most efficient way to get rid of duplicates is to make a hash table
        // Using the post id as the key in the hash table, it will ensure that duplicates are removed
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
        // if a sortBy value is utilized by the user, then we will sort depending on the direction
        if (sortBy) {
          if (direction === 'desc') {
            posts = posts.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
          } else {
            posts = posts.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
          }
        }
        // Finally we have rid ourselves of duplicates and sorted our data as the user desires and can return the data
        res.status(200).send(posts);
      }))
      // If no tags are used, then this error will be shown to the user
      .catch(error => {
        res.status(400).send({
          error: 'Tags parameter is required',
        })
        console.log(error)
      });
  } else {
    // If the user only searches for one tag, then we don't have to worry about congruent calls and duplicate values
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
      .then(request => {
        let data = request.data.posts;
        if (sortBy) {
          if (direction === 'desc') {
            data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
          } else {
            data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
          }
        }
        res.status(200).send(data);
      })
      .catch(error => {
        res.status(400).send({
          error: 'Tags parameter is required',
        })
        console.log(error)
      });
  }
}

module.exports = {
  step1,
  getTags
}