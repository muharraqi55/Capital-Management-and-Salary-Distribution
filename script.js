// ============================================
// قائمة الوسائط - أضف صورك وفيديوهاتك هنا
// ============================================
const mediaItems = [
    // ===== الصور =====
    {
        type: 'image',
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/1.png',
        title: 'منظر طبيعي 1',
    },
    {
        type: 'image',
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/2.png',
        title: 'منظر طبيعي 2',
    },
    {
        type: 'image',
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/3.png',
        title: 'منظر طبيعي 3',
    },
    {
        type: 'image',
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/4.png',
        title: 'منظر طبيعي 4',
    },
    {
        type: 'image',
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/5.png',
        title: 'منظر طبيعي 5',
    },
    {
        type: 'image',
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/6.png',
        title: 'منظر طبيعي 6',
    },
    
    // ===== فيديوهات YouTube =====
    {
        type: 'youtube',
        videoId: 'y4ETb8WrcuQ',
        title: 'فيديو ممتع على YouTube',
    },
    {
        type: 'youtube',
        videoId: '9bZkp7q19f0',
        title: 'فيديو رائع آخر',
    },
];

// ============================================
// المتغيرات الأساسية
// ============================================
let currentIndex = 0;
let isPlaying = true;
let slideInterval = null;
let isYouTubePlaying = false;
let currentYouTubeIframe = null; // لتخزين إطار الفيديو الحالي
const SLIDE_DELAY = 5000; // 5 ثواني

const slidesContainer = document.getElementById('slidesContainer');
const dotsContainer = document.getElementById('dotsContainer');
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
// دالة لإيقاف فيديو YouTube
// ============================================
function stopYouTubeVideo(iframe) {
    if (!iframe) return;
    
    try {
        // محاولة إيقاف الفيديو باستخدام postMessage (يعمل مع معظم متصفحات)
        iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        
        // محاولة إعادة تحميل الإطار لإيقاف الفيديو تمامًا
        const src = iframe.src;
        if (src.includes('youtube.com')) {
            // إزالة autoplay وإضافة pause
            let newSrc = src.replace(/autoplay=1/g, 'autoplay=0');
            if (!newSrc.includes('autoplay')) {
                newSrc += '&autoplay=0';
            }
            // إضافة pause
            iframe.src = newSrc;
        }
        
        console.log('⏹️ تم إيقاف فيديو YouTube');
    } catch (e) {
        console.log('⚠️ تعذر إيقاف الفيديو:', e.message);
    }
}

// ============================================
// دالة لإيقاف جميع فيديوهات YouTube
// ============================================
function stopAllYouTubeVideos() {
    document.querySelectorAll('.slide iframe[src*="youtube.com"]').forEach(iframe => {
        stopYouTubeVideo(iframe);
    });
    isYouTubePlaying = false;
    currentYouTubeIframe = null;
}

// ============================================
// عرض الشرائح
// ============================================
function renderSlides() {
    slidesContainer.innerHTML = mediaItems.map((item, index) => {
        let content = '';
        let typeLabel = '';
        
        if (item.type === 'image') {
            content = `<img src="${item.src}" alt="${item.title}" data-index="${index}" class="slide-image">`;
            typeLabel = '🖼️ صورة';
        } else if (item.type === 'youtube') {
            const iframeId = `youtube-${index}`;
            content = `
                <iframe 
                    id="${iframeId}"
                    src="https://www.youtube.com/embed/${item.videoId}?autoplay=0&rel=0&controls=1&enablejsapi=1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            `;
            typeLabel = '🎬 YouTube';
        }
        
        return `
            <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}" data-type="${item.type}">
                ${content}
                <span class="type-label">${typeLabel}</span>
                <div class="title">${item.title}</div>
            </div>
        `;
    }).join('');

    dotsContainer.innerHTML = mediaItems.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');

    updateCounter();
    console.log(`✅ تم عرض ${mediaItems.length} عنصر`);
}

