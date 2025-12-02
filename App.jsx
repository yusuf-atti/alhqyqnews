import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// =======================================================================
// إعدادات Firebase العامة - يجب استخدامها كما هي
// =======================================================================
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// =======================================================================
// مكون التطبيق الرئيسي
// =======================================================================

const contractText = `
    يقر الطرف الثاني بقراءة وفهم جميع بنود العقد، ويشمل ذلك:
    1.  **حصرية النشر:** جميع المواد المقدمة حصرية لصحيفة الحقيقة الإلكترونية.
    2.  **فترة التجربة:** خضوع العضوية لفترة تجربة مدتها 90 يوماً.
    3.  **التوزيع الجغرافي:** تحديد مكتب العضوية المرجعي بـ **[officeRegion]**.
    4.  **التوقيع الملزم:** يعتبر التوقيع الإلكتروني (البصمة الرقمية) بمثابة توقيع يدوي ملزم.
`;

// دالة محاكاة لتوليد البصمة الرقمية للجهاز
const generateDigitalHash = () => {
  // يولد بصمة فريدة للجهاز بناءً على المتصفح والوقت
  const userAgent = navigator.userAgent;
  const timestamp = Date.now();
  const rawString = `${userAgent}-${timestamp}-${Math.random()}`;
  
  // محاكاة لـ SHA-256 بسيط
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // تحويل إلى عدد صحيح 32 بت
  }
  return hash.toString(16).toUpperCase().padStart(8, '0');
};

const regionalOffices = [
    { value: 'الوسطى', label: 'المنطقة الوسطى (الرياض)' },
    { value: 'الغربية', label: 'المنطقة الغربية (جدة، مكة)' },
    { value: 'الشرقية', label: 'المنطقة الشرقية (الدمام، الخبر)' },
    { value: 'الشمالية', label: 'المنطقة الشمالية' },
    { value: 'الجنوبية', label: 'المنطقة الجنوبية' },
    { value: 'جازان', label: 'المكتب الرئيسي (جازان)' },
];

