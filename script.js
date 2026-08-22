// ============================================
// قائمة الملفات الثابتة - عدل هنا حسب ملفاتك
// ============================================
const mediaFiles = [
    // ===== الصور =====
    { 
        type: 'image', 
        src: 'assets/images/1.png', 
        title: 'منظر طبيعي جميل' 
    },
    { 
        type: 'image', 
        src: 'assets/images/photo2.png', 
        title: 'تصميم جرافيكي' 
    },
    { 
        type: 'image', 
        src: 'assets/images/photo3.jpg', 
        title: 'صورة شخصية' 
    },
    
    // ===== الفيديوهات =====
    { 
        type: 'video', 
        src: 'assets/videos/1.mp4', 
        title: 'فيديو تعليمي 1' 
    },
    { 
        type: 'video', 
        src: 'assets/videos/video2.mp4', 
        title: 'فيديو ممتع' 
    },
];

// ============================================
// عرض الملفات في المعرض
// ============================================
const gallery = document.getElementById('gallery');

function displayMedia() {
    // التحقق إذا كانت القائمة فارغة
    if (mediaFiles.length === 0) {
        gallery.innerHTML = `
            <div class="no-media">
                <span>📂</span>
                لا توجد صور أو فيديوهات<br>
                <small style="color: #555;">أضف ملفاتك في مجلد assets</small>
            </div>
        `;
        return;
    }

    // إنشاء عناصر المعرض
    gallery.innerHTML = mediaFiles.map((item, index) => {
        // تحديد نوع الملف
        const isVideo = item.type === 'video';
        
        // إنشاء العنصر
        return `
            <div class="item" data-index="${index}">
                ${isVideo 
                    ? `<video controls preload="metadata">
                        <source src="${item.src}" type="video/mp4">
                        <source src="${item.src}" type="video/webm">
                        متصفحك لا يدعم تشغيل الفيديو
                       </video>`
                    : `<img src="${item.src}" alt="${item.title}" loading="lazy">`
                }
                <div class="caption">
                    📌 ${item.title}
                    ${isVideo ? ' 🎬' : ' 🖼️'}
                </div>
            </div>
        `;
    }).join('');

    // إضافة رسالة في الكونسول للمساعدة
    console.log(`✅ تم عرض ${mediaFiles.length} ملف بنجاح`);
    console.log(`📸 صور: ${mediaFiles.filter(f => f.type === 'image').length}`);
    console.log(`🎬 فيديوهات: ${mediaFiles.filter(f => f.type === 'video').length}`);
}

// ============================================
// تشغيل العرض عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', displayMedia);

// ============================================
// (اختياري) عرض رسالة خطأ إذا فشل تحميل الصور
// ============================================
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        const parent = e.target.parentElement;
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #111;
            color: #666;
            font-size: 0.9rem;
        `;
        errorMsg.textContent = '❌ تعذر تحميل الصورة';
        parent.insertBefore(errorMsg, e.target);
    }
}, true);
