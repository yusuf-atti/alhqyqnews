# ملف: .htaccess (في المجلد الرئيسي)

# تفعيل محرك إعادة الكتابة
RewriteEngine On

# التأكد من توجيه طلبات /api/hr/ إلى api.php
# هذا يحول: /api/hr/generate-invite?x=1
# إلى: api.php/api/hr/generate-invite?x=1
RewriteRule ^api/hr/(.*)$ api.php/$0 [L,QSA]
