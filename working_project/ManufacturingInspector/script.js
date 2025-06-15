// MedForce Games - Main JavaScript File

class MedForceGames {
    constructor() {
        this.gameData = {
            brainTeasers: {
                currentLevel: 1,
                unlockedLevels: [1],
                score: 0,
                hints: 3,
                usedQuestions: new Set()
            },
            wordScramble: {
                currentLevel: 1,
                unlockedLevels: [1],
                score: 0,
                wordsCompleted: 0,
                usedWords: new Set()
            },
            snake: {
                currentLevel: 1,
                unlockedLevels: [1],
                score: 0,
                highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0
            },
            knowledgeQuiz: {
                currentLevel: 1,
                unlockedLevels: [1],
                score: 0,
                questionsCompleted: 0,
                streak: 0,
                usedQuestions: new Set()
            },
            mathQuiz: {
                currentLevel: 1,
                unlockedLevels: [1],
                score: 0,
                questionsCompleted: 0,
                hints: 5,
                usedQuestions: new Set()
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupGameNavigation();
        this.initializeGames();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Browse Games button
        const browseGamesBtn = document.getElementById('browseGamesBtn');
        if (browseGamesBtn) {
            browseGamesBtn.addEventListener('click', () => {
                this.scrollToSection('categories');
            });
        }

        // Category card interactions
        this.setupCategoryCards();
        
        // Game navigation
        this.setupGameButtons();

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navToggle && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target) &&
                navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu && navToggle) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    setupCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            // Add hover sound effect (visual feedback)
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });

            // Add click animation
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('card-link')) {
                    this.animateCardClick(card);
                }
            });
        });
    }

    animateCardHover(card, isHovering) {
        const icon = card.querySelector('.card-icon');
        const title = card.querySelector('.card-title');
        
        if (isHovering) {
            // Add pulsing effect to icon
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.filter = 'drop-shadow(0 0 15px var(--gradient-purple))';
            }
            // Add glow to title
            if (title) {
                title.style.textShadow = '0 0 10px var(--gradient-blue)';
            }
        } else {
            // Reset animations
            if (icon) {
                icon.style.transform = '';
                icon.style.filter = '';
            }
            if (title) {
                title.style.textShadow = '';
            }
        }
    }

    animateCardClick(card) {
        // Add click ripple effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe category cards for animation
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(card);
        });

        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupNavigation() {
        // Active navigation highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
            this.updateHeaderBackground();
        });

        // Smooth scroll for anchor links
        navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    this.scrollToSection(targetId);
                });
            }
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // If at top of page, highlight home
        if (window.scrollY < 100) {
            current = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    updateHeaderBackground() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.background = 'hsla(240, 6%, 6%, 0.95)';
            header.style.borderBottomColor = 'hsla(270, 100%, 50%, 0.3)';
        } else {
            header.style.background = 'hsla(240, 6%, 6%, 0.95)';
            header.style.borderBottomColor = 'hsla(0, 0%, 50%, 0.1)';
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupScrollEffects() {
        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-bg');
            
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }

            // Logo rotation effect
            const heroLogo = document.querySelector('.hero-logo-icon');
            if (heroLogo) {
                heroLogo.style.transform = `rotate(${scrolled * 0.1}deg)`;
            }
        });

        // Mouse movement parallax for particles
        document.addEventListener('mousemove', (e) => {
            const particles = document.querySelectorAll('.particle');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Utility method for creating dynamic backgrounds
    createDynamicBackground() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(canvas);

        // Animate background
        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(188, 0, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            time += 0.01;
            requestAnimationFrame(animate);
        };
        
        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupGameNavigation() {
        // Game navigation from nav links and game cards
        document.addEventListener('click', (e) => {
            const gameData = e.target.dataset.game;
            if (gameData) {
                e.preventDefault();
                this.openGame(gameData);
            }
        });
    }

    setupGameButtons() {
        // Home buttons in games
        document.querySelectorAll('[id$="-home-btn"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllGames());
        });

        // Quit buttons in games
        document.querySelectorAll('[id$="-quit-btn"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllGames());
        });

        // Restart buttons
        document.getElementById('brain-restart-btn')?.addEventListener('click', () => this.restartBrainTeasers());
        document.getElementById('word-restart-btn')?.addEventListener('click', () => this.restartWordScramble());
        document.getElementById('snake-restart-btn')?.addEventListener('click', () => this.restartSnake());
        document.getElementById('knowledge-restart-btn')?.addEventListener('click', () => this.restartKnowledgeQuiz());
        document.getElementById('math-restart-btn')?.addEventListener('click', () => this.restartMathQuiz());
    }

    openGame(gameName) {
        this.closeAllGames();
        const gameContainer = document.getElementById(`${gameName}-game`);
        if (gameContainer) {
            gameContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAllGames() {
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.remove('active');
        });
        document.body.style.overflow = '';
        
        // Stop any running games
        if (this.snakeGame?.gameLoop) {
            clearInterval(this.snakeGame.gameLoop);
        }
        if (this.brainGame?.timer) {
            clearInterval(this.brainGame.timer);
        }
    }

    initializeGames() {
        this.initBrainTeasers();
        this.initWordScramble();
        this.initSnake();
        this.initKnowledgeQuiz();
        this.initMathQuiz();
    }

    // BRAIN TEASERS GAME
    initBrainTeasers() {
        this.brainGame = {
            questions: {
                1: [ // Riddles
                    {q: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?", a: "echo", hint: "Sound bounces back"},
                    {q: "The more you take, the more you leave behind. What am I?", a: "footsteps", hint: "You make them when walking"},
                    {q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", a: "map", hint: "Shows geography on paper"},
                    {q: "What has keys but no locks, space but no room, and you can enter but not go inside?", a: "keyboard", hint: "Computer input device"},
                    {q: "I'm tall when I'm young, short when I'm old. What am I?", a: "candle", hint: "Burns down over time"},
                    {q: "What gets wet while drying?", a: "towel", hint: "Used after shower"},
                    {q: "I have a head and tail but no body. What am I?", a: "coin", hint: "Currency with two sides"},
                    {q: "What can travel around the world while staying in a corner?", a: "stamp", hint: "On mail envelopes"},
                    {q: "I'm not alive, but I grow. I don't have lungs, but I need air. What am I?", a: "fire", hint: "Needs oxygen to burn"},
                    {q: "What has one eye but cannot see?", a: "needle", hint: "Used for sewing"},
                    {q: "I have hands but cannot clap. What am I?", a: "clock", hint: "Shows time"},
                    {q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "m", hint: "It's a letter"},
                    {q: "I can be cracked, made, told, and played. What am I?", a: "joke", hint: "Makes people laugh"},
                    {q: "What has a neck but no head?", a: "bottle", hint: "Container for liquids"},
                    {q: "I'm light as a feather, yet the strongest man can't hold me for 5 minutes. What am I?", a: "breath", hint: "You do it automatically"},
                    {q: "What goes up but never comes down?", a: "age", hint: "Increases with time"},
                    {q: "I have teeth but cannot bite. What am I?", a: "comb", hint: "Used for hair"},
                    {q: "What has a thumb and four fingers but is not alive?", a: "glove", hint: "Worn on hands"},
                    {q: "I'm always hungry and must be fed. The finger I touch will soon turn red. What am I?", a: "fire", hint: "Burns everything"},
                    {q: "What can fill a room but takes up no space?", a: "light", hint: "Illuminates darkness"}
                ],
                2: [ // Math Puzzles
                    {q: "What is 15 + 27?", a: "42", hint: "Add the numbers"},
                    {q: "If a train leaves at 2 PM traveling 60 mph and arrives at 5 PM, how many miles did it travel?", a: "180", hint: "Speed × Time"},
                    {q: "What is 144 ÷ 12?", a: "12", hint: "Division problem"},
                    {q: "A farmer has 17 sheep. All but 9 die. How many are left?", a: "9", hint: "Read carefully"},
                    {q: "What is 8²?", a: "64", hint: "8 times 8"},
                    {q: "If you buy 3 apples for $2 each, how much change from $10?", a: "4", hint: "Calculate total cost first"},
                    {q: "What is 25% of 80?", a: "20", hint: "Quarter of 80"},
                    {q: "How many minutes in 2.5 hours?", a: "150", hint: "60 minutes per hour"},
                    {q: "What is the next number: 2, 6, 18, 54, ?", a: "162", hint: "Multiply by 3 each time"},
                    {q: "If today is Wednesday, what day will it be in 100 days?", a: "friday", hint: "100 ÷ 7 = 14 remainder 2"},
                    {q: "What is 999 + 1?", a: "1000", hint: "Simple addition"},
                    {q: "How many sides does a hexagon have?", a: "6", hint: "Hex means six"},
                    {q: "What is 7 × 8?", a: "56", hint: "Basic multiplication"},
                    {q: "If a pizza is cut into 8 slices and you eat 3, what fraction is left?", a: "5/8", hint: "Remaining slices over total"},
                    {q: "What is 100 - 37?", a: "63", hint: "Subtraction"},
                    {q: "How many degrees in a right angle?", a: "90", hint: "Quarter of a circle"},
                    {q: "What is 13 × 4?", a: "52", hint: "Multiply 13 by 4"},
                    {q: "If you save $5 per week, how much in 10 weeks?", a: "50", hint: "5 × 10"},
                    {q: "What is the square root of 49?", a: "7", hint: "7 × 7 = 49"},
                    {q: "How many cents in $3.50?", a: "350", hint: "100 cents per dollar"}
                ],
                3: [ // Pattern Recognition
                    {q: "Complete the pattern: A, C, E, G, ?", a: "i", hint: "Skip one letter each time"},
                    {q: "What comes next: 1, 4, 9, 16, ?", a: "25", hint: "Perfect squares"},
                    {q: "Continue: Red, Blue, Red, Blue, ?", a: "red", hint: "Alternating colors"},
                    {q: "Next in sequence: 1, 1, 2, 3, 5, 8, ?", a: "13", hint: "Fibonacci sequence"},
                    {q: "Pattern: ○●○●○●?", a: "○", hint: "Alternating symbols"},
                    {q: "Complete: MON, TUE, WED, THU, ?", a: "fri", hint: "Days of the week"},
                    {q: "What's next: 2, 4, 8, 16, ?", a: "32", hint: "Powers of 2"},
                    {q: "Continue: Z, Y, X, W, ?", a: "v", hint: "Reverse alphabetical"},
                    {q: "Pattern: 3, 6, 12, 24, ?", a: "48", hint: "Double each number"},
                    {q: "Next: January, March, May, July, ?", a: "september", hint: "Every other month"},
                    {q: "Complete: 1, 3, 7, 15, ?", a: "31", hint: "Double and add 1"},
                    {q: "Pattern: ABCD, EFGH, IJKL, ?", a: "mnop", hint: "Groups of 4 letters"},
                    {q: "What's next: 100, 91, 82, 73, ?", a: "64", hint: "Subtract 9 each time"},
                    {q: "Continue: △□○△□○?", a: "△", hint: "Repeating pattern of 3"},
                    {q: "Next: 5, 10, 20, 40, ?", a: "80", hint: "Double each time"},
                    {q: "Pattern: AZ, BY, CX, DW, ?", a: "ev", hint: "First letter forward, second backward"},
                    {q: "Complete: 1, 4, 7, 10, ?", a: "13", hint: "Add 3 each time"},
                    {q: "What's next: 64, 32, 16, 8, ?", a: "4", hint: "Divide by 2"},
                    {q: "Continue: Spring, Summer, Fall, Winter, ?", a: "spring", hint: "Seasons cycle"},
                    {q: "Pattern: 1A, 2B, 3C, 4D, ?", a: "5e", hint: "Number with corresponding letter"}
                ],
                4: [ // Rebus Puzzles
                    {q: "ME_AL", a: "meal", hint: "Missing letter in the middle", image: "🍽️"},
                    {q: "STAND\nI", a: "understand", hint: "I under STAND", image: "🤔"},
                    {q: "READING", a: "reading between the lines", hint: "Look at the spacing", image: "📖"},
                    {q: "NOON\nGOOD", a: "good afternoon", hint: "Good after noon", image: "🌅"},
                    {q: "WEAR\nLONG", a: "long underwear", hint: "Under the WEAR", image: "👕"},
                    {q: "HEAD\nHEELS", a: "head over heels", hint: "Head positioned over heels", image: "💕"},
                    {q: "CYCLE\nCYCLE\nCYCLE", a: "tricycle", hint: "Three cycles", image: "🚲"},
                    {q: "MIND\nMATTER", a: "mind over matter", hint: "Mind is over matter", image: "🧠"},
                    {q: "SYMPHON", a: "unfinished symphony", hint: "Symphony not finished", image: "🎵"},
                    {q: "DICE\nDICE", a: "paradise", hint: "Pair of dice", image: "🎲"},
                    {q: "GROUND\nFEET\nFEET\nFEET\nFEET\nFEET\nFEET", a: "six feet under ground", hint: "Six feet under the ground", image: "⚰️"},
                    {q: "ECNALG", a: "backward glance", hint: "GLANCE spelled backward", image: "👀"},
                    {q: "DEATH\nLIFE", a: "life after death", hint: "Life comes after death", image: "☯️"},
                    {q: "TIMING\nTIM ING", a: "split second timing", hint: "Timing split in the middle", image: "⏱️"},
                    {q: "TOUCH", a: "touchdown", hint: "Touch down", image: "🏈"},
                    {q: "BELT\nHITTING", a: "hitting below the belt", hint: "Hitting below the belt", image: "🥊"},
                    {q: "WORLD", a: "world upside down", hint: "World flipped", image: "🌍"},
                    {q: "ARREST\nYOU'RE", a: "you're under arrest", hint: "You're under arrest", image: "👮"},
                    {q: "FRIEND\nFRIEND\nFRIEND\nFRIEND", a: "four square friends", hint: "Four friends in a square", image: "👥"},
                    {q: "KNEE\nLIGHT", a: "neon light", hint: "Knee-on light", image: "💡"}
                ],
                5: [ // Rapid Fire Mixed
                    {q: "What has 4 legs in the morning, 2 at noon, 3 at night?", a: "human", hint: "Life stages"},
                    {q: "What is 7 × 9?", a: "63", hint: "Basic multiplication"},
                    {q: "Next: 5, 10, 15, 20, ?", a: "25", hint: "Count by 5s"},
                    {q: "ONCE\nTIME", a: "once upon a time", hint: "Once upon a time", image: "📚"},
                    {q: "I'm bought to eat but never consumed. What am I?", a: "plate", hint: "Holds food"},
                    {q: "What is 50% of 60?", a: "30", hint: "Half of 60"},
                    {q: "Pattern: ABC, DEF, GHI, ?", a: "jkl", hint: "Groups of 3 letters"},
                    {q: "What room has no doors or windows?", a: "mushroom", hint: "Not a real room"},
                    {q: "How many months have 28 days?", a: "12", hint: "All months have at least 28"},
                    {q: "What gets sharper the more you use it?", a: "brain", hint: "Mental exercise"},
                    {q: "Complete: 2, 4, 6, 8, ?", a: "10", hint: "Even numbers"},
                    {q: "What can't talk but will reply when spoken to?", a: "echo", hint: "Sound reflection"},
                    {q: "PRICE\nPRICE", a: "two for the price of one", hint: "Two prices", image: "💰"},
                    {q: "What is 12 + 8?", a: "20", hint: "Simple addition"},
                    {q: "I have branches but no fruit, trunk but no leaves. What am I?", a: "bank", hint: "Financial institution"},
                    {q: "What weighs more: a pound of feathers or a pound of bricks?", a: "same", hint: "Both weigh a pound"},
                    {q: "Next: A, D, G, J, ?", a: "m", hint: "Skip 2 letters each time"},
                    {q: "What invention lets you look through walls?", a: "window", hint: "Transparent barrier"},
                    {q: "How many sides does a triangle have?", a: "3", hint: "Tri means three"},
                    {q: "What goes around the world but stays in the corner?", a: "stamp", hint: "On envelope"}
                ]
            },
            currentQuestion: null,
            timer: null
        };

        this.setupBrainTeasersEvents();
    }

    setupBrainTeasersEvents() {
        // Level selection
        document.querySelectorAll('#brain-level-select .level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                if (this.gameData.brainTeasers.unlockedLevels.includes(level)) {
                    this.startBrainTeasersLevel(level);
                }
            });
        });

        // Game controls
        document.getElementById('brain-submit-btn')?.addEventListener('click', () => this.submitBrainAnswer());
        document.getElementById('brain-hint-btn')?.addEventListener('click', () => this.showBrainHint());
        document.getElementById('brain-skip-btn')?.addEventListener('click', () => this.skipBrainQuestion());
        document.getElementById('brain-back-btn')?.addEventListener('click', () => this.showBrainLevelSelect());

        // Enter key submission
        document.getElementById('brain-answer-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitBrainAnswer();
        });
    }

    startBrainTeasersLevel(level) {
        this.gameData.brainTeasers.currentLevel = level;
        this.gameData.brainTeasers.score = 0;
        this.gameData.brainTeasers.hints = level === 5 ? 1 : 3; // Rapid fire has fewer hints
        this.gameData.brainTeasers.usedQuestions = new Set();

        document.getElementById('brain-level-select').style.display = 'none';
        document.getElementById('brain-game-play').style.display = 'block';
        document.getElementById('brain-current-level').textContent = level;
        document.getElementById('brain-score').textContent = '0';
        document.getElementById('brain-hints').textContent = this.gameData.brainTeasers.hints;

        // Setup timer for rapid fire (level 5)
        if (level === 5) {
            document.getElementById('brain-timer').style.display = 'block';
            this.startBrainTimer();
        } else {
            document.getElementById('brain-timer').style.display = 'none';
        }

        this.loadNextBrainQuestion();
    }

    startBrainTimer() {
        let timeLeft = 60;
        document.getElementById('brain-time').textContent = timeLeft;
        
        this.brainGame.timer = setInterval(() => {
            timeLeft--;
            document.getElementById('brain-time').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.brainGame.timer);
                this.endBrainLevel();
            }
        }, 1000);
    }

    loadNextBrainQuestion() {
        const level = this.gameData.brainTeasers.currentLevel;
        const questions = this.brainGame.questions[level];
        
        // Filter out used questions
        const availableQuestions = questions.filter((_, index) => 
            !this.gameData.brainTeasers.usedQuestions.has(index)
        );
        
        if (availableQuestions.length === 0) {
            // All questions used, level complete
            this.endBrainLevel();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions[randomIndex];
        const originalIndex = questions.indexOf(question);
        
        this.gameData.brainTeasers.usedQuestions.add(originalIndex);
        this.brainGame.currentQuestion = question;
        
        document.getElementById('brain-question-text').textContent = question.q;
        document.getElementById('brain-answer-input').value = '';
        document.getElementById('brain-feedback').textContent = '';
        
        // Show image for rebus puzzles
        const imageContainer = document.getElementById('brain-question-image');
        if (question.image) {
            imageContainer.textContent = question.image;
            imageContainer.style.display = 'flex';
        } else {
            imageContainer.style.display = 'none';
        }
    }

    submitBrainAnswer() {
        const userAnswer = document.getElementById('brain-answer-input').value.toLowerCase().trim();
        const correctAnswer = this.brainGame.currentQuestion.a.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            this.showBrainFeedback('Correct! Well done!', 'correct');
            this.gameData.brainTeasers.score += 10;
            document.getElementById('brain-score').textContent = this.gameData.brainTeasers.score;
            
            setTimeout(() => {
                if (this.gameData.brainTeasers.currentLevel === 5 && this.brainGame.timer) {
                    this.loadNextBrainQuestion(); // Continue rapid fire
                } else {
                    this.loadNextBrainQuestion();
                }
            }, 1500);
        } else {
            this.showBrainFeedback('Incorrect. Try again!', 'incorrect');
        }
    }

    showBrainHint() {
        if (this.gameData.brainTeasers.hints > 0) {
            this.gameData.brainTeasers.hints--;
            document.getElementById('brain-hints').textContent = this.gameData.brainTeasers.hints;
            this.showBrainFeedback(`Hint: ${this.brainGame.currentQuestion.hint}`, 'hint');
        } else {
            this.showBrainFeedback('No hints remaining!', 'incorrect');
        }
    }

    skipBrainQuestion() {
        this.showBrainFeedback(`Answer was: ${this.brainGame.currentQuestion.a}`, 'hint');
        setTimeout(() => this.loadNextBrainQuestion(), 2000);
    }

    showBrainFeedback(message, type) {
        const feedback = document.getElementById('brain-feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
    }

    endBrainLevel() {
        if (this.brainGame.timer) {
            clearInterval(this.brainGame.timer);
        }
        
        const level = this.gameData.brainTeasers.currentLevel;
        const score = this.gameData.brainTeasers.score;
        
        // Unlock next level based on score
        if (score >= 50 && level < 5 && !this.gameData.brainTeasers.unlockedLevels.includes(level + 1)) {
            this.gameData.brainTeasers.unlockedLevels.push(level + 1);
            this.updateBrainLevelButtons();
            this.showBrainFeedback(`Level ${level + 1} unlocked! Score: ${score}`, 'correct');
        } else {
            this.showBrainFeedback(`Level complete! Final score: ${score}`, 'correct');
        }
        
        setTimeout(() => this.showBrainLevelSelect(), 3000);
    }

    showBrainLevelSelect() {
        document.getElementById('brain-game-play').style.display = 'none';
        document.getElementById('brain-level-select').style.display = 'block';
        if (this.brainGame.timer) {
            clearInterval(this.brainGame.timer);
        }
    }

    updateBrainLevelButtons() {
        document.querySelectorAll('#brain-level-select .level-btn').forEach((btn, index) => {
            const level = index + 1;
            if (this.gameData.brainTeasers.unlockedLevels.includes(level)) {
                btn.classList.remove('locked');
                btn.classList.add('unlocked');
            }
        });
    }

    restartBrainTeasers() {
        this.gameData.brainTeasers = {
            currentLevel: 1,
            unlockedLevels: [1],
            score: 0,
            hints: 3,
            usedQuestions: new Set()
        };
        this.updateBrainLevelButtons();
        this.showBrainLevelSelect();
    }

    // WORD SCRAMBLE GAME
    initWordScramble() {
        this.wordGame = {
            words: {
                1: ['LOVE', 'STAR', 'MOON', 'FIRE', 'WIND', 'RAIN', 'SNOW', 'TREE', 'BIRD', 'FISH', 'ROCK', 'SAND', 'BLUE', 'RED', 'GOLD', 'DARK', 'CALM', 'WARM', 'COLD', 'SOFT', 'HARD', 'FAST', 'SLOW', 'TALL', 'WIDE', 'DEEP', 'HIGH', 'LONG', 'NEAR', 'AWAY'],
                2: ['HAPPY', 'BEACH', 'LIGHT', 'SPACE', 'MAGIC', 'DREAM', 'PEACE', 'STORM', 'RIVER', 'OCEAN', 'MUSIC', 'DANCE', 'SMILE', 'LAUGH', 'BRAVE', 'SMART', 'QUICK', 'FRESH', 'CLEAN', 'SWEET', 'STRONG', 'BRIGHT', 'SHARP', 'ROUND', 'SMOOTH', 'GENTLE', 'QUIET', 'CLEVER', 'HUMBLE', 'HONEST'],
                3: ['FRIEND', 'FLOWER', 'CASTLE', 'DRAGON', 'PUZZLE', 'SIMPLE', 'BRIGHT', 'SMOOTH', 'GENTLE', 'RHYTHM', 'MELODY', 'WONDER', 'SPIRAL', 'MARBLE', 'PURPLE', 'ORANGE', 'SILVER', 'GOLDEN', 'FROZEN', 'BROKEN', 'HIDDEN', 'SECRET', 'MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'FAMILY', 'GARDEN', 'WINDOW', 'BRIDGE'],
                4: ['RAINBOW', 'DIAMOND', 'THUNDER', 'WHISPER', 'HARMONY', 'MYSTERY', 'JOURNEY', 'COURAGE', 'FREEDOM', 'CRYSTAL', 'SUNRISE', 'EVENING', 'MORNING', 'WEEKEND', 'HOLIDAY', 'SPECIAL', 'PERFECT', 'AMAZING', 'AWESOME', 'MAGICAL', 'SPARKLE', 'SHIMMER', 'GLITTER', 'TWINKLE', 'ROMANCE', 'PASSION', 'EMOTION', 'FEELING', 'HEALING', 'HELPING'],
                5: ['HAPPINESS', 'ADVENTURE', 'DISCOVERY', 'WONDERFUL', 'BEAUTIFUL', 'FANTASTIC', 'MARVELOUS', 'BRILLIANT', 'EXCELLENT', 'SPLENDID', 'GORGEOUS', 'STUNNING', 'CHARMING', 'ELEGANT', 'GRACEFUL', 'PEACEFUL', 'POWERFUL', 'COLORFUL', 'CHEERFUL', 'GRATEFUL', 'HOPEFUL', 'HELPFUL', 'CAREFUL', 'MINDFUL', 'SKILLFUL', 'PLAYFUL', 'JOYFUL', 'USEFUL', 'GENTLE', 'HUMBLE']
            },
            currentWord: null,
            scrambledLetters: []
        };

        this.setupWordScrambleEvents();
    }

    setupWordScrambleEvents() {
        // Level selection
        document.querySelectorAll('#word-level-select .level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                if (this.gameData.wordScramble.unlockedLevels.includes(level)) {
                    this.startWordScrambleLevel(level);
                }
            });
        });

        // Game controls
        document.getElementById('word-submit-btn')?.addEventListener('click', () => this.submitWordAnswer());
        document.getElementById('word-hint-btn')?.addEventListener('click', () => this.showWordHint());
        document.getElementById('word-speak-btn')?.addEventListener('click', () => this.speakWord());
        document.getElementById('word-shuffle-btn')?.addEventListener('click', () => this.shuffleWordLetters());
        document.getElementById('word-back-btn')?.addEventListener('click', () => this.showWordLevelSelect());

        // Enter key submission
        document.getElementById('word-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitWordAnswer();
        });
    }

    startWordScrambleLevel(level) {
        this.gameData.wordScramble.currentLevel = level;
        this.gameData.wordScramble.score = 0;
        this.gameData.wordScramble.wordsCompleted = 0;
        this.gameData.wordScramble.usedWords = new Set();

        document.getElementById('word-level-select').style.display = 'none';
        document.getElementById('word-game-play').style.display = 'block';
        document.getElementById('word-current-level').textContent = level;
        document.getElementById('word-score').textContent = '0';
        document.getElementById('word-progress').textContent = '0/10';

        this.loadNextWordQuestion();
    }

    loadNextWordQuestion() {
        const level = this.gameData.wordScramble.currentLevel;
        const words = this.wordGame.words[level];
        
        // Filter out used words
        const availableWords = words.filter(word => 
            !this.gameData.wordScramble.usedWords.has(word)
        );
        
        if (availableWords.length === 0 || this.gameData.wordScramble.wordsCompleted >= 10) {
            this.endWordLevel();
            return;
        }
        
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        this.gameData.wordScramble.usedWords.add(randomWord);
        this.wordGame.currentWord = randomWord;
        
        this.scrambleWord(randomWord);
        document.getElementById('word-input').value = '';
        document.getElementById('word-feedback').textContent = '';
    }

    scrambleWord(word) {
        const letters = word.split('');
        
        // Shuffle letters
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        
        this.wordGame.scrambledLetters = letters;
        this.displayScrambledWord();
    }

    displayScrambledWord() {
        const container = document.getElementById('scrambled-word');
        container.innerHTML = '';
        
        this.wordGame.scrambledLetters.forEach(letter => {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = letter;
            container.appendChild(letterDiv);
        });
    }

    shuffleWordLetters() {
        this.scrambleWord(this.wordGame.currentWord);
    }

    submitWordAnswer() {
        const userAnswer = document.getElementById('word-input').value.toUpperCase().trim();
        const correctAnswer = this.wordGame.currentWord;
        
        if (userAnswer === correctAnswer) {
            this.showWordFeedback('Correct! Great job!', 'correct');
            this.gameData.wordScramble.score += this.gameData.wordScramble.currentLevel * 10;
            this.gameData.wordScramble.wordsCompleted++;
            
            document.getElementById('word-score').textContent = this.gameData.wordScramble.score;
            document.getElementById('word-progress').textContent = 
                `${this.gameData.wordScramble.wordsCompleted}/10`;
            
            setTimeout(() => this.loadNextWordQuestion(), 1500);
        } else {
            this.showWordFeedback('Try again!', 'incorrect');
        }
    }

    showWordHint() {
        const word = this.wordGame.currentWord;
        const hint = `First letter: ${word[0]}, Length: ${word.length}`;
        this.showWordFeedback(hint, 'hint');
    }

    speakWord() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.wordGame.currentWord);
            utterance.rate = 0.7;
            speechSynthesis.speak(utterance);
        } else {
            this.showWordFeedback('Speech not supported in this browser', 'incorrect');
        }
    }

    showWordFeedback(message, type) {
        const feedback = document.getElementById('word-feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
    }

    endWordLevel() {
        const level = this.gameData.wordScramble.currentLevel;
        const score = this.gameData.wordScramble.score;
        
        // Unlock next level based on performance
        if (this.gameData.wordScramble.wordsCompleted >= 7 && level < 5 && 
            !this.gameData.wordScramble.unlockedLevels.includes(level + 1)) {
            this.gameData.wordScramble.unlockedLevels.push(level + 1);
            this.updateWordLevelButtons();
            this.showWordFeedback(`Level ${level + 1} unlocked! Score: ${score}`, 'correct');
        } else {
            this.showWordFeedback(`Level complete! Score: ${score}`, 'correct');
        }
        
        setTimeout(() => this.showWordLevelSelect(), 3000);
    }

    showWordLevelSelect() {
        document.getElementById('word-game-play').style.display = 'none';
        document.getElementById('word-level-select').style.display = 'block';
    }

    updateWordLevelButtons() {
        document.querySelectorAll('#word-level-select .level-btn').forEach((btn, index) => {
            const level = index + 1;
            if (this.gameData.wordScramble.unlockedLevels.includes(level)) {
                btn.classList.remove('locked');
                btn.classList.add('unlocked');
            }
        });
    }

    restartWordScramble() {
        this.gameData.wordScramble = {
            currentLevel: 1,
            unlockedLevels: [1],
            score: 0,
            wordsCompleted: 0,
            usedWords: new Set()
        };
        this.updateWordLevelButtons();
        this.showWordLevelSelect();
    }

    // SNAKE GAME
    initSnake() {
        this.snakeGame = {
            canvas: document.getElementById('snake-canvas'),
            ctx: null,
            snake: [{x: 200, y: 200}],
            direction: {x: 0, y: 0},
            food: {x: 0, y: 0},
            powerUps: [],
            obstacles: [],
            gameLoop: null,
            speed: 200,
            score: 0,
            timeWarp: false,
            timeWarpEnd: 0
        };

        if (this.snakeGame.canvas) {
            this.snakeGame.ctx = this.snakeGame.canvas.getContext('2d');
            this.setupSnakeEvents();
            document.getElementById('snake-high-score').textContent = this.gameData.snake.highScore;
        }
    }

    setupSnakeEvents() {
        // Level selection
        document.querySelectorAll('#snake-level-select .level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                if (this.gameData.snake.unlockedLevels.includes(level)) {
                    this.startSnakeLevel(level);
                }
            });
        });

        // Controls
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.snakeGame.gameLoop) return;
            
            const key = e.key.toLowerCase();
            const {x, y} = this.snakeGame.direction;
            
            switch(key) {
                case 'w':
                case 'arrowup':
                    if (y === 0) this.snakeGame.direction = {x: 0, y: -20};
                    break;
                case 's':
                case 'arrowdown':
                    if (y === 0) this.snakeGame.direction = {x: 0, y: 20};
                    break;
                case 'a':
                case 'arrowleft':
                    if (x === 0) this.snakeGame.direction = {x: -20, y: 0};
                    break;
                case 'd':
                case 'arrowright':
                    if (x === 0) this.snakeGame.direction = {x: 20, y: 0};
                    break;
            }
        });

        // Touch controls
        document.querySelectorAll('.touch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.snakeGame.gameLoop) return;
                
                const direction = e.target.dataset.direction;
                const {x, y} = this.snakeGame.direction;
                
                switch(direction) {
                    case 'up':
                        if (y === 0) this.snakeGame.direction = {x: 0, y: -20};
                        break;
                    case 'down':
                        if (y === 0) this.snakeGame.direction = {x: 0, y: 20};
                        break;
                    case 'left':
                        if (x === 0) this.snakeGame.direction = {x: -20, y: 0};
                        break;
                    case 'right':
                        if (x === 0) this.snakeGame.direction = {x: 20, y: 0};
                        break;
                }
            });
        });

        document.getElementById('snake-back-btn')?.addEventListener('click', () => this.showSnakeLevelSelect());
    }

    startSnakeLevel(level) {
        this.gameData.snake.currentLevel = level;
        this.gameData.snake.score = 0;
        
        // Set speed based on level
        const speeds = [200, 150, 120, 100, 80];
        this.snakeGame.speed = speeds[level - 1] || 80;
        
        // Reset game state
        this.snakeGame.snake = [{x: 200, y: 200}];
        this.snakeGame.direction = {x: 0, y: 0};
        this.snakeGame.powerUps = [];
        this.snakeGame.obstacles = [];
        this.snakeGame.score = 0;
        this.snakeGame.timeWarp = false;
        
        document.getElementById('snake-level-select').style.display = 'none';
        document.getElementById('snake-game-play').style.display = 'block';
        document.getElementById('snake-current-level').textContent = level;
        document.getElementById('snake-score').textContent = '0';
        document.getElementById('snake-length').textContent = '1';
        
        this.generateSnakeFood();
        this.generateSnakeObstacles(level);
        this.startSnakeGame();
    }

    generateSnakeFood() {
        let foodX, foodY;
        let validPosition = false;
        
        while (!validPosition) {
            foodX = Math.floor(Math.random() * 20) * 20;
            foodY = Math.floor(Math.random() * 20) * 20;
            
            // Check if food position conflicts with snake
            const conflictsWithSnake = this.snakeGame.snake.some(segment => 
                segment.x === foodX && segment.y === foodY
            );
            
            // Check if food position conflicts with obstacles
            const conflictsWithObstacles = this.snakeGame.obstacles.some(obstacle =>
                obstacle.x === foodX && obstacle.y === foodY
            );
            
            validPosition = !conflictsWithSnake && !conflictsWithObstacles;
        }
        
        this.snakeGame.food = { x: foodX, y: foodY };
    }

    generateSnakeObstacles(level) {
        this.snakeGame.obstacles = [];
        
        if (level >= 2) {
            const numObstacles = Math.min(level * 2, 10);
            
            for (let i = 0; i < numObstacles; i++) {
                let obsX, obsY;
                let validPosition = false;
                let attempts = 0;
                
                while (!validPosition && attempts < 50) {
                    obsX = Math.floor(Math.random() * 20) * 20;
                    obsY = Math.floor(Math.random() * 20) * 20;
                    
                    // Check if obstacle conflicts with snake starting position
                    const conflictsWithSnake = this.snakeGame.snake.some(segment => 
                        segment.x === obsX && segment.y === obsY
                    );
                    
                    // Check if obstacle conflicts with existing obstacles
                    const conflictsWithObstacles = this.snakeGame.obstacles.some(obstacle =>
                        obstacle.x === obsX && obstacle.y === obsY
                    );
                    
                    // Avoid center area where snake starts
                    const tooCloseToCenter = (obsX >= 180 && obsX <= 220) && (obsY >= 180 && obsY <= 220);
                    
                    validPosition = !conflictsWithSnake && !conflictsWithObstacles && !tooCloseToCenter;
                    attempts++;
                }
                
                if (validPosition) {
                    this.snakeGame.obstacles.push({ x: obsX, y: obsY });
                }
            }
        }
    }

    generatePowerUp() {
        if (this.gameData.snake.currentLevel >= 3 && Math.random() < 0.3) {
            const types = ['golden', 'bomb', 'timewarp'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            let powerX, powerY;
            let validPosition = false;
            let attempts = 0;
            
            while (!validPosition && attempts < 30) {
                powerX = Math.floor(Math.random() * 20) * 20;
                powerY = Math.floor(Math.random() * 20) * 20;
                
                // Check conflicts with snake, food, obstacles, and existing power-ups
                const conflictsWithSnake = this.snakeGame.snake.some(segment => 
                    segment.x === powerX && segment.y === powerY
                );
                const conflictsWithFood = this.snakeGame.food.x === powerX && this.snakeGame.food.y === powerY;
                const conflictsWithObstacles = this.snakeGame.obstacles.some(obstacle =>
                    obstacle.x === powerX && obstacle.y === powerY
                );
                const conflictsWithPowerUps = this.snakeGame.powerUps.some(powerUp =>
                    powerUp.x === powerX && powerUp.y === powerY
                );
                
                validPosition = !conflictsWithSnake && !conflictsWithFood && !conflictsWithObstacles && !conflictsWithPowerUps;
                attempts++;
            }
            
            if (validPosition) {
                this.snakeGame.powerUps.push({
                    x: powerX,
                    y: powerY,
                    type: type,
                    timer: 300
                });
            }
        }
    }

    startSnakeGame() {
        this.snakeGame.gameLoop = setInterval(() => {
            this.updateSnake();
            this.drawSnake();
        }, this.snakeGame.timeWarp ? this.snakeGame.speed * 2 : this.snakeGame.speed);
    }

    updateSnake() {
        // Don't move if no direction is set (game hasn't started yet)
        if (this.snakeGame.direction.x === 0 && this.snakeGame.direction.y === 0) {
            return;
        }
        
        const head = {...this.snakeGame.snake[0]};
        head.x += this.snakeGame.direction.x;
        head.y += this.snakeGame.direction.y;
        
        // Wall collision
        if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
            this.gameOverSnake();
            return;
        }
        
        // Self collision
        if (this.snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOverSnake();
            return;
        }
        
        // Obstacle collision
        if (this.snakeGame.obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
            this.gameOverSnake();
            return;
        }
        
        this.snakeGame.snake.unshift(head);
        
        // Food collision
        if (head.x === this.snakeGame.food.x && head.y === this.snakeGame.food.y) {
            this.snakeGame.score += 10;
            this.gameData.snake.score = this.snakeGame.score;
            this.generateSnakeFood();
            this.generatePowerUp();
            
            document.getElementById('snake-score').textContent = this.snakeGame.score;
            document.getElementById('snake-length').textContent = this.snakeGame.snake.length;
            
            // Check for level unlock
            const unlockScores = [0, 100, 250, 500, 1000];
            const nextLevel = this.gameData.snake.currentLevel + 1;
            if (nextLevel <= 5 && this.snakeGame.score >= unlockScores[nextLevel - 1] && 
                !this.gameData.snake.unlockedLevels.includes(nextLevel)) {
                this.gameData.snake.unlockedLevels.push(nextLevel);
            }
        } else {
            this.snakeGame.snake.pop();
        }
        
        // Power-up collision
        this.snakeGame.powerUps.forEach((powerUp, index) => {
            if (head.x === powerUp.x && head.y === powerUp.y) {
                this.handlePowerUp(powerUp.type);
                this.snakeGame.powerUps.splice(index, 1);
            } else {
                powerUp.timer--;
                if (powerUp.timer <= 0) {
                    this.snakeGame.powerUps.splice(index, 1);
                }
            }
        });
        
        // Check time warp end
        if (this.snakeGame.timeWarp && Date.now() > this.snakeGame.timeWarpEnd) {
            this.snakeGame.timeWarp = false;
        }
    }

    handlePowerUp(type) {
        switch(type) {
            case 'golden':
                this.snakeGame.score += 50;
                document.getElementById('snake-score').textContent = this.snakeGame.score;
                break;
            case 'bomb':
                this.gameOverSnake();
                break;
            case 'timewarp':
                this.snakeGame.timeWarp = true;
                this.snakeGame.timeWarpEnd = Date.now() + 5000; // 5 seconds
                break;
        }
    }

    drawSnake() {
        const ctx = this.snakeGame.ctx;
        
        // Clear canvas
        ctx.fillStyle = 'hsl(240, 8%, 10%)';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(188, 0, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 400; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 400);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(400, i);
            ctx.stroke();
        }
        
        // Draw snake with neon effect
        this.snakeGame.snake.forEach((segment, index) => {
            const intensity = Math.max(0.3, 1 - index * 0.1);
            
            // Glow effect
            ctx.shadowColor = '#BC00FF';
            ctx.shadowBlur = 15;
            ctx.fillStyle = `rgba(188, 0, 255, ${intensity})`;
            
            if (index === 0) {
                // Head - make it brighter
                ctx.fillStyle = '#00F0FF';
                ctx.shadowColor = '#00F0FF';
            }
            
            ctx.fillRect(segment.x + 2, segment.y + 2, 16, 16);
        });
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Draw food
        ctx.fillStyle = '#FF6B6B';
        ctx.shadowColor = '#FF6B6B';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.snakeGame.food.x + 2, this.snakeGame.food.y + 2, 16, 16);
        
        // Draw obstacles
        ctx.fillStyle = '#6C757D';
        ctx.shadowColor = '#6C757D';
        ctx.shadowBlur = 5;
        this.snakeGame.obstacles.forEach(obs => {
            ctx.fillRect(obs.x + 2, obs.y + 2, 16, 16);
        });
        
        // Draw power-ups
        this.snakeGame.powerUps.forEach(powerUp => {
            let color, symbol;
            switch(powerUp.type) {
                case 'golden':
                    color = '#FFD700';
                    symbol = '●';
                    break;
                case 'bomb':
                    color = '#FF4444';
                    symbol = '💣';
                    break;
                case 'timewarp':
                    color = '#44FF44';
                    symbol = '⏰';
                    break;
            }
            
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.fillRect(powerUp.x + 2, powerUp.y + 2, 16, 16);
        });
        
        ctx.shadowBlur = 0;
    }

    gameOverSnake() {
        clearInterval(this.snakeGame.gameLoop);
        this.snakeGame.gameLoop = null;
        
        // Update high score
        if (this.snakeGame.score > this.gameData.snake.highScore) {
            this.gameData.snake.highScore = this.snakeGame.score;
            localStorage.setItem('snakeHighScore', this.snakeGame.score.toString());
            document.getElementById('snake-high-score').textContent = this.snakeGame.score;
        }
        
        setTimeout(() => {
            alert(`Game Over! Score: ${this.snakeGame.score}`);
            this.showSnakeLevelSelect();
        }, 100);
    }

    showSnakeLevelSelect() {
        if (this.snakeGame.gameLoop) {
            clearInterval(this.snakeGame.gameLoop);
            this.snakeGame.gameLoop = null;
        }
        
        document.getElementById('snake-game-play').style.display = 'none';
        document.getElementById('snake-level-select').style.display = 'block';
        this.updateSnakeLevelButtons();
    }

    updateSnakeLevelButtons() {
        document.querySelectorAll('#snake-level-select .level-btn').forEach((btn, index) => {
            const level = index + 1;
            if (this.gameData.snake.unlockedLevels.includes(level)) {
                btn.classList.remove('locked');
                btn.classList.add('unlocked');
            }
        });
    }

    restartSnake() {
        this.gameData.snake = {
            currentLevel: 1,
            unlockedLevels: [1],
            score: 0,
            highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0
        };
        this.updateSnakeLevelButtons();
        this.showSnakeLevelSelect();
    }

    // KNOWLEDGE QUIZ GAME
    initKnowledgeQuiz() {
        this.knowledgeGame = {
            questions: {
                1: [ // Science
                    {q: "What is the largest organ in the human body?", options: ["Heart", "Brain", "Skin", "Liver"], a: 2},
                    {q: "How many bones are in an adult human body?", options: ["206", "208", "210", "204"], a: 0},
                    {q: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], a: 2},
                    {q: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], a: 0},
                    {q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], a: 1},
                    {q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Silver"], a: 2},
                    {q: "How many chambers does a human heart have?", options: ["2", "3", "4", "5"], a: 2},
                    {q: "What is the center of an atom called?", options: ["Electron", "Neutron", "Proton", "Nucleus"], a: 3},
                    {q: "Which blood type is known as the universal donor?", options: ["A", "B", "AB", "O"], a: 3},
                    {q: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], a: 0},
                    {q: "Which organ produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Heart"], a: 2},
                    {q: "What is the smallest unit of matter?", options: ["Molecule", "Atom", "Cell", "Particle"], a: 1},
                    {q: "How many teeth does an adult human typically have?", options: ["28", "30", "32", "34"], a: 2},
                    {q: "What is the main gas in Earth's atmosphere?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], a: 2},
                    {q: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], a: 3},
                    {q: "What is the largest mammal in the world?", options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"], a: 1},
                    {q: "How many bones are in the human skull?", options: ["22", "24", "26", "28"], a: 0},
                    {q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], a: 2},
                    {q: "Which part of the brain controls balance?", options: ["Cerebrum", "Cerebellum", "Brain stem", "Frontal lobe"], a: 1},
                    {q: "What is the normal human body temperature?", options: ["36°C", "37°C", "38°C", "39°C"], a: 1}
                ],
                2: [ // Technology
                    {q: "Who founded Microsoft?", options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"], a: 1},
                    {q: "What does CPU stand for?", options: ["Computer Processing Unit", "Central Processing Unit", "Central Program Unit", "Computer Program Unit"], a: 1},
                    {q: "Which company created the iPhone?", options: ["Samsung", "Google", "Apple", "Microsoft"], a: 2},
                    {q: "What does WWW stand for?", options: ["World Wide Web", "World Wide Work", "Web Wide World", "Wide World Web"], a: 0},
                    {q: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Benjamin Franklin"], a: 1},
                    {q: "What does USB stand for?", options: ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "United System Bus"], a: 0},
                    {q: "Which programming language is known for web development?", options: ["Python", "Java", "JavaScript", "C++"], a: 2},
                    {q: "What is the main function of RAM?", options: ["Storage", "Processing", "Memory", "Graphics"], a: 2},
                    {q: "Who created Facebook?", options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Larry Page"], a: 2},
                    {q: "What does AI stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Applied Intelligence"], a: 1},
                    {q: "Which company developed Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], a: 2},
                    {q: "What is the binary number system based on?", options: ["0 and 1", "1 and 2", "0 and 2", "1 and 3"], a: 0},
                    {q: "What does HTML stand for?", options: ["High Text Markup Language", "HyperText Markup Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"], a: 1},
                    {q: "Who invented the computer mouse?", options: ["Steve Jobs", "Douglas Engelbart", "Bill Gates", "Alan Turing"], a: 1},
                    {q: "What is the main purpose of an operating system?", options: ["Browse internet", "Manage hardware", "Create documents", "Play games"], a: 1},
                    {q: "Which company created the search engine Google?", options: ["Microsoft", "Apple", "Google Inc.", "Yahoo"], a: 2},
                    {q: "What does URL stand for?", options: ["Universal Resource Locator", "Uniform Resource Locator", "United Resource Locator", "Universal Reference Locator"], a: 1},
                    {q: "Who is considered the father of computers?", options: ["Alan Turing", "Charles Babbage", "John von Neumann", "Steve Jobs"], a: 1},
                    {q: "What is cloud computing?", options: ["Weather prediction", "Internet-based computing", "Sky observation", "Atmospheric analysis"], a: 1},
                    {q: "Which technology enables wireless internet?", options: ["Bluetooth", "WiFi", "NFC", "GPS"], a: 1}
                ],
                3: [ // History
                    {q: "In which year did World War II end?", options: ["1944", "1945", "1946", "1947"], a: 1},
                    {q: "Who was the first President of the United States?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], a: 2},
                    {q: "Which ancient wonder of the world was located in Egypt?", options: ["Hanging Gardens", "Lighthouse of Alexandria", "Pyramids of Giza", "Colossus of Rhodes"], a: 2},
                    {q: "In which year did India gain independence?", options: ["1946", "1947", "1948", "1949"], a: 1},
                    {q: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], a: 2},
                    {q: "Which empire was ruled by Julius Caesar?", options: ["Greek Empire", "Roman Empire", "Egyptian Empire", "Persian Empire"], a: 1},
                    {q: "In which year did the Berlin Wall fall?", options: ["1987", "1988", "1989", "1990"], a: 2},
                    {q: "Who discovered America?", options: ["Marco Polo", "Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan"], a: 1},
                    {q: "Which war was fought between 1914-1918?", options: ["World War I", "World War II", "Civil War", "Cold War"], a: 0},
                    {q: "Who was known as the Iron Lady?", options: ["Queen Elizabeth", "Margaret Thatcher", "Angela Merkel", "Indira Gandhi"], a: 1},
                    {q: "In which country did the Renaissance begin?", options: ["France", "Germany", "Italy", "Spain"], a: 2},
                    {q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], a: 1},
                    {q: "Which ancient civilization built Machu Picchu?", options: ["Aztecs", "Mayans", "Incas", "Olmecs"], a: 2},
                    {q: "In which year did the Titanic sink?", options: ["1910", "1911", "1912", "1913"], a: 2},
                    {q: "Who was the first man on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"], a: 1},
                    {q: "Which revolution began in France in 1789?", options: ["Industrial Revolution", "French Revolution", "American Revolution", "Russian Revolution"], a: 1},
                    {q: "Who was the Egyptian queen who ruled with Julius Caesar?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Ankhesenamun"], a: 1},
                    {q: "In which year did the Great Wall of China construction begin?", options: ["7th century BC", "3rd century BC", "1st century BC", "1st century AD"], a: 0},
                    {q: "Who invented the printing press?", options: ["Johannes Gutenberg", "Leonardo da Vinci", "Benjamin Franklin", "Thomas Edison"], a: 0},
                    {q: "Which empire was known for its gladiator fights?", options: ["Greek Empire", "Roman Empire", "Byzantine Empire", "Ottoman Empire"], a: 1}
                ],
                4: [ // Geography
                    {q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], a: 2},
                    {q: "Which is the longest river in the world?", options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"], a: 1},
                    {q: "How many continents are there?", options: ["5", "6", "7", "8"], a: 2},
                    {q: "Which country has the most time zones?", options: ["Russia", "USA", "China", "Canada"], a: 0},
                    {q: "What is the smallest country in the world?", options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], a: 2},
                    {q: "Which ocean is the largest?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], a: 2},
                    {q: "What is the capital of Japan?", options: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"], a: 1},
                    {q: "Which mountain range contains Mount Everest?", options: ["Andes", "Rocky Mountains", "Alps", "Himalayas"], a: 3},
                    {q: "What is the largest desert in the world?", options: ["Sahara Desert", "Antarctic Desert", "Arabian Desert", "Gobi Desert"], a: 1},
                    {q: "Which country is known as the Land of the Rising Sun?", options: ["China", "South Korea", "Japan", "Thailand"], a: 2},
                    {q: "What is the capital of Brazil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], a: 2},
                    {q: "Which strait separates Asia and North America?", options: ["Bering Strait", "Gibraltar Strait", "Suez Canal", "Panama Canal"], a: 0},
                    {q: "What is the largest island in the world?", options: ["Australia", "Greenland", "New Guinea", "Madagascar"], a: 1},
                    {q: "Which city is known as the Big Apple?", options: ["Los Angeles", "Chicago", "New York City", "Boston"], a: 2},
                    {q: "What is the deepest point on Earth?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Peru-Chile Trench"], a: 0},
                    {q: "Which country has the most natural lakes?", options: ["USA", "Russia", "Canada", "Finland"], a: 2},
                    {q: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Luxor", "Aswan"], a: 1},
                    {q: "Which sea is the saltiest?", options: ["Red Sea", "Dead Sea", "Mediterranean Sea", "Black Sea"], a: 1},
                    {q: "What is the highest waterfall in the world?", options: ["Niagara Falls", "Angel Falls", "Victoria Falls", "Iguazu Falls"], a: 1},
                    {q: "Which country is both in Europe and Asia?", options: ["Russia", "Turkey", "Kazakhstan", "All of the above"], a: 3}
                ],
                5: [ // Mixed Expert
                    {q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], a: 2},
                    {q: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"], a: 1},
                    {q: "What is the currency of the United Kingdom?", options: ["Euro", "Dollar", "Pound Sterling", "Franc"], a: 2},
                    {q: "Which programming language was created by Guido van Rossum?", options: ["Java", "Python", "C++", "JavaScript"], a: 1},
                    {q: "In which year was the United Nations founded?", options: ["1944", "1945", "1946", "1947"], a: 1},
                    {q: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], a: 1},
                    {q: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"], a: 1},
                    {q: "What is the chemical formula for table salt?", options: ["NaCl", "KCl", "CaCl2", "MgCl2"], a: 0},
                    {q: "Which river flows through Paris?", options: ["Thames", "Rhine", "Seine", "Danube"], a: 2},
                    {q: "What does DNA stand for?", options: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribonuclear Acid", "Diribonuclear Acid"], a: 0},
                    {q: "Who painted 'Starry Night'?", options: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Salvador Dalí"], a: 1},
                    {q: "What is the square root of 144?", options: ["11", "12", "13", "14"], a: 1},
                    {q: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Lithium", "Carbon"], a: 1},
                    {q: "In which city is the Taj Mahal located?", options: ["Delhi", "Mumbai", "Agra", "Jaipur"], a: 2},
                    {q: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Leopard", "Gazelle"], a: 1},
                    {q: "Who composed 'The Four Seasons'?", options: ["Mozart", "Beethoven", "Vivaldi", "Bach"], a: 2},
                    {q: "What is the largest organ inside the human body?", options: ["Heart", "Brain", "Liver", "Lungs"], a: 2},
                    {q: "Which country invented paper money?", options: ["India", "Greece", "China", "Egypt"], a: 2},
                    {q: "What is the hardest rock?", options: ["Granite", "Marble", "Quartz", "Diamond"], a: 3},
                    {q: "Who discovered penicillin?", options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Joseph Lister"], a: 1}
                ]
            },
            currentQuestion: null,
            selectedAnswer: null
        };

        this.setupKnowledgeQuizEvents();
    }

    setupKnowledgeQuizEvents() {
        // Level selection
        document.querySelectorAll('#knowledge-level-select .level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                if (this.gameData.knowledgeQuiz.unlockedLevels.includes(level)) {
                    this.startKnowledgeQuizLevel(level);
                }
            });
        });

        // Quiz options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                const questionCard = option.closest('#knowledge-question-card');
                if (questionCard) {
                    questionCard.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    this.knowledgeGame.selectedAnswer = parseInt(option.dataset.option);
                    setTimeout(() => this.submitKnowledgeAnswer(), 1000);
                }
            });
        });

        document.getElementById('knowledge-back-btn')?.addEventListener('click', () => this.showKnowledgeLevelSelect());
    }

    startKnowledgeQuizLevel(level) {
        this.gameData.knowledgeQuiz.currentLevel = level;
        this.gameData.knowledgeQuiz.score = 0;
        this.gameData.knowledgeQuiz.questionsCompleted = 0;
        this.gameData.knowledgeQuiz.streak = 0;
        this.gameData.knowledgeQuiz.usedQuestions = new Set();

        document.getElementById('knowledge-level-select').style.display = 'none';
        document.getElementById('knowledge-game-play').style.display = 'block';
        document.getElementById('knowledge-current-level').textContent = level;
        document.getElementById('knowledge-score').textContent = '0';
        document.getElementById('knowledge-progress').textContent = '0/10';
        document.getElementById('knowledge-streak').textContent = '0';

        this.loadNextKnowledgeQuestion();
    }

    loadNextKnowledgeQuestion() {
        const level = this.gameData.knowledgeQuiz.currentLevel;
        const questions = this.knowledgeGame.questions[level];
        
        const availableQuestions = questions.filter((_, index) => 
            !this.gameData.knowledgeQuiz.usedQuestions.has(index)
        );
        
        if (availableQuestions.length === 0 || this.gameData.knowledgeQuiz.questionsCompleted >= 10) {
            this.endKnowledgeLevel();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions[randomIndex];
        const originalIndex = questions.indexOf(question);
        
        this.gameData.knowledgeQuiz.usedQuestions.add(originalIndex);
        this.knowledgeGame.currentQuestion = question;
        this.knowledgeGame.selectedAnswer = null;
        
        document.getElementById('knowledge-question-text').textContent = question.q;
        
        const options = document.querySelectorAll('#knowledge-question-card .quiz-option');
        options.forEach((option, index) => {
            option.textContent = question.options[index];
            option.className = 'quiz-option';
        });
        
        document.getElementById('knowledge-feedback').textContent = '';
    }

    submitKnowledgeAnswer() {
        if (this.knowledgeGame.selectedAnswer === null) return;
        
        const correct = this.knowledgeGame.selectedAnswer === this.knowledgeGame.currentQuestion.a;
        const options = document.querySelectorAll('#knowledge-question-card .quiz-option');
        
        options.forEach((option, index) => {
            if (index === this.knowledgeGame.currentQuestion.a) {
                option.classList.add('correct');
            } else if (index === this.knowledgeGame.selectedAnswer && !correct) {
                option.classList.add('incorrect');
            }
        });
        
        if (correct) {
            this.gameData.knowledgeQuiz.score += 10;
            this.gameData.knowledgeQuiz.streak++;
            this.showKnowledgeFeedback('Correct! Well done!', 'correct');
        } else {
            this.gameData.knowledgeQuiz.streak = 0;
            this.showKnowledgeFeedback(`Incorrect. The answer was: ${this.knowledgeGame.currentQuestion.options[this.knowledgeGame.currentQuestion.a]}`, 'incorrect');
        }
        
        this.gameData.knowledgeQuiz.questionsCompleted++;
        
        document.getElementById('knowledge-score').textContent = this.gameData.knowledgeQuiz.score;
        document.getElementById('knowledge-progress').textContent = `${this.gameData.knowledgeQuiz.questionsCompleted}/10`;
        document.getElementById('knowledge-streak').textContent = this.gameData.knowledgeQuiz.streak;
        
        setTimeout(() => this.loadNextKnowledgeQuestion(), 2000);
    }

    showKnowledgeFeedback(message, type) {
        const feedback = document.getElementById('knowledge-feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
    }

    endKnowledgeLevel() {
        const level = this.gameData.knowledgeQuiz.currentLevel;
        const score = this.gameData.knowledgeQuiz.score;
        
        if (score >= 70 && level < 5 && !this.gameData.knowledgeQuiz.unlockedLevels.includes(level + 1)) {
            this.gameData.knowledgeQuiz.unlockedLevels.push(level + 1);
            this.updateKnowledgeLevelButtons();
            this.showKnowledgeFeedback(`Subject ${level + 1} unlocked! Score: ${score}`, 'correct');
        } else {
            this.showKnowledgeFeedback(`Quiz complete! Final score: ${score}`, 'correct');
        }
        
        setTimeout(() => this.showKnowledgeLevelSelect(), 3000);
    }

    showKnowledgeLevelSelect() {
        document.getElementById('knowledge-game-play').style.display = 'none';
        document.getElementById('knowledge-level-select').style.display = 'block';
    }

    updateKnowledgeLevelButtons() {
        document.querySelectorAll('#knowledge-level-select .level-btn').forEach((btn, index) => {
            const level = index + 1;
            if (this.gameData.knowledgeQuiz.unlockedLevels.includes(level)) {
                btn.classList.remove('locked');
                btn.classList.add('unlocked');
            }
        });
    }

    restartKnowledgeQuiz() {
        this.gameData.knowledgeQuiz = {
            currentLevel: 1,
            unlockedLevels: [1],
            score: 0,
            questionsCompleted: 0,
            streak: 0,
            usedQuestions: new Set()
        };
        this.updateKnowledgeLevelButtons();
        this.showKnowledgeLevelSelect();
    }

    // MATH QUIZ GAME
    initMathQuiz() {
        this.mathGame = {
            currentQuestion: null,
            questionGenerator: {
                1: () => this.generateAdditionQuestion(),
                2: () => this.generateSubtractionQuestion(),
                3: () => this.generateMultiplicationQuestion(),
                4: () => this.generateDivisionQuestion(),
                5: () => this.generateMixedQuestion()
            }
        };

        this.setupMathQuizEvents();
    }

    setupMathQuizEvents() {
        // Level selection
        document.querySelectorAll('#math-level-select .level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = parseInt(btn.dataset.level);
                if (this.gameData.mathQuiz.unlockedLevels.includes(level)) {
                    this.startMathQuizLevel(level);
                }
            });
        });

        // Game controls
        document.getElementById('math-submit-btn')?.addEventListener('click', () => this.submitMathAnswer());
        document.getElementById('math-hint-btn')?.addEventListener('click', () => this.showMathHint());
        document.getElementById('math-speak-btn')?.addEventListener('click', () => this.speakMathQuestion());
        document.getElementById('math-back-btn')?.addEventListener('click', () => this.showMathLevelSelect());

        // Enter key submission
        document.getElementById('math-answer-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitMathAnswer();
        });
    }

    generateAdditionQuestion() {
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 50) + 1;
        return {
            question: `What is ${a} + ${b}?`,
            answer: a + b,
            hint: `Break it down: ${a} plus ${b}`
        };
    }

    generateSubtractionQuestion() {
        const a = Math.floor(Math.random() * 100) + 10;
        const b = Math.floor(Math.random() * a) + 1;
        return {
            question: `What is ${a} - ${b}?`,
            answer: a - b,
            hint: `Count backwards from ${a}`
        };
    }

    generateMultiplicationQuestion() {
        const a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;
        return {
            question: `What is ${a} × ${b}?`,
            answer: a * b,
            hint: `Think of ${a} groups of ${b}`
        };
    }

    generateDivisionQuestion() {
        const b = Math.floor(Math.random() * 12) + 1;
        const answer = Math.floor(Math.random() * 12) + 1;
        const a = b * answer;
        return {
            question: `What is ${a} ÷ ${b}?`,
            answer: answer,
            hint: `How many ${b}s fit into ${a}?`
        };
    }

    generateMixedQuestion() {
        const operations = ['+', '-', '×', '÷'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        switch(op) {
            case '+': return this.generateAdditionQuestion();
            case '-': return this.generateSubtractionQuestion();
            case '×': return this.generateMultiplicationQuestion();
            case '÷': return this.generateDivisionQuestion();
        }
    }

    startMathQuizLevel(level) {
        this.gameData.mathQuiz.currentLevel = level;
        this.gameData.mathQuiz.score = 0;
        this.gameData.mathQuiz.questionsCompleted = 0;
        this.gameData.mathQuiz.hints = level <= 3 ? 5 : 3;

        document.getElementById('math-level-select').style.display = 'none';
        document.getElementById('math-game-play').style.display = 'block';
        document.getElementById('math-current-level').textContent = level;
        document.getElementById('math-score').textContent = '0';
        document.getElementById('math-progress').textContent = '0/10';
        document.getElementById('math-hints').textContent = this.gameData.mathQuiz.hints;

        this.loadNextMathQuestion();
    }

    loadNextMathQuestion() {
        if (this.gameData.mathQuiz.questionsCompleted >= 10) {
            this.endMathLevel();
            return;
        }

        const level = this.gameData.mathQuiz.currentLevel;
        this.mathGame.currentQuestion = this.mathGame.questionGenerator[level]();
        
        document.getElementById('math-question-text').textContent = this.mathGame.currentQuestion.question;
        document.getElementById('math-answer-input').value = '';
        document.getElementById('math-feedback').textContent = '';
    }

    submitMathAnswer() {
        const userAnswer = parseInt(document.getElementById('math-answer-input').value);
        const correctAnswer = this.mathGame.currentQuestion.answer;
        
        if (isNaN(userAnswer)) {
            this.showMathFeedback('Please enter a number', 'incorrect');
            return;
        }
        
        if (userAnswer === correctAnswer) {
            this.showMathFeedback('Correct! Excellent work!', 'correct');
            this.gameData.mathQuiz.score += this.gameData.mathQuiz.currentLevel * 10;
            this.gameData.mathQuiz.questionsCompleted++;
            
            document.getElementById('math-score').textContent = this.gameData.mathQuiz.score;
            document.getElementById('math-progress').textContent = `${this.gameData.mathQuiz.questionsCompleted}/10`;
            
            setTimeout(() => this.loadNextMathQuestion(), 1500);
        } else {
            this.showMathFeedback(`Incorrect. The answer is ${correctAnswer}`, 'incorrect');
            setTimeout(() => this.loadNextMathQuestion(), 2000);
        }
    }

    showMathHint() {
        if (this.gameData.mathQuiz.hints > 0) {
            this.gameData.mathQuiz.hints--;
            document.getElementById('math-hints').textContent = this.gameData.mathQuiz.hints;
            this.showMathFeedback(`Hint: ${this.mathGame.currentQuestion.hint}`, 'hint');
        } else if (this.gameData.mathQuiz.currentLevel >= 4 && this.gameData.mathQuiz.score >= 10) {
            this.gameData.mathQuiz.score -= 10;
            document.getElementById('math-score').textContent = this.gameData.mathQuiz.score;
            this.showMathFeedback(`Hint: ${this.mathGame.currentQuestion.hint} (-10 points)`, 'hint');
        } else {
            this.showMathFeedback('No hints available!', 'incorrect');
        }
    }

    speakMathQuestion() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.mathGame.currentQuestion.question);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            this.showMathFeedback('Speech not supported in this browser', 'incorrect');
        }
    }

    showMathFeedback(message, type) {
        const feedback = document.getElementById('math-feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
    }

    endMathLevel() {
        const level = this.gameData.mathQuiz.currentLevel;
        const score = this.gameData.mathQuiz.score;
        
        if (score >= 70 && level < 5 && !this.gameData.mathQuiz.unlockedLevels.includes(level + 1)) {
            this.gameData.mathQuiz.unlockedLevels.push(level + 1);
            this.updateMathLevelButtons();
            this.showMathFeedback(`Level ${level + 1} unlocked! Score: ${score}`, 'correct');
        } else {
            this.showMathFeedback(`Quiz complete! Final score: ${score}`, 'correct');
        }
        
        setTimeout(() => this.showMathLevelSelect(), 3000);
    }

    showMathLevelSelect() {
        document.getElementById('math-game-play').style.display = 'none';
        document.getElementById('math-level-select').style.display = 'block';
    }

    updateMathLevelButtons() {
        document.querySelectorAll('#math-level-select .level-btn').forEach((btn, index) => {
            const level = index + 1;
            if (this.gameData.mathQuiz.unlockedLevels.includes(level)) {
                btn.classList.remove('locked');
                btn.classList.add('unlocked');
            }
        });
    }

    restartMathQuiz() {
        this.gameData.mathQuiz = {
            currentLevel: 1,
            unlockedLevels: [1],
            score: 0,
            questionsCompleted: 0,
            hints: 5,
            usedQuestions: new Set()
        };
        this.updateMathLevelButtons();
        this.showMathLevelSelect();
    }

    // Error handling
    handleError(error) {
        console.error('MedForce Games Error:', error);
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <p>Something went wrong. Please refresh the page or try again later.</p>
        `;
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(errorMessage);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 5000);
    }
}

// Performance optimization
const performanceOptimizations = {
    // Debounce function for scroll events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for high-frequency events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Lazy loading for images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new MedForceGames();
        
        // Initialize performance optimizations
        performanceOptimizations.lazyLoadImages();
        
        // Add global error handler
        window.addEventListener('error', (e) => {
            app.handleError(e.error);
        });
        
        console.log('🎮 MedForce Games initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize MedForce Games:', error);
    }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Note: Service worker would need to be implemented separately
            console.log('Service Worker support detected');
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    });
}

// Export for potential module usage
window.MedForceGames = MedForceGames;
