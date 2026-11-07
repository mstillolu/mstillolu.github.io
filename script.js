// script.js

const KIRPI_PATH = "M5 4h6v1H5zM3 5h10v1H3zM2 6h12v1H2zM1 7h14v1H1zM0 8h15v1H0zM0 9h14v1H0zM1 10h12v1H1zM2 11h3v1H2zM8 11h3v1H8z";

// ---------------------------------------------------------------------------
// Dil (TR / EN)
// ---------------------------------------------------------------------------
const I18N = {
    tr: {
        'title.home': 'mstillolu',
        'title.about': 'mstillolu | Hakkımda',
        'title.projects': 'mstillolu | Projeler',
        'nav.home': 'mstillolu - Ana sayfa',
        'nav.about': 'Hakkımda',
        'nav.projects': 'Projeler',
        'nav.toggle': 'Menüyü aç/kapat',
        'lang.label': 'Dili değiştir (Change language)',
        'footer.tagline': 'BAĞLANTI KORUNUYOR.',
        'home.welcome': '> Merhaba, ben SIRRI',
        'menu.label': 'Ana menü',
        'menu.profile': 'Profil',
        'menu.inventory': 'Envanter',
        'menu.contact': 'İletişim',
        'menu.play': 'Oyna',
        'menu.hint': '↑ ↓ seç · ENTER onayla',
        'kirpi.title': 'Tıkla ve Oyna!',
        'kirpi.aria': 'Kirpi Runner oyununu aç',
        'game.dialog': 'Kirpi Runner oyunu',
        'game.hint': 'Zıplamak için [SPACE] veya Ekrana Dokun',
        'game.start': 'BAŞLA',
        'game.exit': 'ÇIKIŞ',
        'about.profile': '[ OYUNCU PROFİLİ: mstillolu ]',
        'about.education': '✦ EĞİTİM',
        'about.experience': '✦ DENEYİM',
        'items.intro': 'Yol boyunca kilidini açtığım eşyalar.',
        'items.unlocked': 'KİLİT AÇILDI',
        'items.usedIn': 'Kullanıldığı yer',
        'items.type.language': 'Programlama Dili',
        'items.type.engine': 'Motor / Framework',
        'items.type.tool': 'Araç',
        'items.type.field': 'Alan',
        'items.type.spoken': 'Konuşulan Dil',
        'projects.store': 'Google Play mağazam'
    },
    en: {
        'title.home': 'mstillolu',
        'title.about': 'mstillolu | About',
        'title.projects': 'mstillolu | Projects',
        'nav.home': 'mstillolu - Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.toggle': 'Toggle menu',
        'lang.label': 'Change language (Dili değiştir)',
        'footer.tagline': 'CONNECTION SECURED.',
        'home.welcome': "> Hi, I'm SIRRI",
        'menu.label': 'Main menu',
        'menu.profile': 'Profile',
        'menu.inventory': 'Inventory',
        'menu.contact': 'Contact',
        'menu.play': 'Play',
        'menu.hint': '↑ ↓ select · ENTER confirm',
        'kirpi.title': 'Click to play!',
        'kirpi.aria': 'Open the Kirpi Runner game',
        'game.dialog': 'Kirpi Runner game',
        'game.hint': 'Press [SPACE] or tap the screen to jump',
        'game.start': 'START',
        'game.exit': 'EXIT',
        'about.profile': '[ PLAYER PROFILE: mstillolu ]',
        'about.education': '✦ EDUCATION',
        'about.experience': '✦ EXPERIENCE',
        'items.intro': 'Items I have unlocked along the way.',
        'items.unlocked': 'UNLOCKED',
        'items.usedIn': 'Used in',
        'items.type.language': 'Programming Language',
        'items.type.engine': 'Engine / Framework',
        'items.type.tool': 'Tool',
        'items.type.field': 'Field',
        'items.type.spoken': 'Spoken Language',
        'projects.store': 'My Google Play store'
    }
};

const ITEM_ICONS = { language: '{ }', engine: '▣', tool: '⚒', field: '◆', spoken: '✉' };

function detectLang() {
    try {
        const saved = localStorage.getItem('lang');
        if (saved === 'tr' || saved === 'en') return saved;
    } catch (e) { /* depolama kapalı olabilir */ }
    return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

let lang = detectLang();
let cvData = null;

function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.tr[key] || key;
}

