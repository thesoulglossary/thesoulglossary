const BASE_PATH = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

fetch(BASE_PATH + "/posts.json")
  .then(res => res.json())
  .then(posts => {

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const path = window.location.pathname;

    // HOMEPAGE
    if (path.endsWith("index.html") || path === BASE_PATH + "/") {

      const container = document.getElementById("posts");
      if (!container) return;

      posts.forEach(post => {
        const article = document.createElement("article");

        article.innerHTML = `
          <h2>
            <a href="${BASE_PATH}/posts.html#${post.id}">
              ${post.title}
            </a>
          </h2>
          <p class="date">${formatDate(post.date)}</p>
        `;

        container.appendChild(article);
      });

    }

    // POST PAGE
    if (window.location.hash) {

  const slug = window.location.hash.substring(1);
  const post = posts.find(p => p.id === slug);

  const container = document.getElementById("post-content");
  if (!container) return;

  if (!post) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }

  container.innerHTML = `
    <h1>${post.title}</h1>
    <p class="date">${formatDate(post.date)}</p>
    <div class="markdown">
      ${marked.parse(post.content)}
    </div>
  `;
}

  });
