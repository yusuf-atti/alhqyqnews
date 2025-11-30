<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صحيفة الحقيقة | الرؤية الجديدة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Tajawal', 'sans-serif'] },
                    colors: { navy: { 900: '#050510', 800: '#0a0a15' }, gold: { 400: '#D4AF37' } }
                }
            }
        }
    </script>
    <style>
        body { background-color: #050510; color: #f3f4f6; }
        .glass-nav { background: rgba(5, 5, 16, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .hero-gradient { background: linear-gradient(to top, #050510 0%, rgba(5,5,16,0.8) 50%, transparent 100%); }
        .loader { border: 4px solid rgba(255,255,255,0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #D4AF37; animation: spin 1s ease infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body class="antialiased selection:bg-gold-400 selection:text-black">

    <nav class="fixed w-full z-50 glass-nav">
        <div class="container mx-auto px-6 h-20 flex justify-between items-center">
            <div class="text-3xl font-black text-white cursor-pointer" onclick="window.location.reload()">
                الـحقيقة <span class="text-gold-400">.</span>
            </div>
            <div class="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                <a href="#" class="hover:text-gold-400">الرئيسية</a>
                <a href="#" class="hover:text-gold-400">أخبار محلية</a>
                <button onclick="openSettings()" class="text-gold-400 flex items-center gap-1"><i data-lucide="cpu" class="w-4 h-4"></i> إعدادات AI</button>
                <!-- رابط للوحة التحليلات -->
                <a href="analytics.html" class="text-white bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition">لوحة الإدارة</a>
            </div>
        </div>
    </nav>

    <div class="fixed top-20 w-full z-40 bg-navy-800 border-b border-white/5 py-2 overflow-hidden">
        <div class="container mx-auto px-6 flex items-center">
            <span class="text-gold-400 text-xs font-bold ml-4 border-l border-gray-700 px-2">عاجل</span>
            <div class="w-full overflow-hidden relative h-5">
                <div class="absolute whitespace-nowrap animate-[marquee_20s_linear_infinite] text-xs text-gray-300" id="ticker-content">جاري التحميل...</div>
            </div>
        </div>
    </div>

    <main class="pt-36 pb-20 container mx-auto px-6">
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 h-auto lg:h-[500px]" id="hero-section">
            <div class="lg:col-span-12 flex items-center justify-center h-96"><div class="loader"></div></div>
        </section>
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div class="lg:col-span-8" id="news-container"><div class="loader"></div></div>
            <div class="lg:col-span-4 sticky top-32 h-fit space-y-6">
                <div class="bg-navy-800/50 p-6 rounded-2xl border border-white/5">
                    <h3 class="text-gold-400 font-bold mb-4">الأكثر قراءة</h3>
                    <div id="sidebar-content" class="space-y-4"></div>
                </div>
            </div>
        </section>
    </main>

    <!-- AI Components -->
    <div class="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-4">
        <div id="ai-chat-window" class="hidden w-80 bg-navy-800 border border-gold-400/30 rounded-2xl shadow-2xl p-4">
            <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <span class="text-gold-400 font-bold text-sm">مساعد الحقيقة</span>
                <button onclick="toggleChat()"><i data-lucide="x" class="w-4 h-4 text-white"></i></button>
            </div>
            <div id="chat-messages" class="h-64 overflow-y-auto mb-4 text-sm space-y-2 text-gray-300"></div>
            <div class="relative">
                <input type="text" id="chat-input" class="w-full bg-black/30 rounded-full py-2 px-4 text-white text-sm" placeholder="اسألني...">
                <button onclick="sendMessage()" class="absolute left-2 top-1.5 text-gold-400"><i data-lucide="send" class="w-4 h-4"></i></button>
            </div>
        </div>
        <button onclick="toggleChat()" class="w-14 h-14 bg-gold-400 rounded-full flex items-center justify-center shadow-lg"><i data-lucide="sparkles" class="w-6 h-6 text-black"></i></button>
    </div>

    <!-- Modals -->
    <div id="analysis-modal" class="fixed inset-0 z-[60] bg-black/80 hidden items-center justify-center p-4">
        <div class="bg-navy-800 w-full max-w-2xl rounded-2xl border border-gold-400/30 p-6">
            <div class="flex justify-between mb-4"><h3 class="text-white font-bold">تحليل AI</h3><button onclick="closeAnalysis()" class="text-gray-400"><i data-lucide="x"></i></button></div>
            <div id="analysis-result" class="text-gray-300 prose prose-invert max-h-[60vh] overflow-y-auto"></div>
        </div>
    </div>

    <div id="settings-modal" class="fixed inset-0 z-[70] bg-black/90 hidden items-center justify-center p-4">
        <div class="bg-navy-800 w-full max-w-md rounded-xl p-6">
            <h3 class="text-white font-bold mb-4">إعدادات AI</h3>
            <input type="password" id="api-key-input" placeholder="Gemini API Key" class="w-full bg-black/50 p-3 rounded text-white mb-4">
            <button onclick="saveApiKey()" class="w-full bg-gold-400 text-black font-bold py-2 rounded">حفظ</button>
            <button onclick="document.getElementById('settings-modal').classList.add('hidden')" class="w-full mt-2 text-gray-400">إلغاء</button>
        </div>
    </div>

    <script>
        lucide.createIcons();
        let userApiKey = localStorage.getItem('gemini_api_key') || "";
        const RSS_URL = "https://alhqyq.com/rss-action-feed-m-news-id-0-feed-rss20.xml";
        let fetchedNewsData = [];

        function openSettings() { document.getElementById('settings-modal').classList.remove('hidden'); }
        function saveApiKey() { 
            const key = document.getElementById('api-key-input').value;
            if(key) { localStorage.setItem('gemini_api_key', key); userApiKey = key; document.getElementById('settings-modal').classList.add('hidden'); }
        }
        
        async function callGemini(prompt, systemPrompt) {
            if(!userApiKey) { openSettings(); return null; }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${userApiKey}`;
            try {
                const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] } }) });
                const data = await res.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch(e) { console.error(e); return "خطأ في الاتصال"; }
        }

        async function analyzeNews(title, desc) {
            document.getElementById('analysis-modal').classList.remove('hidden'); document.getElementById('analysis-modal').classList.add('flex');
            document.getElementById('analysis-result').innerHTML = '<div class="loader mx-auto"></div>';
            const text = await callGemini(`حلل هذا الخبر: ${title} - ${desc}`, "أنت محلل إخباري.");
            document.getElementById('analysis-result').innerHTML = marked.parse(text || "يرجى التحقق من المفتاح");
        }
        function closeAnalysis() { document.getElementById('analysis-modal').classList.add('hidden'); document.getElementById('analysis-modal').classList.remove('flex'); }

        function toggleChat() { document.getElementById('ai-chat-window').classList.toggle('hidden'); }
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const msg = input.value; if(!msg) return;
            const chat = document.getElementById('chat-messages');
            chat.innerHTML += `<div class="text-right bg-gold-400 text-black p-2 rounded mb-2 ml-auto w-fit">${msg}</div>`;
            input.value = '';
            const reply = await callGemini(msg, "أنت مساعد صحيفة الحقيقة.");
            chat.innerHTML += `<div class="text-left bg-white/10 p-2 rounded mb-2 w-fit">${marked.parse(reply || "")}</div>`;
            chat.scrollTop = chat.scrollHeight;
        }

        function renderSite(news) {
            if(!news.length) return;
            const hero = news[0];
            const safe = (s) => s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            
            // Hero
            document.getElementById('hero-section').innerHTML = `
                <div class="lg:col-span-8 relative group rounded-2xl overflow-hidden h-[400px] lg:h-full cursor-pointer">
                    <img src="${hero.img}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div class="absolute bottom-0 p-8">
                        <h1 class="text-3xl font-bold text-white mb-2">${hero.title}</h1>
                        <button onclick="analyzeNews('${safe(hero.title)}', '${safe(hero.desc)}')" class="bg-gold-400 text-black px-3 py-1 rounded text-sm font-bold">تحليل AI</button>
                    </div>
                </div>
                <div class="lg:col-span-4 flex flex-col gap-4 h-[400px] lg:h-full">
                    ${news.slice(1,3).map(n => `<div class="flex-1 relative rounded-xl overflow-hidden"><img src="${n.img}" class="w-full h-full object-cover"><div class="absolute bottom-0 p-4 bg-black/60 w-full"><h3 class="text-white font-bold text-sm">${n.title}</h3></div></div>`).join('')}
                </div>
            `;

            // Feed
            document.getElementById('news-container').innerHTML = news.slice(3).map(n => `
                <div class="flex gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                    <img src="${n.img}" class="w-32 h-24 object-cover rounded-lg">
                    <div>
                        <h3 class="text-white font-bold text-lg mb-2">${n.title}</h3>
                        <p class="text-gray-400 text-xs line-clamp-2">${n.desc}</p>
                        <button onclick="analyzeNews('${safe(n.title)}', '${safe(n.desc)}')" class="text-gold-400 text-xs mt-2 border border-gold-400/30 px-2 py-1 rounded">تحليل</button>
                    </div>
                </div>
            `).join('');

            // Sidebar
            document.getElementById('sidebar-content').innerHTML = news.slice(0,5).reverse().map(n => `<div class="flex gap-2 items-center"><img src="${n.img}" class="w-12 h-12 rounded object-cover"><h4 class="text-gray-300 text-xs">${n.title}</h4></div>`).join('');
            
            document.getElementById('ticker-content').innerText = "• مرحباً بك في صحيفة يوسف الإلكترونية   " + news.map(n => ` • ${n.title}`).join(' ');
            lucide.createIcons();
        }

        async function fetchNews() {
            try {
                const res = await fetch(RSS_URL);
                const str = await res.text();
                const xml = new DOMParser().parseFromString(str, "text/xml");
                fetchedNewsData = Array.from(xml.querySelectorAll("item")).map(item => ({
                    title: item.querySelector("title")?.textContent,
                    desc: item.querySelector("description")?.textContent.replace(/<[^>]+>/g, '').substring(0,100),
                    img: item.querySelector("enclosure")?.getAttribute("url") || "https://alhqyq.com/contents/datastore/layouts/41/logos/logo.jpg"
                }));
                renderSite(fetchedNewsData);
            } catch(e) {
                // Mock Data Fallback
                renderSite([
                    {title: "وزير البيئة يبحث تطوير مشاريع الخرج", desc: "تفاصيل الخبر هنا...", img: "https://alhqyq.com/contents/newsth/17729_0.jpg"},
                    {title: "برنامج رافد الحرمين يطلق خطة موسم الحج", desc: "...", img: "https://alhqyq.com/contents/newsth/17726_0.jpg"},
                    {title: "تحديثات عاجلة لطائرات A320", desc: "...", img: "https://alhqyq.com/contents/newsth/17725_0.jpg"},
                    {title: "الأهلي يبلغ نصف النهائي", desc: "...", img: "https://alhqyq.com/contents/newsth/17727_0.jpg"}
                ]); 
            }
        }
        fetchNews();
    </script>
</body>
</html>
