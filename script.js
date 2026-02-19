// Detect base path (for GitHub Pages repo sites)
const BASE_PATH = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

// Format date UK style
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Page fade wrapper
const pageWrapper = document.getElementById("page-wrapper");

function fadeAndNavigate(url) {
  if (!pageWrapper) {
    window.location.href = url;
    return;
  }

  pageWrapper.style.opacity = "0";
  pageWrapper.style.transform = "translateY(10px)";

  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

// Fade in on load
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

// Hamburger menu
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

// Fetch posts
fetch(BASE_PATH + "/posts.json")
  .then(res => res.json())
  .then(posts => {

    // Sort newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const path = window.location.pathname;

    // =========================
    // HOMEPAGE
    // =========================
    if (path.endsWith("index.html") || path === BASE_PATH + "/") {

      const container = document.getElementById("posts");
      if (!container) return;

      posts.forEach(post => {

        const article = document.createElement("article");

        const excerpt = post.content
          .replace(/#/g, "")
          .substring(0, 300);

        article.innerHTML = `
          <h2>${post.title}</h2>
          <p class="date">${formatDate(post.date)}</p>
          <p class="excerpt">${excerpt}</p>
        `;

        // Make FULL block clickable
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
    if (window.location.hash) {

      const slug = window.location.hash.substring(1);
      const index = posts.findIndex(p => p.id === slug);
      const post = posts[index];
      const container = document.getElementById("post-content");

      if (!container) return;

      if (!post) {
        container.innerHTML = "<p>Post not found.</p>";
        return;
      }

      const prevPost = posts[index + 1] || null;
      const nextPost = posts[index - 1] || null;

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

      // Back
      document.getElementById("back-btn").addEventListener("click", () => {
        fadeAndNavigate(BASE_PATH + "/index.html");
      });

      // Previous
      if (prevPost) {
        document.getElementById("prev-btn").addEventListener("click", () => {
          fadeAndNavigate(`${BASE_PATH}/posts.html#${prevPost.id}`);
        });
      }

      // Next
      if (nextPost) {
        document.getElementById("next-btn").addEventListener("click", () => {
          fadeAndNavigate(`${BASE_PATH}/posts.html#${nextPost.id}`);
        });
      }
    }

  })
  .catch(err => {
    console.error("Failed to load posts.json", err);
  });
