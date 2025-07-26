document.addEventListener('DOMContentLoaded', function () {
    initProfessionalFeatures();

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

function initProfessionalFeatures() {
    enhanceLinkInteractions();

    addKeyboardNavigation();

    addLoadingStates();

    addProfessionalAnimations();
}

function enhanceLinkInteractions() {
    const links = document.querySelectorAll('.links a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(66, 153, 225, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        link.addEventListener('focus', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)';
        });

        link.addEventListener('blur', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function addKeyboardNavigation() {
    const links = document.querySelectorAll('.links a');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (links.includes(focusedElement)) {
                focusedElement.style.outline = '2px solid var(--accent-color)';
                focusedElement.style.outlineOffset = '2px';
            }
        }

        if (e.key === 'Enter' && document.activeElement.classList.contains('links')) {
            document.activeElement.click();
        }
    });
}

function addLoadingStates() {
    const elementsToLoad = ['codeSection', 'contactSection', 'socialSection'];

    elementsToLoad.forEach(id => {
        const element = document.getElementById(id);
        if (element && !element.textContent.trim()) {
            element.innerHTML = '<div class="loading-skeleton"></div>';
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        .loading-skeleton {
            height: 20px;
            background: linear-gradient(90deg, var(--border-color) 25%, rgba(66, 153, 225, 0.1) 50%, var(--border-color) 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
            width: 100px;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
}

function addProfessionalAnimations() {
    const links = document.querySelectorAll('.links a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = 'all 0.6s ease';
        observer.observe(link);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addSkillBadges() {
    const projectLinks = document.querySelectorAll('.links a');

    const skillMap = {
        'github': ['JavaScript', 'Git', 'Open Source'],
        'sketchfab': ['3D Modeling', 'Blender', 'Design'],
        'WebProjects': ['HTML5', 'CSS3', 'JavaScript'],
        'wordpress': ['WordPress', 'PHP', 'CMS'],
        'google-play': ['Android', 'Mobile Dev', 'Java'],
        'resume': ['PDF', 'Professional'],
        'linkedin': ['Networking', 'Professional'],
        'youtube': ['Content Creation', 'Video'],
        'twitch': ['Streaming', 'Community'],
        'discord': ['Community', 'Real-time']
    };

    projectLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const onclick = link.getAttribute('onclick') || '';

        let skills = [];

        if (href.includes('github')) skills = skillMap.github;
        else if (href.includes('sketchfab')) skills = skillMap.sketchfab;
        else if (href.includes('WebProjects')) skills = skillMap.WebProjects;
        else if (href.includes('wordpress')) skills = skillMap.wordpress;
        else if (href.includes('play.google')) skills = skillMap['google-play'];
        else if (href.includes('resume')) skills = skillMap.resume;
        else if (href.includes('linkedin')) skills = skillMap.linkedin;
        else if (href.includes('youtube')) skills = skillMap.youtube;
        else if (href.includes('twitch')) skills = skillMap.twitch;
        else if (onclick.includes('discord')) skills = skillMap.discord;

        if (skills.length > 0) {
            const skillContainer = document.createElement('div');
            skillContainer.className = 'skill-container';
            skillContainer.style.cssText = `
                position: absolute;
                bottom: -30px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 4px;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                pointer-events: none;
                z-index: 10;
            `;

            skills.forEach(skill => {
                const badge = document.createElement('span');
                badge.className = 'skill-badge';
                badge.textContent = skill;
                skillContainer.appendChild(badge);
            });

            link.style.position = 'relative';
            link.appendChild(skillContainer);

            link.addEventListener('mouseenter', () => {
                skillContainer.style.opacity = '1';
                skillContainer.style.transform = 'translateY(0)';
            });

            link.addEventListener('mouseleave', () => {
                skillContainer.style.opacity = '0';
                skillContainer.style.transform = 'translateY(-10px)';
            });
        }
    });
}

function enhanceCopyFeedback() {
    window.copyToClipboard = function (text, elementId, classes, textNode) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            const el = document.createElement('textarea');
            el.value = text;
            el.style.position = 'fixed';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }

        const element = document.getElementById(elementId);
        if (element) {
            const feedback = document.createElement('div');
            feedback.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--success-color);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 500;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                white-space: nowrap;
            `;
            feedback.textContent = '✓ Copied!';

            const originalPosition = element.style.position;
            if (!originalPosition || originalPosition === 'static') {
                element.style.position = 'relative';
            }

            element.appendChild(feedback);

            setTimeout(() => {
                feedback.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                feedback.style.opacity = '0';
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                    if (!originalPosition || originalPosition === 'static') {
                        element.style.position = originalPosition || '';
                    }
                }, 300);
            }, 1500);
        }
    };

    window.recreate = function () {
    };
}

function addProfessionalSectionHeaders() {
    const sections = document.querySelectorAll('.links h3');

    sections.forEach(section => {
        section.className = 'section-header';
    });
}

function addPerformanceMonitoring() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        let performanceData = {
            loadTime: 0,
            interactionCount: 0,
            errorCount: 0
        };

        window.addEventListener('load', () => {
            performanceData.loadTime = performance.now();
            console.log(`🚀 Professional Portfolio loaded in ${performanceData.loadTime.toFixed(2)}ms`);
        });

        document.addEventListener('click', () => {
            performanceData.interactionCount++;
        });

        window.addEventListener('error', () => {
            performanceData.errorCount++;
        });

        setInterval(() => {
            console.log('📊 Professional Portfolio Metrics:', {
                loadTime: `${performanceData.loadTime.toFixed(2)}ms`,
                interactions: performanceData.interactionCount,
                errors: performanceData.errorCount,
                timestamp: new Date().toLocaleTimeString()
            });
        }, 30000);
    }
}

function addRecruiterEasterEgg() {
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);

        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            startRetroBootSequence();
            konamiCode = [];
        }
    });
}

function startRetroBootSequence() {
    const overlay = document.createElement('div');
    overlay.id = 'retro-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        z-index: 10000;
        padding: 20px;
        box-sizing: border-box;
        overflow: hidden;
    `;

    const terminal = document.createElement('div');
    terminal.style.cssText = `
        white-space: pre-wrap;
        line-height: 1.4;
    `;

    overlay.appendChild(terminal);
    document.body.appendChild(overlay);

    const bootMessages = [
        'SFPDC SYSTEM v2.1.4',
        'Copyright (C) 2025 JustNeki Software',
        '',
        'Initializing PDC modules...',
        'Loading skills database................ [OK]',
        'Checking project repositories......... [OK]',
        'Validating contact information........ [OK]',
        'Scanning for easter eggs.............. [FOUND]',
        'Initializing language support......... [OK]',
        'Loading professional experience....... [OK]',
        '',
        'System ready. Launching PDC stats...',
        ''
    ];

    let messageIndex = 0;
    let charIndex = 0;

    function typeMessage() {
        if (messageIndex < bootMessages.length) {
            const currentMessage = bootMessages[messageIndex];

            if (charIndex < currentMessage.length) {
                terminal.textContent += currentMessage[charIndex];
                charIndex++;
                setTimeout(typeMessage, Math.random() * 50 + 20);
            } else {
                terminal.textContent += '\n';
                messageIndex++;
                charIndex = 0;
                setTimeout(typeMessage, Math.random() * 200 + 100);
            }
        } else {
            setTimeout(() => showPortfolioStats(overlay), 1000);
        }
    }

    typeMessage();
}

function showPortfolioStats(overlay) {
    const visitTime = new Date();
    const portfolioAge = Math.floor((visitTime - new Date('2024-01-01')) / (1000 * 60 * 60 * 24));
    const skills = document.querySelectorAll('.skill-badge, .skill-item').length || 12;
    const projects = document.querySelectorAll('.project-card, .project-item').length || 6;

    overlay.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            height: 100%;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            padding: 20px;
        ">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #00ff00; margin: 0; font-size: 24px;">
                    ╔══════════════════════════════════════╗
                    ║        PDC STATS v2.1.4              ║
                    ╚══════════════════════════════════════╝
                </h1>
            </div>
            
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                flex: 1;
            ">
                <div style="border: 1px solid #00ff00; padding: 15px; background: rgba(0, 255, 0, 0.05);">
                    <h3 style="margin-top: 0; color: #00ff00;">SYSTEM INFO</h3>
                    <div>Developer: Santiago Fisela</div>
                    <div>Status: Available for hire</div>
                    <div>Uptime: ${portfolioAge} days</div>
                    <div>Last Update: ${visitTime.toLocaleDateString()}</div>
                    <div>Version: 2.1.4-stable</div>
                </div>
                
                <div style="border: 1px solid #00ff00; padding: 15px; background: rgba(0, 255, 0, 0.05);">
                    <h3 style="margin-top: 0; color: #00ff00;">METRICS</h3>
                    <div>Skills Loaded: ${skills}</div>
                    <div>Projects Deployed: ${projects}</div>
                    <div>Languages: 2 (EN/ES)</div>
                    <div>Easter Eggs Found: 1/3</div>
                </div>
                
                <div style="border: 1px solid #00ff00; padding: 15px; background: rgba(0, 255, 0, 0.05);">
                    <h3 style="margin-top: 0; color: #00ff00;">CONTACT PROTOCOLS</h3>
                    <div>Email: contacto@justneki.com</div>
                    <div>LinkedIn: /in/santiago-fisela</div>
                    <div>GitHub: /PinkLittleKitty</div>
                    <div>Response Time: < 24h</div>
                    <div>Availability: High</div>
                </div>
                
                <div style="border: 1px solid #00ff00; padding: 15px; background: rgba(0, 255, 0, 0.05);">
                    <h3 style="margin-top: 0; color: #00ff00;">TECH STACK</h3>
                    <div>Frontend: React</div>
                    <div>Backend: Node.js, C#, Javascript, .Net/WPF</div>
                    <div>Database: MySQL, MongoDB</div>
                    <div>Cloud: Docker</div>
                    <div>Tools: Git, VS Code, Unity</div>
                </div>
            </div>
            
            <div style="
                text-align: center;
                margin-top: 20px;
                padding: 15px;
                border: 1px solid #00ff00;
                background: rgba(0, 255, 0, 0.1);
            ">
                <div style="margin-bottom: 10px;">
                    🎉 CONGRATULATIONS! You found the secret developer console!
                </div>
                <div style="margin-bottom: 15px;">
                    This shows the kind of attention to detail I bring to every project.
                </div>
                <button onclick="document.getElementById('retro-overlay').remove()" style="
                    background: #00ff00;
                    color: #000;
                    border: none;
                    padding: 10px 20px;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 0 10px;
                ">EXIT SYSTEM</button>
                <button onclick="location.href='mailto:contacto@justneki.com'" style="
                    background: transparent;
                    color: #00ff00;
                    border: 1px solid #00ff00;
                    padding: 10px 20px;
                    font-family: 'Courier New', monospace;
                    cursor: pointer;
                    margin: 0 10px;
                ">HIRE DEVELOPER</button>
            </div>
        </div>
    `;

    const cursor = document.createElement('span');
    cursor.textContent = '_';
    cursor.style.animation = 'blink 1s infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        addSkillBadges();
        enhanceCopyFeedback();
        addProfessionalSectionHeaders();
        addPerformanceMonitoring();
        addRecruiterEasterEgg();
    }, 500);
});

console.log(`
Portfolio by Santiago Fisela.

Interested in working together? Let's connect!
📧 contacto@justneki.com
💼 linkedin.com/in/santiago-fisela
🐙 github.com/PinkLittleKitty

Try the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA
`);