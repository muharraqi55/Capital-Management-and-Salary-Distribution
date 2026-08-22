document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 0. إعدادات الثيم وحجم الخط (مصححة)
    // ============================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const fontIncreaseBtn = document.getElementById('fontIncrease');
    const fontDecreaseBtn = document.getElementById('fontDecrease');
    const body = document.body;

    // 1. منطق الوضع الليلي / النهاري
    let currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️ الوضع الليلي';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '☀️ الوضع الليلي';
            } else {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '🌙 الوضع النهاري';
            }
        });
    }

    // 2. منطق تكبير وتصغير الخط (الإصلاح هنا)
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    const minFontSize = 12;
    const maxFontSize = 24;

    function updateFontSize() {
        // التغيير على documentElement (html) وليس body
        document.documentElement.style.fontSize = `${currentFontSize}px`;
        localStorage.setItem('fontSize', currentFontSize);
    }
    
    // تطبيق الحجم المحفوظ عند التحميل
    updateFontSize();

    if (fontIncreaseBtn) {
        fontIncreaseBtn.addEventListener('click', () => {
            if (currentFontSize < maxFontSize) {
                currentFontSize += 2;
                updateFontSize();
            }
        });
    }

    if (fontDecreaseBtn) {
        fontDecreaseBtn.addEventListener('click', () => {
            if (currentFontSize > minFontSize) {
                currentFontSize -= 2;
                updateFontSize();
            }
        });
    }

    // ============================================
    // 1. المتغيرات والدوال العالمية (الوسائط)
    // ============================================
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalMp4 = document.getElementById('modalMp4');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.getElementById('closeModal');

    window.openModal = function(src, type) {
        if (!modal) return;
        modal.style.display = 'flex';
        
        modalImage.style.display = 'none';
        modalMp4.style.display = 'none';
        modalVideo.style.display = 'none';
        modalImage.src = '';
        modalMp4.src = '';
        modalVideo.src = '';

        if (type === 'image') {
            modalImage.style.display = 'block';
            modalImage.src = src;
        } else if (type === 'mp4') {
            modalMp4.style.display = 'block';
            modalMp4.src = src;
            modalMp4.play();
        } else if (type === 'youtube') {
            modalVideo.style.display = 'block';
            modalVideo.src = `https://www.youtube.com/embed/${src}?autoplay=1&rel=0&controls=1`;
        }
        document.body.style.overflow = 'hidden';
    };

    window.closeModalFunc = function() {
        if (!modal) return;
        modal.style.display = 'none';
        modalImage.src = '';
        modalMp4.pause();
        modalMp4.src = '';
        modalVideo.src = '';
        document.body.style.overflow = 'auto';
    };

    window.zoomMedia = function(element, type, src) {
        if (type === 'image') {
            window.openModal(element.src, 'image');
        } else {
            window.openModal(src, type);
        }
    };

    if (closeModal) closeModal.addEventListener('click', window.closeModalFunc);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.closeModalFunc();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeModalFunc();
    });

    // ============================================
    // 2. البيانات
    // ============================================
    const imageItems = [
        { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/1.png', title: 'منظر طبيعي 1' },
        { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/2.png', title: 'منظر طبيعي 2' },
        { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/3.png', title: 'منظر طبيعي 3' },
        { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/4.png', title: 'منظر طبيعي 4' },
        { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/5.png', title: 'منظر طبيعي 5' },
        { src: 'https://raw.githubusercontent.com/muharraqi55/Capital-Management-and-Salary-Distribution/refs/heads/main/assets/images/6.png', title: 'منظر طبيعي 6' },
        { src: 'assets/images/6.png', title: 'صورة محلية 6' },
    ];

    const videoItems = [
        { type: 'youtube', videoId: 'y4ETb8WrcuQ', title: 'فيديو يوتيوب 1' },
        { type: 'youtube', videoId: 'IttOZGG69mo', title: 'فيديو يوتيوب 2' },
        { type: 'mp4', mp4Src: 'assets/videos/2.mp4', title: 'فيديو محلي 1' },
    ];

    // ============================================
    // 3. دالة إنشاء السلايدر
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
                    content = `<img src="${item.src}" data-src="${item.src}" alt="${item.title}" data-index="${index}" class="slide-image" onclick="window.zoomMedia(this, 'image')">`;
                } else {
                    if (item.type === 'mp4') {
                        content = `
                            <div class="video-click-wrapper" onclick="window.zoomMedia(null, 'mp4', '${item.mp4Src}')" style="width: 100%; height: 100%; position: relative; cursor: zoom-in; display: flex; align-items: center; justify-content: center; background: #000;">
                                <video src="${item.mp4Src}" style="pointer-events: none; width: 100%; height: 100%; object-fit: contain;"></video>
                                <div style="position: absolute; font-size: 3rem; color: rgba(255, 255, 255, 0.8); pointer-events: none; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">▶️</div>
                            </div>
                        `;
                    } else {
                        content = `
                            <div class="video-click-wrapper" onclick="window.zoomMedia(null, 'youtube', '${item.videoId}')" style="width: 100%; height: 100%; position: relative; cursor: zoom-in; display: flex; align-items: center; justify-content: center; background: #000;">
                                <iframe src="https://www.youtube.com/embed/${item.videoId}?autoplay=0&rel=0&controls=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="pointer-events: none; width: 100%; height: 100%; border: none;"></iframe>
                                <div style="position: absolute; font-size: 3rem; color: rgba(255, 255, 255, 0.8); pointer-events: none; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">▶️</div>
                            </div>
                        `;
                    }
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
        function updateCounter() { if(counter) counter.textContent = `${currentIndex + 1} / ${items.length}`; }

        function startAutoPlay() {
            if (!autoPlay || isVideo) return;
            if (slideInterval) clearInterval(slideInterval);
            if (isPlaying) slideInterval = setInterval(nextSlide, DELAY);
        }

        function togglePlay() {
            if (isVideo) return;
            isPlaying = !isPlaying;
            if (playBtn) playBtn.textContent = isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل';
            startAutoPlay();
        }

        if (playBtn) playBtn.addEventListener('click', togglePlay);
        
        [prevBtn, nextBtn, leftNav, rightNav].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function() {
                    clearInterval(slideInterval);
                    if (this === prevBtn || this === leftNav) prevSlide();
                    else nextSlide();
                    startAutoPlay();
                });
            }
        });
        
        if (dotsContainer) {
            dotsContainer.addEventListener('click', function(e) {
                if (e.target.classList.contains('dot')) {
                    clearInterval(slideInterval);
                    goToSlide(parseInt(e.target.dataset.index));
                    startAutoPlay();
                }
            });
        }

        renderSlides();
        if (autoPlay && !isVideo) startAutoPlay();
        return { goToSlide, nextSlide, prevSlide };
    }

    // ============================================
    // 4. تشغيل المعارض
    // ============================================
    createSlider({
        items: imageItems, containerId: 'imageSlidesContainer', dotsId: 'imageDotsContainer',
        counterId: 'imageCounter', playBtnId: 'imagePlayBtn', prevBtnId: 'imagePrevBtn',
        nextBtnId: 'imageNextBtn', leftNavId: 'imageLeftNav', rightNavId: 'imageRightNav',
        isVideo: false, autoPlay: true,
    });

    createSlider({
        items: videoItems, containerId: 'videoSlidesContainer', dotsId: 'videoDotsContainer',
        counterId: 'videoCounter', prevBtnId: 'videoPrevBtn', nextBtnId: 'videoNextBtn',
        leftNavId: 'videoLeftNav', rightNavId: 'videoRightNav',
        isVideo: true, autoPlay: false,
    });
});
