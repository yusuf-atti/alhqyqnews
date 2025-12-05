<?php
// ====================================================================
// ملف: app/Controllers/HRController.php
// ...
// ====================================================================

// ... (بقية الكود والمُنشئ) ...

    // ----------------------------------------------------------------
    // الإجراء: توليد رابط توظيف سري (Job Invite Link)
    // ----------------------------------------------------------------
    public function generateInvite() {
        // 1. توليد رقم وظيفي جديد فريد وآمن
        $job_id = 'HR-' . time() . bin2hex(random_bytes(4));
        
        // 2. بناء بيانات التوكن المشفرة
        $token_payload = ['job_id' => $job_id, 'expires' => time() + (3600 * 24 * 7)];
        $encrypted_token = base64_encode(json_encode($token_payload)); 
        
        // **التعديل هنا:** استخدام الرابط الجديد
        $invite_link = 'https://yusuf-atti.github.io/alhqyqnews/?mode=recruitment&token=' . $encrypted_token;
        
        // 3. توليد كلمة مرور مؤقتة عشوائية وآمنة
        $temp_password = bin2hex(random_bytes(4));
        
        // إرسال استجابة JSON: تعيين رأس (Header) لـ JSON
        header('Content-Type: application/json');
        
        echo json_encode([
            'success' => true,
            'message' => 'تم إنشاء رابط الدعوة بنجاح.',
            'link' => $invite_link, 
            'temp_password' => $temp_password, 
            'job_id' => $job_id
        ]);
        
        exit;
    }
    
// ... (بقية الكود) ...
}
?>
