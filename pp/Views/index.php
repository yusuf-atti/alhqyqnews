<?php
// ====================================================================
// ملف: admin/login.php
// الوظيفة: عرض نموذج تسجيل الدخول لمحرري ومدراء الصحيفة.
// ====================================================================
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>دخول المدير | صحيفة الحقيقة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Tajawal', sans-serif; background-color: #0f172a; color: #f8fafc; }
        .login-box { background-color: #1e293b; border: 1px solid #334155; }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen">

    <div class="login-box p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h1 class="text-3xl font-bold mb-2 text-[#D4AF37]">القيادة المركزية</h1>
        <p class="text-gray-400 mb-8">سجل الدخول للمتابعة إلى لوحة تحكم التحرير.</p>

        <form action="/admin/auth/login" method="POST" class="space-y-4 text-right">
            <div>
                <label for="email" class="text-sm text-gray-400 block mb-1">البريد الإلكتروني</label>
                <input type="email" id="email" name="email" required
                       class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#D4AF37] outline-none text-white">
            </div>
            <div>
                <label for="password" class="text-sm text-gray-400 block mb-1">كلمة المرور</label>
                <input type="password" id="password" name="password" required
                       class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#D4AF37] outline-none text-white">
            </div>
            
            <button type="submit" class="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition">
                تسجيل الدخول
            </button>
        </form>

    </div>

</body>
</html>
