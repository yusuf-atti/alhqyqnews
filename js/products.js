/* js/products.js
   بيانات عيّنات للمنتجات تُستخدم في صفحات المتجر.
   يمكن لاحقًا استبدالها بتحميل من API.
*/

const PRODUCTS = [
  {
    id: "p001",
    title: "مربى التمر العضوي",
    price: 45.00,
    oldPrice: 60.00,
    vendor: "أسرة المبدعون",
    category: "طعام",
    rating: 4.8,
    images: ["images/product1-1.jpg","images/product1-2.jpg"],
    featured: true,
    description: "مربى تمر محضّر يدوياً بمكونات طبيعية 100%."
  },
  {
    id: "p002",
    title: "مفرش يدوي من الصوف",
    price: 120.00,
    oldPrice: null,
    vendor: "حياكة الأصيل",
    category: "حرف",
    rating: 4.5,
    images: ["images/product2-1.jpg"],
    featured: true,
    description: "مفرش بلون عصري وتطريز عربي تقليدي."
  },
  {
    id: "p003",
    title: "قميص أطفال مطبوع",
    price: 65.00,
    oldPrice: 80.00,
    vendor: "أميرة للملابس",
    category: "ملابس",
    rating: 4.6,
    images: ["images/product3-1.jpg"],
    featured: false,
    description: "قميص مريح وآمن لبشرة الأطفال."
  }
];

/* تسهيلات: البحث المحلي */
function searchProducts(q = "") {
  q = (q || "").trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.vendor.toLowerCase().includes(q)
  );
}
