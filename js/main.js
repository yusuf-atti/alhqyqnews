/* js/main.js
   سلوك واجهة المستخدم: Theme toggle, RTL toggle, lazy load, toasts, render products.
*/

/* Theme */
const modeToggle = document.getElementById("mode-toggle");
if(modeToggle){
  modeToggle.addEventListener("click", ()=>{
    const root = document.documentElement;
    const current = document.body.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark": "light";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("ibtakir_theme", next);
    modeToggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // apply saved
  const saved = localStorage.getItem("ibtakir_theme");
  if(saved) {
    document.body.setAttribute("data-theme", saved);
    modeToggle.textContent = saved === "dark" ? "☀️" : "🌙";
  }
}

/* RTL toggle */
const rtlToggle = document.getElementById("rtl-toggle");
if(rtlToggle){
  rtlToggle.addEventListener("click", ()=> {
    const html = document.documentElement;
    const newDir = html.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
    html.setAttribute("dir", newDir);
    localStorage.setItem("ibtakir_dir", newDir);
    showToast("تم تغيير اتجاه العرض");
  });
  const savedDir = localStorage.getItem("ibtakir_dir");
  if(savedDir) document.documentElement.setAttribute("dir", savedDir);
}

/* Toasts */
function showToast(msg, type = "success", timeout = 3500){
  const container = document.getElementById("toast-container");
  if(!container) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<div>${msg}</div>`;
  t.style.pointerEvents = "auto";
  container.appendChild(t);
  setTimeout(()=> t.classList.add("show"), 10);
  setTimeout(()=> {
    t.classList.remove("show");
    setTimeout(()=> t.remove(), 350);
  }, timeout);
}

/* Lazy load images with data-src */
function initLazy(){
  const imgs = document.querySelectorAll("img.lazy");
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const img = e.target;
        img.src = img.dataset.src;
        img.classList.add("show");
        obs.unobserve(img);
      }
    });
  }, {rootMargin: "120px"});
  imgs.forEach(i=>obs.observe(i));
}

/* Render featured products (from products.js) */
function renderFeatured(){
  const grid = document.getElementById("featured-grid");
  if(!grid || typeof PRODUCTS === "undefined") return;
  const featured = PRODUCTS.filter(p=>p.featured);
  grid.innerHTML = featured.map(p=>`
    <article class="product-card">
      <img data-src="${p.images[0]||'images/placeholder.png'}" class="lazy" alt="${p.title}">
      <h4>${p.title}</h4>
      <p class="text-muted">${p.vendor}</p>
      <div class="price">${p.price.toFixed(2)} ر.س</div>
      <div style="margin-top:0.6rem">
        <button class="btn small" onclick="addToCart('${p.id}',1)">أضف للسلة</button>
        <a class="btn small" href="product.html?id=${p.id}">تفاصيل</a>
      </div>
    </article>
  `).join("");
}

/* Search bar */
const searchInput = document.getElementById("global-search");
const searchBtn = document.getElementById("search-btn");
if(searchBtn){
  searchBtn.addEventListener("click", ()=>{
    const q = searchInput.value.trim();
    window.location.href = `products.html?q=${encodeURIComponent(q)}`;
  });
}

/* Hero carousel simple auto-switch */
function initHeroCarousel(){
  const imgs = document.querySelectorAll(".hero-carousel img");
  if(!imgs.length) return;
  let i = 0;
  imgs[i].classList.add("show");
  setInterval(()=>{
    imgs[i].classList.remove("show");
    i = (i+1) % imgs.length;
    imgs[i].classList.add("show");
  }, 4500);
}

/* On DOM ready */
document.addEventListener("DOMContentLoaded", ()=>{
  initLazy();
  renderFeatured();
  initHeroCarousel();
  // update cart count (cart.js)
  if(typeof updateCartCount === "function") updateCartCount();
});
