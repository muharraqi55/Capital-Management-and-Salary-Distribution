// ============================================
// قائمة الوسائط - أضف صورك وفيديوهاتك هنا
// ============================================
const mediaItems = [
    // ===== الصور =====
    {
        type: 'image',
        src: 'assets/images/1.png',
        title: 'منظر طبيعي خلاب',
    },
    {
        type: 'image',
        src: 'assets/images/2.png',
        title: 'تصميم جرافيكي رائع',
    },
    {
        type: 'image',
        src: 'assets/images/photo3.jpg',
        title: 'صورة شخصية جميلة',
    },
    
    // ===== فيديوهات YouTube =====
    {
        type: 'youtube',
        videoId: 'y4ETb8WrcuQ',  // ضع ID فيديو YouTube هنا
        title: 'فيديو ممتع على YouTube',
    },
    {
        type: 'youtube',
        videoId: '9bZkp7q19f0',  // مثال: PSY - Gangnam Style
        title: 'فيديو رائع آخر',
    },
    
    // ===== فيديوهات محلية (اختياري) =====
    {
         type: 'video',
         src: 'assets/videos/2.mp4',
         title: 'فيديو محلي',
     },
];

// ============================================
// المتغيرات الأساسية
// ============================================
let currentIndex = 0;
let isPlaying = true;
let slideInterval = null;
const SLIDE_DELAY = 5000; // 5 ثواني

const slider = document.getElementById('slider');
const dotsContainer = document.getElementById('dots');
const counter = document.getElementById('counter');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const leftNav = document.getElementById('leftNav');
const rightNav = document.getElementById('rightNav');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

// ============================================
// عرض الوسائط
// ============================================
function renderSlides() {
    slider.innerHTML = mediaItems.map((item, index) => {
        let content = '';
        let typeLabel = '';
        
        if (item.type === 'image') {
            content = `<img src="${item.src}" alt="${item.title}" data-index="${index}" class="slide-image">`;
            typeLabel = '🖼️ صورة';
        } else if (item.type === 'youtube') {
            content = `
                <iframe 
                    src="https://www.youtube.com/embed/${item.videoId}?autoplay=0&rel=0&controls=1&loop=1&playlist=${item.videoId}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style="width: 100%; height: 100%;"
                ></iframe>
            `;
            typeLabel = '🎬 YouTube';
        } else if (item.type === 'video') {
            content = `
                <video controls autoplay muted loop>
                    <source src="${item.src}" type="video/mp4">
                    متصفحك لا يدعم الفيديو
                </video>
            `;
            typeLabel = '🎥 فيديو';
        }
        
        return `
            <div class="slide" data-index="${index}">
                ${content}
                <span class="slide-type">${typeLabel}</span>
                <div class="slide-title">${item.title}</div>
            </div>
        `;
    }).join('');
    
    // إضافة نقاط التقدم
    dotsContainer.innerHTML = mediaItems.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');
    
    // تحديث العداد
    updateCounter();
}

// ============================================
// تحديث العرض
// ============================================
function goToSlide(index) {
    if (index < 0) index = mediaItems.length - 1;
    if (index >= mediaItems.length) index = 0;
    
    currentIndex = index;
    const offset = -index * 100;
    slider.style.transform = `translateX(${offset}%)`;
    
    // تحديث النقاط
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    updateCounter();
}

function nextSlide() {
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    goToSlide(currentIndex - 1);
}

function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${mediaItems.length}`;
}

// ============================================
// التحكم في التشغيل التلقائي
// ============================================
function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    if (isPlaying) {
        slideInterval = setInterval(nextSlide, SLIDE_DELAY);
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
    if (isPlaying) {
        startAutoPlay();
    } else {
        clearInterval(slideInterval);
    }
}

// ============================================
// فتح نافذة الزوم (للكبس على الصورة)
// ============================================
function openModal(src) {
    modal.style.display = 'flex';
    modalImage.src = src;
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// الأحداث (Event Listeners)
// ============================================
// أزرار التحكم
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => { clearInterval(slideInterval); prevSlide(); startAutoPlay(); });
nextBtn.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); startAutoPlay(); });
leftNav.addEventListener('click', () => { clearInterval(slideInterval); prevSlide(); startAutoPlay(); });
rightNav.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); startAutoPlay(); });

// النقاط
dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        clearInterval(slideInterval);
        const index = parseInt(e.target.dataset.index);
        goToSlide(index);
        startAutoPlay();
    }
});

// الزوم عند النقر على الصورة
slider.addEventListener('click', (e) => {
    const img = e.target.closest('.slide-image');
    if (img) {
        openModal(img.src);
    }
});

// إغلاق الزوم
closeModal.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { clearInterval(slideInterval); nextSlide(); startAutoPlay(); }
    if (e.key === 'ArrowLeft') { clearInterval(slideInterval); prevSlide(); startAutoPlay(); }
    if (e.key === ' ' || e.key === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModalFunc();
});

// ============================================
// بدء التشغيل
// ============================================
renderSlides();
startAutoPlay();

// عرض مساعدة في الكونسول
console.log('✅ معرض الوسائط يعمل!');
console.log(`📊 عدد العناصر: ${mediaItems.length}`);
console.log('⌨️ اختصارات لوحة المفاتيح:');
console.log('  ➡️ → التالي');
console.log('  ⬅️ → السابق');
console.log('  Space → تشغيل/إيقاف');
console.log('  ESC → إغلاق الزوم');
