const toast = document.querySelector(".toast");
let toastTimer;
let uploadedImageUrl;
let storyTimer;

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function switchView(view) {
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.viewPanel === view);
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.querySelectorAll(".explore-tile, .profile-grid button").forEach((tile) => {
  tile.addEventListener("click", () => {
    switchView("home");
    showToast("Post opened in your feed");
  });
});

document.querySelector("[data-action='sort']").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isLatest = button.textContent.includes("Latest");
  button.childNodes[0].textContent = isLatest ? "Most loved " : "Latest first ";
  showToast(isLatest ? "Showing posts with the most warmth" : "Showing the freshest bakes");
});

function setPostLike(post, liked) {
  const likeButton = post.querySelector(".like-button");
  const countElement = post.querySelector(".likes-count");
  const baseCount = Number(post.dataset.likeCount);
  likeButton.classList.toggle("is-liked", liked);
  likeButton.setAttribute("aria-label", liked ? "Unlike post" : "Like post");
  countElement.textContent = (baseCount + (liked ? 1 : 0)).toLocaleString();
}

function bindPost(post) {
  const likeButton = post.querySelector(".like-button");
  const media = post.querySelector(".post-media");
  const doubleHeart = post.querySelector(".double-heart");
  const saveButton = post.querySelector(".save-button");
  const commentButton = post.querySelector(".js-focus-comment");
  const commentForm = post.querySelector(".comment-form");
  const shareButton = post.querySelector(".js-share");
  const commentsLink = post.querySelector(".comments-link");

  likeButton?.addEventListener("click", () => {
    setPostLike(post, !likeButton.classList.contains("is-liked"));
  });

  media?.addEventListener("dblclick", () => {
    if (!likeButton.classList.contains("is-liked")) {
      setPostLike(post, true);
    }
    doubleHeart.classList.remove("show");
    requestAnimationFrame(() => doubleHeart.classList.add("show"));
  });

  saveButton?.addEventListener("click", () => {
    const saved = saveButton.classList.toggle("is-saved");
    saveButton.querySelector("svg")?.setAttribute("fill", saved ? "currentColor" : "none");
    showToast(saved ? "Saved to your recipe box" : "Removed from saved");
  });

  commentButton?.addEventListener("click", () => {
    commentForm.classList.add("is-open");
    commentForm.querySelector("input").focus();
  });

  commentsLink?.addEventListener("click", () => {
    commentForm.classList.add("is-open");
    commentForm.querySelector("input").focus();
  });

  commentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = commentForm.querySelector("input");
    const value = input.value.trim();
    if (!value) return;
    const comment = document.createElement("li");
    comment.innerHTML = "<strong>alexa.oven</strong>";
    comment.append(document.createTextNode(value));
    post.querySelector(".comment-list").append(comment);
    input.value = "";
    showToast("Your comment is warm and ready");
  });

  shareButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Post link copied");
    } catch {
      showToast("Share link ready");
    }
  });
}

document.querySelectorAll(".post-card").forEach(bindPost);

const storyViewer = document.querySelector(".story-viewer");
const viewerImage = storyViewer.querySelector(".viewer-image");
const viewerName = storyViewer.querySelector(".viewer-name");
const storyProgress = storyViewer.querySelector(".story-progress span");
let currentStoryButton;

function openStory(button) {
  currentStoryButton = button;
  viewerImage.src = button.dataset.storyImage;
  viewerImage.alt = `${button.dataset.storyName}'s story`;
  viewerName.textContent = button.dataset.storyName;
  storyViewer.hidden = false;
  document.body.style.overflow = "hidden";
  storyProgress.style.animation = "none";
  requestAnimationFrame(() => {
    storyProgress.style.animation = "";
  });
  storyTimer = window.setTimeout(closeStory, 6000);
}

function closeStory() {
  window.clearTimeout(storyTimer);
  storyViewer.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll(".story[data-story-image]").forEach((button) => {
  button.addEventListener("click", () => openStory(button));
});

storyViewer.querySelector(".viewer-close").addEventListener("click", closeStory);
storyViewer.addEventListener("click", (event) => {
  if (event.target === storyViewer) closeStory();
});

storyViewer.querySelector(".viewer-next").addEventListener("click", () => {
  const stories = [...document.querySelectorAll(".story[data-story-image]")];
  const next = stories[(stories.indexOf(currentStoryButton) + 1) % stories.length];
  openStory(next);
});

storyViewer.querySelector(".viewer-prev").addEventListener("click", () => {
  const stories = [...document.querySelectorAll(".story[data-story-image]")];
  const previous = stories[(stories.indexOf(currentStoryButton) - 1 + stories.length) % stories.length];
  openStory(previous);
});

document.querySelectorAll(".follow-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isFollowing = button.classList.toggle("is-following");
    button.textContent = isFollowing ? "Following" : "Follow";
  });
});

