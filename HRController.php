// ملف: app/Controllers/HRController.php

// ... الكود قبل الدالة ...
    
// الإجراء: توليد رابط توظيف سري (Job Invite Link)
public function generateInvite() {
    
    // ... توليد $job_id و $encrypted_token ...

    // السطر المطلوب تعديله: بناء الرابط
    $invite_link = 'https://alhaqiqa.com/?mode=recruitment&token=' . $encrypted_token; // هذا هو السطر الحالي
    
    // ... باقي الكود ...
}

// ... الكود بعد الدالة ...