const App = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [officeRegion, setOfficeRegion] = useState('الوسطى');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [digitalHash, setDigitalHash] = useState(null);

    // 1. تهيئة Firebase والمصادقة
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);
            
            setDb(firestoreDb);
            setAuth(firebaseAuth);

            // المصادقة باستخدام الرمز المخصص أو مجهول
            const authenticate = async () => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(firebaseAuth, initialAuthToken);
                    } else {
                        await signInAnonymously(firebaseAuth);
                    }
                } catch (e) {
                    console.error("Firebase Auth Error:", e);
                    setError("فشل المصادقة مع Firebase. يرجى إعادة تحميل الصفحة.");
                }
            };
            authenticate();

            // الاستماع لحالة المصادقة
            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                if (user) {
                    setUserId(user.uid);
                    setDigitalHash(generateDigitalHash()); // توليد البصمة بعد المصادقة
                }
                setLoading(false);
            });
            
            return () => unsubscribe();
        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            setError("فشل تهيئة Firebase. تحقق من الإعدادات.");
            setLoading(false);
        }
    }, []);

    // 2. التحقق من الهوية الوطنية
    const validateNationalId = useCallback((id) => {
        if (!id || id.length !== 10) {
            return "يجب أن يتكون رقم الهوية من 10 أرقام بالضبط.";
        }
        if (id[0] !== '1') {
            return "يجب أن يبدأ رقم الهوية الوطنية السعودية بالرقم '1'.";
        }
        if (!/^\d+$/.test(id)) {
            return "يجب أن يحتوي رقم الهوية على أرقام فقط.";
        }
        return null;
    }, []);

    // 3. معالجة إرسال النموذج وحفظ العقد
    const handleSubmission = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmissionStatus(null);
        
        if (loading || !db || !userId) {
            setError("النظام لا يزال قيد التحميل أو المصادقة.");
            return;
        }

        const idError = validateNationalId(nationalId);
        if (idError) {
            setError(idError);
            return;
        }

        try {
            setLoading(true);
            const membershipRef = doc(db, `artifacts/${appId}/users/${userId}/memberships`, 'contract_data');
            
            const contractData = {
                name: name,
                national_id: nationalId,
                office_region: officeRegion,
                digital_signature_hash: digitalHash, // البصمة الرقمية الملزمة
                timestamp: Date.now(),
                contract_accepted: true,
                contract_version: '1.2_AI_Enhanced',
                userId: userId,
            };

            await setDoc(membershipRef, contractData);

            setSubmissionStatus("🎉 تم توثيق العقد بنجاح! نرحب بك في غرفة القيادة لصحيفة الحقيقة.");
            setLoading(false);

        } catch (e) {
            console.error("Firestore Save Error:", e);
            setError("فشل في حفظ العقد: قد تكون هناك مشكلة في الاتصال أو الصلاحيات.");
            setLoading(false);
        }
    };
    
    // تصميم الواجهة (Tailwind CSS)
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex justify-center items-center font-['Tajawal',sans-serif]">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                    body { font-family: 'Tajawal', sans-serif; }
                `}
            </style>

            <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">
                
                <h1 className="text-4xl font-bold mb-2 text-yellow-400 text-center">توثيق العقد الإلكتروني</h1>
                <p className="text-gray-400 mb-8 text-center">شروط العضوية والأمان لصحيفة الحقيقة</p>

                {/* حالة النظام */}
                {loading && (
                    <div className="p-4 mb-4 text-center bg-blue-900/50 rounded-lg">
                        جاري تهيئة النظام والمصادقة...
                    </div>
                )}

                {error && (
                    <div className="p-4 mb-4 text-sm text-red-300 bg-red-900/50 rounded-lg border border-red-700">
                        {error}
                    </div>
                )}

                {submissionStatus && (
                    <div className="p-4 mb-4 text-lg text-green-300 bg-green-900/50 rounded-lg border border-green-700 font-bold">
                        {submissionStatus}
                    </div>
                )}

                {!loading && !submissionStatus && (
                    <form onSubmit={handleSubmission} className="space-y-6">
                        
                        {/* معلومات العضو */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-700/30 p-6 rounded-xl">
                            <h2 className="col-span-full text-xl font-semibold mb-2 text-yellow-300">بيانات العضوية</h2>
                            
                            {/* حقل الاسم */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">الاسم الكامل</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

                            {/* حقل الهوية الوطنية */}
                            <div>
                                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-300 mb-1">رقم الهوية الوطنية (10 أرقام تبدأ بـ 1)</label>
                                <input
                                    type="text"
                                    id="nationalId"
                                    value={nationalId}
                                    onChange={(e) => setNationalId(e.target.value)}
                                    maxLength="10"
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

                            {/* اختيار المنطقة */}
                            <div className="md:col-span-2">
                                <label htmlFor="officeRegion" className="block text-sm font-medium text-gray-300 mb-1">مكتب العضوية المرجعي (المادة 1.1)</label>
                                <select
                                    id="officeRegion"
                                    value={officeRegion}
                                    onChange={(e) => setOfficeRegion(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
                                    required
                                >
                                    {regionalOffices.map(office => (
                                        <option key={office.value} value={office.value}>{office.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* نص العقد وبصمة الأمان */}
                        <div className="bg-gray-700/30 p-6 rounded-xl space-y-4">
                            <h2 className="text-xl font-semibold text-yellow-300">ملخص بنود العقد الملزمة</h2>
                            <div className="text-gray-300 whitespace-pre-line border border-gray-600 p-4 rounded-lg bg-gray-800 text-right">
                                {/* استبدال متغير المنطقة في نص العقد */}
                                {contractText.replace('[officeRegion]', officeRegion)}
                            </div>
                            
                            <p className="text-sm text-gray-400">
                                <span className="text-red-500 font-bold">تنبيه أمني:</span> يتم توثيق قبولك لهذا العقد بـ **البصمة الرقمية** لجهازك (المادة 2.2).
                            </p>
                            
                            <div className="text-center p-3 border-2 border-dashed border-yellow-600/50 rounded-lg">
                                <span className="text-sm text-yellow-400">رمز التوثيق الرقمي (Digital Signature Hash):</span>
                                <p className="font-mono text-xl text-white mt-1 select-all">
                                    {digitalHash || 'جاري التوليد...'}
                                </p>
                            </div>
                        </div>

                        {/* زر القبول */}
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-extrabold py-3 rounded-xl transition shadow-lg shadow-yellow-500/30 text-lg disabled:opacity-50"
                            disabled={loading}
                        >
                            قبول البنود وتوثيق العقد إلكترونياً
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default App;
