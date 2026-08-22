// ============================================
// قائمة الصور
// ============================================
const imageItems = [
    {
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/1.png',
        title: 'منظر طبيعي 1',
    },
    {
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/2.png',
        title: 'منظر طبيعي 2',
    },
    {
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/3.png',
        title: 'منظر طبيعي 3',
    },
    {
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/4.png',
        title: 'منظر طبيعي 4',
    },
    {
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/5.png',
        title: 'منظر طبيعي 5',
    },
    {
        src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/6.png',
        title: 'منظر طبيعي 6',
    },
];

// ============================================
// قائمة فيديوهات YouTube
// ============================================
const videoItems = [
    {
        videoId: 'y4ETb8WrcuQ',
        title: 'فيديو ممتع على YouTube',
    },
    {
        videoId: '9bZkp7q19f0',
        title: 'فيديو رائع آخر',
    },
];

// ============================================
// دالة لإنشاء سلايدر (معرض)
// ============================================
function createSlider({
    items,
    containerId,
    dotsId,
    counterId,
    playBtnId,
    prevBtnId,
    nextBtnId,
    leftNavId,
    rightNavId,
    isVideo = false,
    autoPlay = true,
}) {
    let currentIndex = 0;
    let isPlaying = true;
    let slideInterval = null;
    const SLIDE_DELAY = 5000;

    const container = document.getElementById(containerId);
    const dotsContainer = document.getElementById(dotsId);
    const counter = document.getElementById(counterId);
    const playBtn = document.getElementById(playBtnId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const leftNav = document.getElementById(leftNavId);
    const rightNav = document.getElementById(rightNavId);

    // ===== عرض الشرائح =====
    function renderSlides() {
        container.innerHTML = items.map((item, index) => {
            let content = '';
            if (!isVideo) {
                content = `<img src="${item.src}" alt="${item.title}" data-index="${index}" class="slide-image">`;
            } else {
                content = `
                    <iframe 
                        src="https://www.youtube.com/embed/${item.videoId}?autoplay=0&rel=0&controls=1&enablejsapi=1"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                `;
            }
            return `
                <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                    ${content}
                    <div class="slide-title">${item.title}</div>
                </div>
            `;
        }).join('');

        dotsContainer.innerHTML = items.map((_, index) => `
            <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
        `).join('');

        updateCounter();
    }

    // ===== الانتقال إلى شريحة =====
    function goToSlide(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;

        document.querySelectorAll(`#${containerId} .slide`).forEach(el => el.classList.remove('active'));
        document.querySelectorAll(`#${dotsId} .dot`).forEach(el => el.classList.remove('active'));

        const slides = document.querySelectorAll(`#${containerId} .slide`);
        const dots = document.querySelectorAll(`#${dotsId} .dot`);

        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        currentIndex = index;
        updateCounter();
    }

    function nextSlide() {
        if (!isVideo) {
            goToSlide(currentIndex + 1);
        } else {
            // للفيديو: لا انتقال تلقائي
            console.log('⏸️ فيديو YouTube - لا انتقال تلقائي');
        }
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    // ===== التشغيل التلقائي (للصور فقط) =====
    function startAutoPlay() {
        if (!autoPlay || isVideo) return;
        if (slideInterval) clearInterval(slideInterval);
        if (isPlaying) {
            slideInterval = setInterval(nextSlide, SLIDE_DELAY);
        }
    }

    function togglePlay() {
        if (isVideo) return;
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
        startAutoPlay();
    }

    // ===== الأحداث =====
    if (playBtn) playBtn.addEventListener('click', togglePlay);

    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        if (!isVideo) {
            nextSlide();
        } else {
            goToSlide(currentIndex + 1);
        }
        startAutoPlay();
    });

    leftNav.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        startAutoPlay();
    });

    rightNav.addEventListener('click', () => {
        clearInterval(slideInterval);
        if (!isVideo) {
            nextSlide();
        } else {
            goToSlide(currentIndex + 1);
        }
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

    // ===== تكبير الصورة =====
    container.addEventListener('click', (e) => {
        const img = e.target.closest('.slide-image');
        if (img) {
            openModal(img.src, 'image');
        }
        const iframe = e.target.closest('iframe');
        if (iframe && isVideo) {
            openModal(iframe.src, 'video');
        }
    });

    // ===== بدء التشغيل =====
    renderSlides();
    if (autoPlay && !isVideo) {
        startAutoPlay();
    }

    return { goToSlide, nextSlide, prevSlide };
}

// ============================================
// نافذة التكبير الموحدة
// ============================================
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.getElementById('closeModal');

function openModal(src, type) {
    modal.style.display = 'flex';
    if (type === 'image') {
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
        modalImage.src = src;
    } else {
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = src + '&autoplay=1';
    }
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    modal.style.display = 'none';
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalFunc();
});

// ============================================
// إنشاء معرض الصور
// ============================================
const imageSlider = createSlider({
    items: imageItems,
    containerId: 'imageSlidesContainer',
    dotsId: 'imageDotsContainer',
    counterId: 'imageCounter',
    playBtnId: 'imagePlayBtn',
    prevBtnId: 'imagePrevBtn',
    nextBtnId: 'imageNextBtn',
    leftNavId: 'imageLeftNav',
    rightNavId: 'imageRightNav',
    isVideo: false,
    autoPlay: true,
});

// ============================================
// إنشاء معرض الفيديوهات
// ============================================
const videoSlider = createSlider({
    items: videoItems,
    containerId: 'videoSlidesContainer',
    dotsId: 'videoDotsContainer',
    counterId: 'videoCounter',
    playBtnId: null, // لا يوجد زر تشغيل للفيديو
    prevBtnId: 'videoPrevBtn',
    nextBtnId: 'videoNextBtn',
    leftNavId: 'videoLeftNav',
    rightNavId: 'videoRightNav',
    isVideo: true,
    autoPlay: false,
});

console.log('✅ معرض الصور والفيديوهات يعمل!');
console.log(`🖼️ عدد الصور: ${imageItems.length}`);
console.log(`🎬 عدد الفيديوهات: ${videoItems.length}`);
