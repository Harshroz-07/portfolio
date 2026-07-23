document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       0. RONALDO BICYCLE KICK INTRO LOADER CONTROL
    ========================================== */
    const introLoader = document.getElementById('introLoader');
    const skipIntroBtn = document.getElementById('skipIntroBtn');

    if (introLoader) {
        // Enforce scroll lock on load
        document.body.classList.add('intro-active');

        // Fast skip transition
        const skipIntro = () => {
            if (introLoader.classList.contains('intro-finished')) return;
            
            const gates = introLoader.querySelectorAll('.reveal-gate');
            gates.forEach(gate => {
                gate.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            });
            const introContent = introLoader.querySelector('.intro-content');
            if (introContent) {
                introContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease';
            }
            
            introLoader.classList.add('intro-finished');
            document.body.classList.remove('intro-active');
            
            setTimeout(() => {
                introLoader.style.display = 'none';
                introLoader.remove();
            }, 600);
        };

        // Auto trigger portfolio open after animation completes
        const autoTimeout = setTimeout(() => {
            introLoader.classList.add('intro-finished');
            document.body.classList.remove('intro-active');
            
            setTimeout(() => {
                introLoader.style.display = 'none';
                introLoader.remove();
            }, 1200); // Wait for sliding doors to open fully
        }, 4200); // Match timeline duration of CSS animations

        // Event listener for skip button
        if (skipIntroBtn) {
            skipIntroBtn.addEventListener('click', () => {
                clearTimeout(autoTimeout);
                skipIntro();
            });
        }
    }

    /* ==========================================
       1. INITIALIZE LUCIDE ICONS
    ========================================== */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================
       2. INTERACTIVE CUSTOM CURSOR
    ========================================== */
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursor && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            // Precise cursor dot
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            // Lagged ambient cursor glow
            cursorGlow.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        // Add interactive hover states for cursors
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'var(--accent-indigo)';
                cursorGlow.style.opacity = 'calc(var(--glow-opacity) * 1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--accent-teal)';
                cursorGlow.style.opacity = 'var(--glow-opacity)';
            });
        });
    }

    /* ==========================================
       3. DARK / LIGHT THEME TOGGLE
    ========================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'dark';

            if (currentTheme === 'dark') {
                newTheme = 'light';
            }

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ==========================================
       4. MOBILE NAVIGATION MENU
    ========================================== */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle icon menu / close
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                const currentIcon = icon.getAttribute('data-lucide');
                if (currentIcon === 'menu') {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    /* ==========================================
       5. STICKY HEADER & SCROLL SPY
    ========================================== */
    const header = document.getElementById('mainHeader');
    const sections = document.querySelectorAll('section');

    const handleScrollEffects = () => {
        const scrollPos = window.scrollY;

        // Sticky Navbar Toggle
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active Link Highlight
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 150;
            const secHeight = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger initially

    /* ==========================================
       6. HERO TYPING ANIMATION
    ========================================== */
    const typingTextEl = document.getElementById('typingText');
    const phrases = ["Frontend Engineer", "Creative Designer", "SaaS Developer", "Clean Coder"];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const runTypingLoop = () => {
        if (!typingTextEl) return;
        
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typingTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Delete faster
        } else {
            typingTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120; // Type standard
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            // Full phrase is typed, wait before deleting
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(runTypingLoop, typingSpeed);
    };

    runTypingLoop();

    /* ==========================================
       7. PROJECTS GRID FILTERING
    ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    // Show animation
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    // Hide animation
                    card.style.transform = 'scale(0.95)';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================
       8. PROJECT DETAILS MODAL
    ========================================== */
    // Detailed projects data
    const projectsData = {
        project1: {
            title: "Apex E-Commerce Platform",
            category: "Web App",
            img: "assets/project1.png",
            desc: "Apex is a full-featured e-commerce solution engineered for next-generation digital storefronts. It utilizes modern static rendering engines and optimization strategies to secure a Google Lighthouse score near 100.",
            bullets: [
                "Constructed high-speed API route caching to shrink response latencies by 60%.",
                "Incorporated Stripe payment gateways, utilizing secure webhooks for transaction tracking.",
                "Engineered fully customized CSS-in-JS micro-animations using Framer Motion for shopping cart and filtering panels.",
                "Designed custom analytical dashboards monitoring page-views, orders, and sales demographics."
            ],
            tags: ["Next.js", "React", "TypeScript", "Stripe", "Framer Motion", "Sass"],
            liveLink: "https://example.com/apex-demo",
            repoLink: "https://github.com/example/apex-ecom"
        },
        project2: {
            title: "Pulse Analytics App",
            category: "Mobile App",
            img: "assets/project2.png",
            desc: "Pulse is a dashboard-oriented mobile application tracking user growth trends and multi-channel marketing campaigns in real-time. Built specifically to deliver granular chart analyses in a performant design.",
            bullets: [
                "Utilized React Native Reanimated to process chart transitions smoothly at 60fps.",
                "Designed responsive flex layouts to ensure design fidelity on both iOS tablets and compact Android models.",
                "Wrote asynchronous caching models enabling fully functional offline dashboard rendering.",
                "Implemented localized notifications alerts signaling spikes or crashes in client marketing metrics."
            ],
            tags: ["React Native", "Expo", "Reanimated", "ChartJS", "REST API", "Redux"],
            liveLink: "https://example.com/pulse-demo",
            repoLink: "https://github.com/example/pulse-analytics"
        },
        project3: {
            title: "Zenith Collaboration Board",
            category: "UI/UX Design",
            img: "assets/project3.png",
            desc: "Zenith is a real-time team collaboration platform modeling complex agile workflows. Features include custom project drag-and-drop cards, integrated chats, and comprehensive task assignments.",
            bullets: [
                "Initiated full UX research loops including wireframing, high-fidelity mockups, and interactive user prototypes.",
                "Designed lightweight glassmorphic panels ensuring high readability in dark modes.",
                "Integrated real-time database syncing, triggering instant board changes across concurrent team members.",
                "Wrote comprehensive unit testing routines ensuring clean draggable task lanes."
            ],
            tags: ["Figma", "UX Design", "Prototyping", "React", "TailwindCSS", "Firebase"],
            liveLink: "https://example.com/zenith-demo",
            repoLink: "https://github.com/example/zenith-board"
        }
    };

    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const detailTriggers = document.querySelectorAll('.btn-detail-trigger');

    // Select Modal elements to fill dynamically
    const mImg = document.getElementById('modalImg');
    const mBadge = document.getElementById('modalBadge');
    const mTitle = document.getElementById('modalTitle');
    const mDesc = document.getElementById('modalDesc');
    const mBullets = document.getElementById('modalBullets');
    const mTags = document.getElementById('modalTags');
    const mLiveLink = document.getElementById('modalLiveLink');
    const mRepoLink = document.getElementById('modalRepoLink');

    const openModal = (projId) => {
        const data = projectsData[projId];
        if (!data || !modal) return;

        // Populate elements
        mImg.src = data.img;
        mImg.alt = `${data.title} preview image`;
        mBadge.textContent = data.category;
        mTitle.textContent = data.title;
        mDesc.textContent = data.desc;

        // Bullets
        mBullets.innerHTML = '';
        data.bullets.forEach(bullet => {
            const li = document.createElement('li');
            li.textContent = bullet;
            mBullets.appendChild(li);
        });

        // Tags
        mTags.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            mTags.appendChild(span);
        });

        // Links
        mLiveLink.href = data.liveLink;
        mRepoLink.href = data.repoLink;

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling background
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Resume scrolling
    };

    detailTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const projKey = trigger.getAttribute('data-project');
            openModal(projKey);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape Key Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /* ==========================================
       9. TIMELINE SCROLL PATH ANIMATION
    ========================================== */
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const handleTimelineScroll = () => {
        if (!timelineProgress || timelineItems.length === 0) return;

        const timelineContainer = document.querySelector('.timeline-container');
        const containerRect = timelineContainer.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.85;

        // Calculate progress percentage
        let progressStart = containerRect.top + window.scrollY;
        let progressHeight = containerRect.height;
        let currentScroll = window.scrollY + triggerPoint;

        let percentage = ((currentScroll - progressStart) / progressHeight) * 100;
        percentage = Math.max(0, Math.min(percentage, 100)); // Clamp between 0% and 100%

        timelineProgress.style.height = `${percentage}%`;

        // Highlight Active Timeline Items
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top < triggerPoint) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll(); // Initial run

    /* ==========================================
       10. CONTACT FORM INTEGRATION & VALIDATIONS
    ========================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccessOverlay = document.getElementById('formSuccessOverlay');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const submitBtn = document.getElementById('submitBtn');

    const validateInput = (inputGroup) => {
        const input = inputGroup.querySelector('input, textarea');
        let isValid = true;

        if (input.hasAttribute('required')) {
            if (input.value.trim() === '') {
                isValid = false;
            }
        }

        if (isValid && input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
            }
        }

        if (!isValid) {
            inputGroup.classList.add('invalid');
        } else {
            inputGroup.classList.remove('invalid');
        }

        return isValid;
    };

    if (contactForm) {
        const inputGroups = contactForm.querySelectorAll('.input-group');

        // Instant validation on input blur & change
        inputGroups.forEach(group => {
            const field = group.querySelector('input, textarea');
            field.addEventListener('blur', () => validateInput(group));
            field.addEventListener('input', () => {
                if (group.classList.contains('invalid')) {
                    validateInput(group);
                }
            });
        });

        // Form Submit handler
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            inputGroups.forEach(group => {
                const isValid = validateInput(group);
                if (!isValid) isFormValid = false;
            });

            if (isFormValid) {
                // Simulate Send Interaction
                const btnText = submitBtn.querySelector('.btn-text');
                const btnIcon = submitBtn.querySelector('.btn-icon');
                const originalText = btnText.textContent;
                const originalIcon = btnIcon.getAttribute('data-lucide');

                // Loading State
                submitBtn.disabled = true;
                btnText.textContent = "Transmitting...";
                btnIcon.setAttribute('data-lucide', 'loader-2');
                btnIcon.classList.add('animate-spin'); // spin loading
                lucide.createIcons();

                setTimeout(() => {
                    // Success State
                    if (formSuccessOverlay) {
                        formSuccessOverlay.classList.add('active');
                    }
                    
                    // Reset Button UI
                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                    btnIcon.setAttribute('data-lucide', originalIcon);
                    btnIcon.classList.remove('animate-spin');
                    lucide.createIcons();

                    contactForm.reset();
                    // Reset labels positioning
                    inputGroups.forEach(group => group.classList.remove('invalid'));
                }, 1800);
            }
        });
    }

    if (resetFormBtn && formSuccessOverlay) {
        resetFormBtn.addEventListener('click', () => {
            formSuccessOverlay.classList.remove('active');
        });
    }

    /* ==========================================
       11. SCROLL REVEAL (INTERSECTION OBSERVER)
    ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, we don't need to observe it again
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before entry
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ==========================================
       12. BACK TO TOP BUTTON
    ========================================== */
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.pointerEvents = 'all';
                scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.pointerEvents = 'none';
                scrollToTopBtn.style.transform = 'translateY(15px) scale(0.9)';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
