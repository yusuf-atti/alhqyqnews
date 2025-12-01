<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>جميع الأخبار | صحيفة الحقيقة</title>
    
    <!-- نفس روابط index.html -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    
    <style>
        body { background-color: #050510; color: #f3f4f6; font-family: 'Tajawal', sans-serif; }
        .glass-nav { background: rgba(5, 5, 16, 0.9); backdrop-filter: blur(16px); }
        .news-card { transition: all 0.3s ease; }
        .news-card:hover { transform: translateY(-4px); }
    </style>
</head>
<body class="antialiased">

    <!-- التنقل -->
    <nav class="glass-nav fixed w-full z-50 top-0 border-b border-white/10">
        <div class="container mx-auto px-4 h-16 flex justify-between items-center">
            <!-- الشعار -->
            <a href="index.html" class="text-2xl font-black text-gold-400 flex items-center gap-2">
                الـحقيقة<span class="text-white">.</span>
            </a>
            
            <!-- روابط التنقل -->
            <div class="hidden md:flex items-center gap-6">
                <a href="index.html" class="text-white hover:text-gold-400 text-sm">الرئيسية</a>
                <a href="news.html" class="text-gold-400 font-bold text-sm">الأخبار</a>
                <a href="categories.html" class="text-white hover:text-gold-400 text-sm">الأقسام</a>
                <a href="about.html" class="text-white hover:text-gold-400 text-sm">عن الموقع</a>
                <a href="contact.html" class="text-white hover:text-gold-400 text-sm">اتصل بنا</a>
            </div>
            
            <!-- زر القيادة (مختصر) -->
            <a href="index.html#admin-view" class="text-white bg-white/10 px-4 py-1.5 rounded-full hover:bg-gold-400 hover:text-black text-xs">
                <i data-lucide="shield" class="w-3 h-3 inline ml-1"></i> القيادة
            </a>
        </div>
    </nav>

    <!-- محتوى الصفحة -->
    <main class="pt-24 pb-16 container mx-auto px-4">
        <!-- العنوان -->
        <div class="mb-10">
            <h1 class="text-4xl font-black text-white mb-4">📰 جميع الأخبار</h1>
            <p class="text-gray-400">تصفح كافة الأخبار والتحليلات المنشورة في صحيفة الحقيقة</p>
            
            <!-- فلاتر -->
            <div class="flex flex-wrap gap-3 mt-6">
                <button class="px-4 py-2 bg-gold-400 text-black rounded-full text-sm font-bold">الكل</button>
                <button class="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20">أخبار محلية</button>
                <button class="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20">اقتصاد</button>
                <button class="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20">رياضة</button>
                <button class="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20">ثقافة</button>
            </div>
        </div>

        <!-- شبكة الأخبار -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="news-grid">
            <!-- سيتم ملؤها بالجافاسكربت -->
            <div class="col-span-full text-center py-10">
                <div class="loader mx-auto"></div>
                <p class="text-gray-500 mt-4">جاري تحميل الأخبار...</p>
            </div>
        </div>
        
        <!-- ترقيم الصفحات -->
        <div class="flex justify-center gap-2 mt-12">
            <button class="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">السابق</button>
            <button class="px-4 py-2 bg-gold-400 text-black rounded-lg text-sm font-bold">1</button>
            <button class="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">2</button>
            <button class="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">3</button>
            <button class="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">التالي</button>
        </div>
    </main>

    <!-- الفوتر -->
    <footer class="border-t border-white/10 py-8">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-6 md:mb-0">
                    <div class="text-2xl font-black text-gold-400">الـحقيقة.</div>
                    <p class="text-gray-500 text-sm mt-2">نحن لا ننقل الخبر، نحن نصنع الواقع</p>
                </div>
                
                <div class="text-center md:text-right">
                    <p class="text-gray-500 text-sm">© 2025 جميع الحقوق محفوظة لشبكة الحقيقة الإعلامية</p>
                    <p class="text-gray-600 text-xs mt-2">المصدر الأول للمعلومات الموثقة والدقيقة</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- نافذة المقال (نفس index.html) -->
    <div id="article-modal" class="fixed inset-0 z-50 bg-[#050510] hidden overflow-y-auto">
        <!-- نفس محتوى النافذة من index.html -->
    </div>

<script>
// تهيئة الأيقونات
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    loadAllNews();
});

