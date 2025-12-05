<?php
// ملف: api.php - توجيه طلبات API إلى HRController

// 1. إعداد المتغيرات البيئية
define('ROOT_PATH', __DIR__);
define('APP_PATH', ROOT_PATH . '/app');

// 2. تضمين Controller
require_once APP_PATH . '/Controllers/HRController.php';

// 3. تحليل المسار (URL)
// مثال: إذا كان الطلب هو /api/hr/generate-invite
$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// نبحث عن الجزء الأخير من المسار بعد "api/hr"
// (هذا يعتمد على إعدادات .htaccess التي سنضيفها لاحقاً)
$parts = explode('/', $uri);
$action = end($parts); // مثل 'generate-invite' أو 'submit-contract'

// 4. تحديد اسم الدالة (Method) من المسار
// تحويل 'generate-invite' إلى 'generateInvite'
$methodName = str_replace('-', '', lcfirst(ucwords($action, '-'))); 

// 5. إنشاء Controller واستدعاء الدالة
if (!empty($action) && (strpos($action, 'invite') !== false || strpos($action, 'contract') !== false)) {
    
    // إذا كانت المسارات تبدأ بـ 'api' و 'hr'
    // يتم إنشاء Controller
    $controller = new HRController();

    if (method_exists($controller, $methodName)) {
        // استدعاء الدالة المطلوبة (مثل $controller->generateInvite())
        $controller->$methodName();
    } else {
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'API Endpoint not found: ' . $action]);
    }
} else {
    // إذا لم يكن الطلب لـ HR API
    header('Content-Type: application/json');
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Invalid API Request.']);
}
?>
