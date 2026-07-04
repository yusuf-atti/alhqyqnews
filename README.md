# ابتكر | Ibtakir

مشروع متجر ويب جاهز للعمل محليًا ومناسب للتحويل إلى تطبيق عبر AppsGeyser.

هيكل المجلد (مقترح):
Ibtakir/
├── index.html
├── products.html
├── product.html
├── cart.html
├── checkout.html
├── login.html (قابل للإضافة)
├── register.html (قابل للإضافة)
├── dashboard.html
├── profile.html (قابل للإضافة)
├── ai.html
├── about.html (قابل للإضافة)
├── contact.html (قابل للإضافة)
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── products.js
│   └── cart.js
├── images/
└── assets/

تشغيل:
- افتح `index.html` في المتصفح مباشرة (ملف محلي). كل الروابط نسبية.
- لا يلزم خادم أو Build.
- لتحويل إلى تطبيق Android باستخدام AppsGeyser: قم بتحميل مجلد المشروع إلى مضيف، أو ZIP وارفع حسب متطلبات AppsGeyser (يفضل رفع نسخة مستضافة على https).

ملاحظات تطويرية:
- استبدل صور الـ placeholder في مجلد images/.
- يمكن توصيل API لاحقًا بطرق بسيطة باستخدام fetch() إلى endpoints خارجية.
