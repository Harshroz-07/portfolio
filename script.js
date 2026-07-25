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
            category: "Web Application",
            img: "assets/project1.png",
            desc: "Apex is a full-featured e-commerce solution engineered for next-generation digital storefronts. It utilizes modern static rendering engines and optimization strategies to secure a Google Lighthouse performance score near 100.",
            bullets: [
                "Constructed high-speed API route caching to shrink response latencies by 60%.",
                "Incorporated Stripe payment gateways, utilizing secure webhooks for transaction tracking.",
                "Engineered fully customized CSS micro-animations for shopping cart and filtering panels.",
                "Designed custom analytical dashboards monitoring page-views, orders, and sales demographics."
            ],
            tags: ["Next.js", "React", "TypeScript", "Stripe", "Framer Motion", "TailwindCSS"],
            liveLink: "https://example.com/apex-demo",
            repoLink: "https://github.com/example/apex-ecom"
        },
        project2: {
            title: "Pulse Real-Time Analytics App",
            category: "Mobile & Analytics",
            img: "assets/project2.png",
            desc: "Pulse is a dashboard-oriented mobile application tracking user growth trends and multi-channel marketing campaigns in real-time. Built specifically to deliver granular chart analyses in a performant design.",
            bullets: [
                "Utilized React Native Reanimated to process chart transitions smoothly at 60fps.",
                "Designed responsive flex layouts to ensure design fidelity on both iOS tablets and mobile screens.",
                "Wrote asynchronous caching models enabling fully functional offline dashboard rendering.",
                "Implemented localized notifications signaling spikes or crashes in client marketing metrics."
            ],
            tags: ["React Native", "Expo", "ChartJS", "Node.js", "WebSockets", "Redux"],
            liveLink: "https://example.com/pulse-demo",
            repoLink: "https://github.com/example/pulse-analytics"
        },
        project3: {
            title: "Zenith Collaboration Board",
            category: "UI/UX & Web SaaS",
            img: "assets/project3.png",
            desc: "Zenith is a real-time team collaboration platform modeling complex agile workflows. Features include custom project drag-and-drop cards, integrated chats, and comprehensive task assignments.",
            bullets: [
                "Initiated full UX research loops including wireframing, high-fidelity mockups, and interactive prototypes.",
                "Designed lightweight glassmorphic panels ensuring high readability in dark mode.",
                "Integrated real-time database syncing, triggering instant board changes across concurrent team members.",
                "Wrote comprehensive unit testing routines ensuring clean draggable task lanes."
            ],
            tags: ["Figma", "UX Design", "React", "TailwindCSS", "Firebase"],
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
       13. 3D WEBGL ENGINE & THREE.JS SCENE
    ========================================== */
    const init3D = () => {
        if (typeof THREE === 'undefined') return;

        /* --- 1. Fullscreen WebGL Background Scene --- */
        const bgCanvas = document.getElementById('bg3dCanvas');
        if (bgCanvas) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 30;

            const renderer = new THREE.WebGLRenderer({
                canvas: bgCanvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Particles Starfield
            const particleCount = 1200;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            const palette = [
                new THREE.Color('#14b8a6'), // teal
                new THREE.Color('#6366f1'), // indigo
                new THREE.Color('#a855f7'), // purple
                new THREE.Color('#38bdf8'), // sky blue
                new THREE.Color('#ffffff')  // white
            ];

            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 80;
                positions[i + 1] = (Math.random() - 0.5) * 80;
                positions[i + 2] = (Math.random() - 0.5) * 60;

                const c = palette[Math.floor(Math.random() * palette.length)];
                colors[i] = c.r;
                colors[i + 1] = c.g;
                colors[i + 2] = c.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.25,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });

            const particles = new THREE.Points(geometry, particleMaterial);
            scene.add(particles);

            // Floating Wireframe Geometric Objects
            const shapeGroup = new THREE.Group();

            // Large Wireframe Icosahedron
            const icoGeo = new THREE.IcosahedronGeometry(12, 1);
            const icoMat = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                wireframe: true,
                transparent: true,
                opacity: 0.12
            });
            const icoMesh = new THREE.Mesh(icoGeo, icoMat);
            shapeGroup.add(icoMesh);

            // Inner Octahedron
            const octGeo = new THREE.OctahedronGeometry(6, 0);
            const octMat = new THREE.MeshBasicMaterial({
                color: 0x14b8a6,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const octMesh = new THREE.Mesh(octGeo, octMat);
            shapeGroup.add(octMesh);

            // Floating Torus Rings
            const torusGeo = new THREE.TorusGeometry(18, 0.1, 16, 100);
            const torusMat = new THREE.MeshBasicMaterial({
                color: 0xa855f7,
                wireframe: true,
                transparent: true,
                opacity: 0.15
            });
            const torusMesh = new THREE.Mesh(torusGeo, torusMat);
            torusMesh.rotation.x = Math.PI / 4;
            shapeGroup.add(torusMesh);

            scene.add(shapeGroup);

            // Dynamic Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0x14b8a6, 2, 50);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x6366f1, 2, 50);
            scene.add(pointLight2);

            // Mouse Interaction
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
                mouseY = (e.clientY - window.innerHeight / 2) * 0.01;

                pointLight1.position.x = mouseX * 10;
                pointLight1.position.y = -mouseY * 10;
                pointLight1.position.z = 15;

                pointLight2.position.x = -mouseX * 10;
                pointLight2.position.y = mouseY * 10;
                pointLight2.position.z = 10;
            });

            // Scroll Animation Morph
            let scrollY = 0;
            window.addEventListener('scroll', () => {
                scrollY = window.scrollY;
            });

            // Animation Loop
            const animateBg = () => {
                requestAnimationFrame(animateBg);

                targetX += (mouseX - targetX) * 0.05;
                targetY += (mouseY - targetY) * 0.05;

                camera.position.x = targetX * 1.5;
                camera.position.y = -targetY * 1.5 + (scrollY * 0.01);
                camera.lookAt(scene.position);

                // Rotations
                particles.rotation.y += 0.0008;
                particles.rotation.x += 0.0003;

                icoMesh.rotation.x += 0.002;
                icoMesh.rotation.y += 0.003;

                octMesh.rotation.x -= 0.004;
                octMesh.rotation.y -= 0.002;

                torusMesh.rotation.z += 0.001;

                renderer.render(scene, camera);
            };

            animateBg();

            // Resize handler
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        /* --- 2. Interactive 3D Hero Canvas --- */
        const heroContainer = document.getElementById('hero3dCanvas');
        if (heroContainer) {
            const width = heroContainer.clientWidth || 300;
            const height = heroContainer.clientHeight || 300;

            const heroScene = new THREE.Scene();
            const heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            heroCamera.position.z = 5.5;

            const heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            heroRenderer.setSize(width, height);
            heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            heroContainer.appendChild(heroRenderer.domElement);

            // 3D Glassmorphic TorusKnot
            const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 32);
            const knotMat = new THREE.MeshStandardMaterial({
                color: 0x6366f1,
                roughness: 0.15,
                metalness: 0.85,
                wireframe: false
            });
            const knotMesh = new THREE.Mesh(knotGeo, knotMat);
            heroScene.add(knotMesh);

            // Orbiting Mini Spheres
            const orbitGroup = new THREE.Group();
            const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
            const sphereMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6 });

            for (let i = 0; i < 6; i++) {
                const sphere = new THREE.Mesh(sphereGeo, sphereMat);
                const angle = (i / 6) * Math.PI * 2;
                sphere.position.x = Math.cos(angle) * 2.2;
                sphere.position.y = Math.sin(angle) * 2.2;
                orbitGroup.add(sphere);
            }
            heroScene.add(orbitGroup);

            // Lights
            const pLight1 = new THREE.PointLight(0x14b8a6, 4, 20);
            pLight1.position.set(3, 3, 4);
            heroScene.add(pLight1);

            const pLight2 = new THREE.PointLight(0xa855f7, 3, 20);
            pLight2.position.set(-3, -3, 2);
            heroScene.add(pLight2);

            const hAmbient = new THREE.AmbientLight(0xffffff, 0.6);
            heroScene.add(hAmbient);

            // Drag to Rotate Interactive Controller
            let isDragging = false;
            let previousMousePosition = { x: 0, y: 0 };
            let targetRotationX = 0;
            let targetRotationY = 0;

            const onMouseDown = (e) => {
                isDragging = true;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                targetRotationY += deltaX * 0.01;
                targetRotationX += deltaY * 0.01;

                previousMousePosition = { x: e.clientX, y: e.clientY };
            };

            const onMouseUp = () => {
                isDragging = false;
            };

            heroContainer.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);

            // Touch events for mobile
            heroContainer.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    isDragging = true;
                    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
            });
            window.addEventListener('touchmove', (e) => {
                if (!isDragging || e.touches.length === 0) return;
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                const deltaY = e.touches[0].clientY - previousMousePosition.y;

                targetRotationY += deltaX * 0.01;
                targetRotationX += deltaY * 0.01;

                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            });
            window.addEventListener('touchend', () => { isDragging = false; });

            // Hover scale interaction on Three.js 3D Mesh
            const avatarWrapper = document.querySelector('.avatar-wrapper');
            let isHovered = false;
            if (avatarWrapper) {
                avatarWrapper.addEventListener('mouseenter', () => { isHovered = true; });
                avatarWrapper.addEventListener('mouseleave', () => { isHovered = false; });
            }

            // Hero Model Render Loop
            let targetScale = 1.0;
            const animateHero = () => {
                requestAnimationFrame(animateHero);

                if (!isDragging) {
                    targetRotationY += isHovered ? 0.02 : 0.008;
                    targetRotationX += isHovered ? 0.01 : 0.003;
                }

                targetScale = isHovered ? 1.25 : 1.0;
                knotMesh.scale.x += (targetScale - knotMesh.scale.x) * 0.1;
                knotMesh.scale.y += (targetScale - knotMesh.scale.y) * 0.1;
                knotMesh.scale.z += (targetScale - knotMesh.scale.z) * 0.1;

                knotMesh.rotation.y += (targetRotationY - knotMesh.rotation.y) * 0.1;
                knotMesh.rotation.x += (targetRotationX - knotMesh.rotation.x) * 0.1;

                orbitGroup.rotation.z -= isHovered ? 0.03 : 0.01;
                pLight1.intensity = isHovered ? 7 : 4;

                heroRenderer.render(heroScene, heroCamera);
            };

            animateHero();

            // Resize Hero Canvas
            window.addEventListener('resize', () => {
                const w = heroContainer.clientWidth || 300;
                const h = heroContainer.clientHeight || 300;
                heroCamera.aspect = w / h;
                heroCamera.updateProjectionMatrix();
                heroRenderer.setSize(w, h);
            });
        }

        /* --- 3D Holographic Cyan Globe & UI UX Cube Engine --- */
        const globeContainer = document.getElementById('hero3dGlobeContainer');
        if (globeContainer) {
            const width = globeContainer.clientWidth || 600;
            const height = globeContainer.clientHeight || 500;

            const globeScene = new THREE.Scene();
            const globeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            globeCamera.position.z = 6.2;

            const globeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            globeRenderer.setSize(width, height);
            globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            globeContainer.appendChild(globeRenderer.domElement);

            // Group for all central objects
            const mainGroup = new THREE.Group();
            globeScene.add(mainGroup);

            // 1. Cyan Particle Sphere
            const particleCount = 2800;
            const sphereRadius = 1.8;
            const pGeometry = new THREE.BufferGeometry();
            const pPositions = new Float32Array(particleCount * 3);
            const pColors = new Float32Array(particleCount * 3);

            const cyanColor = new THREE.Color('#00f2fe');
            const tealColor = new THREE.Color('#14b8a6');
            const whiteColor = new THREE.Color('#ffffff');

            for (let i = 0; i < particleCount; i++) {
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                const r = sphereRadius + (Math.random() - 0.5) * 0.15;

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);

                pPositions[i * 3] = x;
                pPositions[i * 3 + 1] = y;
                pPositions[i * 3 + 2] = z;

                const mixedColor = Math.random() > 0.3 ? cyanColor : (Math.random() > 0.5 ? tealColor : whiteColor);
                pColors[i * 3] = mixedColor.r;
                pColors[i * 3 + 1] = mixedColor.g;
                pColors[i * 3 + 2] = mixedColor.b;
            }

            pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
            pGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

            const pMaterial = new THREE.PointsMaterial({
                size: 0.042,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });

            const particleSphere = new THREE.Points(pGeometry, pMaterial);
            mainGroup.add(particleSphere);

            // 2. Central Rotating "UI UX" Cube with Custom Canvas Texture
            const createTextTexture = (text) => {
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 256, 256);

                ctx.lineWidth = 14;
                ctx.strokeStyle = '#00f2fe';
                ctx.strokeRect(10, 10, 236, 236);

                ctx.font = '900 64px "Plus Jakarta Sans", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#070913';
                ctx.fillText(text, 128, 128);

                return new THREE.CanvasTexture(canvas);
            };

            const uiUxTexture = createTextTexture('UI UX');
            const devTexture = createTextTexture('DEV');
            const webTexture = createTextTexture('3D');

            const materials = [
                new THREE.MeshStandardMaterial({ map: uiUxTexture, roughness: 0.2, metalness: 0.8 }),
                new THREE.MeshStandardMaterial({ map: devTexture, roughness: 0.2, metalness: 0.8 }),
                new THREE.MeshStandardMaterial({ map: webTexture, roughness: 0.2, metalness: 0.8 }),
                new THREE.MeshStandardMaterial({ map: uiUxTexture, roughness: 0.2, metalness: 0.8 }),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }),
                new THREE.MeshStandardMaterial({ color: 0x00f2fe, roughness: 0.2, metalness: 0.8 })
            ];

            const cubeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
            const uiCube = new THREE.Mesh(cubeGeo, materials);
            mainGroup.add(uiCube);

            // 3. Orbiting Satellite Trails & Orbs
            const orbitGroup = new THREE.Group();
            
            const ringGeo1 = new THREE.TorusGeometry(2.3, 0.012, 16, 100);
            const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
            const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
            ringMesh1.rotation.x = Math.PI / 3;
            ringMesh1.rotation.y = Math.PI / 6;
            orbitGroup.add(ringMesh1);

            const orbGeo1 = new THREE.SphereGeometry(0.08, 16, 16);
            const orbMat1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const orb1 = new THREE.Mesh(orbGeo1, orbMat1);
            orbitGroup.add(orb1);

            const orbGeo2 = new THREE.SphereGeometry(0.07, 16, 16);
            const orbMat2 = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const orb2 = new THREE.Mesh(orbGeo2, orbMat2);
            orbitGroup.add(orb2);

            mainGroup.add(orbitGroup);

            // 4. Secondary Floating Striped Planet
            const planetGroup = new THREE.Group();
            const planetGeo = new THREE.SphereGeometry(0.42, 32, 32);
            const planetMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7, wireframe: true });
            const planet = new THREE.Mesh(planetGeo, planetMat);
            planetGroup.add(planet);

            // Red Core Dot inside Planet
            const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const coreDot = new THREE.Mesh(coreGeo, coreMat);
            planetGroup.add(coreDot);

            planetGroup.position.set(2.1, 1.2, -0.4);
            mainGroup.add(planetGroup);

            // Lights
            const cyanLight = new THREE.PointLight(0x00f2fe, 5, 20);
            cyanLight.position.set(3, 3, 5);
            globeScene.add(cyanLight);

            const redLight = new THREE.PointLight(0xef4444, 3, 20);
            redLight.position.set(-3, -2, 3);
            globeScene.add(redLight);

            const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
            globeScene.add(ambLight);

            // Interactive Drag to Rotate
            let isDraggingGlobe = false;
            let prevMousePos = { x: 0, y: 0 };
            let targetRotX = 0;
            let targetRotY = 0;

            globeContainer.addEventListener('mousedown', (e) => {
                isDraggingGlobe = true;
                prevMousePos = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDraggingGlobe) return;
                const deltaX = e.clientX - prevMousePos.x;
                const deltaY = e.clientY - prevMousePos.y;

                targetRotY += deltaX * 0.008;
                targetRotX += deltaY * 0.008;

                prevMousePos = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('mouseup', () => { isDraggingGlobe = false; });

            // Render Loop
            let orbitAngle = 0;
            const animateGlobe = () => {
                requestAnimationFrame(animateGlobe);

                if (!isDraggingGlobe) {
                    targetRotY += 0.006;
                    targetRotX += 0.002;
                }

                mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.08;
                mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.08;

                uiCube.rotation.y += 0.012;
                uiCube.rotation.x += 0.006;

                // Orbiting satellites
                orbitAngle += 0.02;
                orb1.position.x = Math.cos(orbitAngle) * 2.3;
                orb1.position.y = Math.sin(orbitAngle) * 1.2;
                orb1.position.z = Math.sin(orbitAngle) * 2.3;

                orb2.position.x = Math.cos(orbitAngle + Math.PI) * 2.3;
                orb2.position.y = Math.sin(orbitAngle + Math.PI) * -1.2;
                orb2.position.z = Math.sin(orbitAngle + Math.PI) * 2.3;

                planetGroup.rotation.y += 0.01;

                globeRenderer.render(globeScene, globeCamera);
            };

            animateGlobe();

            // Resize
            window.addEventListener('resize', () => {
                const w = globeContainer.clientWidth || 600;
                const h = globeContainer.clientHeight || 500;
                globeCamera.aspect = w / h;
                globeCamera.updateProjectionMatrix();
                globeRenderer.setSize(w, h);
            });
        }
    };

    /* ==========================================
       14. INTERACTIVE CSS 3D TILT ENGINE
    ========================================== */
    const init3DTiltEngine = () => {
        const tiltCards = document.querySelectorAll('[data-tilt-3d]');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;

                const maxTilt = 12; // Maximum tilt angle in degrees

                const rotateX = (-percentY * maxTilt).toFixed(2);
                const rotateY = (percentX * maxTilt).toFixed(2);

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Update 3D Glare Position
                card.style.setProperty('--shine-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--shine-y', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    };

    // Initialize 3D Systems
    init3D();
    init3DTiltEngine();

    /* ==========================================
       15. ADMIN PORTAL & USER MESSAGING MODULE
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
                subject: 'React & WebGL Collaboration',
                timestamp: 'Yesterday 04:15 PM',
                status: 'replied',
                messages: [
                    { id: 'm-2', sender: 'user', text: 'Hey Harsh, are you available for freelance shader or 3D canvas work next month?', time: 'Yesterday 04:15 PM' },
                    { id: 'm-3', sender: 'admin', text: 'Hi Marcus! Thanks for reaching out. Yes, I have bandwidth for WebGL consulting. Let us set up a call!', time: 'Yesterday 05:00 PM' }
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

});
