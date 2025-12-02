// ملف: app.js (يُضاف في الأسفل)

// ----------------------------------------------------
// 4. بناء وعرض المقالات
// ----------------------------------------------------

// دالة لبناء بطاقة مقال فردي
function createArticleCard(article) {
    // نستخدم Marked.js لتحويل المحتوى النصي إلى HTML
    const contentHtml = convertMarkdownToHtml(article.content.substring(0, 150) + '...');

    return `
        <div class="glass-panel p-6 rounded-xl shadow-lg animate-fade-in mb-8">
            <div class="flex justify-between items-start">
                <h2 class="text-2xl font-bold text-white mb-2 hover:text-gold-400 cursor-pointer transition duration-300">
                    ${article.title}
                </h2>
                <span class="text-xs text-gray-400">${new Date(article.timestamp.seconds * 1000).toLocaleDateString('ar-EG')}</span>
            </div>
            
            <p class="text-gray-300 mb-4 leading-relaxed">${article.author}</p>
            
            <div class="text-gray-400 text-sm leading-7">
                ${contentHtml}
            </div>

            <a href="#" class="inline-block mt-4 text-gold-400 hover:text-gold-500 font-medium transition duration-300">
                اقرأ المقال كاملاً →
            </a>
        </div>
    `;
}

// الدالة الرئيسية لتحميل وعرض المقالات
async function renderArticles() {
    const container = document.getElementById('app-container');
    container.innerHTML = `<div class="loader mx-auto my-12"></div>`; // عرض مؤشر تحميل

    const articles = await fetchArticles();
    
    // إفراغ المؤشر
    container.innerHTML = ''; 

    if (articles.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400">لا توجد مقالات لعرضها حالياً.</p>';
        return;
    }

    // بناء سلاسل HTML للمقالات
    let htmlContent = '';
    articles.forEach(article => {
        htmlContent += createArticleCard(article);
    });

    container.innerHTML = htmlContent;
}

// ----------------------------------------------------
// 5. بدء تشغيل التطبيق
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // عند تحميل الصفحة، ابدأ بعرض المقالات
    renderArticles();
    // يمكنك هنا إضافة مهام أخرى مثل تهيئة أزرار التنقل
});