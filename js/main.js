// main.js

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor & Magnetic Elements ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const magneticElements = document.querySelectorAll('.magnetic, .magnetic-light, a, button, .service-card, .advantage-card-wrapper');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    // Detect if device supports hover (ignore on touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            // Fast follow for dot
            cursorX += (mouseX - cursorX) * 0.5;
            cursorY += (mouseY - cursorY) * 0.5;
            gsap.set(cursor, { x: cursorX, y: cursorY });

            // Smooth follow for ring
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            gsap.set(cursorFollower, { x: followerX, y: followerY });
        });

        magneticElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorFollower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursorFollower.classList.remove('hovering');
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
            });
            
            // Magnetic effect
            if(el.classList.contains('magnetic') || el.classList.contains('magnetic-light')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    gsap.to(el, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
                });
            }
        });
    }

    // --- 2. Preloader & Hero Cinematic Timeline ---
    const tl = gsap.timeline();
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Preloader Animation
        tl.to('.loader-progress', { width: '100%', duration: 1.5, ease: 'power3.inOut' })
          .to('.loader-logo', { y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.5")
          .to('#preloader', { y: '-100%', duration: 1, ease: 'power4.inOut', delay: 0.3 })
          
          // Hero Reveal Animation
          .from('.hero-bg', { scale: 1.2, duration: 2, ease: 'power3.out' }, "-=1")
          .from('.hero-stagger', { 
              y: 50, 
              opacity: 0, 
              duration: 1, 
              stagger: 0.15, 
              ease: 'power3.out',
              clearProps: 'all'
          }, "-=1.2");
    }

    // --- 3. Parallax Effects (GSAP ScrollTrigger) ---
    // Hero Background Parallax
    gsap.to('.hero-bg', {
        y: "30%",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Stats Background Parallax
    gsap.to('.stats-bg', {
        y: "20%",
        ease: "none",
        scrollTrigger: {
            trigger: "#statistics",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Image Parallax within wrappers
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
            y: "10%",
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // --- 4. Section & Element Reveal Animations ---
    
    // Generic Slide Up Reveal
    gsap.utils.toArray('.slide-up').forEach(element => {
        gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Services Stagger
    gsap.from('.service-card-wrapper', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".service-stagger-container",
            start: "top 80%"
        }
    });

    // Advantages Stagger
    gsap.from('.advantage-card-wrapper', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".advantage-stagger-container",
            start: "top 80%"
        }
    });

    // Projects Stagger
    gsap.to('.project-card-wrapper', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".project-stagger-container",
            start: "top 75%"
        }
    });

    // --- 5. Timeline Delivery Process ---
    gsap.to('.timeline-line', {
        height: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".timeline",
            start: "top center",
            end: "bottom center",
            scrub: true
        }
    });

    gsap.utils.toArray('.timeline-item').forEach(item => {
        const dot = item.querySelector('.timeline-dot');
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });
        
        tl.to(item, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
          .to(dot, { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.6");
    });

    // --- 6. Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const fps = 60;
            const totalFrames = (duration / 1000) * fps;
            let currentFrame = 0;
            
            const updateCount = () => {
                currentFrame++;
                const progress = currentFrame / totalFrames;
                // Easing out function
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentCount = Math.ceil(target * easedProgress);
                
                if (currentFrame < totalFrames) {
                    counter.innerText = currentCount;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + (counter.hasAttribute('data-plus') ? '+' : (counter.hasAttribute('data-percent') ? '%' : ''));
                }
            };
            
            updateCount();
        });
    };

    ScrollTrigger.create({
        trigger: "#statistics",
        start: "top 75%",
        onEnter: () => {
            if (!hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }
    });

    // --- 7. Navbar Scroll & UI Elements ---
    const navbar = document.querySelector('.navbar');
    const btnTop = document.querySelector('.btn-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (btnTop) {
            if (window.scrollY > 500) {
                btnTop.classList.add('show');
            } else {
                btnTop.classList.remove('show');
            }
        }
    });

    // Back to top smooth scroll
    if(btnTop) {
        btnTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 8. Mobile Menu Interaction Fix ---
    const navLinksList = document.querySelectorAll('.navbar-nav a');
    const menuToggle = document.getElementById('navbarNav');
    let bsCollapse;
    if (menuToggle) {
        bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    }

    navLinksList.forEach((link) => {
        link.addEventListener('click', () => {
            // Remove active from all immediately to prevent double lines
            navLinksList.forEach(l => l.classList.remove('active'));
            // Add active to clicked instantly
            link.classList.add('active');
            
            // Close mobile menu if open
            if (menuToggle && menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });

    // Form Submission Demo
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check2-circle"></i> Message Sent';
                btn.classList.add('btn-success');
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- 9. Gallery Lightbox ---
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (imageModal && modalImage) {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.style.cursor = 'pointer'; // Make it obvious they are clickable
            img.addEventListener('click', () => {
                modalImage.src = img.src; // Swap the source
                const modal = new bootstrap.Modal(imageModal);
                modal.show(); // Open the modal
            });
        });
    }

});