// ============================================
// التحقق من وجود فيديو في الشريحة الحالية
// ============================================
function isCurrentSlideYouTube() {
    const slides = document.querySelectorAll('.slide');
    if (slides[currentIndex]) {
        return slides[currentIndex].dataset.type === 'youtube';
    }
    return false;
}

// ============================================
// الحصول على إطار الفيديو الحالي
// ============================================
function getCurrentYouTubeIframe() {
    const slides = document.querySelectorAll('.slide');
    if (slides[currentIndex]) {
        return slides[currentIndex].querySelector('iframe[src*="youtube.com"]');
    }
    return null;
}

// ============================================
// الانتقال إلى شريحة معينة
// ============================================
function goToSlide(index) {
    if (index < 0) index = mediaItems.length - 1;
    if (index >= mediaItems.length) index = 0;

    // ✅ إيقاف جميع فيديوهات YouTube قبل الانتقال
    stopAllYouTubeVideos();

    // إخفاء جميع الشرائح
    document.querySelectorAll('.slide').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(el => el.classList.remove('active'));

    // إظهار الشريحة المطلوبة
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');

    currentIndex = index;
    updateCounter();
    
    // التحقق من نوع الشريحة الجديدة
    if (isCurrentSlideYouTube()) {
        // إذا كانت الشريحة الجديدة تحتوي على فيديو، أوقف التشغيل التلقائي مؤقتًا
        pauseAutoPlayForVideo();
        // تخزين إطار الفيديو الحالي
        currentYouTubeIframe = getCurrentYouTubeIframe();
        console.log('🎬 تم الانتقال إلى فيديو YouTube');
    } else {
        // إذا كانت صورة، استأنف التشغيل التلقائي
        currentYouTubeIframe = null;
        resumeAutoPlayAfterVideo();
        console.log('🖼️ تم الانتقال إلى صورة');
    }
    
    console.log(`📺 انتقل إلى: ${index + 1} / ${mediaItems.length}`);
}

function nextSlide() {
    // لا تنتقل إذا كان الفيديو يعمل
    if (isYouTubePlaying) {
        console.log('⏸️ الفيديو يعمل، لن ننتقل تلقائيًا');
        return;
    }
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    goToSlide(currentIndex - 1);
}

