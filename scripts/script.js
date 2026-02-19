fetch("posts.json")
  .then(response => response.json())
  .then(posts => {
    const container = document.getElementById("posts");

    posts.reverse().forEach(post => {
      const article = document.createElement("article");

      article.innerHTML = `
        <h2>${post.title}</h2>
        <p><em>${post.date}</em></p>
        <p>${post.content}</p>
      `;

      container.appendChild(article);
    });
  })
  .catch(error => console.error("Error loading posts:", error));
