const BASE_PATH = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

// UK date formatting
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

const pageWrapper = document.getElementById("page-wrapper");

// Fade animation
function fadeAndNavigate(url) {
  if (!pageWrapper) {
    window.location.href = url;
    return;
  }

  pageWrapper.style.opacity = "0";
  pageWrapper.style.transform = "translateY(10px)";
  pageWrapper.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

window.addEventListener("load", () => {
  if (pageWrapper) {
    pageWrapper.style.opacity = "0";
    pageWrapper.style.transform = "translateY(10px)";
    pageWrapper.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    requestAnimationFrame(() => {
      pageWrapper.style.opacity = "1";
      pageWrapper.style.transform = "translateY(0)";
    });
  }
});

// Hamburger
const hamburger = document.createElement("div");
hamburger.className = "hamburger";
hamburger.innerHTML = `<span></span><span></span><span></span>`;
document.body.appendChild(hamburger);

const sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

document.addEventListener("click", e => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

// Load posts
let ALL_POSTS = [];

fetch(BASE_PATH + "/posts.json")
  .then(res => res.json())
  .then(posts => {

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    ALL_POSTS = posts;

    renderHome();
    renderPost();

  })
  .catch(err => console.error("Failed loading posts.json", err));

// =========================
// HOMEPAGE
// =========================
function renderHome() {
  const path = window.location.pathname;

  if (!(path.endsWith("index.html") || path === BASE_PATH + "/")) return;

  const container = document.getElementById("posts");
  if (!container) return;

  container.innerHTML = "";

  ALL_POSTS.forEach(post => {

    const article = document.createElement("article");

    const excerpt = post.content
      .replace(/#/g, "")
      .substring(0, 300);

    article.innerHTML = `
      <h2>${post.title}</h2>
      <p class="date">${formatDate(post.date)}</p>
      <p class="excerpt">${excerpt}</p>
    `;

    article.style.cursor = "pointer";

    article.addEventListener("click", () => {
      fadeAndNavigate(`${BASE_PATH}/posts.html#${post.id}`);
    });

    container.appendChild(article);
  });
}

// =========================
// POST PAGE
// =========================
function renderPost() {

  if (!window.location.pathname.includes("posts.html")) return;

  const container = document.getElementById("post-content");
  if (!container) return;

  const slug = window.location.hash.substring(1);
  if (!slug) return;

  const index = ALL_POSTS.findIndex(p => p.id === slug);
  const post = ALL_POSTS[index];

  if (!post) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }

  const prevPost = ALL_POSTS[index + 1] || null;
  const nextPost = ALL_POSTS[index - 1] || null;

  container.innerHTML = `
    <div class="entry">
      <div class="post-nav">
        <button id="back-btn">Back</button>
        <div>
          ${prevPost ? `<button id="prev-btn">Previous</button>` : ""}
          ${nextPost ? `<button id="next-btn">Next</button>` : ""}
        </div>
      </div>

      <h1 class="entry-word">${post.title}</h1>
      <p class="entry-meta">${formatDate(post.date)}</p>
      <div class="entry-definition">${marked.parse(post.content)}</div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    fadeAndNavigate(BASE_PATH + "/index.html");
  });

  if (prevPost) {
    document.getElementById("prev-btn").addEventListener("click", () => {
      window.location.hash = prevPost.id;
    });
  }

  if (nextPost) {
    document.getElementById("next-btn").addEventListener("click", () => {
      window.location.hash = nextPost.id;
    });
  }
}

// IMPORTANT: listen for hash change
window.addEventListener("hashchange", renderPost);
