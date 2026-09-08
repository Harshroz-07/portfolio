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
       CINEMATIC 3D TECH STACK & EXPERTISE ENGINE
    ==================================================== */
    const init3DTechStack = () => {
        const section = document.getElementById('about');
        const cardsGrid = document.getElementById('techCardsGrid');
        const cards = document.querySelectorAll('.tech-card-3d');
        const canvas = document.getElementById('techParticlesCanvas');

        if (!cardsGrid || !cards.length) return;

        // --------------------------------------------------
        // 1. FLOATING 3D PARTICLES CANVAS BACKGROUND
        // --------------------------------------------------
        if (canvas) {
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
                constructor() {
                    this.reset();
                }
                reset() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.z = Math.random() * 0.8 + 0.2;
                    this.radius = Math.random() * 2 + 1;
                    this.vx = (Math.random() - 0.5) * 0.4;
                    this.vy = (Math.random() - 0.5) * 0.4;
                    this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(6, 182, 212, ';
                    this.alpha = Math.random() * 0.4 + 0.1;
                }
                update() {
                    this.x += this.vx * this.z + (mousePos.x * 0.05 * this.z);
                    this.y += this.vy * this.z + (mousePos.y * 0.05 * this.z);

                    if (this.x < 0) this.x = width;
                    if (this.x > width) this.x = 0;
                    if (this.y < 0) this.y = height;
                    if (this.y > height) this.y = 0;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * this.z, 0, Math.PI * 2);
                    ctx.fillStyle = this.color + (this.alpha * this.z) + ')';
                    ctx.shadowColor = this.color + '0.8)';
                    ctx.shadowBlur = 8 * this.z;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            for (let i = 0; i < 35; i++) {
                particles.push(new Particle());
            }

            const renderParticles = () => {
                ctx.clearRect(0, 0, width, height);
                mousePos.x += (mousePos.targetX - mousePos.x) * 0.05;
                mousePos.y += (mousePos.targetY - mousePos.y) * 0.05;

                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                requestAnimationFrame(renderParticles);
            };
            renderParticles();

            if (section) {
                section.addEventListener('mousemove', (e) => {
                    const rect = section.getBoundingClientRect();
                    mousePos.targetX = (e.clientX - rect.left - rect.width / 2) * 0.05;
                    mousePos.targetY = (e.clientY - rect.top - rect.height / 2) * 0.05;
                });
            }
        }

        // --------------------------------------------------
        // 2. REAL-TIME MOUSE 3D TILT & PARALLAX TRACKER
        // --------------------------------------------------
        let hoveredIndex = null;

        cards.forEach((card, idx) => {
            card.addEventListener('mousemove', (e) => {
                hoveredIndex = idx;
                const rect = card.getBoundingClientRect();
                const cardWidth = rect.width;
                const cardHeight = rect.height;

                const mouseX = (e.clientX - rect.left - cardWidth / 2) / (cardWidth / 2);
                const mouseY = (e.clientY - rect.top - cardHeight / 2) / (cardHeight / 2);

                const rotateX = -mouseY * 8;
                const rotateY = mouseX * 8;

                const spotX = e.clientX - rect.left;
                const spotY = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${spotX}px`);
                card.style.setProperty('--mouse-y', `${spotY}px`);

                if (window.gsap) {
                    gsap.to(card, {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        scale3d: 1.03,
                        transformPerspective: 1200,
                        duration: 0.35,
                        ease: "power2.out"
                    });
                } else {
                    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                hoveredIndex = null;
                if (window.gsap) {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        scale3d: 1,
                        duration: 0.6,
                        ease: "power3.out"
                    });
                } else {
                    card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                }
            });
        });

        // --------------------------------------------------
        // 3. LIVE SEQUENTIAL ROTATION & SPOTLIGHT TIMELINE
        // --------------------------------------------------
        const presets = [
            { rotateX: -4, rotateY: 7, translateY: -8, scale: 1.03 },
            { rotateX: 4, rotateY: -7, translateY: -8, scale: 1.03 },
            { rotateX: -3, rotateY: 6, translateY: -8, scale: 1.03 }
        ];

        let activeCardIndex = 0;

        const animateProgressBars = (card) => {
            const bars = card.querySelectorAll('.skill-progress-3d');
            bars.forEach((bar, i) => {
                const targetWidth = bar.getAttribute('data-progress') || '85';
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, i * 100);
            });
        };

        const triggerCardSpotlight = (index) => {
            if (hoveredIndex !== null) return;

            cards.forEach((card, idx) => {
                const preset = presets[idx] || presets[0];

                if (idx === index) {
                    card.classList.add('active-3d-card');
                    animateProgressBars(card);

                    if (window.gsap) {
                        gsap.to(card, {
                            rotateX: preset.rotateX,
                            rotateY: preset.rotateY,
                            y: preset.translateY,
                            scale3d: preset.scale,
                            duration: 1.8,
                            ease: "power3.inOut"
                        });
                    } else {
                        card.style.transform = `perspective(1200px) rotateX(${preset.rotateX}deg) rotateY(${preset.rotateY}deg) translateY(${preset.translateY}px) scale3d(${preset.scale}, ${preset.scale}, ${preset.scale})`;
                    }
                } else {
                    card.classList.remove('active-3d-card');
                    if (window.gsap) {
                        gsap.to(card, {
                            rotateX: 0,
                            rotateY: 0,
                            y: 0,
                            scale3d: 1,
                            duration: 1.2,
                            ease: "power3.out"
                        });
                    } else {
                        card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
                    }
                }
            });
        };

        triggerCardSpotlight(0);

        setInterval(() => {
            if (hoveredIndex === null) {
                activeCardIndex = (activeCardIndex + 1) % cards.length;
                triggerCardSpotlight(activeCardIndex);
            }
        }, 2800);

        // --------------------------------------------------
        // 4. GSAP SCROLLTRIGGER ENTRANCE ANIMATION
        // --------------------------------------------------
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo('.tech-section-header', 
                { opacity: 0, y: 50, filter: 'blur(10px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '#about',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            gsap.fromTo(cards,
                { opacity: 0, y: 70, rotateX: -15 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1.1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.skills-wrapper-3d',
                        start: 'top 85%',
                        onEnter: () => {
                            if (window.lucide) lucide.createIcons();
                        }
                    }
                }
            );
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        triggerCardSpotlight(0);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(cardsGrid);
        }
    };

    init3DTechStack();

});
