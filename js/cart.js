/* js/cart.js
   عمليات السلة (localStorage). يعمل بدون Backend.
*/

const LS_CART_KEY = "ibtakir_cart_v1";
const LS_FAV_KEY = "ibtakir_fav_v1";
const LS_COMPARE_KEY = "ibtakir_cmp_v1";
const LS_COUPON_KEY = "ibtakir_coupon_v1";

/* الحصول على حالة السلة */
function getCart(){
  return JSON.parse(localStorage.getItem(LS_CART_KEY) || "[]");
}
function saveCart(cart){
  localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

/* إضافة منتج */
function addToCart(productId, qty = 1){
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({id: productId, qty});
  saveCart(cart);
  showToast("تمت إضافة المنتج إلى السلة");
}

/* إزالة */
function removeFromCart(productId){
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  showToast("تمت إزالة المنتج");
}

/* تفريغ */
function clearCart(){
  saveCart([]);
  showToast("تمت تفريغ السلة");
}

/* عدد العناصر */
function cartCount(){
  return getCart().reduce((s,i)=>s+i.qty,0);
}
function updateCartCount(){
  const el = document.getElementById("cart-count");
  if(el) el.textContent = cartCount();
}

/* Favorites */
function toggleFavorite(id){
  let fav = JSON.parse(localStorage.getItem(LS_FAV_KEY) || "[]");
  if(fav.includes(id)) fav = fav.filter(x => x !== id);
  else fav.push(id);
  localStorage.setItem(LS_FAV_KEY, JSON.stringify(fav));
  showToast("تم تحديث المفضلات");
}

/* Compare */
function toggleCompare(id){
  let cmp = JSON.parse(localStorage.getItem(LS_COMPARE_KEY) || "[]");
  if(cmp.includes(id)) cmp = cmp.filter(x => x !== id);
  else cmp.push(id);
  localStorage.setItem(LS_COMPARE_KEY, JSON.stringify(cmp));
  showToast("تم تحديث المقارنة");
}

/* كوبون بسيط */
function applyCoupon(code){
  const normalized = (code||"").trim().toUpperCase();
  // أمثلة كوبونات تجريبية
  const coupons = { "IBTA10": 10, "FAMILY20": 20 };
  if(coupons[normalized]){
    localStorage.setItem(LS_COUPON_KEY, JSON.stringify({code:normalized,discount:coupons[normalized]}));
    showToast(`تم تطبيق كوبون ${normalized} بنجاح`);
    return {applied:true, discount:coupons[normalized]};
  } else {
    localStorage.removeItem(LS_COUPON_KEY);
    showToast("كود غير صالح", "error");
    return {applied:false};
  }
}

document.addEventListener("DOMContentLoaded", ()=> {
  updateCartCount();
});
