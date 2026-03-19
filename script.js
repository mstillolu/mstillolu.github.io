// script.js
document.addEventListener("DOMContentLoaded", () => {
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
        }
    });

    // Daktilo Efekti (Typewriter Effect) for Welcome Text
    const welcomeTextEl = document.getElementById('welcome-text');
    if (welcomeTextEl) {
        const textToType = "> Merhaba, ben SIRRI";
        welcomeTextEl.innerHTML = "<span class='terminal-cursor'></span>";

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < textToType.length) {
                // Metni harf harf yazarken imleci her zaman sona ekle
                welcomeTextEl.innerHTML = textToType.substring(0, i + 1) + "<span class='terminal-cursor'></span>";
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
    }

    // Gamification: Interactive Kirpi on index.html
    if (currentPage === 'index.html' || currentPage === '') {
        document.body.addEventListener('click', (e) => {
            // Check if clicking inside game modal, if so don't spawn mini kirpis
            if(e.target.closest('#kirpi-game-overlay')) return;
            
            const kirpi = document.createElement('div');
            kirpi.className = 'dynamic-kirpi';
            kirpi.style.left = e.pageX + 'px';
            kirpi.style.top = e.pageY + 'px';
            kirpi.innerHTML = `
                <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
                    <path fill="var(--highlight-color)" d="M5 4h6v1H5zM3 5h10v1H3zM2 6h12v1H2zM1 7h14v1H1zM0 8h15v1H0zM0 9h14v1H0zM1 10h12v1H1zM2 11h3v1H2zM8 11h3v1H8z"/>
                    <rect fill="#0A0A0A" x="2" y="8" width="1" height="1"/>
                </svg>
            `;
            document.body.appendChild(kirpi);
            setTimeout(() => kirpi.remove(), 1000);
        });

        // Kirpi Runner Minigame Logic
        const mainKirpi = document.querySelector('svg.kirpi-svg.holo-kirpi');
        if (mainKirpi) {
            mainKirpi.style.cursor = 'pointer';
            mainKirpi.setAttribute('title', 'Tıkla ve Oyna!');
            
            // Generate Game UI
            const gameOverlay = document.createElement('div');
            gameOverlay.id = 'kirpi-game-overlay';
            gameOverlay.innerHTML = `
                <div id="kirpi-minigame-container">
                    <div id="game-score">SCORE: 0</div>
                    <div id="player-kirpi">
                        <svg viewBox="0 0 16 16" width="48" height="48" shape-rendering="crispEdges">
                            <path fill="var(--highlight-color)" d="M5 4h6v1H5zM3 5h10v1H3zM2 6h12v1H2zM1 7h14v1H1zM0 8h15v1H0zM0 9h14v1H0zM1 10h12v1H1zM2 11h3v1H2zM8 11h3v1H8z"/>
                            <rect fill="#0A0A0A" x="2" y="8" width="1" height="1"/>
                        </svg>
                    </div>
                    <div id="game-ground"></div>
                    
                    <div id="game-start-screen" class="game-screen">
                        <h2 style="color: var(--highlight-color); text-shadow: 2px 2px #330033;">KIRPI RUNNER</h2>
                        <p style="font-size: 0.8rem; margin: 20px 0;">Zıplamak için [SPACE] veya Ekrana Dokun</p>
                        <button id="start-btn" class="badge p-3 border-0 mt-2" style="cursor:pointer; font-size: 1rem;">BAŞLA (START)</button>
                        <button class="close-game-btn badge p-2 border-0 mt-3" style="cursor:pointer; opacity:0.6;">ÇIKIŞ</button>
                    </div>

                    <div id="game-over-screen" class="game-screen" style="display:none;">
                        <h2 style="color: #FF003C; text-shadow: 2px 2px #fff;">SYSTEM FAILURE</h2>
                        <p id="final-score" style="color: var(--highlight-color); font-size: 1.2rem; margin: 20px 0;">> SCORE: 0</p>
                        <button id="restart-btn" class="badge p-3 mt-1 border-0" style="cursor:pointer; background: var(--highlight-color) !important; color: #0A0A0A !important; font-size: 1rem;">REBOOT_SYSTEM</button>
                        <button class="close-game-btn badge p-2 mt-3 border-0" style="cursor:pointer; opacity: 0.6;">ÇIKIŞ</button>
                    </div>
                </div>
            `;
            document.body.appendChild(gameOverlay);

            let isPlaying = false;
            let isJumping = false;
            let gravity = 1.0;
            let isGameOver = false;

            let player = document.getElementById('player-kirpi');
            let ground = document.getElementById('game-ground');
            let scoreDisplay = document.getElementById('game-score');
            let overScreen = document.getElementById('game-over-screen');
            let startScreen = document.getElementById('game-start-screen');
            let finalScore = document.getElementById('final-score');
            
            let obstacles = [];
            let score = 0;
            let gameLoop;
            let spawnTimeout;
            
            let playerY = 24; 
            let velocityY = 0;

            function startGame() {
                startScreen.style.display = 'none';
                overScreen.style.display = 'none';
                isPlaying = true;
                isGameOver = false;
                score = 0;
                playerY = 24;
                velocityY = 0;
                obstacles.forEach(ob => ob.remove());
                obstacles = [];
                scoreDisplay.innerText = "SCORE: 0";
                
                spawnObstacle();
                gameLoop = requestAnimationFrame(update);
            }

            function spawnObstacle() {
                if (!isPlaying) return;
                
                let ob = document.createElement('div');
                ob.className = 'obstacle';
                let type = Math.random();
                if(type > 0.6) {
                    ob.classList.add('obs-tall');
                } else if(type > 0.3) {
                    ob.classList.add('obs-wide');
                } else {
                    ob.classList.add('obs-tall'); 
                }
                
                document.getElementById('kirpi-minigame-container').appendChild(ob);
                let gameWidth = document.getElementById('kirpi-minigame-container').offsetWidth;
                ob.style.left = gameWidth + 'px';
                obstacles.push(ob);

                let nextSpawnInfo = Math.random() * 1000 + 800; // 0.8s to 1.8s
                let speedModifier = Math.min(score * 1.5, 600); 
                spawnTimeout = setTimeout(spawnObstacle, nextSpawnInfo - speedModifier); 
            }

            function jump(e) {
                if(e && e.target.tagName === 'BUTTON') return; 
                if (!isPlaying || isGameOver) return;
                if (!isJumping) {
                    isJumping = true;
                    velocityY = 16; 
                }
            }

            function update() {
                if (!isPlaying) return;

                playerY += velocityY;
                velocityY -= gravity;

                if (playerY <= 24) {
                    playerY = 24;
                    isJumping = false;
                    velocityY = 0;
                }
                player.style.bottom = playerY + 'px';

                let obSpeed = 7 + (score / 150); 
                
                for (let i = 0; i < obstacles.length; i++) {
                    let ob = obstacles[i];
                    let obLeft = parseFloat(ob.style.left);
                    obLeft -= obSpeed;
                    ob.style.left = obLeft + 'px';

                    let obRect = ob.getBoundingClientRect();
                    let playerRect = player.getBoundingClientRect();
                    
                    let tolerance = 5;
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

                score += 1;
                scoreDisplay.innerText = "SCORE: " + Math.floor(score/10);

                gameLoop = requestAnimationFrame(update);
            }

            function gameOver() {
                isGameOver = true;
                isPlaying = false;
                clearTimeout(spawnTimeout);
                overScreen.style.display = 'flex';
                finalScore.innerHTML = "> SCORE: " + Math.floor(score/10);
            }

            mainKirpi.addEventListener('click', (e) => {
                e.stopPropagation(); 
                gameOverlay.style.display = 'block';
                startScreen.style.display = 'flex';
                overScreen.style.display = 'none';
            });

            document.getElementById('start-btn').addEventListener('click', startGame);
            document.getElementById('restart-btn').addEventListener('click', startGame);
            
            document.querySelectorAll('.close-game-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    gameOverlay.style.display = 'none';
                    isPlaying = false;
                    isGameOver = false;
                    clearTimeout(spawnTimeout);
                    cancelAnimationFrame(gameLoop);
                    obstacles.forEach(ob => ob.remove());
                    obstacles = [];
                });
            });

            document.addEventListener('keydown', (e) => {
                if (gameOverlay.style.display === 'block') {
                    if (e.code === 'Space' || e.code === 'ArrowUp') {
                        e.preventDefault();
                        if(startScreen.style.display === 'flex') startGame();
                        else if(overScreen.style.display === 'flex') startGame();
                        else jump();
                    }
                    if (e.code === 'Escape') {
                        document.querySelector('.close-game-btn').click();
                    }
                }
            });

            document.getElementById('kirpi-minigame-container').addEventListener('mousedown', jump);
            document.getElementById('kirpi-minigame-container').addEventListener('touchstart', jump);
        }
    }

    // Fetch CV data for all dynamic sections
    fetch('cv.json')
        .then(response => response.json())
        .then(data => {
            // Footer Contact (All pages)
            const footerContactContainer = document.getElementById('footer-contact');
            if (footerContactContainer && data.contact) {
                footerContactContainer.innerHTML = `
                    <div class="d-flex flex-column align-items-center gap-3 mb-4 mt-2">
                        ${data.contact.email ? `<a href="mailto:${data.contact.email}" class="badge p-3 text-lowercase text-decoration-none">email: ${data.contact.email}</a>` : ''}
                        <div class="d-flex justify-content-center gap-3">
                            ${data.contact.github ? `<a href="${data.contact.github}" target="_blank" class="badge p-3 text-decoration-none">GITHUB</a>` : ''}
                            ${data.contact.linkedin ? `<a href="${data.contact.linkedin}" target="_blank" class="badge p-3 text-decoration-none">LINKEDIN</a>` : ''}
                        </div>
                    </div>
                `;
            }

            // Populate About (about.html)
            const aboutContainer = document.getElementById('about-container');
            if (aboutContainer && data.about) {
                aboutContainer.innerHTML = `<p>${data.about}</p>`;
            }

            // Build the Terminal Directory Tree (about.html)
            const treeRootContainer = document.getElementById('cyber-tree-root');
            if (treeRootContainer && data.education && data.experience && data.skills) {
                
                const eduList = Array.isArray(data.education) ? data.education : [{ school: data.education, date: '' }];
                
                const eduHtml = eduList.map(edu => `
                    <li><div class="tree-node-box">> [${edu.school}] ${edu.date}</div></li>
                `).join('');

                const expHtml = data.experience.map(exp => `
                    <li>
                        <div class="tree-node-box">> [${exp.company}] ${exp.title}</div>
                        <ul>
                            <li><div class="tree-node-box" style="border:none; box-shadow:none; padding: 0.5rem 0; opacity: 0.8;">${exp.description}</div></li>
                        </ul>
                    </li>
                `).join('');

                const skillsHtml = data.skills.map(skill => `
                    <li><div class="tree-node-box">+ ${skill}</div></li>
                `).join('');

                treeRootContainer.innerHTML = `
                    <li>
                        <div class="tree-node-box root-box">[ OYUNCU PROFİLİ: mstillolu ]</div>
                        <ul>
                            <li>
                                <div class="tree-node-box cat-box">✦ EĞİTİM</div>
                                <ul>${eduHtml}</ul>
                            </li>
                            <li>
                                <div class="tree-node-box cat-box">✦ DENEYİM</div>
                                <ul>${expHtml}</ul>
                            </li>
                            <li>
                                <div class="tree-node-box cat-box">✦ YETENEKLER</div>
                                <ul>${skillsHtml}</ul>
                            </li>
                        </ul>
                    </li>
                `;
            }

            // Render Projects (projects.html)
            const projectContainer = document.getElementById('project-container');
            if (projectContainer && data.projects) {
                data.projects.forEach(project => {
                    const col = document.createElement('div');
                    col.className = 'col-md-6 mb-4';

                    const tagsHtml = project.tags.map(tag => `<span class="badge me-2 mb-2 p-1">${tag}</span>`).join('');

                    const cardInnerHtml = `
                        <div class="card h-100 p-3">
                            <div class="card-body d-flex flex-column">
                                <h3 class="card-title mb-3">${project.title}</h3>
                                <div class="mb-3">
                                    ${tagsHtml}
                                </div>
                                <p class="card-text flex-grow-1" style="font-family: 'IBM Plex Mono', monospace;">${project.description}</p>
                            </div>
                        </div>
                    `;

                    col.innerHTML = project.url
                        ? `<a href="${project.url}" target="_blank" class="project-card-link h-100">${cardInnerHtml}</a>`
                        : cardInnerHtml;
                    projectContainer.appendChild(col);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching CV data:', error);
        });
});