document.querySelectorAll(".js-create").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".create-modal").hidden = false;
    document.body.style.overflow = "hidden";
  });
});

document.querySelectorAll("[data-create-story]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".create-modal").hidden = false;
    document.body.style.overflow = "hidden";
  });
});

document.querySelectorAll(".js-search").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".search-modal").hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => document.querySelector(".search-input input").focus(), 50);
  });
});

function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.hidden = true;
  });
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", closeModals);
});

document.querySelectorAll(".modal-backdrop").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModals();
  });
});

document.querySelector(".upload-area input").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
  uploadedImageUrl = URL.createObjectURL(file);
  const preview = document.querySelector(".upload-preview");
  preview.src = uploadedImageUrl;
  preview.hidden = false;
  document.querySelector(".upload-area label").style.display = "none";
});

document.querySelector(".create-card").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!uploadedImageUrl) {
    showToast("Choose a photo first");
    return;
  }

  const caption = event.currentTarget.querySelector("textarea").value.trim() || "A little something fresh from the oven.";
  const article = document.createElement("article");
  article.className = "post-card";
  article.dataset.likeCount = "0";
  article.innerHTML = `
    <header class="post-header">
      <span class="story-ring small"><span class="story-avatar avatar-you">A</span></span>
      <span class="post-author"><strong>alexa.oven</strong><small>Just now</small></span>
      <button class="icon-button" type="button" aria-label="Post options"><i data-lucide="ellipsis"></i></button>
    </header>
    <div class="post-media">
      <img src="${uploadedImageUrl}" alt="Your newly shared post" />
      <span class="double-heart" aria-hidden="true"><i data-lucide="heart"></i></span>
    </div>
    <div class="post-body">
      <div class="post-actions">
        <div>
          <button class="action-button like-button" type="button" aria-label="Like post"><i data-lucide="heart"></i></button>
          <button class="action-button js-focus-comment" type="button" aria-label="Comment"><i data-lucide="message-circle"></i></button>
          <button class="action-button js-share" type="button" aria-label="Share post"><i data-lucide="send"></i></button>
        </div>
        <button class="action-button save-button" type="button" aria-label="Save post"><i data-lucide="bookmark"></i></button>
      </div>
      <p class="likes"><strong class="likes-count">0</strong> warm hearts</p>
      <p class="caption"><strong>alexa.oven</strong> ${caption.replaceAll("<", "&lt;")}</p>
      <button class="comments-link" type="button">Add the first comment</button>
      <ul class="comment-list"></ul>
      <time datetime="2026-10-09T10:00">JUST NOW</time>
      <form class="comment-form">
        <input type="text" aria-label="Add a comment" placeholder="Add a warm comment…" maxlength="120" />
        <button type="submit">Post</button>
      </form>
    </div>
  `;
  document.querySelector(".post-list").prepend(article);
  bindPost(article);
  refreshIcons();
  closeModals();
  switchView("home");
  uploadedImageUrl = undefined;
  event.currentTarget.reset();
  document.querySelector(".upload-preview").hidden = true;
  document.querySelector(".upload-area label").style.display = "";
  event.currentTarget.querySelector("textarea").value = "";
  showToast("Shared! Your moment is warm in the feed");
});

document.querySelector(".chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  if (!input.value.trim()) return;
  const bubble = document.createElement("p");
  bubble.className = "mine";
  bubble.textContent = input.value.trim();
  event.currentTarget.previousElementSibling.append(bubble);
  input.value = "";
});

document.querySelectorAll(".conversation").forEach((conversation) => {
  conversation.addEventListener("click", () => {
    document.querySelectorAll(".conversation").forEach((item) => item.classList.remove("is-selected"));
    conversation.classList.add("is-selected");
    showToast(`${conversation.querySelector("strong").textContent} opened`);
  });
});

document.querySelectorAll(".js-activity").forEach((button) => {
  button.addEventListener("click", () => switchView("notifications"));
});

document.querySelectorAll(".profile-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".profile-tabs button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector(".search-modal").hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => document.querySelector(".search-input input").focus(), 50);
  }
  if (event.key === "Escape") {
    closeStory();
    closeModals();
  }
});

window.addEventListener("load", refreshIcons);
refreshIcons();
