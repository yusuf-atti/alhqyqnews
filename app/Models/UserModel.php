<?php
// ملف: app/Models/UserModel.php
// الوظيفة: محاكاة التعامل مع قاعدة بيانات المستخدمين (لأغراض العقد والتوظيف)

class UserModel {
    
    // محاكاة جلب جميع المستخدمين (لغرض عرض الهيكل التنظيمي)
    public function getAllUsers() {
        // في تطبيق حقيقي، سيتم هنا استدعاء Firebase Firestore أو قاعدة بيانات SQL
        return [
            ['id' => 1, 'name' => 'يوسف', 'title' => 'الرئيس التنفيذي', 'level' => 'high'],
            ['id' => 2, 'name' => 'فهد', 'title' => 'مدير التحرير', 'level' => 'middle'],
            // ... المزيد من الأعضاء
        ];
    }
    
    // محاكاة التحقق من تكرار الإيميل أو السجل المدني
    public function isUserExists($civil_id, $email) {
        // في هذا المثال، نفترض أن الرقم المدني "1000000000" موجود بالفعل
        if ($civil_id === '1000000000' || $email === 'test@example.com') {
            return true;
        }
        return false;
    }
    
    // محاكاة إنشاء موظف جديد وحفظ بياناته
    public function createNewEmployee($data) {
        // منطق حفظ بيانات العقد في Firestore
        return true; 
    }
}
?>
