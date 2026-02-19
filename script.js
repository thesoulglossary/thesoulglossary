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

let ALL_POSTS = [];
let refreshInterval = 60;
let countdown = refreshInterval;

function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  el.textContent = countdown;
  countdown--;

  if (countdown < 0) {
    countdown = refreshInterval;
    loadPosts();
  }
}

setInterval(updateCountdown, 1000);

function updateRefreshTime() {
  const el = document.getElementById("last-refresh");
  if (!el) return;

  const now = new Date();
  el.textContent = now.toLocaleTimeString("en-GB");
}

function loadPosts() {

  fetch(BASE_PATH + "/posts.json?ts=" + Date.now(), {
    cache: "no-store"
  })
  .then(res => res.json())
  .then(posts => {

    posts.sort((a,b)=> new Date(b.date)-new Date(a.date));
    ALL_POSTS = posts;

    renderHome();
    renderPost();

    const counter = document.getElementById("post-count");
    if (counter) counter.textContent = posts.length;

    updateRefreshTime();
  });
}

function renderHome() {

  const path = window.location.pathname;
  if (!(path.endsWith("index.html") || path === BASE_PATH + "/")) return;

  const container = document.getElementById("posts");
  if (!container) return;

  container.innerHTML = "";

  ALL_POSTS.forEach(post => {

    const article = document.createElement("article");

    const excerpt = post.content.replace(/#/g,"").substring(0,100);

    article.innerHTML = `
      <h2>${post.title}</h2>
      <p class="date">${formatDate(post.date)}</p>
      <p class="excerpt">${excerpt}...</p>
      <span class="read-more">Read more</span>
    `;

    article.addEventListener("click", () => {
      window.location.href = `${BASE_PATH}/posts.html#${post.id}`;
    });

    container.appendChild(article);
  });
}

function renderPost() {

  if (!window.location.pathname.includes("posts.html")) return;

  const container = document.getElementById("post-content");
  if (!container) return;

  const slug = window.location.hash.substring(1);
  if (!slug) return;

  const index = ALL_POSTS.findIndex(p => p.id === slug);
  const post = ALL_POSTS[index];
  if (!post) return;

  const prevPost = ALL_POSTS[index + 1] || null;
  const nextPost = ALL_POSTS[index - 1] || null;

  container.innerHTML = `
    <div class="entry">
      <div class="post-nav">
        <button onclick="window.location.href='${BASE_PATH}/index.html'">Back</button>
        <div>
          ${prevPost ? `<button onclick="window.location.hash='${prevPost.id}'">Previous</button>` : ""}
          ${nextPost ? `<button onclick="window.location.hash='${nextPost.id}'">Next</button>` : ""}
        </div>
      </div>

      <h1 class="entry-word">${post.title}</h1>
      <p class="entry-meta">${formatDate(post.date)}</p>
      <div class="entry-definition">${marked.parse(post.content)}</div>
    </div>
  `;
}

window.addEventListener("hashchange", renderPost);

loadPosts();
