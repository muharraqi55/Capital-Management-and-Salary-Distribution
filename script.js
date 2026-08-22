// ============================================
// قائمة الوسائط - أضف صورك وفيديوهاتك هنا
// ============================================
const mediaItems = [
    // ===== الصور =====
    {
        type: 'image',
        src: 'assets/images/1.png',
        title: 'منظر طبيعي 1',
    },
    {
        type: 'image',
        src: 'assets/images/2.png',
        title: 'منظر طبيعي 2',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/seed/3/1920/1080',
        title: 'منظر طبيعي 3',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/seed/4/1920/1080',
        title: 'منظر طبيعي 4',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/seed/5/1920/1080',
        title: 'منظر طبيعي 5',
    },
    {
        type: 'image',
        src: 'https://picsum.photos/seed/6/1920/1080',
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
            content = `
                <iframe 
                    src="https://www.youtube.com/embed/${item.videoId}?autoplay=0&rel=0&controls=1&loop=1&playlist=${item.videoId}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            `;
            typeLabel = '🎬 YouTube';
        }
        
        return `
            <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
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
// الانتقال إلى شريحة معينة
// ============================================
function goToSlide(index) {
    if (index < 0) index = mediaItems.length - 1;
    if (index >= mediaItems.length) index = 0;

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
    console.log(`📺 انتقل إلى: ${index + 1} / ${mediaItems.length}`);
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
// التشغيل التلقائي
// ============================================
function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    if (isPlaying) {
        slideInterval = setInterval(nextSlide, SLIDE_DELAY);
        console.log('▶️ التشغيل التلقائي بدأ');
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
    startAutoPlay();
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
    prevSlide();
    startAutoPlay();
});

nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    startAutoPlay();
});

leftNav.addEventListener('click', () => {
    clearInterval(slideInterval);
    prevSlide();
    startAutoPlay();
});

rightNav.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    startAutoPlay();
});

dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        clearInterval(slideInterval);
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

// اختصارات لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        clearInterval(slideInterval);
        nextSlide();
        startAutoPlay();
    }
    if (e.key === 'ArrowLeft') {
        clearInterval(slideInterval);
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
startAutoPlay();

console.log('✅ معرض الوسائط يعمل!');
console.log(`📊 عدد العناصر: ${mediaItems.length}`);
console.log('⌨️ اختصارات لوحة المفاتيح:');
console.log('  ➡️ → التالي');
console.log('  ⬅️ → السابق');
console.log('  Space → تشغيل/إيقاف');
console.log('  ESC → إغلاق التكبير');