function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${mediaItems.length}`;
}

// ============================================
// التحكم في التشغيل التلقائي مع الفيديو
// ============================================
function pauseAutoPlayForVideo() {
    isYouTubePlaying = true;
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
        console.log('⏸️ تم إيقاف التشغيل التلقائي مؤقتًا (فيديو)');
    }
}

function resumeAutoPlayAfterVideo() {
    isYouTubePlaying = false;
    if (isPlaying && !slideInterval) {
        slideInterval = setInterval(nextSlide, SLIDE_DELAY);
        console.log('▶️ استئناف التشغيل التلقائي');
    }
}

function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    if (isPlaying && !isYouTubePlaying) {
        slideInterval = setInterval(nextSlide, SLIDE_DELAY);
        console.log('▶️ التشغيل التلقائي بدأ');
    } else if (isYouTubePlaying) {
        console.log('⏸️ الفيديو يعمل، التشغيل التلقائي متوقف مؤقتًا');
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
    if (isPlaying && !isYouTubePlaying) {
        startAutoPlay();
    } else if (isPlaying && isYouTubePlaying) {
        console.log('⏸️ الفيديو يعمل، لن يبدأ التشغيل التلقائي');
    } else {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// ============================================
// نافذة التكبير
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
playBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    slideInterval = null;
    // ✅ إيقاف الفيديو عند الانتقال يدويًا
    stopAllYouTubeVideos();
    isYouTubePlaying = false;
    prevSlide();
    startAutoPlay();
});

nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    slideInterval = null;
    // ✅ إيقاف الفيديو عند الانتقال يدويًا
    stopAllYouTubeVideos();
    isYouTubePlaying = false;
    nextSlide();
    startAutoPlay();
});

leftNav.addEventListener('click', () => {
    clearInterval(slideInterval);
    slideInterval = null;
    // ✅ إيقاف الفيديو عند الانتقال يدويًا
    stopAllYouTubeVideos();
    isYouTubePlaying = false;
    prevSlide();
    startAutoPlay();
});

rightNav.addEventListener('click', () => {
    clearInterval(slideInterval);
    slideInterval = null;
    // ✅ إيقاف الفيديو عند الانتقال يدويًا
    stopAllYouTubeVideos();
    isYouTubePlaying = false;
    nextSlide();
    startAutoPlay();
});

dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        clearInterval(slideInterval);
        slideInterval = null;
        // ✅ إيقاف الفيديو عند الانتقال يدويًا
        stopAllYouTubeVideos();
        isYouTubePlaying = false;
        const index = parseInt(e.target.dataset.index);
        goToSlide(index);
        startAutoPlay();
    }
});

slidesContainer.addEventListener('click', (e) => {
    const img = e.target.closest('.slide-image');
    if (img) {
        openModal(img.src);
    }
});

closeModal.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

// ============================================
// مراقبة التفاعل مع فيديو YouTube
// ============================================
document.addEventListener('click', (e) => {
    const iframe = e.target.closest('iframe[src*="youtube.com"]');
    if (iframe) {
        console.log('🎬 تفاعل مع فيديو YouTube');
        // عندما يتفاعل المستخدم مع الفيديو، نوقف التشغيل التلقائي
        pauseAutoPlayForVideo();
        currentYouTubeIframe = iframe;
        
        // إضافة مستمع لإيقاف الفيديو عند الانتقال
        const slide = iframe.closest('.slide');
        if (slide) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        // الفيديو لم يعد ظاهرًا، أوقفه واستأنف التشغيل التلقائي
                        console.log('🎬 فيديو YouTube لم يعد ظاهرًا، إيقاف التشغيل');
                        stopYouTubeVideo(iframe);
                        isYouTubePlaying = false;
                        currentYouTubeIframe = null;
                        resumeAutoPlayAfterVideo();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(slide);
        }
    }
});

// ============================================
// إيقاف الفيديو عند إغلاق الصفحة
// ============================================
window.addEventListener('beforeunload', () => {
    stopAllYouTubeVideos();
});

// ============================================
// اختصارات لوحة المفاتيح
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        clearInterval(slideInterval);
        slideInterval = null;
        // ✅ إيقاف الفيديو عند الانتقال باستخدام لوحة المفاتيح
        stopAllYouTubeVideos();
        isYouTubePlaying = false;
        nextSlide();
        startAutoPlay();
    }
    if (e.key === 'ArrowLeft') {
        clearInterval(slideInterval);
        slideInterval = null;
        // ✅ إيقاف الفيديو عند الانتقال باستخدام لوحة المفاتيح
        stopAllYouTubeVideos();
        isYouTubePlaying = false;
        prevSlide();
        startAutoPlay();
    }
    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        togglePlay();
    }
    if (e.key === 'Escape') {
        closeModalFunc();
    }
});

// ============================================
// بدء التشغيل
// ============================================
renderSlides();

// تأخير بسيط للتأكد من اكتمال العرض
setTimeout(() => {
    startAutoPlay();
}, 100);

console.log('✅ معرض الوسائط يعمل!');
console.log(`📊 عدد العناصر: ${mediaItems.length}`);
console.log('🎬 سيتم إيقاف الفيديو عند الانتقال إلى شريحة أخرى');
console.log('⌨️ اختصارات لوحة المفاتيح:');
console.log('  ➡️ → التالي');
console.log('  ⬅️ → السابق');
console.log('  Space → تشغيل/إيقاف');
console.log('  ESC → إغلاق التكبير');
