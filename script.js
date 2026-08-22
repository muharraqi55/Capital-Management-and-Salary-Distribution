// ============================================
// 1. البيانات (يمكنك تعديل الروابط هنا بسهولة)
// ============================================
const imageItems = [
    { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/1.png', title: 'منظر طبيعي 1' },
    { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/2.png', title: 'منظر طبيعي 2' },
    { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/3.png', title: 'منظر طبيعي 3' },
    { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/4.png', title: 'منظر طبيعي 4' },
    { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/5.png', title: 'منظر طبيعي 5' },
    { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/6.png', title: 'منظر طبيعي 6' },
];

const videoItems = [
    { videoId: 'y4ETb8WrcuQ', title: 'فيديو يوتيوب 1' },
    { videoId: 'IttOZGG69mo', title: 'فيديو يوتيوب 2' },
];

// ============================================
// 2. دوال التكبير (متاحة عالمياً عبر window)
// ============================================
function zoomImage(element) {
    const src = element.getAttribute('data-src') || element.src;
    openModal(src, 'image');
}

function zoomVideo(videoId) {
    if (videoId) {
        openModal(videoId, 'video');
    }
}

// ربط الدوال بـ window لتعمل مع onclick في HTML
window.zoomImage = zoomImage;
window.zoomVideo = zoomVideo;

// ============================================
// 3. منطق الصفحة (يتم تنفيذه بعد تحميل HTML)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.getElementById('closeModal');

    function openModal(src, type) {
        modal.style.display = 'flex';
        if (type === 'image') {
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
            modalVideo.src = '';
            modalImage.src = src;
        } else {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'block';
            modalImage.src = '';
            modalVideo.src = `https://www.youtube.com/embed/${src}?autoplay=1&rel=0&controls=1`;
        }
        document.body.style.overflow = 'hidden';
    }

    function closeModalFunc() {
        modal.style.display = 'none';
        modalImage.src = '';
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
    // 4. دالة إنشاء السلايدر
    // ============================================
    function createSlider({
        items, containerId, dotsId, counterId, playBtnId = null,
        prevBtnId, nextBtnId, leftNavId, rightNavId, isVideo = false, autoPlay = true,
    }) {
        let currentIndex = 0;
        let isPlaying = true;
        let slideInterval = null;
        const DELAY = 5000;

        const container = document.getElementById(containerId);
        const dotsContainer = document.getElementById(dotsId);
        const counter = document.getElementById(counterId);
        const playBtn = playBtnId ? document.getElementById(playBtnId) : null;
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const leftNav = document.getElementById(leftNavId);
        const rightNav = document.getElementById(rightNavId);

        function renderSlides() {
            container.innerHTML = items.map((item, index) => {
                let content = '';
                if (!isVideo) {
                    content = `<img src="${item.src}" data-src="${item.src}" alt="${item.title}" data-index="${index}" class="slide-image" onclick="window.zoomImage(this)">`;
                } else {
                    content = `
                        <div class="video-click-wrapper" onclick="window.zoomVideo('${item.videoId}')" style="width: 100%; height: 100%; position: relative; cursor: zoom-in; display: flex; align-items: center; justify-content: center; background: #000;">
                            <iframe 
                                src="https://www.youtube.com/embed/${item.videoId}?autoplay=0&rel=0&controls=1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                style="pointer-events: none; width: 100%; height: 100%; border: none;"
                            ></iframe>
                            <div style="position: absolute; font-size: 3rem; color: rgba(255, 255, 255, 0.8); pointer-events: none; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">▶️</div>
                        </div>
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

        function goToSlide(index) {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;

            const slides = container.querySelectorAll('.slide');
            const dots = dotsContainer.querySelectorAll('.dot');

            slides.forEach(el => el.classList.remove('active'));
            dots.forEach(el => el.classList.remove('active'));

            if (slides[index]) slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');

            currentIndex = index;
            updateCounter();
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        function updateCounter() {
            counter.textContent = `${currentIndex + 1} / ${items.length}`;
        }

        function startAutoPlay() {
            if (!autoPlay || isVideo) return;
            if (slideInterval) clearInterval(slideInterval);
            if (isPlaying) {
                slideInterval = setInterval(nextSlide, DELAY);
            }
        }

        function togglePlay() {
            if (isVideo) return;
            isPlaying = !isPlaying;
            if (playBtn) {
                playBtn.textContent = isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
            }
            startAutoPlay();
        }

        if (playBtn) playBtn.addEventListener('click', togglePlay);

        [prevBtn, nextBtn, leftNav, rightNav].forEach(btn => {
            btn.addEventListener('click', function() {
                clearInterval(slideInterval);
                if (this === prevBtn || this === leftNav) prevSlide();
                else nextSlide();
                startAutoPlay();
            });
        });

        dotsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('dot')) {
                clearInterval(slideInterval);
                goToSlide(parseInt(e.target.dataset.index));
                startAutoPlay();
            }
        });

        renderSlides();
        if (autoPlay && !isVideo) startAutoPlay();

        return { goToSlide, nextSlide, prevSlide };
    }

    // ============================================
    // 5. تشغيل المعارض
    // ============================================
    createSlider({
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

    createSlider({
        items: videoItems,
        containerId: 'videoSlidesContainer',
        dotsId: 'videoDotsContainer',
        counterId: 'videoCounter',
        prevBtnId: 'videoPrevBtn',
        nextBtnId: 'videoNextBtn',
        leftNavId: 'videoLeftNav',
        rightNavId: 'videoRightNav',
        isVideo: true,
        autoPlay: false,
    });
});
