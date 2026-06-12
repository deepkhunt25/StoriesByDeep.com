document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==============================
    // SCROLL PROGRESS BAR
    // ==============================
    const scrollProgress = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    }

    // ==============================
    // SCROLL REVEAL ANIMATIONS
    // ==============================
    function initRevealAnimations() {
        if (prefersReducedMotion) return;

        const assignments = [
            { el: '.hero-portfolio-label', cls: 'reveal reveal-up', delay: 0 },
            { el: '.hero-identity', cls: 'reveal reveal-up', delay: 1 },
            { el: '.hero-divider', cls: 'reveal reveal-line', delay: 2 },
            { el: '.hero-quote', cls: 'reveal reveal-up', delay: 3 },
            { el: '.hero-media', cls: 'reveal reveal-up reveal-scale', delay: 1 },

            { el: '.about-text-col .section-heading', cls: 'reveal reveal-up', delay: 0 },
            { el: '.about-text-col .body-text', cls: 'reveal reveal-up', delay: 1 },
            { el: '.collage-item--top', cls: 'reveal reveal-right reveal-scale', delay: 1 },
            { el: '.collage-item--middle', cls: 'reveal reveal-scale', delay: 2 },
            { el: '.collage-item--bottom', cls: 'reveal reveal-left reveal-scale', delay: 3 },

            { el: '.why-me-text .section-heading', cls: 'reveal reveal-up', delay: 0 },
            { el: '.why-me-text .body-text', cls: 'reveal reveal-up', delay: null, stagger: true },
            { el: '.why-me-media', cls: 'reveal reveal-left reveal-scale', delay: 1 },

            { el: '.what-you-get-heading', cls: 'reveal reveal-up', delay: 0 },
            { el: '.benefits-list li', cls: 'reveal reveal-left', delay: null, stagger: true },

            { el: '.experience-heading', cls: 'reveal reveal-up', delay: 0 },
            { el: '.experience-text', cls: 'reveal reveal-up', delay: null, stagger: true },
            { el: '.studio-name', cls: 'reveal reveal-fade', delay: null, stagger: true },

            { el: '.contact-brand', cls: 'reveal reveal-fade', delay: 0 },
            { el: '.contact-item', cls: 'reveal reveal-up', delay: null, stagger: true },

            { el: '.footer p', cls: 'reveal reveal-fade', delay: null, stagger: true },
        ];

        assignments.forEach(({ el, cls, delay, stagger }) => {
            document.querySelectorAll(el).forEach((node, i) => {
                node.classList.add(...cls.split(' '));
                if (stagger) {
                    node.setAttribute('data-delay', String(Math.min(i + 1, 7)));
                } else if (delay !== null && delay !== undefined) {
                    node.setAttribute('data-delay', String(delay));
                }
            });
        });

        // Work blocks — alternate directions
        document.querySelectorAll('.work-block').forEach((block, index) => {
            const isEven = index % 2 === 0;
            const textDir = isEven ? 'reveal-left' : 'reveal-right';
            const mediaDir = isEven ? 'reveal-right' : 'reveal-left';

            block.querySelectorAll('.work-text .section-heading, .work-text .work-subtitle').forEach((el, i) => {
                el.classList.add('reveal', 'reveal-up');
                el.setAttribute('data-delay', String(i));
            });

            block.querySelectorAll('.work-text .body-text').forEach((el, i) => {
                el.classList.add('reveal', textDir);
                el.setAttribute('data-delay', String(Math.min(i + 1, 3)));
            });

            block.querySelectorAll('.work-title').forEach((el) => {
                el.classList.add('reveal', 'reveal-up');
                el.setAttribute('data-delay', '0');
            });

            block.querySelectorAll('.video-wrap').forEach((el) => {
                el.classList.add('reveal', mediaDir, 'reveal-scale');
                el.setAttribute('data-delay', '2');
            });

            const card = block.querySelector('.work-card');
            if (card) {
                card.classList.add('reveal', 'reveal-scale');
                card.setAttribute('data-delay', '1');
            }
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.reveal, .reveal-line').forEach(el => revealObserver.observe(el));

        const experienceSection = document.querySelector('.experience');
        if (experienceSection) {
            const expObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        experienceSection.classList.add('is-visible');
                        expObserver.unobserve(experienceSection);
                    }
                });
            }, { threshold: 0.2 });
            expObserver.observe(experienceSection);
        }

        function animateHero() {
            document.querySelectorAll('.hero .reveal, .hero .reveal-line').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 100);
            });
        }

        const preloader = document.getElementById('preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    document.body.classList.remove('preloader-active');
                    setTimeout(animateHero, 400); // Trigger hero reveal animations mid-way through slide-up
                }, 1500);
            });
        } else {
            requestAnimationFrame(() => {
                setTimeout(animateHero, 120);
            });
        }

        initContactTitleReveal();
    }

    // ==============================
    // CONTACT TITLE — LETTER REVEAL
    // ==============================
    function initContactTitleReveal() {
        if (prefersReducedMotion) return;

        document.querySelectorAll('.contact-title-line').forEach((line, lineIndex) => {
            const text = line.textContent.trim();
            line.textContent = '';
            [...text].forEach((char, charIndex) => {
                const wrap = document.createElement('span');
                wrap.className = 'char-wrap';
                wrap.textContent = char === ' ' ? '\u00A0' : char;
                wrap.style.transitionDelay = `${lineIndex * 0.15 + charIndex * 0.04}s`;
                line.appendChild(wrap);
            });
        });

        const contactSection = document.querySelector('.contact');
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.contact-title-line').forEach((line, i) => {
                        setTimeout(() => line.classList.add('is-visible'), i * 180);
                    });
                    contactSection?.classList.add('is-visible');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const contactTitle = document.querySelector('.contact-title');
        if (contactTitle) titleObserver.observe(contactTitle);
    }

    // ==============================
    // CONTACT GLOW — MOUSE PARALLAX
    // ==============================
    function initContactGlow() {
        if (prefersReducedMotion) return;

        const contact = document.querySelector('.contact');
        const glow = document.querySelector('.contact-glow');
        if (!contact || !glow) return;

        contact.addEventListener('mousemove', (e) => {
            const rect = contact.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            glow.style.transform = `translate(${x * 30}px, calc(-50% + ${y * 20}px))`;
        }, { passive: true });
    }

    // ==============================
    // PARALLAX ON HERO MEDIA
    // ==============================
    function initParallax() {
        if (prefersReducedMotion) return;

        const parallaxEl = document.querySelector('.hero-media.parallax-wrap');
        if (!parallaxEl) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                parallaxEl.style.transform = `translateY(${scrollY * 0.12}px)`;
            }
        }, { passive: true });
    }

    // ==============================
    // VIDEO PLAYERS
    // ==============================
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxIframe = document.getElementById('lightbox-iframe');
    const lightboxClose = document.querySelector('.lightbox-close');

    function formatVideoTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function getVideoSrc(video) {
        const sourceEl = video?.querySelector('source');
        return sourceEl?.getAttribute('src') || video?.getAttribute('src') || '';
    }

    function updateSeekVisual(controls, ratio) {
        const pct = `${Math.min(100, Math.max(0, ratio * 100))}%`;
        if (controls.seekFill) controls.seekFill.style.width = pct;
        if (controls.seekThumb) controls.seekThumb.style.left = pct;
        if (controls.seekTrack) {
            const valueNow = Math.round(ratio * 1000);
            controls.seekTrack.setAttribute('aria-valuenow', String(valueNow));
            if (controls.timeLabel) {
                controls.seekTrack.setAttribute('aria-valuetext', controls.timeLabel.textContent);
            }
        }
    }

    function updateVideoUi(wrap, video, controls) {
        const { playCtrl, muteCtrl, fullscreenCtrl, timeLabel } = controls;
        const isPlaying = !video.paused && !video.ended;
        const isFullscreen = document.fullscreenElement === wrap
            || document.webkitFullscreenElement === wrap;

        wrap.classList.toggle('is-playing', isPlaying);
        wrap.classList.toggle('playing', isPlaying);
        wrap.classList.toggle('is-fullscreen', isFullscreen);
        playCtrl.classList.toggle('is-playing', isPlaying);
        playCtrl.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
        muteCtrl.classList.toggle('is-unmuted', !video.muted);
        muteCtrl.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        fullscreenCtrl?.classList.toggle('is-fullscreen', isFullscreen);
        fullscreenCtrl?.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');

        if (timeLabel && !controls.seeking) {
            const current = formatVideoTime(video.currentTime);
            const total = formatVideoTime(video.duration);
            timeLabel.textContent = `${current} / ${total}`;
        }

        if (!controls.seeking && Number.isFinite(video.duration) && video.duration > 0) {
            updateSeekVisual(controls, video.currentTime / video.duration);
        }
    }

    function setupSeekBar(wrap, video, controls) {
        const { seekTrack } = controls;
        if (!seekTrack) return;

        const getRatio = (clientX) => {
            const rect = seekTrack.getBoundingClientRect();
            if (rect.width <= 0) return 0;
            return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        };

        const seekToClientX = (clientX) => {
            if (!Number.isFinite(video.duration) || video.duration <= 0) return;
            const ratio = getRatio(clientX);
            video.currentTime = ratio * video.duration;
            updateSeekVisual(controls, ratio);
            if (controls.timeLabel) {
                const current = formatVideoTime(video.currentTime);
                const total = formatVideoTime(video.duration);
                controls.timeLabel.textContent = `${current} / ${total}`;
            }
        };

        const seekBySeconds = (deltaSeconds) => {
            if (!Number.isFinite(video.duration) || video.duration <= 0) return false;
            video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + deltaSeconds));
            updateVideoUi(wrap, video, controls);
            return true;
        };

        const isSeekArrowKey = (e) => (
            e.key === 'ArrowRight' || e.code === 'ArrowRight'
            || e.key === 'ArrowLeft' || e.code === 'ArrowLeft'
        );

        const getSeekArrowDelta = (e) => {
            if (e.key === 'ArrowRight' || e.code === 'ArrowRight') return 5;
            if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') return -5;
            return 0;
        };

        const handleSeekKeydown = (e) => {
            if (!isSeekArrowKey(e)) return;

            const focusTarget = document.activeElement;
            const focusInPlayer = focusTarget === wrap
                || focusTarget === seekTrack
                || wrap.contains(focusTarget);
            if (!focusInPlayer) return;

            e.preventDefault();
            e.stopPropagation();

            const delta = getSeekArrowDelta(e);
            if (!delta) return;
            seekBySeconds(delta);
        };

        const endSeek = () => {
            controls.seeking = false;
            wrap.classList.remove('controls-focus');
            updateVideoUi(wrap, video, controls);
        };

        seekTrack.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            controls.seeking = true;
            wrap.classList.add('controls-focus');
            seekTrack.focus({ preventScroll: true });
            seekTrack.setPointerCapture(e.pointerId);
            seekToClientX(e.clientX);
        });

        seekTrack.addEventListener('pointermove', (e) => {
            if (!controls.seeking) return;
            seekToClientX(e.clientX);
        });

        seekTrack.addEventListener('pointerup', (e) => {
            if (!controls.seeking) return;
            seekTrack.releasePointerCapture(e.pointerId);
            endSeek();
        });

        seekTrack.addEventListener('pointercancel', endSeek);

        wrap.setAttribute('tabindex', '-1');
        wrap.addEventListener('keydown', handleSeekKeydown, true);
    }

    async function toggleFullscreen(wrap, video, controls) {
        const isFullscreen = document.fullscreenElement === wrap
            || document.webkitFullscreenElement === wrap;

        try {
            if (isFullscreen) {
                if (document.exitFullscreen) await document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            } else if (wrap.requestFullscreen) {
                await wrap.requestFullscreen();
            } else if (wrap.webkitRequestFullscreen) {
                wrap.webkitRequestFullscreen();
            } else if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            }
        } catch {
            // Fullscreen blocked or unsupported
        }

        updateVideoUi(wrap, video, controls);
    }

    function createVideoControls(wrap, video) {
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        controls.innerHTML = `
            <button type="button" class="video-ctrl-btn video-ctrl-play" aria-label="Play video">
                <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            </button>
            <div class="video-seek-wrap">
                <div class="video-seek-track" role="slider" tabindex="0" aria-label="Seek video" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0">
                    <div class="video-seek-fill"></div>
                    <div class="video-seek-thumb"></div>
                </div>
            </div>
            <span class="video-time" aria-hidden="true">0:00 / 0:00</span>
            <button type="button" class="video-ctrl-btn video-ctrl-mute" aria-label="Unmute video">
                <svg class="icon-muted" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></svg>
                <svg class="icon-unmuted" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
            </button>
            <button type="button" class="video-ctrl-btn video-ctrl-fullscreen" aria-label="Enter fullscreen">
                <svg class="icon-enter-fs" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
                <svg class="icon-exit-fs" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>
            </button>
        `;

        const ui = {
            el: controls,
            playCtrl: controls.querySelector('.video-ctrl-play'),
            muteCtrl: controls.querySelector('.video-ctrl-mute'),
            fullscreenCtrl: controls.querySelector('.video-ctrl-fullscreen'),
            seekTrack: controls.querySelector('.video-seek-track'),
            seekFill: controls.querySelector('.video-seek-fill'),
            seekThumb: controls.querySelector('.video-seek-thumb'),
            timeLabel: controls.querySelector('.video-time'),
            seeking: false
        };

        wrap.appendChild(controls);
        setupSeekBar(wrap, video, ui);

        const focusSeekTrack = () => {
            ui.seekTrack?.focus({ preventScroll: true });
        };

        const playVideo = () => {
            video.playsInline = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => updateVideoUi(wrap, video, ui))
                    .catch(() => updateVideoUi(wrap, video, ui));
            }
        };

        const pauseVideo = () => {
            video.pause();
            updateVideoUi(wrap, video, ui);
        };

        const togglePlay = () => {
            if (video.paused || video.ended) {
                playVideo();
            } else {
                pauseVideo();
            }
        };

        ui.playCtrl.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
            focusSeekTrack();
        });

        ui.muteCtrl.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            wrap.dataset.userAudio = video.muted ? 'muted' : 'unmuted';
            updateVideoUi(wrap, video, ui);
        });

        ui.fullscreenCtrl.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen(wrap, video, ui);
        });

        controls.addEventListener('pointerdown', (e) => e.stopPropagation());
        controls.addEventListener('click', (e) => e.stopPropagation());

        controls.addEventListener('focusin', () => wrap.classList.add('controls-focus'));
        controls.addEventListener('focusout', () => {
            if (!ui.seeking) wrap.classList.remove('controls-focus');
        });

        video.addEventListener('timeupdate', () => updateVideoUi(wrap, video, ui));
        video.addEventListener('loadedmetadata', () => updateVideoUi(wrap, video, ui));
        video.addEventListener('durationchange', () => updateVideoUi(wrap, video, ui));
        video.addEventListener('play', () => updateVideoUi(wrap, video, ui));
        video.addEventListener('pause', () => updateVideoUi(wrap, video, ui));
        video.addEventListener('volumechange', () => updateVideoUi(wrap, video, ui));

        const onFullscreenChange = () => updateVideoUi(wrap, video, ui);
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);

        return { ui, playVideo, pauseVideo, togglePlay };
    }

    function initVideoPlayers() {
        const videoWraps = document.querySelectorAll('.video-wrap');

        videoWraps.forEach(wrap => {
            const video = wrap.querySelector('.video-el');
            const playBtn = wrap.querySelector('.play-btn');
            if (!video) return;

            const src = getVideoSrc(video);
            const hasVideo = Boolean(src);
            const { playVideo, pauseVideo, togglePlay } = createVideoControls(wrap, video);

            playBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!hasVideo) {
                    openLightbox(video);
                    return;
                }
                if (video.paused || video.ended) {
                    playVideo();
                } else {
                    pauseVideo();
                }
            });

            video.addEventListener('click', (e) => {
                if (e.target.closest('.video-controls')) return;
                if (!hasVideo) {
                    openLightbox(video);
                    return;
                }
                togglePlay();
                wrap.querySelector('.video-seek-track')?.focus({ preventScroll: true });
            });

            video.addEventListener('ended', () => {
                if (video.loop) {
                    playVideo();
                } else {
                    wrap.classList.remove('is-playing', 'playing');
                }
            });
        });

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const wrap = entry.target;
                const video = wrap.querySelector('.video-el');
                if (!video || !getVideoSrc(video)) return;

                if (entry.isIntersecting) {
                    if (wrap.dataset.userAudio !== 'unmuted') {
                        video.muted = true;
                    }
                    video.playsInline = true;

                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                wrap.classList.add('is-playing', 'playing');
                            })
                            .catch(() => {
                                wrap.classList.remove('is-playing', 'playing');
                            });
                    }
                } else {
                    video.pause();
                    wrap.classList.remove('is-playing', 'playing');
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px'
        });

        videoWraps.forEach(wrap => {
            if (wrap.querySelector('.video-el') && getVideoSrc(wrap.querySelector('.video-el'))) {
                videoObserver.observe(wrap);
            }
        });
    }

    function openLightbox(videoEl) {
        const source = videoEl.querySelector('source');
        const src = source?.getAttribute('src') || videoEl.src || '';
        const embedUrl = videoEl.dataset.embed || videoEl.closest('.video-wrap')?.dataset?.embed || '';

        lightboxIframe.classList.remove('active');
        lightboxVideo.classList.remove('active');

        if (embedUrl) {
            lightboxIframe.src = embedUrl;
            lightboxIframe.classList.add('active');
        } else if (src) {
            lightboxVideo.src = src;
            lightboxVideo.classList.add('active');
            lightboxVideo.play();
        } else {
            lightboxVideo.poster = videoEl.poster || '';
            lightboxVideo.classList.add('active');
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxVideo.classList.remove('active');
        lightboxIframe.src = '';
        lightboxIframe.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('active')) closeLightbox();
    });

    // ==============================
    // SCROLL TO TOP
    // ==============================
    const scrollTopBtn = document.getElementById('scroll-top');

    function updateScrollTopBtn() {
        if (!scrollTopBtn) return;
        scrollTopBtn.classList.toggle('is-visible', window.scrollY > 400);
    }

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==============================
    // INIT
    // ==============================
    initRevealAnimations();
    initParallax();
    initVideoPlayers();
    initContactGlow();

    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateScrollTopBtn();
    }, { passive: true });

    updateScrollProgress();
    updateScrollTopBtn();
});