// cv.json değerleri düz metin ya da { tr, en } olabilir
function L(value) {
    if (value == null) return '';
    if (typeof value === 'object' && !Array.isArray(value)) return value[lang] || value.tr || '';
    return value;
}

function applyStaticI18n() {
    document.documentElement.lang = lang;
    const page = document.body.dataset.page;
    if (page) document.title = t('title.' + page);

    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-title]').forEach(el => el.setAttribute('title', t(el.dataset.i18nTitle)));

    document.querySelectorAll('.lang-toggle [data-lang]').forEach(el => {
        el.classList.toggle('active', el.dataset.lang === lang);
    });
}

function setLang(newLang) {
    lang = newLang;
    try { localStorage.setItem('lang', lang); } catch (e) { /* yoksay */ }
    applyStaticI18n();
    startTypewriter();
    if (cvData) renderCv(cvData);
}

// ---------------------------------------------------------------------------
// Ortak menü ve footer
// ---------------------------------------------------------------------------
function renderLayout() {
    const navSlot = document.getElementById('site-nav');
    if (navSlot) {
        navSlot.outerHTML = `
            <nav class="navbar navbar-expand-lg fixed-top">
                <div class="container">
                    <a class="navbar-brand" href="index.html" data-i18n-aria="nav.home">
                        <svg class="kirpi-svg" viewBox="0 0 16 16" width="24" height="24" shape-rendering="crispEdges" aria-hidden="true">
                            <path d="${KIRPI_PATH}" />
                            <rect fill="#0A0A0A" x="2" y="8" width="1" height="1" />
                        </svg>
                        <span id="cyber-logo" data-value="mstillolu" aria-hidden="true">mstillolu</span>
                    </a>
                    <button class="lang-toggle" type="button" data-i18n-aria="lang.label">
                        <span data-lang="tr">TR</span><span class="lang-sep">/</span><span data-lang="en">EN</span>
                    </button>
                    <button class="navbar-toggler" type="button" aria-controls="navMenu" aria-expanded="false" data-i18n-aria="nav.toggle">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navMenu">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item"><a class="nav-link" href="about.html" data-i18n="nav.about">Hakkımda</a></li>
                            <li class="nav-item"><a class="nav-link" href="projects.html" data-i18n="nav.projects">Projeler</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    const footer = document.getElementById('contact');
    if (footer) {
        footer.innerHTML = `
            <div class="container">
                <div id="footer-contact" class="mb-4"></div>
                <p class="mb-0" style="opacity:0.7;">&copy; ${new Date().getFullYear()} mstillolu - <span data-i18n="footer.tagline">BAĞLANTI KORUNUYOR.</span></p>
            </div>
        `;
    }

    // Mobil menü aç/kapat (Bootstrap JS yerine)
    const toggler = document.querySelector('.navbar-toggler');
    const navMenu = document.getElementById('navMenu');
    if (toggler && navMenu) {
        toggler.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('show');
            toggler.setAttribute('aria-expanded', String(isOpen));
        });
    }

    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setLang(lang === 'tr' ? 'en' : 'tr');
        });
    }
}

// ---------------------------------------------------------------------------
// Daktilo efekti (ana sayfa)
// ---------------------------------------------------------------------------
let typingInterval;
function startTypewriter() {
    const el = document.getElementById('welcome-text');
    if (!el) return;
    clearInterval(typingInterval);
    const text = t('home.welcome');
    el.setAttribute('aria-label', text);
    let i = 0;
    el.innerHTML = "<span class='terminal-cursor' aria-hidden='true'></span>";
    typingInterval = setInterval(() => {
        if (i < text.length) {
            el.textContent = text.substring(0, i + 1);
            el.insertAdjacentHTML('beforeend', "<span class='terminal-cursor' aria-hidden='true'></span>");
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 100);
}

// E-posta cv.json içinde parçalı tutulur, botlar düz metin olarak bulamaz
function getEmail(email) {
    if (!email) return '';
    if (typeof email === 'string') return email;
    return `${email.user}@${email.domain}`;
}

// ---------------------------------------------------------------------------
// cv.json içeriğini çiz (dil değişince tekrar çağrılır)
// ---------------------------------------------------------------------------
function renderCv(data) {
    // Footer Contact (All pages)
    const footerContactContainer = document.getElementById('footer-contact');
    if (footerContactContainer && data.contact) {
        const email = getEmail(data.contact.email);
        footerContactContainer.innerHTML = `
            <div class="d-flex flex-column align-items-center gap-3 mb-4 mt-2">
                ${email ? `<a href="mailto:${email}" class="badge p-3 text-lowercase text-decoration-none">email: ${email}</a>` : ''}
                <div class="d-flex justify-content-center gap-3">
                    ${data.contact.github ? `<a href="${data.contact.github}" target="_blank" rel="noopener" class="badge p-3 text-decoration-none">GITHUB</a>` : ''}
                    ${data.contact.linkedin ? `<a href="${data.contact.linkedin}" target="_blank" rel="noopener" class="badge p-3 text-decoration-none">LINKEDIN</a>` : ''}
                </div>
            </div>
        `;
    }

    // Populate About (about.html)
    const aboutContainer = document.getElementById('about-container');
    if (aboutContainer && data.about) {
        aboutContainer.innerHTML = `<p>${L(data.about)}</p>`;
    }

    // Eğitim + deneyim ağacı (about.html)
    const treeRootContainer = document.getElementById('cyber-tree-root');
    if (treeRootContainer && data.education && data.experience) {
        const eduList = Array.isArray(data.education) ? data.education : [{ school: data.education, date: '' }];

        const eduHtml = eduList.map(edu => `
            <li><div class="tree-node-box">> [${L(edu.school)}] ${L(edu.date)}</div></li>
        `).join('');

        const expHtml = data.experience.map(exp => {
            const desc = L(exp.description);
            return `
                <li>
                    <div class="tree-node-box">> [${L(exp.company)}] ${L(exp.title)}</div>
                    ${desc ? `<ul><li><div class="tree-node-box tree-node-text">${desc}</div></li></ul>` : ''}
                </li>
            `;
        }).join('');

        treeRootContainer.innerHTML = `
            <li>
                <div class="tree-node-box root-box">${t('about.profile')}</div>
                <ul>
                    <li>
                        <div class="tree-node-box cat-box">${t('about.education')}</div>
                        <ul>${eduHtml}</ul>
                    </li>
                    <li>
                        <div class="tree-node-box cat-box">${t('about.experience')}</div>
                        <ul>${expHtml}</ul>
                    </li>
                </ul>
            </li>
        `;
    }

    // Kilidi açılan eşyalar (about.html)
    const itemsContainer = document.getElementById('unlock-grid');
    if (itemsContainer && data.skills) {
        const intro = document.getElementById('unlock-intro');
        if (intro) intro.textContent = t('items.intro');

        itemsContainer.innerHTML = data.skills.map((skill, i) => {
            const item = typeof skill === 'string' ? { name: skill } : skill;
            const type = item.type || 'tool';
            const usedIn = (item.usedIn || []).map(L).filter(Boolean);
            return `
                <li class="unlock-item type-${type}" style="--delay:${i * 60}ms">
                    <div class="unlock-head">
                        <span class="unlock-icon" aria-hidden="true">${ITEM_ICONS[type] || '◆'}</span>
                        <span class="unlock-badge">🔓 ${t('items.unlocked')}</span>
                    </div>
                    <div class="unlock-name">${L(item.name)}</div>
                    <div class="unlock-type">${t('items.type.' + type)}</div>
                    ${usedIn.length ? `<div class="unlock-used"><span>${t('items.usedIn')}:</span> ${usedIn.join(', ')}</div>` : ''}
                </li>
            `;
        }).join('');
    }

    // Render Projects (projects.html)
    const projectContainer = document.getElementById('project-container');
    if (projectContainer && data.projects) {
        projectContainer.innerHTML = '';
        data.projects.forEach(project => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-4';

            // Çevrilmeyen etiketler teknik terim: "Kotlin" -> "KOTLİN" olmasın
            const tagsHtml = (project.tags || []).map(tag => {
                const langAttr = typeof tag === 'string' ? ' lang="en"' : '';
                return `<span class="badge me-2 mb-2 p-1"${langAttr}>${L(tag)}</span>`;
            }).join('');

            const desc = L(project.description);
            const cardInnerHtml = `
                <div class="card h-100 p-3">
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title ${tagsHtml || desc ? 'mb-3' : 'mb-0'}"${typeof project.title === 'string' ? ' lang="en"' : ''}>${L(project.title)}</h3>
                        ${tagsHtml ? `<div class="${desc ? 'mb-3' : ''}">${tagsHtml}</div>` : ''}
                        ${desc ? `<p class="card-text flex-grow-1">${desc}</p>` : ''}
                    </div>
                </div>
            `;

            col.innerHTML = project.url
                ? `<a href="${project.url}" target="_blank" rel="noopener" class="project-card-link h-100">${cardInnerHtml}</a>`
                : cardInnerHtml;
            projectContainer.appendChild(col);
        });
    }
}

// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderLayout();
    applyStaticI18n();

    // Hacker Text / Glitch Effect Logic for Logo
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$^*()_+-=";
    const cyberLogo = document.getElementById('cyber-logo');

    function playGlitchEffect(element) {
        let iteration = 0;
        clearInterval(element.dataset.glitchInterval);

        element.dataset.glitchInterval = setInterval(() => {
            element.innerText = element.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return element.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            if (iteration >= element.dataset.value.length) {
                clearInterval(element.dataset.glitchInterval);
            }
            iteration += 1 / 3;
        }, 30);
    }

    if (cyberLogo) {
        playGlitchEffect(cyberLogo);

        function scheduleRandomGlitch() {
            const randomTime = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
            setTimeout(() => {
                playGlitchEffect(cyberLogo);
                scheduleRandomGlitch();
            }, randomTime);
        }
        scheduleRandomGlitch();

        cyberLogo.addEventListener('click', (e) => {
            e.preventDefault();
            playGlitchEffect(cyberLogo);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });

        cyberLogo.addEventListener('mouseenter', () => playGlitchEffect(cyberLogo));
    }

    // Determine active navigation link automatically
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    startTypewriter();

    // Gamification: Interactive Kirpi on index.html
    if (currentPage === 'index.html' || currentPage === '') {
        document.body.addEventListener('click', (e) => {
            // Oyun penceresi ve menü tıklamalarında mini kirpi çıkmasın
            if (e.target.closest('#kirpi-game-overlay, .start-menu, .navbar')) return;

            const kirpi = document.createElement('div');
            kirpi.className = 'dynamic-kirpi';
            kirpi.style.left = e.pageX + 'px';
            kirpi.style.top = e.pageY + 'px';
            kirpi.innerHTML = `
                <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" aria-hidden="true">
                    <path fill="var(--highlight-color)" d="${KIRPI_PATH}"/>
                    <rect fill="#0A0A0A" x="2" y="8" width="1" height="1"/>
                </svg>
            `;
            document.body.appendChild(kirpi);
            setTimeout(() => kirpi.remove(), 1000);
        });

        // Kirpi Runner Minigame Logic
        const mainKirpi = document.querySelector('svg.kirpi-svg.holo-kirpi');
        let openGame = null;
        let isGameOpen = () => false;

        if (mainKirpi) {
            // Generate Game UI
            const gameOverlay = document.createElement('div');
            gameOverlay.id = 'kirpi-game-overlay';
            gameOverlay.setAttribute('role', 'dialog');
            gameOverlay.dataset.i18nAria = 'game.dialog';
            gameOverlay.innerHTML = `
                <div id="kirpi-minigame-container">
                    <div id="game-score">SCORE: 0</div>
                    <div id="player-kirpi">
                        <svg viewBox="0 0 16 16" width="48" height="48" shape-rendering="crispEdges" aria-hidden="true">
                            <path fill="var(--highlight-color)" d="${KIRPI_PATH}"/>
                            <rect fill="#0A0A0A" x="2" y="8" width="1" height="1"/>
                        </svg>
                    </div>
                    <div id="game-ground"></div>

                    <div id="game-start-screen" class="game-screen">
                        <h2 style="color: var(--highlight-color); text-shadow: 2px 2px #330033;">KIRPI RUNNER</h2>
                        <p style="font-size: 0.8rem; margin: 20px 0;" data-i18n="game.hint"></p>
                        <button id="start-btn" class="badge p-3 border-0 mt-2" style="cursor:pointer; font-size: 1rem;" data-i18n="game.start"></button>
                        <button class="close-game-btn badge p-2 border-0 mt-3" style="cursor:pointer; opacity:0.6;" data-i18n="game.exit"></button>
                    </div>

                    <div id="game-over-screen" class="game-screen" style="display:none;">
                        <h2 style="color: #FF003C; text-shadow: 2px 2px #fff;">SYSTEM FAILURE</h2>
                        <p id="final-score" style="color: var(--highlight-color); font-size: 1.2rem; margin: 20px 0;">> SCORE: 0</p>
                        <button id="restart-btn" class="badge p-3 mt-1 border-0" style="cursor:pointer; background: var(--highlight-color) !important; color: #0A0A0A !important; font-size: 1rem;">REBOOT_SYSTEM</button>
                        <button class="close-game-btn badge p-2 mt-3 border-0" style="cursor:pointer; opacity: 0.6;" data-i18n="game.exit"></button>
                    </div>
                </div>
            `;
            document.body.appendChild(gameOverlay);
            applyStaticI18n();

            // Fizik değerleri 60 FPS'e göre ayarlı; deltaTime ile her ekranda aynı hız
            const FRAME_MS = 1000 / 60;
            const GROUND_Y = 24;
            const GRAVITY = 1.0;
            const JUMP_VELOCITY = 16;

            let isPlaying = false;
            let isJumping = false;
            let isGameOver = false;

            const container = document.getElementById('kirpi-minigame-container');
            const player = document.getElementById('player-kirpi');
            const scoreDisplay = document.getElementById('game-score');
            const overScreen = document.getElementById('game-over-screen');
            const startScreen = document.getElementById('game-start-screen');
            const finalScore = document.getElementById('final-score');

            let obstacles = [];
            let score = 0;
            let gameLoop;
            let spawnTimeout;
            let lastTime = null;
            let returnFocusTo = mainKirpi;

            let playerY = GROUND_Y;
            let velocityY = 0;

            function startGame() {
                cancelAnimationFrame(gameLoop);
                clearTimeout(spawnTimeout);
                startScreen.style.display = 'none';
                overScreen.style.display = 'none';
                isPlaying = true;
                isGameOver = false;
                isJumping = false;
                score = 0;
                playerY = GROUND_Y;
                velocityY = 0;
                lastTime = null;
                obstacles.forEach(ob => ob.remove());
                obstacles = [];
                scoreDisplay.innerText = "SCORE: 0";

                spawnObstacle();
                gameLoop = requestAnimationFrame(update);
            }

            function spawnObstacle() {
                if (!isPlaying) return;

                const ob = document.createElement('div');
                ob.className = 'obstacle';
                const type = Math.random();
                ob.classList.add(type > 0.3 && type <= 0.6 ? 'obs-wide' : 'obs-tall');

                container.appendChild(ob);
                ob.style.left = container.offsetWidth + 'px';
                obstacles.push(ob);

                const nextSpawn = Math.random() * 1000 + 800; // 0.8s to 1.8s
                const speedModifier = Math.min(score * 1.5, 600);
                spawnTimeout = setTimeout(spawnObstacle, nextSpawn - speedModifier);
            }

            function jump(e) {
                if (e && e.target.tagName === 'BUTTON') return;
                if (!isPlaying || isGameOver) return;
                if (!isJumping) {
                    isJumping = true;
                    velocityY = JUMP_VELOCITY;
                }
            }

            function update(now) {
                if (!isPlaying) return;

                if (lastTime === null) lastTime = now;
                // Sekme arka plandaysa büyük sıçramaları engelle
                const dt = Math.min((now - lastTime) / FRAME_MS, 3);
                lastTime = now;

                playerY += velocityY * dt;
                velocityY -= GRAVITY * dt;

                if (playerY <= GROUND_Y) {
                    playerY = GROUND_Y;
                    isJumping = false;
                    velocityY = 0;
                }
                player.style.bottom = playerY + 'px';

                const obSpeed = 7 + (score / 150);
                const playerRect = player.getBoundingClientRect();
                const tolerance = 5;

                for (let i = 0; i < obstacles.length; i++) {
                    const ob = obstacles[i];
                    const obLeft = parseFloat(ob.style.left) - obSpeed * dt;
                    ob.style.left = obLeft + 'px';

                    const obRect = ob.getBoundingClientRect();
                    if (
                        playerRect.left + tolerance < obRect.right - tolerance &&
                        playerRect.right - tolerance > obRect.left + tolerance &&
                        playerRect.top + tolerance < obRect.bottom - tolerance &&
                        playerRect.bottom - tolerance > obRect.top + tolerance
                    ) {
                        gameOver();
                        return;
                    }

                    if (obLeft < -60) {
                        ob.remove();
                        obstacles.splice(i, 1);
                        i--;
                    }
                }

                score += dt;
                scoreDisplay.innerText = "SCORE: " + Math.floor(score / 10);

                gameLoop = requestAnimationFrame(update);
            }

            function gameOver() {
                isGameOver = true;
                isPlaying = false;
                clearTimeout(spawnTimeout);
                overScreen.style.display = 'flex';
                finalScore.innerText = "> SCORE: " + Math.floor(score / 10);
            }

            openGame = function (focusAfter) {
                returnFocusTo = focusAfter || mainKirpi;
                gameOverlay.style.display = 'block';
                startScreen.style.display = 'flex';
                overScreen.style.display = 'none';
                document.getElementById('start-btn').focus();
            };
            isGameOpen = () => gameOverlay.style.display === 'block';

            function closeGame() {
                gameOverlay.style.display = 'none';
                isPlaying = false;
                isGameOver = false;
                clearTimeout(spawnTimeout);
                cancelAnimationFrame(gameLoop);
                obstacles.forEach(ob => ob.remove());
                obstacles = [];
                returnFocusTo.focus();
            }

            mainKirpi.addEventListener('click', (e) => {
                e.stopPropagation();
                openGame();
            });

            // Klavyeyle de açılabilsin (Tab ile odaklan, Enter/Space ile aç)
            mainKirpi.addEventListener('keydown', (e) => {
                if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    e.stopPropagation();
                    openGame();
                }
            });

            document.getElementById('start-btn').addEventListener('click', startGame);
            document.getElementById('restart-btn').addEventListener('click', startGame);
            document.querySelectorAll('.close-game-btn').forEach(btn => btn.addEventListener('click', closeGame));

            document.addEventListener('keydown', (e) => {
                if (!isGameOpen()) return;
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    if (e.repeat) return;
                    if (startScreen.style.display === 'flex' || overScreen.style.display === 'flex') startGame();
                    else jump();
                }
                if (e.code === 'Escape') closeGame();
            });

            container.addEventListener('mousedown', jump);
            container.addEventListener('touchstart', jump, { passive: true });
        }

        // Oyun açılış menüsü: ok tuşlarıyla gez, Enter ile seç
        const menuItems = [...document.querySelectorAll('.start-menu .menu-item')];
        if (menuItems.length) {
            let selected = 0;

            function select(index, focus) {
                selected = (index + menuItems.length) % menuItems.length;
                menuItems.forEach((item, i) => item.classList.toggle('selected', i === selected));
                if (focus) menuItems[selected].focus();
            }

            menuItems.forEach((item, i) => {
                item.addEventListener('mouseenter', () => select(i));
                item.addEventListener('focus', () => select(i));
                item.addEventListener('click', (e) => {
                    const action = item.dataset.action;
                    if (action === 'play' && openGame) {
                        e.preventDefault();
                        openGame(item);
                    } else if (action === 'contact') {
                        e.preventDefault();
                        const footer = document.getElementById('contact');
                        footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        footer.classList.remove('flash');
                        void footer.offsetWidth; // animasyonu yeniden başlat
                        footer.classList.add('flash');
                        const firstLink = footer.querySelector('a');
                        if (firstLink) firstLink.focus({ preventScroll: true });
                    }
                });
            });

            document.addEventListener('keydown', (e) => {
                if (isGameOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
                const active = document.activeElement;
                const inMenuOrBody = !active || active === document.body || menuItems.includes(active);
                if (!inMenuOrBody) return;

                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    select(selected + (e.key === 'ArrowDown' ? 1 : -1), true);
                } else if (e.key === 'Enter' && !menuItems.includes(active)) {
                    e.preventDefault();
                    menuItems[selected].click();
                }
            });

            select(0);
        }
    }

    // Fetch CV data for all dynamic sections
    fetch('cv.json')
        .then(response => response.json())
        .then(data => {
            cvData = data;
            renderCv(data);
        })
        .catch(error => {
            console.error('Error fetching CV data:', error);
        });
});
