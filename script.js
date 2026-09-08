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
       2. INTERACTIVE CUSTOM CYBER CURSOR & SCROLL BAR
    ========================================== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const scrollProgress = document.getElementById('scrollProgress');

    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        // Hover expand elements
        const bindCursorEvents = () => {
            const hoverTargets = document.querySelectorAll('a, button, .project-card, .stat-card, .floating-card, .term-tab, .contact-card, .social-btn, .avatar-wrapper');
            hoverTargets.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        };
        bindCursorEvents();
    }

    // Scroll Progress Indicator
    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    });

    /* ==========================================
       DYNAMIC TYPEWRITER EFFECT
    ========================================== */
    const typewriterEl = document.getElementById('typewriterText');
    if (typewriterEl) {
        const words = [
            'Full Stack Web Apps',
            'Responsive Web Apps',
            'React & Node Architectures'
        ];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        const typeEffect = () => {
            const currentWord = words[wordIdx];
            if (isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentWord.length) {
                typeSpeed = 2200; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                typeSpeed = 400; // Pause before typing next word
            }

            setTimeout(typeEffect, typeSpeed);
        };

        typeEffect();
    }

    /* ==========================================
       HERO CODE TERMINAL TABS & COPY FUNCTIONALITY
    ========================================== */
    const termTabs = document.querySelectorAll('.term-tab');
    const copyBtn = document.getElementById('copyTerminalCode');

    termTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            termTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetTab = tab.dataset.termTab;
            const panes = document.querySelectorAll('.term-pane');
            panes.forEach(pane => {
                pane.classList.add('hidden');
                pane.classList.remove('active');
            });

            const activePane = document.getElementById(`termPane${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`);
            if (activePane) {
                activePane.classList.remove('hidden');
                activePane.classList.add('active');
            }
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const activePane = document.querySelector('.term-pane.active');
            if (activePane) {
                const textToCopy = activePane.innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyBtn.innerHTML = '<i data-lucide="check" style="color:#14b8a6"></i>';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i data-lucide="copy"></i>';
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    }, 2000);
                });
            }
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
            title: "Car Dealership Inventory System",
            category: "Full-Stack Web App",
            img: "assets/car_dealership_inventory_system.png",
            desc: "Car Dealership Inventory System is a full-stack web application designed for automotive dealerships to manage car inventory, track vehicle specifications, organize price listings, and manage customer leads efficiently.",
            bullets: [
                "Engineered RESTful API endpoints with Node.js and Express for car inventory CRUD operations.",
                "Implemented MongoDB schema architecture storing vehicle specifications, availability, and pricing stats.",
                "Built responsive search and filtering controls for make, model, year, and price ranges.",
                "Designed clean glassmorphic admin dashboards for updating vehicle status and tracking leads."
            ],
            tags: ["Node.js", "Express.js", "MongoDB", "React.js", "REST API", "CSS3"],
            liveLink: "https://github.com/Harshroz-07",
            repoLink: "https://github.com/Harshroz-07"
        },
        project2: {
            title: "Notes App",
            category: "React Web Application",
            img: "assets/notes_app.png",
            desc: "Notes App is a fast, interactive note-taking web application built with React and Vite. It provides vibrant note color categorization, instant text search, interactive task checklists, and confetti micro-animations on completion.",
            bullets: [
                "Developed modular React 19 components with instant local storage state synchronization.",
                "Added interactive task checklists with confetti animation celebrations upon completing tasks.",
                "Engineered responsive dark glassmorphism layout with smooth category filtering and search.",
                "Optimized bundle performance with Vite, delivering fast sub-second load times."
            ],
            tags: ["React.js", "Vite", "JavaScript", "LocalStorage", "Confetti", "CSS3"],
            liveLink: "http://localhost:5173",
            repoLink: "https://github.com/Harshroz-07"
        },
        project3: {
            title: "Personal Portfolio",
            category: "Creative Portfolio",
            img: "assets/personal_portfolio.png",
            desc: "Personal Portfolio is an interactive, high-performance developer portfolio built with Vanilla JS, HTML5, and CSS3. It incorporates an integrated Admin Control Panel, live messaging system, and custom glassmorphic aesthetics.",
            bullets: [
                "Built responsive layout, CSS micro-animations, and dynamic glassmorphism design system.",
                "Designed full-featured Admin Control Panel featuring user management, message inbox, and reply threads.",
                "Engineered floating live chat support widget allowing real-time communication between users and Admin.",
                "Optimized response times, zero external framework overhead, and automated Git deployment workflows."
            ],
            tags: ["JavaScript", "HTML5", "CSS3", "Admin Portal", "REST API"],
            liveLink: "http://localhost:8080",
            repoLink: "https://github.com/Harshroz-07/portfolio"
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
                    // Log message into Admin Inbox & User Messaging System
                    const cName = document.getElementById('contactName')?.value || 'Guest User';
                    const cEmail = document.getElementById('contactEmail')?.value || 'guest@portfolio.dev';
                    const cSubject = document.getElementById('contactSubject')?.value || 'Project Inquiry';
                    const cMessage = document.getElementById('contactMessage')?.value || 'Contact message submitted.';

                    if (typeof window.addNewContactMessage === 'function') {
                        window.addNewContactMessage(cName, cEmail, cSubject, cMessage);
                    }

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

    /* ==========================================
       13. ADMIN PORTAL & USER MESSAGING MODULE
    ========================================== */
    const initAdminPortal = () => {
        // Initial Seed Users
        const defaultUsers = [
            { id: 'usr-1', name: 'Sarah Jenkins', email: 'sarah.j@techcorp.io', role: 'Product Owner', status: 'Active', avatar: 'SJ' },
            { id: 'usr-2', name: 'Marcus Chen', email: 'marcus@devstudio.com', role: 'Developer', status: 'Active', avatar: 'MC' },
            { id: 'usr-3', name: 'Elena Rostova', email: 'elena@designhub.org', role: 'Designer', status: 'Offline', avatar: 'ER' }
        ];

        // Initial Seed Messages
        const defaultMessages = [
            {
                id: 'msg-1',
                userId: 'usr-1',
                senderName: 'Sarah Jenkins',
                email: 'sarah.j@techcorp.io',
                subject: 'E-commerce Redesign Proposal',
                timestamp: 'Today 09:30 AM',
                status: 'pending',
                messages: [
                    { id: 'm-1', sender: 'user', text: 'Hi Harsh! We loved your portfolio and would like to discuss a custom web application project for our team.', time: '09:30 AM' }
                ]
            },
            {
                id: 'msg-2',
                userId: 'usr-2',
                senderName: 'Marcus Chen',
                email: 'marcus@devstudio.com',
                subject: 'React & Web App Collaboration',
                timestamp: 'Yesterday 04:15 PM',
                status: 'replied',
                messages: [
                    { id: 'm-2', sender: 'user', text: 'Hey Harsh, are you available for freelance React or web development work next month?', time: 'Yesterday 04:15 PM' },
                    { id: 'm-3', sender: 'admin', text: 'Hi Marcus! Thanks for reaching out. Yes, I have bandwidth for web development consulting. Let us set up a call!', time: 'Yesterday 05:00 PM' }
                ]
            }
        ];

        // Storage Helpers
        const getUsers = () => JSON.parse(localStorage.getItem('admin_portal_users')) || defaultUsers;
        const setUsers = (users) => localStorage.setItem('admin_portal_users', JSON.stringify(users));
        const getMessages = () => JSON.parse(localStorage.getItem('admin_portal_messages')) || defaultMessages;
        const setMessages = (msgs) => localStorage.setItem('admin_portal_messages', JSON.stringify(msgs));

        // Ensure storage is seeded on first load
        if (!localStorage.getItem('admin_portal_users')) setUsers(defaultUsers);
        if (!localStorage.getItem('admin_portal_messages')) setMessages(defaultMessages);

        // Elements
        const adminModal = document.getElementById('adminModal');
        const adminModalBackdrop = document.getElementById('adminModalBackdrop');
        const adminPortalBtn = document.getElementById('adminPortalBtn');
        const adminModalClose = document.getElementById('adminModalClose');
        const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
        const adminTabPanes = document.querySelectorAll('.admin-tab-pane');

        const adminInboxBadge = document.getElementById('adminInboxBadge');
        const adminUsersBadge = document.getElementById('adminUsersBadge');
        const adminMessageList = document.getElementById('adminMessageList');
        const adminEmptyDetail = document.getElementById('adminEmptyDetail');
        const adminActiveThread = document.getElementById('adminActiveThread');
        const threadAvatar = document.getElementById('threadAvatar');
        const threadName = document.getElementById('threadName');
        const threadEmail = document.getElementById('threadEmail');
        const threadDate = document.getElementById('threadDate');
        const threadSubject = document.getElementById('threadSubject');
        const threadChatBody = document.getElementById('threadChatBody');
        const adminReplyForm = document.getElementById('adminReplyForm');
        const adminReplyText = document.getElementById('adminReplyText');

        const adminMessageSearch = document.getElementById('adminMessageSearch');
        const filterChips = document.querySelectorAll('.filter-chip');

        const adminUsersGrid = document.getElementById('adminUsersGrid');
        const adminUserSearch = document.getElementById('adminUserSearch');
        const adminAddUserForm = document.getElementById('adminAddUserForm');
        const jumpToAddUserBtn = document.getElementById('jumpToAddUserBtn');

        const userChatToggle = document.getElementById('userChatToggle');
        const userChatWindow = document.getElementById('userChatWindow');
        const userChatClose = document.getElementById('userChatClose');
        const userChatBadge = document.getElementById('userChatBadge');
        const userChatMessages = document.getElementById('userChatMessages');
        const userChatForm = document.getElementById('userChatForm');
        const userChatInput = document.getElementById('userChatInput');

        let activeMessageId = null;
        let currentFilter = 'all';

        // Format Time Helper
        const getCurrentTimeFormatted = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours}:${minutes} ${ampm}`;
        };

        // RENDER INBOX MESSAGES LIST
        const renderInboxList = () => {
            const messages = getMessages();
            const searchVal = (adminMessageSearch ? adminMessageSearch.value : '').toLowerCase();

            const filtered = messages.filter(m => {
                const matchesFilter = currentFilter === 'all' || 
                    (currentFilter === 'unread' && m.status === 'pending') || 
                    (currentFilter === 'replied' && m.status === 'replied');
                const matchesSearch = m.senderName.toLowerCase().includes(searchVal) ||
                    m.email.toLowerCase().includes(searchVal) ||
                    m.subject.toLowerCase().includes(searchVal);
                return matchesFilter && matchesSearch;
            });

            // Update Badge Count
            const pendingCount = messages.filter(m => m.status === 'pending').length;
            if (adminInboxBadge) adminInboxBadge.textContent = pendingCount;

            if (!adminMessageList) return;
            if (filtered.length === 0) {
                adminMessageList.innerHTML = `<div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 0.85rem;">No messages found.</div>`;
                return;
            }

            adminMessageList.innerHTML = filtered.map(m => {
                const lastMsg = m.messages[m.messages.length - 1] || {};
                const isActive = m.id === activeMessageId ? 'active' : '';
                const badgeClass = m.status === 'pending' ? 'pending' : 'replied';
                const badgeText = m.status === 'pending' ? 'Pending' : 'Replied';
                return `
                    <div class="msg-card ${isActive}" data-id="${m.id}">
                        <div class="msg-card-top">
                            <span class="msg-card-sender">${escapeHtml(m.senderName)}</span>
                            <span class="msg-card-time">${m.timestamp}</span>
                        </div>
                        <div class="msg-card-subject">${escapeHtml(m.subject)}</div>
                        <div class="msg-card-preview">${escapeHtml(lastMsg.text || '')}</div>
                        <div style="margin-top: 8px;">
                            <span class="msg-status-badge ${badgeClass}">${badgeText}</span>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach Click Listeners
            adminMessageList.querySelectorAll('.msg-card').forEach(card => {
                card.addEventListener('click', () => {
                    const msgId = card.getAttribute('data-id');
                    selectMessageThread(msgId);
                });
            });
        };

        // SELECT & RENDER THREAD DETAILS
        const selectMessageThread = (msgId) => {
            activeMessageId = msgId;
            renderInboxList();

            const messages = getMessages();
            const targetMsg = messages.find(m => m.id === msgId);
            if (!targetMsg) return;

            if (adminEmptyDetail) adminEmptyDetail.classList.add('hidden');
            if (adminActiveThread) adminActiveThread.classList.remove('hidden');

            const initials = targetMsg.senderName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
            if (threadAvatar) threadAvatar.textContent = initials;
            if (threadName) threadName.textContent = targetMsg.senderName;
            if (threadEmail) threadEmail.textContent = targetMsg.email;
            if (threadDate) threadDate.textContent = targetMsg.timestamp;
            if (threadSubject) threadSubject.textContent = targetMsg.subject;

            // Render Thread Body Bubbles
            if (threadChatBody) {
                threadChatBody.innerHTML = targetMsg.messages.map(item => {
                    const isUser = item.sender === 'user';
                    const bubbleClass = isUser ? 'user-msg' : 'admin-msg';
                    const senderLabel = isUser ? targetMsg.senderName : 'Harsh Roz (Admin)';
                    return `
                        <div class="chat-bubble ${bubbleClass}">
                            <div class="chat-bubble-sender">${escapeHtml(senderLabel)}</div>
                            <div>${escapeHtml(item.text)}</div>
                            <div class="chat-bubble-time">${item.time || ''}</div>
                        </div>
                    `;
                }).join('');
                threadChatBody.scrollTop = threadChatBody.scrollHeight;
            }
        };

        // ADMIN REPLY HANDLER
        if (adminReplyForm) {
            adminReplyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!activeMessageId || !adminReplyText || !adminReplyText.value.trim()) return;

                const replyVal = adminReplyText.value.trim();
                const messages = getMessages();
                const targetMsg = messages.find(m => m.id === activeMessageId);

                if (targetMsg) {
                    const newReply = {
                        id: 'r-' + Date.now(),
                        sender: 'admin',
                        text: replyVal,
                        time: getCurrentTimeFormatted()
                    };
                    targetMsg.messages.push(newReply);
                    targetMsg.status = 'replied';

                    setMessages(messages);
                    adminReplyText.value = '';

                    selectMessageThread(activeMessageId);
                    renderInboxList();
                    renderUserChatMessages();
                }
            });
        }

        // RENDER USERS GRID
        const renderUsersGrid = () => {
            const users = getUsers();
            const searchVal = (adminUserSearch ? adminUserSearch.value : '').toLowerCase();

            if (adminUsersBadge) adminUsersBadge.textContent = users.length;

            const filtered = users.filter(u => 
                u.name.toLowerCase().includes(searchVal) ||
                u.role.toLowerCase().includes(searchVal) ||
                u.email.toLowerCase().includes(searchVal)
            );

            if (!adminUsersGrid) return;
            if (filtered.length === 0) {
                adminUsersGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #94a3b8;">No users found matching query.</div>`;
                return;
            }

            adminUsersGrid.innerHTML = filtered.map(u => `
                <div class="user-card">
                    <div class="user-card-avatar" style="background: ${u.avatarBg || 'linear-gradient(135deg, #6366f1, #a855f7)'}">
                        ${u.avatar || u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="user-card-info">
                        <h4>${escapeHtml(u.name)}</h4>
                        <p>${escapeHtml(u.email)}</p>
                        <span class="user-role-badge">${escapeHtml(u.role)}</span>
                    </div>
                </div>
            `).join('');
        };

        // ADD NEW USER HANDLER
        if (adminAddUserForm) {
            adminAddUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('newUserName');
                const emailInput = document.getElementById('newUserEmail');
                const roleInput = document.getElementById('newUserRole');
                const statusInput = document.getElementById('newUserStatus');

                if (!nameInput || !emailInput) return;

                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const role = roleInput ? roleInput.value : 'Client';
                const status = statusInput ? statusInput.value : 'Active';

                const users = getUsers();
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

                const newUser = {
                    id: 'usr-' + Date.now(),
                    name,
                    email,
                    role,
                    status,
                    avatar: initials,
                    avatarBg: 'linear-gradient(135deg, #14b8a6, #6366f1)'
                };

                users.unshift(newUser);
                setUsers(users);
                adminAddUserForm.reset();

                // Switch to Users tab & refresh grid
                const usersTabBtn = document.querySelector('.admin-tab-btn[data-tab="usersTab"]');
                if (usersTabBtn) usersTabBtn.click();
                renderUsersGrid();
            });
        }

        // RENDER USER FLOATING CHAT MESSAGES
        const renderUserChatMessages = () => {
            const messages = getMessages();
            const currentThread = messages[0] || { messages: [] };
            const threadMsgs = currentThread.messages || [];

            const hasUnreadAdmin = currentThread.status === 'replied';
            if (userChatBadge) {
                if (hasUnreadAdmin) {
                    userChatBadge.classList.remove('hidden');
                } else {
                    userChatBadge.classList.add('hidden');
                }
            }

            if (!userChatMessages) return;
            userChatMessages.innerHTML = threadMsgs.map(m => {
                const isUser = m.sender === 'user';
                const bubbleClass = isUser ? 'user-msg' : 'admin-msg';
                const senderLabel = isUser ? 'You' : 'Harsh Roz (Admin)';
                return `
                    <div class="chat-bubble ${bubbleClass}">
                        <div class="chat-bubble-sender">${escapeHtml(senderLabel)}</div>
                        <div>${escapeHtml(m.text)}</div>
                        <div class="chat-bubble-time">${m.time || ''}</div>
                    </div>
                `;
            }).join('');
            userChatMessages.scrollTop = userChatMessages.scrollHeight;
        };

        // USER CHAT FORM SUBMIT
        if (userChatForm) {
            userChatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!userChatInput || !userChatInput.value.trim()) return;

                const textVal = userChatInput.value.trim();
                const messages = getMessages();

                let activeThread = messages[0];
                if (!activeThread) {
                    activeThread = {
                        id: 'msg-' + Date.now(),
                        userId: 'usr-guest',
                        senderName: 'Visitor User',
                        email: 'visitor@portfolio.dev',
                        subject: 'Live Chat Inquiry',
                        timestamp: 'Today',
                        status: 'pending',
                        messages: []
                    };
                    messages.unshift(activeThread);
                }

                activeThread.messages.push({
                    id: 'm-' + Date.now(),
                    sender: 'user',
                    text: textVal,
                    time: getCurrentTimeFormatted()
                });
                activeThread.status = 'pending';

                setMessages(messages);
                userChatInput.value = '';

                renderUserChatMessages();
                renderInboxList();
            });
        }

        // GLOBAL UTILITY FOR CONTACT FORM INTEGRATION
        window.addNewContactMessage = (senderName, email, subject, messageText) => {
            const messages = getMessages();
            const users = getUsers();

            let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                const initials = senderName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
                user = {
                    id: 'usr-' + Date.now(),
                    name: senderName,
                    email: email,
                    role: 'Client Inquiry',
                    status: 'Active',
                    avatar: initials
                };
                users.unshift(user);
                setUsers(users);
            }

            const newMsg = {
                id: 'msg-' + Date.now(),
                userId: user.id,
                senderName: senderName,
                email: email,
                subject: subject || 'Contact Inquiry',
                timestamp: 'Today ' + getCurrentTimeFormatted(),
                status: 'pending',
                messages: [
                    { id: 'm-' + Date.now(), sender: 'user', text: messageText, time: getCurrentTimeFormatted() }
                ]
            };

            messages.unshift(newMsg);
            setMessages(messages);

            renderInboxList();
            renderUsersGrid();
            renderUserChatMessages();
        };

        // Helper for escaping HTML strings
        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        // EVENT LISTENERS: Admin Modal Toggle
        if (adminPortalBtn && adminModal) {
            adminPortalBtn.addEventListener('click', () => {
                adminModal.classList.add('active');
                adminModal.setAttribute('aria-hidden', 'false');
                renderInboxList();
                renderUsersGrid();
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }

        const closeAdminModal = () => {
            if (adminModal) {
                adminModal.classList.remove('active');
                adminModal.setAttribute('aria-hidden', 'true');
            }
        };

        if (adminModalClose) adminModalClose.addEventListener('click', closeAdminModal);
        if (adminModalBackdrop) adminModalBackdrop.addEventListener('click', closeAdminModal);

        // EVENT LISTENERS: Tab Switching
        adminTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                adminTabBtns.forEach(b => b.classList.remove('active'));
                adminTabPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const pane = document.getElementById(targetTab);
                if (pane) pane.classList.add('active');

                if (targetTab === 'inboxTab') renderInboxList();
                if (targetTab === 'usersTab') renderUsersGrid();
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });

        // Filter chips in inbox
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.getAttribute('data-filter');
                renderInboxList();
            });
        });

        if (adminMessageSearch) adminMessageSearch.addEventListener('input', renderInboxList);
        if (adminUserSearch) adminUserSearch.addEventListener('input', renderUsersGrid);

        if (jumpToAddUserBtn) {
            jumpToAddUserBtn.addEventListener('click', () => {
                const addTabBtn = document.querySelector('.admin-tab-btn[data-tab="addUserTab"]');
                if (addTabBtn) addTabBtn.click();
            });
        }

        // Floating User Chat Widget Listeners
        if (userChatToggle && userChatWindow) {
            userChatToggle.addEventListener('click', () => {
                userChatWindow.classList.toggle('hidden');
                const mainIcon = userChatToggle.querySelector('.chat-icon-main');
                const closeIcon = userChatToggle.querySelector('.chat-icon-close');
                if (userChatWindow.classList.contains('hidden')) {
                    if (mainIcon) mainIcon.classList.remove('hidden');
                    if (closeIcon) closeIcon.classList.add('hidden');
                } else {
                    if (mainIcon) mainIcon.classList.add('hidden');
                    if (closeIcon) closeIcon.classList.remove('hidden');
                    renderUserChatMessages();
                }
            });
        }

        if (userChatClose && userChatWindow) {
            userChatClose.addEventListener('click', () => {
                userChatWindow.classList.add('hidden');
                const mainIcon = userChatToggle.querySelector('.chat-icon-main');
                const closeIcon = userChatToggle.querySelector('.chat-icon-close');
                if (mainIcon) mainIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        }

        // Initial Render Call
        renderInboxList();
        renderUsersGrid();
        renderUserChatMessages();
    };

    initAdminPortal();

    /* ====================================================
       CONTINUOUS 3D TECH ORBIT ECOSYSTEM ENGINE
    ==================================================== */
    const init3DTechOrbit = () => {
        const section = document.getElementById('about');
        const orbitTrack = document.getElementById('orbitLogosTrack');
        const ecosystem = document.getElementById('orbitEcosystem');
        const centerBadge = document.getElementById('centerTechCategory');
        const centerName = document.getElementById('centerTechName');
        const centerDesc = document.getElementById('centerTechDesc');
        const centerLight = document.getElementById('orbitCenterLight');
        const centerCardContent = document.getElementById('centerCardContent');
        const canvas = document.getElementById('orbitParticlesCanvas');

        if (!orbitTrack || !ecosystem) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Technology dataset with all 11 requested technologies
        const technologies = [
            {
                id: "html",
                name: "HTML5",
                category: "Frontend",
                description: "Semantic Web standards, accessible structures, modern markup, and web core foundations.",
                color: "#e34f26",
                glow: "rgba(227, 79, 38, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32"><path fill="#E34F26" d="M1.5 0h21l-1.91 21.563L11.97 24 2.41 21.563z"/><path fill="#EF652A" d="M12 2.182v19.61l7.85-2.14 1.57-17.47z"/><path fill="#FFF" d="M12 9.682H8.38l-.25-2.82H12V4.545H5.82l.75 8.455H12zm0 8.018l-3.95-1.07-.26-2.91H5.45l.49 5.56L12 20.91z"/><path fill="#EEE" d="M12 9.682v2.318h3.37l-.32 3.59-3.05.83v2.318l5.35-1.46.7-7.59zM12 4.545v2.318h6.14l.2-2.318z"/></svg>`
            },
            {
                id: "css",
                name: "CSS3",
                category: "Styling",
                description: "Responsive layouts, Flexbox, Grid systems, keyframe animations, dynamic theme styling, and modern CSS variables.",
                color: "#1572b6",
                glow: "rgba(21, 114, 182, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32"><path fill="#1572B6" d="M1.5 0h21l-1.91 21.563L11.97 24 2.41 21.563z"/><path fill="#33A9DC" d="M12 2.182v19.61l7.85-2.14 1.57-17.47z"/><path fill="#FFF" d="M12 9.682H7.07l.2 2.318H12v2.318H7.48l.4 4.5 4.12 1.13v2.318l-6.41-1.77-.73-8.177h7.14z"/><path fill="#EEE" d="M12 4.545h6.35l.2-2.318H12v2.318zm0 5.137h5.92l-.62 7.045-5.3 1.46v2.318l7.6-2.1.9-10.051H12z"/></svg>`
            },
            {
                id: "js",
                name: "JavaScript",
                category: "Language",
                description: "Dynamic ES6+ programming, DOM manipulation, asynchronous promises, event loops, and core frontend/backend logic.",
                color: "#f7df1e",
                glow: "rgba(247, 223, 30, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M6.5 18.5l2-1.2c.4.7.8 1.2 1.6 1.2.8 0 1.3-.3 1.3-1 0-.7-.5-1-1.6-1.5l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-2 1.6-3.4 3.9-3.4 1.7 0 2.9.6 3.7 2.1l-1.9 1.2c-.4-.7-.9-1-1.7-1-.8 0-1.3.4-1.3.9 0 .6.4.9 1.5 1.4l.6.3c2 1 3 1.9 3 3.6 0 2.2-1.7 3.6-4.3 3.6-2.1 0-3.6-.9-4.4-2.4zm10.3.3c.7 0 1.3-.4 1.5-1.1h2.2c-.4 2-2 3.5-4.2 3.5-2.6 0-4.3-1.6-4.3-4.3v-4.1h2.4v4.1c0 1.2.9 1.9 2.4 1.9z" fill="#000"/></svg>`
            },
            {
                id: "react",
                name: "React.js",
                category: "Frontend",
                description: "Building dynamic, high-performance, component-driven user interfaces and reactive applications.",
                color: "#61dafb",
                glow: "rgba(97, 218, 251, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="none"><ellipse cx="12" cy="12" rx="9.5" ry="4" stroke="#61DAFB" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="9.5" ry="4" stroke="#61DAFB" stroke-width="1.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="4" stroke="#61DAFB" stroke-width="1.6" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="2.2" fill="#61DAFB"/></svg>`
            },
            {
                id: "tailwind",
                name: "Tailwind CSS",
                category: "Styling",
                description: "Building ultra-responsive, highly aesthetic UI design systems with utility-first CSS frameworks.",
                color: "#38bdf8",
                glow: "rgba(56, 189, 248, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="#38BDF8"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>`
            },
            {
                id: "node",
                name: "Node.js",
                category: "Backend",
                description: "Building fast, non-blocking asynchronous backend APIs, event loops, and server architectures using Express.",
                color: "#339933",
                glow: "rgba(51, 153, 51, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32"><path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2z" fill="#339933"/><path d="M12 6.5l5 2.9v5.8l-5 2.9-5-2.9V9.4z" fill="#141a30"/><circle cx="12" cy="12" r="2.5" fill="#66BB66"/></svg>`
            },
            {
                id: "next",
                name: "Next.js",
                category: "Fullstack",
                description: "Building production-ready applications with server-side rendering, App Router, static generation, and modern routing.",
                color: "#ffffff",
                glow: "rgba(255, 255, 255, 0.5)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="none"><circle cx="12" cy="12" r="10.5" fill="#000" stroke="#FFF" stroke-width="1.5"/><path d="M7.5 16.5V7.5l9 10.5" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/><path d="M16.5 7.5v6" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/></svg>`
            },
            {
                id: "sql",
                name: "SQL",
                category: "Database",
                description: "Relational database architecture, normalized schemas, complex joins, data indexing, and high-performance querying.",
                color: "#00758f",
                glow: "rgba(0, 117, 143, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="none" stroke="#00758F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8.5" ry="2.8"/><path d="M20.5 12c0 1.5-3.8 2.8-8.5 2.8s-8.5-1.3-8.5-2.8"/><path d="M3.5 5v14c0 1.5 3.8 2.8 8.5 2.8s8.5-1.3 8.5-2.8V5"/><text x="12" y="13.2" font-family="sans-serif" font-size="5.5" font-weight="900" fill="#00758F" text-anchor="middle" stroke="none">SQL</text></svg>`
            },
            {
                id: "postgresql",
                name: "PostgreSQL",
                category: "Database",
                description: "Enterprise-grade relational database management with ACID compliance, JSONB support, and robust indexing.",
                color: "#4169e1",
                glow: "rgba(65, 105, 225, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="#4169E1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2V13H9v-2h2V9h2v2h2v2h-2v3.5z"/><ellipse cx="12" cy="7.5" rx="3.5" ry="2.5" fill="none" stroke="#FFF" stroke-width="1.5"/><path d="M8.5 10c0 3.5 1.5 6.5 3.5 6.5s3.5-3 3.5-6.5" fill="none" stroke="#FFF" stroke-width="1.5"/></svg>`
            },
            {
                id: "mongodb",
                name: "MongoDB",
                category: "Database",
                description: "High-throughput NoSQL document database managing flexible JSON/BSON schemas and aggregation pipelines.",
                color: "#47a248",
                glow: "rgba(71, 162, 72, 0.6)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="#47A248"><path d="M12 1.5s-6.5 5.2-6.5 11.8c0 4.2 3.2 7.7 6.5 9.2 3.3-1.5 6.5-5 6.5-9.2C18.5 6.7 12 1.5 12 1.5zm.7 18.2V4.3c3.8 2.8 4.3 7 3.5 9-.7 1.8-2.2 3.3-3.5 3.9v2.5z"/></svg>`
            },
            {
                id: "github",
                name: "GitHub",
                category: "DevOps & Tools",
                description: "Version control management, CI/CD automated deployments, collaborative code review, and repository security.",
                color: "#f0f6fc",
                glow: "rgba(240, 246, 252, 0.5)",
                svg: `<svg viewBox="0 0 24 24" class="tech-icon-svg" width="32" height="32" fill="#F0F6FC"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`
            }
        ];

        // Create HTML nodes for each technology
        orbitTrack.innerHTML = '';
        const nodeEls = [];

        technologies.forEach((tech, index) => {
            const node = document.createElement('div');
            node.className = 'orbit-node-3d';
            node.setAttribute('data-tech-id', tech.id);
            node.setAttribute('data-index', index);
            node.style.setProperty('--node-glow', tech.glow);

            node.innerHTML = `
                ${tech.svg ? tech.svg : `<i data-lucide="${tech.icon}"></i>`}
                <span class="orbit-node-tooltip">${tech.name}</span>
            `;

            // Node click to focus
            node.addEventListener('click', () => {
                const numTechs = technologies.length;
                let targetGlobalAngle = (3 * Math.PI / 2) - (index / numTechs) * 2 * Math.PI;
                const diff = (targetGlobalAngle - globalAngle) % (2 * Math.PI);
                globalAngle += diff;
            });

            orbitTrack.appendChild(node);
            nodeEls.push(node);
        });

        // Initialize Lucide icons if fallback icon used
        if (window.lucide) lucide.createIcons();

        // --------------------------------------------------
        // 1. FLOATING PARTICLES CANVAS BACKGROUND
        // --------------------------------------------------
        if (canvas && !prefersReducedMotion) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let width = 0, height = 0;
            let mousePos = { x: 0, y: 0, targetX: 0, targetY: 0 };

            const resizeCanvas = () => {
                if (!canvas) return;
                width = canvas.width = section ? section.offsetWidth : window.innerWidth;
                height = canvas.height = section ? section.offsetHeight : 600;
            };
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            class Particle {
                constructor() { this.reset(); }
                reset() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.z = Math.random() * 0.8 + 0.2;
                    this.radius = Math.random() * 1.8 + 0.8;
                    this.vx = (Math.random() - 0.5) * 0.3;
                    this.vy = (Math.random() - 0.5) * 0.3;
                    this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(6, 182, 212, ';
                    this.alpha = Math.random() * 0.35 + 0.1;
                }
                update() {
                    this.x += this.vx * this.z + (mousePos.x * 0.03 * this.z);
                    this.y += this.vy * this.z + (mousePos.y * 0.03 * this.z);
                    if (this.x < 0) this.x = width;
                    if (this.x > width) this.x = 0;
                    if (this.y < 0) this.y = height;
                    if (this.y > height) this.y = 0;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * this.z, 0, Math.PI * 2);
                    ctx.fillStyle = this.color + (this.alpha * this.z) + ')';
                    ctx.fill();
                }
            }

            for (let i = 0; i < 30; i++) particles.push(new Particle());

            const renderParticles = () => {
                ctx.clearRect(0, 0, width, height);
                mousePos.x += (mousePos.targetX - mousePos.x) * 0.05;
                mousePos.y += (mousePos.targetY - mousePos.y) * 0.05;
                particles.forEach(p => { p.update(); p.draw(); });
                requestAnimationFrame(renderParticles);
            };
            renderParticles();

            if (section) {
                section.addEventListener('mousemove', (e) => {
                    const rect = section.getBoundingClientRect();
                    mousePos.targetX = (e.clientX - rect.left - rect.width / 2) * 0.04;
                    mousePos.targetY = (e.clientY - rect.top - rect.height / 2) * 0.04;
                });
            }
        }

        // --------------------------------------------------
        // 2. CONTINUOUS 3D ORBIT MATHEMATICS ENGINE
        // --------------------------------------------------
        let globalAngle = 0;
        let currentActiveId = null;

        // Camera tilt state for mouse movement
        let mouseXPercent = 0, mouseYPercent = 0;
        let camRotX = 0, camRotY = 0;

        if (section) {
            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                mouseXPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseYPercent = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            });
            section.addEventListener('mouseleave', () => {
                mouseXPercent = 0;
                mouseYPercent = 0;
            });
        }

        // Handle active tech information update
        const updateActiveTechInfo = (tech) => {
            if (currentActiveId === tech.id) return;
            currentActiveId = tech.id;

            if (centerCardContent) {
                centerCardContent.classList.add('animating-out');
                setTimeout(() => {
                    if (centerBadge) centerBadge.textContent = tech.category;
                    if (centerName) centerName.textContent = tech.name;
                    if (centerDesc) centerDesc.textContent = tech.description;

                    if (centerLight) {
                        centerLight.style.background = `radial-gradient(circle, ${tech.glow} 0%, transparent 70%)`;
                    }

                    centerCardContent.classList.remove('animating-out');
                    centerCardContent.classList.add('animating-in');
                    setTimeout(() => {
                        centerCardContent.classList.remove('animating-in');
                    }, 350);
                }, 200);
            }
        };

        // Main 3D Orbit Loop
        const numTechs = technologies.length;
        const speed = 0.0035; // Continuous single-direction orbit

        const animateOrbit = () => {
            if (!prefersReducedMotion) {
                globalAngle += speed;
            }

            // Smooth camera parallax
            const targetCamRotX = -mouseYPercent * 5;
            const targetCamRotY = mouseXPercent * 6;
            camRotX += (targetCamRotX - camRotX) * 0.05;
            camRotY += (targetCamRotY - camRotY) * 0.05;

            ecosystem.style.transform = `perspective(1200px) rotateX(${camRotX}deg) rotateY(${camRotY}deg)`;

            // Responsive Radii
            const isMobile = window.innerWidth <= 768;
            const Rx = isMobile ? 220 : 420;
            const Ry = isMobile ? 110 : 175;
            const Rz = isMobile ? 150 : 230;

            let maxZ = -Infinity;
            let activeIndex = 0;

            nodeEls.forEach((node, idx) => {
                const angle = globalAngle + (idx / numTechs) * 2 * Math.PI;

                const x = Rx * Math.sin(angle);
                const y = Ry * Math.cos(angle);
                const z = Rz * Math.cos(angle);

                // Track max Z (closest to camera at front center)
                if (z > maxZ) {
                    maxZ = z;
                    activeIndex = idx;
                }

                // Normalized depth zNorm in [0, 1]
                const zNorm = (z + Rz) / (2 * Rz);
                const scale = 0.65 + 0.55 * zNorm;
                const opacity = 0.35 + 0.65 * zNorm;
                const brightness = 0.7 + 0.4 * zNorm;
                const zIndex = Math.round(100 + 100 * zNorm);

                node.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
                node.style.opacity = opacity.toFixed(2);
                node.style.filter = `brightness(${brightness.toFixed(2)})`;
                node.style.zIndex = zIndex;
            });

            // Mark active node and update center display
            nodeEls.forEach((node, idx) => {
                if (idx === activeIndex) {
                    node.classList.add('active-orbit-node');
                } else {
                    node.classList.remove('active-orbit-node');
                }
            });

            updateActiveTechInfo(technologies[activeIndex]);

            requestAnimationFrame(animateOrbit);
        };

        animateOrbit();

        // --------------------------------------------------
        // 3. GSAP SCROLLTRIGGER ENTRANCE ASSEMBLY
        // --------------------------------------------------
        if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo('.tech-section-header', 
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: '#about', start: 'top 80%' }
                }
            );

            gsap.fromTo(ecosystem,
                { opacity: 0, scale: 0.85, rotateX: 10 },
                {
                    opacity: 1, scale: 1, rotateX: 0, duration: 1.3, ease: 'power3.out',
                    scrollTrigger: { trigger: '.orbit-ecosystem-3d', start: 'top 85%' }
                }
            );
        }
    };

    /* ====================================================
       CORE CONCEPT — “MY DIGITAL JOURNEY” 3D DESTINATION PATH
    ==================================================== */
    const initDigitalJourneyFooter = () => {
        const viewport = document.getElementById('journey3dViewport');
        const canvas = document.getElementById('journeyPathCanvas');
        const nodesTrack = document.getElementById('journeyNodesTrack');
        const hudBadge = document.getElementById('hudStationBadge');
        const hudTitle = document.getElementById('hudStationTitle');
        const hudDesc = document.getElementById('hudStationDesc');
        const hudWarpBtn = document.getElementById('hudWarpBtn');
        const destBtns = document.querySelectorAll('.journey-dest-btn');

        if (!canvas || !viewport) return;

        const ctx = canvas.getContext('2d');
        let width = 0, height = 0;

        const resizeCanvas = () => {
            width = canvas.width = viewport.offsetWidth;
            height = canvas.height = viewport.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const stations = [
            { id: "0", name: "Launch Station", badge: "STATION 01 // 🚀 LAUNCH PLATFORM", icon: "🚀", target: "#hero", desc: "Starting point of my digital world. Developer intro, bio, and mission parameters." },
            { id: "1", name: "Developer Zone", badge: "STATION 02 // 👨‍💻 DEVELOPER ZONE", icon: "👨‍💻", target: "#about", desc: "Futuristic workstation featuring core development pillars & engineering philosophies." },
            { id: "2", name: "Skill Universe", badge: "STATION 03 // ⚡ SKILL UNIVERSE", icon: "⚡", target: "#about", desc: "3D floating technological ecosystem & interactive continuous skill orbit." },
            { id: "3", name: "AI Lab", badge: "STATION 04 // 🧠 AI LAB", icon: "🧠", target: "#projects", desc: "Artificial intelligence research laboratory, neural network models & machine learning apps." },
            { id: "4", name: "Project City", badge: "STATION 05 // 🔥 PROJECT CITY", icon: "🔥", target: "#projects", desc: "Miniature city of project towers representing fullstack web applications & systems." },
            { id: "5", name: "Achievement Mountain", badge: "STATION 06 // 🏆 ACHIEVEMENT MOUNTAIN", icon: "🏆", target: "#experience", desc: "Milestone peak of competitive wins, academic honors, and certifications." },
            { id: "6", name: "Experience Station", badge: "STATION 07 // 💼 EXPERIENCE STATION", icon: "💼", target: "#experience", desc: "Space station career train journey highlighting internships and timeline milestones." },
            { id: "7", name: "Career Destination", badge: "STATION 08 // 🎯 CAREER DESTINATION", icon: "🎯", target: "#about", desc: "Future roadmap of active builds, new technology horizons, and vision." },
            { id: "8", name: "Contact Portal", badge: "STATION 09 // 📩 CONTACT PORTAL", icon: "📩", target: "#contact", desc: "Wormhole portal to connect, initiate projects, and collaborate." }
        ];

        let activeStationIndex = 0;
        const nodeElements = [];

        // Generate Node Pins along 3D Perspective Curve
        if (nodesTrack) {
            nodesTrack.innerHTML = '';
            stations.forEach((st, idx) => {
                const pin = document.createElement('div');
                pin.className = `journey-node-pin ${idx === 0 ? 'active' : ''}`;
                pin.setAttribute('data-index', idx);
                pin.innerHTML = st.icon;
                pin.title = st.name;

                pin.addEventListener('click', () => {
                    setActiveStation(idx);
                });

                nodesTrack.appendChild(pin);
                nodeElements.push(pin);
            });
        }

        // Calculate 3D Curve Coordinates along S-curve
        const getPointOnCurve = (t) => {
            // S-curve from bottom-left to top-right in 3D perspective
            const x = width * (0.08 + 0.84 * t);
            const y = height * (0.75 - 0.5 * Math.sin(t * Math.PI));
            const z = 0.5 + 0.5 * Math.sin(t * Math.PI); // Depth factor
            return { x, y, z };
        };

        // Energy pulses traveling along the road
        let pulses = [];
        for (let i = 0; i < 20; i++) {
            pulses.push({
                t: Math.random(),
                speed: 0.002 + Math.random() * 0.002,
                size: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? '#c084fc' : '#38bdf8'
            });
        }

        // Main 3D Highway Canvas Loop
        const renderPath = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw glowing 3D cyber road curve
            ctx.beginPath();
            const steps = 100;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const pt = getPointOnCurve(t);
                if (i === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Inner cyan beam
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Render Traveling Energy Pulses
            pulses.forEach(p => {
                p.t = (p.t + p.speed) % 1;
                const pt = getPointOnCurve(p.t);

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, p.size * pt.z, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Position HTML Node Pins over 3D coordinates
            nodeElements.forEach((pin, idx) => {
                const t = idx / (stations.length - 1);
                const pt = getPointOnCurve(t);
                pin.style.left = `${pt.x}px`;
                pin.style.top = `${pt.y}px`;
            });

            requestAnimationFrame(renderPath);
        };
        renderPath();

        // Update active station HUD & triggers
        const setActiveStation = (index) => {
            activeStationIndex = index;
            const st = stations[index];

            // Update pins
            nodeElements.forEach((pin, i) => {
                if (i === index) pin.classList.add('active');
                else pin.classList.remove('active');
            });

            // Update station buttons
            destBtns.forEach((btn, i) => {
                if (i === index) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            // Update HUD card content
            if (hudBadge) hudBadge.textContent = st.badge;
            if (hudTitle) hudTitle.textContent = st.name;
            if (hudDesc) hudDesc.textContent = st.desc;
        };

        // Station button clicks
        destBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-station'), 10);
                setActiveStation(idx);
            });
        });

        // Warp button click
        if (hudWarpBtn) {
            hudWarpBtn.addEventListener('click', () => {
                const st = stations[activeStationIndex];
                if (st && st.target) {
                    const targetEl = document.querySelector(st.target);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    };

    init3DTechOrbit();
    initDigitalJourneyFooter();

});