// دالة تحميل جميع الأخبار
async function loadAllNews() {
    try {
        // محاولة الاتصال بـ Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyD7b1PZY26GN6hR2pliqiFRgyMsNyRlWOs",
            authDomain: "alhqyq-62b0e.firebasestorage.app",
            projectId: "alhqyq-62b0e",
            messagingSenderId: "354014970954",
            appId: "1:354014970954:web:435ca4eb0cbbfcfd1152b3"
        };
        
        // إذا كان Firebase متاحاً
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            const snapshot = await firebase.firestore()
                .collection("news")
                .orderBy("timestamp", "desc")
                .get();
                
            if (!snapshot.empty) {
                displayNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                return;
            }
        }
        
        // إذا فشل Firebase، استخدم البيانات المحلية
        const localNews = JSON.parse(localStorage.getItem("local_news_db") || "[]");
        if (localNews.length > 0) {
            displayNews(localNews);
        } else {
            // بيانات تجريبية
            const mockNews = [
                {
                    id: "1",
                    title: "انطلاق منصة الحقيقة الرقمية",
                    category: "أخبار",
                    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
                    desc: "أعلنت صحيفة الحقيقة عن إطلاق منصتها الرقمية المتكاملة...",
                    date: "٢٠٢٥-٠١-٠١"
                },
                // ... إضافة 5 أخبار تجريبية أخرى
            ];
            displayNews(mockNews);
        }
        
    } catch (error) {
        console.error("خطأ في تحميل الأخبار:", error);
        document.getElementById('news-grid').innerHTML = `
            <div class="col-span-full text-center py-10">
                <i data-lucide="wifi-off" class="w-12 h-12 text-gray-600 mx-auto"></i>
                <p class="text-gray-500 mt-4">تعذر الاتصال بالخادم</p>
            </div>`;
        if (window.lucide) lucide.createIcons();
    }
}

// دالة عرض الأخبار
function displayNews(news) {
    const grid = document.getElementById('news-grid');
    
    if (!news || news.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <i data-lucide="newspaper" class="w-12 h-12 text-gray-600 mx-auto"></i>
                <p class="text-gray-500 mt-4">لا توجد أخبار منشورة بعد</p>
            </div>`;
        return;
    }
    
    grid.innerHTML = news.map(article => `
        <div class="news-card bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-gold-400/30">
            <img src="${article.img}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='https://via.placeholder.com/400x200/0a0a15/ffffff?text=الحقيقة'">
            
            <div class="p-5">
                <span class="inline-block bg-gold-400/20 text-gold-400 text-xs px-3 py-1 rounded-full mb-3">
                    ${article.category || 'أخبار'}
                </span>
                
                <h3 class="text-white font-bold text-lg mb-3 line-clamp-2">
                    ${article.title}
                </h3>
                
                <p class="text-gray-400 text-sm mb-4 line-clamp-3">
                    ${article.desc?.substring(0, 150) || ''}...
                </p>
                
                <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>${article.date || ''}</span>
                    <button onclick="openArticle('${article.id}')" 
                            class="text-gold-400 hover:text-white flex items-center gap-1">
                        اقرأ المزيد <i data-lucide="arrow-left" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}

// دالة فتح المقال (تبسيطية)
function openArticle(id) {
    alert('سيتم فتح المقال الكامل قريباً');
    // يمكن توجيه المستخدم إلى صفحة تفاصيل المقال
    // window.location.href = `article.html?id=${id}`;
}

// CSS للـ loader
const style = document.createElement('style');
style.textContent = `
    .loader {
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-left-color: #D4AF37;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
</script>
</body>
</html>
