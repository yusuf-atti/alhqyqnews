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
        <button onclick="toggleChat()" class="w-14 h-14 bg-gold-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><i data-lucide="sparkles" class="w-6 h-6 text-black"></i></button>
    </div>

    <!-- Hidden Audio Player -->
    <audio id="tts-player" class="hidden"></audio>

    <!-- Modals -->
    <div id="analysis-modal" class="fixed inset-0 z-[60] bg-black/80 hidden items-center justify-center p-4">
        <div class="bg-navy-800 w-full max-w-2xl rounded-2xl border border-gold-400/30 p-6">
            <div class="flex justify-between mb-4"><h3 class="text-white font-bold">تحليل AI</h3><button onclick="closeAnalysis()" class="text-gray-400"><i data-lucide="x"></i></button></div>
            <div id="analysis-result" class="text-gray-300 prose prose-invert max-h-[60vh] overflow-y-auto"></div>
        </div>
    </div>

    <!-- Quiz Modal -->
    <div id="quiz-modal" class="fixed inset-0 z-[65] bg-black/80 hidden items-center justify-center p-4">
        <div class="bg-navy-800 w-full max-w-md rounded-2xl border border-gold-400/30 p-6 text-center">
            <div class="flex justify-between mb-4"><h3 class="text-white font-bold text-lg">🧠 تحدي المعرفة</h3><button onclick="closeQuiz()" class="text-gray-400"><i data-lucide="x"></i></button></div>
            <div id="quiz-content" class="space-y-4">
                <div class="loader mx-auto"></div>
                <p class="text-gray-400 text-sm">جاري توليد سؤال ذكي حول الخبر...</p>
            </div>
        </div>
    </div>

    <div id="settings-modal" class="fixed inset-0 z-[70] bg-black/90 hidden items-center justify-center p-4">
        <div class="bg-navy-800 w-full max-w-md rounded-xl p-6">
            <h3 class="text-white font-bold mb-4">إعدادات AI</h3>
            <p class="text-gray-400 text-sm mb-4">أدخل مفتاح Gemini API لتفعيل الميزات الذكية (التحليل، القراءة الصوتية، الاختبارات).</p>
            <input type="password" id="api-key-input" placeholder="Gemini API Key" class="w-full bg-black/50 p-3 rounded text-white mb-4">
            <button onclick="saveApiKey()" class="w-full bg-gold-400 text-black font-bold py-2 rounded">حفظ</button>
            <button onclick="document.getElementById('settings-modal').classList.add('hidden')" class="w-full mt-2 text-gray-400">إلغاء</button>
        </div>
    </div>

    <script>
        lucide.createIcons();
        let userApiKey = localStorage.getItem('gemini_api_key') || "";
        const apiKey = ""; // Keep empty
        const RSS_URL = "https://alhqyq.com/rss-action-feed-m-news-id-0-feed-rss20.xml";
        let fetchedNewsData = [];

        function openSettings() { document.getElementById('settings-modal').classList.remove('hidden'); }
        function saveApiKey() { 
            const key = document.getElementById('api-key-input').value;
            if(key) { localStorage.setItem('gemini_api_key', key); userApiKey = key; document.getElementById('settings-modal').classList.add('hidden'); }
        }
        
        const getApiKey = () => userApiKey || apiKey;

        // --- Helper: Convert Base64 PCM to WAV ---
        function pcmToWav(pcmData) {
            const binaryString = window.atob(pcmData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
            
            const wavHeader = new ArrayBuffer(44);
            const view = new DataView(wavHeader);
            const writeString = (view, offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
            
            writeString(view, 0, 'RIFF'); view.setUint32(4, 36 + bytes.length, true); writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
            view.setUint32(24, 24000, true); view.setUint32(28, 48000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
            writeString(view, 36, 'data'); view.setUint32(40, bytes.length, true);
            
            const wavBytes = new Uint8Array(wavHeader.byteLength + bytes.length);
            wavBytes.set(new Uint8Array(wavHeader), 0);
            wavBytes.set(bytes, wavHeader.byteLength);
            return new Blob([wavBytes], { type: 'audio/wav' });
        }

        // --- Gemini API Callers ---
        async function callGeminiText(prompt, systemPrompt, jsonMode = false) {
            if(!getApiKey()) { openSettings(); return null; }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${getApiKey()}`;
            try {
                const payload = {
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
                };
                const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
                if(!res.ok) throw new Error("API Error");
                const data = await res.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch(e) { console.error(e); return null; }
        }

        async function callGeminiTTS(text) {
            if(!getApiKey()) { openSettings(); return null; }
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${getApiKey()}`;
            try {
                const payload = {
                    contents: [{ parts: [{ text: text }] }],
                    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } }
                };
                const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
                if(!res.ok) throw new Error("TTS Error");
                const data = await res.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            } catch(e) { console.error(e); return null; }
        }

        // --- Feature 1: Analyze News ---
        async function analyzeNews(title, desc) {
            document.getElementById('analysis-modal').classList.remove('hidden'); document.getElementById('analysis-modal').classList.add('flex');
            document.getElementById('analysis-result').innerHTML = '<div class="loader mx-auto"></div><p class="text-center text-sm text-gray-400 mt-2">جارٍ التحليل...</p>';
            const text = await callGeminiText(`حلل هذا الخبر باختصار: ${title} - ${desc}`, "أنت محلل إخباري.");
            document.getElementById('analysis-result').innerHTML = marked.parse(text || "حدث خطأ أو لم يتم إدخال المفتاح.");
        }
        function closeAnalysis() { document.getElementById('analysis-modal').classList.add('hidden'); document.getElementById('analysis-modal').classList.remove('flex'); }

        // --- Feature 2: Smart Audio (TTS) ---
        async function speakNews(title, desc, btnId) {
            const btn = document.getElementById(btnId);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>`;
            btn.disabled = true;

            const summary = await callGeminiText(`لخص هذا الخبر في جملة واحدة جذابة للبث الإذاعي: ${title}`, "أنت مذيع أخبار.");
            if(summary) {
                const audioData = await callGeminiTTS(summary);
                if(audioData) {
                    const blob = pcmToWav(audioData);
                    const audio = document.getElementById('tts-player');
                    audio.src = URL.createObjectURL(blob);
                    audio.play();
                    btn.classList.add('text-green-400', 'border-green-400');
                    audio.onended = () => { btn.innerHTML = originalHTML; btn.disabled = false; btn.classList.remove('text-green-400', 'border-green-400'); lucide.createIcons(); };
                    return;
                }
            }
            btn.innerHTML = originalHTML; btn.disabled = false; alert("تعذر تشغيل الصوت.");
        }

        // --- Feature 3: Knowledge Quiz ---
        async function startQuiz(title, desc) {
            const modal = document.getElementById('quiz-modal');
            const content = document.getElementById('quiz-content');
            modal.classList.remove('hidden'); modal.classList.add('flex');
            content.innerHTML = '<div class="loader mx-auto"></div><p class="text-gray-400 text-sm mt-2">جاري إعداد السؤال...</p>';

            const json = await callGeminiText(
                `Create 1 multiple choice question about: "${title}". JSON Format: {question:string, options:string[], correctIndex:number}`, 
                "You are a quiz generator.", 
                true
            );

            if(json) {
                const q = JSON.parse(json);
                let html = `<h4 class="text-white font-bold mb-4 text-right">${q.question}</h4><div class="space-y-2">`;
                q.options.forEach((opt, idx) => {
                    html += `<button onclick="checkAnswer(this, ${idx === q.correctIndex})" class="w-full text-right p-3 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition">${opt}</button>`;
                });
                html += `</div><div id="quiz-feedback" class="mt-3 h-6 font-bold text-sm"></div>`;
                content.innerHTML = html;
            } else {
                content.innerHTML = '<p class="text-red-400">حدث خطأ.</p>';
            }
        }
        function checkAnswer(btn, isCorrect) {
            const feedback = document.getElementById('quiz-feedback');
            if(isCorrect) {
                btn.classList.add('bg-green-500/20', 'border-green-500');
                feedback.innerHTML = '<span class="text-green-400">إجابة صحيحة! 🎉</span>';
            } else {
                btn.classList.add('bg-red-500/20', 'border-red-500');
                feedback.innerHTML = '<span class="text-red-400">حاول مرة أخرى.</span>';
            }
        }
        function closeQuiz() { document.getElementById('quiz-modal').classList.add('hidden'); document.getElementById('quiz-modal').classList.remove('flex'); }

        // --- Chat ---
        function toggleChat() { document.getElementById('ai-chat-window').classList.toggle('hidden'); }
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const msg = input.value; if(!msg) return;
            const chat = document.getElementById('chat-messages');
            chat.innerHTML += `<div class="text-right bg-gold-400 text-black p-2 rounded mb-2 ml-auto w-fit">${msg}</div>`;
            input.value = '';
            const reply = await callGeminiText(msg, "أنت مساعد صحيفة الحقيقة.");
            chat.innerHTML += `<div class="text-left bg-white/10 p-2 rounded mb-2 w-fit">${marked.parse(reply || "خطأ")}</div>`;
            chat.scrollTop = chat.scrollHeight;
        }

        // --- Render ---
        function renderSite(news) {
            if(!news.length) return;
            const hero = news[0];
            const safe = (s) => s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            
            // Hero
            document.getElementById('hero-section').innerHTML = `
                <div class="lg:col-span-8 relative group rounded-2xl overflow-hidden h-[400px] lg:h-full cursor-pointer">
                    <img src="${hero.img}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div class="absolute top-4 right-4 flex gap-2 z-20">
                        <button onclick="speakNews('${safe(hero.title)}', '${safe(hero.desc)}', 'hero-tts')" id="hero-tts" class="bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition" title="استمع للخبر"><i data-lucide="headphones" class="w-5 h-5"></i></button>
                        <button onclick="startQuiz('${safe(hero.title)}', '${safe(hero.desc)}')" class="bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition" title="اختبر معلوماتك"><i data-lucide="help-circle" class="w-5 h-5"></i></button>
                    </div>
                    <div class="absolute bottom-0 p-8">
                        <h1 class="text-3xl font-bold text-white mb-2">${hero.title}</h1>
                        <button onclick="analyzeNews('${safe(hero.title)}', '${safe(hero.desc)}')" class="bg-gold-400 text-black px-3 py-1 rounded text-sm font-bold flex items-center gap-1"><i data-lucide="sparkles" class="w-3 h-3"></i> تحليل AI</button>
                    </div>
                </div>
                <div class="lg:col-span-4 flex flex-col gap-4 h-[400px] lg:h-full">
                    ${news.slice(1,3).map(n => `<div class="flex-1 relative rounded-xl overflow-hidden"><img src="${n.img}" class="w-full h-full object-cover"><div class="absolute bottom-0 p-4 bg-black/60 w-full"><h3 class="text-white font-bold text-sm">${n.title}</h3></div></div>`).join('')}
                </div>
            `;

            // Feed
            document.getElementById('news-container').innerHTML = news.slice(3).map((n, idx) => `
                <div class="flex gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                    <img src="${n.img}" class="w-32 h-24 object-cover rounded-lg">
                    <div class="flex-1">
                        <h3 class="text-white font-bold text-lg mb-2 line-clamp-1">${n.title}</h3>
                        <p class="text-gray-400 text-xs line-clamp-2 mb-3">${n.desc}</p>
                        <div class="flex gap-2">
                            <button onclick="analyzeNews('${safe(n.title)}', '${safe(n.desc)}')" class="text-gold-400 text-xs border border-gold-400/30 px-2 py-1 rounded hover:bg-gold-400 hover:text-black transition">تحليل</button>
                            <button id="tts-${idx}" onclick="speakNews('${safe(n.title)}', '${safe(n.desc)}', 'tts-${idx}')" class="text-gray-400 text-xs border border-white/10 px-2 py-1 rounded hover:bg-white hover:text-black transition" title="استماع"><i data-lucide="headphones" class="w-3 h-3"></i></button>
                            <button onclick="startQuiz('${safe(n.title)}', '${safe(n.desc)}')" class="text-gray-400 text-xs border border-white/10 px-2 py-1 rounded hover:bg-white hover:text-black transition" title="اختبار"><i data-lucide="help-circle" class="w-3 h-3"></i></button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Sidebar
            document.getElementById('sidebar-content').innerHTML = news.slice(0,5).reverse().map(n => `<div class="flex gap-2 items-center"><img src="${n.img}" class="w-12 h-12 rounded object-cover"><h4 class="text-gray-300 text-xs line-clamp-2">${n.title}</h4></div>`).join('');
            
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
        document.getElementById('chat-input').addEventListener('keypress', function (e) { if (e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>
