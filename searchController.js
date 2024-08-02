const fs = require('fs');

let posts = [];

// Load posts from posts.json
fs.readFile('posts.json', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    posts = JSON.parse(data);
});

function handleClick(searchTerm, filter) {
    console.log(`Searching for "${searchTerm}" with filter "${filter}"`);

    const searchResults = searchPosts(searchTerm, filter);
    displaySearchResults(searchResults);
}

function searchPosts(searchTerm, filter) {
    const searchResults = [];

    for (const post of posts) {
        if (post.content.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResults.push(post);
        }
    }

    if (filter === 'top') {
        searchResults.sort((a, b) => b.likes - a.likes);
    } else if (filter === 'latest') {
        searchResults.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    }

    return searchResults;
}

function displaySearchResults(searchResults) {
    const template = Handlebars.compile(fs.readFileSync('post.hbs', 'utf8'));
    const html = template({ posts: searchResults });
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = html;
}

// Example usage:
handleClick('example', 'top');