// MedForce Games - Main JavaScript File
// Educational Gaming Platform for Classes 5-6

// Global Variables
let currentGame = null;
let gameStates = {
    brainTeasers: {
        currentLevel: 1,
        score: 0,
        hints: 3,
        currentQuestion: 0,
        questions: [],
        timeLeft: 60,
        timer: null
    },
    wordScramble: {
        currentLevel: 1,
        score: 0,
        currentWord: 0,
        words: [],
        totalWords: 10
    },
    snake: {
        currentLevel: 1,
        score: 0,
        highScore: 0,
        snake: [],
        food: {},
        direction: 'right',
        gameLoop: null,
        canvas: null,
        ctx: null,
        gridSize: 20,
        gameRunning: false
    },
    knowledgeQuiz: {
        currentLevel: 1,
        score: 0,
        currentQuestion: 0,
        questions: [],
        streak: 0,
        totalQuestions: 10
    },
    mathQuiz: {
        currentLevel: 1,
        score: 0,
        currentQuestion: 0,
        questions: [],
        hints: 5,
        totalQuestions: 10
    }
};

// Text-to-Speech functionality
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// Local Storage Management
function saveGameProgress() {
    localStorage.setItem('medforceGameStates', JSON.stringify(gameStates));
}

function loadGameProgress() {
    const saved = localStorage.getItem('medforceGameStates');
    if (saved) {
        const savedStates = JSON.parse(saved);
        // Merge saved states with current states, preserving structure
        Object.keys(gameStates).forEach(game => {
            if (savedStates[game]) {
                Object.assign(gameStates[game], savedStates[game]);
            }
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadGameProgress();
    initializeNavigation();
    initializeHeroSection();
    initializeGameContainers();
    initializeAllGames();
    
    // Make all levels accessible immediately
    unlockAllLevels();
});

// Navigation System
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link[data-game]');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Game navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const gameType = this.getAttribute('data-game');
            if (gameType) {
                showGame(gameType);
                // Close mobile menu if open
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            }
        });
    });
    
    // Update active nav link
    function updateActiveNavLink(gameType) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-game') === gameType) {
                link.classList.add('active');
            }
        });
    }
}

// Hero Section
function initializeHeroSection() {
    const browseGamesBtn = document.getElementById('browseGamesBtn');
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (browseGamesBtn) {
        browseGamesBtn.addEventListener('click', function() {
            document.getElementById('categories').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Category card interactions
    categoryCards.forEach(card => {
        const gameType = card.getAttribute('data-category');
        const playButton = card.querySelector('.card-link');
        
        if (playButton && gameType) {
            playButton.addEventListener('click', function(e) {
                e.preventDefault();
                showGame(gameType);
            });
        }
    });
}

// Game Container Management
function initializeGameContainers() {
    const gameContainers = document.querySelectorAll('.game-container');
    
    gameContainers.forEach(container => {
        const gameType = container.id.replace('-game', '');
        
        // Home buttons
        const homeBtn = container.querySelector(`#${gameType}-home-btn`);
        if (homeBtn) {
            homeBtn.addEventListener('click', () => showHome());
        }
        
        // Quit buttons
        const quitBtn = container.querySelector(`#${gameType}-quit-btn`);
        if (quitBtn) {
            quitBtn.addEventListener('click', () => showHome());
        }
        
        // Restart buttons
        const restartBtn = container.querySelector(`#${gameType}-restart-btn`);
        if (restartBtn) {
            restartBtn.addEventListener('click', () => restartGame(gameType));
        }
        
        // Back to levels buttons
        const backBtn = container.querySelector(`#${gameType}-back-btn`);
        if (backBtn) {
            backBtn.addEventListener('click', () => showLevelSelect(gameType));
        }
    });
}

// Show/Hide Game Functions
function showGame(gameType) {
    hideAllGames();
    currentGame = gameType;
    
    const gameContainer = document.getElementById(`${gameType}-game`);
    if (gameContainer) {
        gameContainer.classList.add('active');
        showLevelSelect(gameType);
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-game') === gameType) {
                link.classList.add('active');
            }
        });
    }
}

function showHome() {
    hideAllGames();
    currentGame = null;
    
    // Update navigation to show home as active
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
            link.classList.add('active');
        }
    });
}

function hideAllGames() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
}

function showLevelSelect(gameType) {
    const levelSelect = document.getElementById(`${gameType}-level-select`);
    const gamePlay = document.getElementById(`${gameType}-game-play`);
    
    if (levelSelect && gamePlay) {
        levelSelect.style.display = 'block';
        gamePlay.style.display = 'none';
    }
}

function showGamePlay(gameType) {
    const levelSelect = document.getElementById(`${gameType}-level-select`);
    const gamePlay = document.getElementById(`${gameType}-game-play`);
    
    if (levelSelect && gamePlay) {
        levelSelect.style.display = 'none';
        gamePlay.style.display = 'block';
    }
}

// Unlock All Levels Function
function unlockAllLevels() {
    // Remove any locked states and make all level buttons accessible
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('locked');
        btn.classList.add('unlocked');
        btn.disabled = false;
        
        // Remove any lock icons
        const lockIcon = btn.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.remove();
        }
    });
}

// Game Initialization
function initializeAllGames() {
    initializeBrainTeasers();
    initializeWordScramble();
    initializeSnakeGame();
    initializeKnowledgeQuiz();
    initializeMathQuiz();
}

// Brain Teasers Game
function initializeBrainTeasers() {
    const levelButtons = document.querySelectorAll('#brain-teasers-game .level-btn');
    
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            startBrainTeasers(level);
        });
    });
    
    // Answer submission
    const submitBtn = document.getElementById('brain-submit-btn');
    const answerInput = document.getElementById('brain-answer-input');
    
    if (submitBtn && answerInput) {
        submitBtn.addEventListener('click', submitBrainAnswer);
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitBrainAnswer();
            }
        });
    }
    
    // Hint button
    const hintBtn = document.getElementById('brain-hint-btn');
    if (hintBtn) {
        hintBtn.addEventListener('click', showBrainHint);
    }
    
    // Skip button
    const skipBtn = document.getElementById('brain-skip-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', skipBrainQuestion);
    }
}

function startBrainTeasers(level) {
    gameStates.brainTeasers.currentLevel = level;
    gameStates.brainTeasers.score = 0;
    gameStates.brainTeasers.hints = 3;
    gameStates.brainTeasers.currentQuestion = 0;
    
    // Generate questions based on level
    generateBrainTeaserQuestions(level);
    
    showGamePlay('brain-teasers');
    updateBrainTeaserStats();
    showNextBrainQuestion();
    
    // Start timer for rapid fire level
    if (level === 5) {
        startBrainTimer();
    }
}

function generateBrainTeaserQuestions(level) {
    const questions = {
        1: [ // Riddles
            {
                question: "What has keys but no locks, space but no room, and you can enter but not go inside?",
                answer: "keyboard",
                hint: "You're probably using one right now to type!"
            },
            {
                question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
                answer: "fire",
                hint: "It's hot and bright!"
            },
            {
                question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
                answer: "m",
                hint: "Look at the letters in the words!"
            },
            {
                question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
                answer: "map",
                hint: "You use this to find your way!"
            },
            {
                question: "What gets wetter the more it dries?",
                answer: "towel",
                hint: "You use this after a shower!"
            }
        ],
        2: [ // Math Puzzles
            {
                question: "If you have 3 apples and you take away 2, how many do you have?",
                answer: "2",
                hint: "Think about what 'you take away' means!"
            },
            {
                question: "What is the next number in this sequence: 2, 4, 8, 16, ?",
                answer: "32",
                hint: "Each number is double the previous one!"
            },
            {
                question: "A farmer has 17 sheep. All but 9 die. How many are left?",
                answer: "9",
                hint: "Read carefully - 'all but 9' means 9 remain!"
            },
            {
                question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
                answer: "5",
                hint: "Think about how long each machine takes!"
            },
            {
                question: "What is half of 2 + 2?",
                answer: "3",
                hint: "Follow the order of operations!"
            }
        ],
        3: [ // Pattern Recognition
            {
                question: "Complete the pattern: A, C, E, G, ?",
                answer: "I",
                hint: "Skip one letter each time!"
            },
            {
                question: "What comes next: 1, 1, 2, 3, 5, 8, ?",
                answer: "13",
                hint: "Add the two previous numbers!"
            },
            {
                question: "Complete: Red, Orange, Yellow, Green, ?",
                answer: "Blue",
                hint: "Think about the colors of the rainbow!"
            },
            {
                question: "What's next: Monday, Wednesday, Friday, ?",
                answer: "Sunday",
                hint: "Skip one day each time!"
            },
            {
                question: "Complete: 1, 4, 9, 16, ?",
                answer: "25",
                hint: "These are perfect squares!"
            }
        ],
        4: [ // Rebus Puzzles
            {
                question: "What does this mean: STAND I",
                answer: "I understand",
                hint: "I is under STAND!"
            },
            {
                question: "What does this represent: R E A D I N G",
                answer: "Reading between the lines",
                hint: "Look at the spacing!"
            },
            {
                question: "Decode: NOON GOOD",
                answer: "Good afternoon",
                hint: "NOON = afternoon!"
            },
            {
                question: "What does this mean: T_RN",
                answer: "U-turn",
                hint: "What letter is missing?"
            },
            {
                question: "Solve: HEAD HEELS",
                answer: "Head over heels",
                hint: "HEAD is over HEELS!"
            }
        ],
        5: [ // Rapid Fire Mix
            {
                question: "What has 13 hearts but no other organs?",
                answer: "deck of cards",
                hint: "Think about card games!"
            },
            {
                question: "If 2 + 2 = 4, and 3 + 3 = 6, what is 4 + 4?",
                answer: "8",
                hint: "Simple addition!"
            },
            {
                question: "What word becomes shorter when you add two letters to it?",
                answer: "short",
                hint: "Add 'er' to make it 'shorter'!"
            },
            {
                question: "Complete: Sun, Moon, ?",
                answer: "Stars",
                hint: "Things you see in the sky!"
            },
            {
                question: "What goes up but never comes down?",
                answer: "age",
                hint: "It increases every year!"
            }
        ]
    };
    
    gameStates.brainTeasers.questions = questions[level] || questions[1];
}

function showNextBrainQuestion() {
    const state = gameStates.brainTeasers;
    
    if (state.currentQuestion >= state.questions.length) {
        completeBrainTeasers();
        return;
    }
    
    const question = state.questions[state.currentQuestion];
    const questionText = document.getElementById('brain-question-text');
    const answerInput = document.getElementById('brain-answer-input');
    const feedback = document.getElementById('brain-feedback');
    
    if (questionText) {
        questionText.textContent = question.question;
        speak(question.question);
    }
    
    if (answerInput) {
        answerInput.value = '';
        answerInput.focus();
    }
    
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
}

function submitBrainAnswer() {
    const state = gameStates.brainTeasers;
    const answerInput = document.getElementById('brain-answer-input');
    const feedback = document.getElementById('brain-feedback');
    
    if (!answerInput || !feedback) return;
    
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = state.questions[state.currentQuestion].answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        state.score += 10;
        feedback.textContent = 'Correct! Well done!';
        feedback.className = 'feedback correct';
        speak('Correct! Well done!');
        
        setTimeout(() => {
            state.currentQuestion++;
            showNextBrainQuestion();
            updateBrainTeaserStats();
        }, 2000);
    } else {
        feedback.textContent = `Incorrect. The answer was: ${state.questions[state.currentQuestion].answer}`;
        feedback.className = 'feedback incorrect';
        speak('Incorrect. Try the next question!');
        
        setTimeout(() => {
            state.currentQuestion++;
            showNextBrainQuestion();
            updateBrainTeaserStats();
        }, 3000);
    }
    
    saveGameProgress();
}

function showBrainHint() {
    const state = gameStates.brainTeasers;
    const feedback = document.getElementById('brain-feedback');
    
    if (state.hints > 0 && feedback) {
        state.hints--;
        const hint = state.questions[state.currentQuestion].hint;
        feedback.textContent = `Hint: ${hint}`;
        feedback.className = 'feedback hint';
        speak(`Hint: ${hint}`);
        updateBrainTeaserStats();
        saveGameProgress();
    }
}

function skipBrainQuestion() {
    const state = gameStates.brainTeasers;
    const feedback = document.getElementById('brain-feedback');
    
    if (feedback) {
        feedback.textContent = `Skipped. The answer was: ${state.questions[state.currentQuestion].answer}`;
        feedback.className = 'feedback incorrect';
    }
    
    setTimeout(() => {
        state.currentQuestion++;
        showNextBrainQuestion();
        updateBrainTeaserStats();
    }, 2000);
}

function updateBrainTeaserStats() {
    const state = gameStates.brainTeasers;
    
    const levelSpan = document.getElementById('brain-current-level');
    const scoreSpan = document.getElementById('brain-score');
    const hintsSpan = document.getElementById('brain-hints');
    
    if (levelSpan) levelSpan.textContent = state.currentLevel;
    if (scoreSpan) scoreSpan.textContent = state.score;
    if (hintsSpan) hintsSpan.textContent = state.hints;
}

function startBrainTimer() {
    const state = gameStates.brainTeasers;
    const timerDiv = document.getElementById('brain-timer');
    const timeSpan = document.getElementById('brain-time');
    
    if (timerDiv) timerDiv.style.display = 'block';
    
    state.timer = setInterval(() => {
        state.timeLeft--;
        if (timeSpan) timeSpan.textContent = state.timeLeft;
        
        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            completeBrainTeasers();
        }
    }, 1000);
}

function completeBrainTeasers() {
    const state = gameStates.brainTeasers;
    
    if (state.timer) {
        clearInterval(state.timer);
    }
    
    const feedback = document.getElementById('brain-feedback');
    if (feedback) {
        feedback.textContent = `Level Complete! Final Score: ${state.score}`;
        feedback.className = 'feedback correct';
        speak(`Level Complete! Your final score is ${state.score} points!`);
    }
    
    saveGameProgress();
}

// Word Scramble Game
function initializeWordScramble() {
    const levelButtons = document.querySelectorAll('#word-scramble-game .level-btn');
    
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            startWordScramble(level);
        });
    });
    
    // Word submission
    const submitBtn = document.getElementById('word-submit-btn');
    const wordInput = document.getElementById('word-input');
    
    if (submitBtn && wordInput) {
        submitBtn.addEventListener('click', submitWord);
        wordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitWord();
            }
        });
    }
    
    // Action buttons
    const hintBtn = document.getElementById('word-hint-btn');
    const speakBtn = document.getElementById('word-speak-btn');
    const shuffleBtn = document.getElementById('word-shuffle-btn');
    
    if (hintBtn) hintBtn.addEventListener('click', showWordHint);
    if (speakBtn) speakBtn.addEventListener('click', speakCurrentWord);
    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleLetters);
}

function startWordScramble(level) {
    gameStates.wordScramble.currentLevel = level;
    gameStates.wordScramble.score = 0;
    gameStates.wordScramble.currentWord = 0;
    
    generateWordScrambleWords(level);
    showGamePlay('word-scramble');
    updateWordScrambleStats();
    showNextWord();
}

function generateWordScrambleWords(level) {
    const wordSets = {
        1: ['BOOK', 'GAME', 'PLAY', 'JUMP', 'SING', 'DRAW', 'READ', 'WALK', 'TALK', 'HELP'],
        2: ['HAPPY', 'LEARN', 'THINK', 'WRITE', 'SMILE', 'DANCE', 'LAUGH', 'STUDY', 'TEACH', 'SHARE'],
        3: ['FRIEND', 'SCHOOL', 'FAMILY', 'GARDEN', 'ANIMAL', 'PLANET', 'NATURE', 'WONDER', 'BRIGHT', 'STRONG'],
        4: ['SCIENCE', 'HISTORY', 'LIBRARY', 'STUDENT', 'TEACHER', 'EXPLORE', 'JOURNEY', 'AMAZING', 'CREATIVE', 'AWESOME'],
        5: ['EDUCATION', 'KNOWLEDGE', 'ADVENTURE', 'DISCOVERY', 'WONDERFUL', 'FANTASTIC', 'BRILLIANT', 'EXCELLENT', 'MARVELOUS', 'INCREDIBLE']
    };
    
    gameStates.wordScramble.words = wordSets[level] || wordSets[1];
}

function showNextWord() {
    const state = gameStates.wordScramble;
    
    if (state.currentWord >= state.words.length) {
        completeWordScramble();
        return;
    }
    
    const word = state.words[state.currentWord];
    const scrambledDiv = document.getElementById('scrambled-word');
    const wordInput = document.getElementById('word-input');
    const feedback = document.getElementById('word-feedback');
    
    // Store the current word for reference
    state.currentWordText = word;
    
    // Create scrambled version
    const scrambled = scrambleWord(word);
    displayScrambledWord(scrambled);
    
    if (wordInput) {
        wordInput.value = '';
        wordInput.maxLength = word.length;
        wordInput.focus();
    }
    
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
}

function scrambleWord(word) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
}

function displayScrambledWord(scrambled) {
    const scrambledDiv = document.getElementById('scrambled-word');
    if (!scrambledDiv) return;
    
    scrambledDiv.innerHTML = '';
    
    for (let letter of scrambled) {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.textContent = letter;
        scrambledDiv.appendChild(letterDiv);
    }
}

function submitWord() {
    const state = gameStates.wordScramble;
    const wordInput = document.getElementById('word-input');
    const feedback = document.getElementById('word-feedback');
    
    if (!wordInput || !feedback) return;
    
    const userAnswer = wordInput.value.trim().toUpperCase();
    const correctAnswer = state.currentWordText;
    
    if (userAnswer === correctAnswer) {
        state.score += 10;
        feedback.textContent = 'Correct! Well done!';
        feedback.className = 'feedback correct';
        speak(`Correct! The word was ${correctAnswer}`);
        
        setTimeout(() => {
            state.currentWord++;
            showNextWord();
            updateWordScrambleStats();
        }, 2000);
    } else {
        feedback.textContent = `Incorrect. The word was: ${correctAnswer}`;
        feedback.className = 'feedback incorrect';
        speak(`Incorrect. The word was ${correctAnswer}`);
        
        setTimeout(() => {
            state.currentWord++;
            showNextWord();
            updateWordScrambleStats();
        }, 3000);
    }
    
    saveGameProgress();
}

function showWordHint() {
    const state = gameStates.wordScramble;
    const feedback = document.getElementById('word-feedback');
    
    if (feedback) {
        const word = state.currentWordText;
        const hint = `The word starts with "${word[0]}" and has ${word.length} letters.`;
        feedback.textContent = `Hint: ${hint}`;
        feedback.className = 'feedback hint';
        speak(hint);
    }
}

function speakCurrentWord() {
    const state = gameStates.wordScramble;
    speak(`The correct word is ${state.currentWordText}`);
}

function shuffleLetters() {
    const state = gameStates.wordScramble;
    const scrambled = scrambleWord(state.currentWordText);
    displayScrambledWord(scrambled);
}

function updateWordScrambleStats() {
    const state = gameStates.wordScramble;
    
    const levelSpan = document.getElementById('word-current-level');
    const scoreSpan = document.getElementById('word-score');
    const progressSpan = document.getElementById('word-progress');
    
    if (levelSpan) levelSpan.textContent = state.currentLevel;
    if (scoreSpan) scoreSpan.textContent = state.score;
    if (progressSpan) progressSpan.textContent = `${state.currentWord}/${state.totalWords}`;
}

function completeWordScramble() {
    const state = gameStates.wordScramble;
    const feedback = document.getElementById('word-feedback');
    
    if (feedback) {
        feedback.textContent = `Level Complete! Final Score: ${state.score}`;
        feedback.className = 'feedback correct';
        speak(`Level Complete! Your final score is ${state.score} points!`);
    }
    
    saveGameProgress();
}

// Snake Game
function initializeSnakeGame() {
    const levelButtons = document.querySelectorAll('#snake-game .level-btn');
    
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            startSnakeGame(level);
        });
    });
    
    // Touch controls for mobile
    const touchButtons = document.querySelectorAll('.touch-btn');
    touchButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const direction = this.getAttribute('data-direction');
            changeSnakeDirection(direction);
        });
    });
}

function startSnakeGame(level) {
    const state = gameStates.snake;
    state.currentLevel = level;
    state.score = 0;
    state.snake = [{x: 10, y: 10}];
    state.direction = 'right';
    state.gameRunning = true;
    
    // Load high score
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
        state.highScore = parseInt(savedHighScore);
    }
    
    showGamePlay('snake');
    initializeSnakeCanvas();
    updateSnakeStats();
    generateFood();
    startSnakeGameLoop(level);
    
    // Add keyboard controls
    document.addEventListener('keydown', handleSnakeKeyPress);
}

function initializeSnakeCanvas() {
    const canvas = document.getElementById('snake-canvas');
    if (!canvas) return;
    
    const state = gameStates.snake;
    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');
    
    // Set canvas size based on level
    const size = state.currentLevel <= 2 ? 400 : 350;
    canvas.width = size;
    canvas.height = size;
}

function startSnakeGameLoop(level) {
    const speeds = {1: 200, 2: 150, 3: 120, 4: 100, 5: 80};
    const speed = speeds[level] || 150;
    
    gameStates.snake.gameLoop = setInterval(() => {
        if (gameStates.snake.gameRunning) {
            updateSnake();
            drawSnake();
        }
    }, speed);
}

function updateSnake() {
    const state = gameStates.snake;
    const head = {...state.snake[0]};
    
    // Move head based on direction
    switch(state.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check wall collision
    const gridWidth = state.canvas.width / state.gridSize;
    const gridHeight = state.canvas.height / state.gridSize;
    
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        gameOverSnake();
        return;
    }
    
    // Check self collision
    if (state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOverSnake();
        return;
    }
    
    state.snake.unshift(head);
    
    // Check food collision
    if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10;
        generateFood();
        updateSnakeStats();
        
        // Check for high score
        if (state.score > state.highScore) {
            state.highScore = state.score;
            localStorage.setItem('snakeHighScore', state.highScore.toString());
        }
    } else {
        state.snake.pop();
    }
}

function drawSnake() {
    const state = gameStates.snake;
    const ctx = state.ctx;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= state.canvas.width; i += state.gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, state.canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= state.canvas.height; i += state.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(state.canvas.width, i);
        ctx.stroke();
    }
    
    // Draw snake
    state.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00f0ff' : '#bc00ff';
        ctx.fillRect(
            segment.x * state.gridSize + 1,
            segment.y * state.gridSize + 1,
            state.gridSize - 2,
            state.gridSize - 2
        );
        
        // Add glow effect
        ctx.shadowColor = index === 0 ? '#00f0ff' : '#bc00ff';
        ctx.shadowBlur = 10;
        ctx.fillRect(
            segment.x * state.gridSize + 1,
            segment.y * state.gridSize + 1,
            state.gridSize - 2,
            state.gridSize - 2
        );
        ctx.shadowBlur = 0;
    });
    
    // Draw food
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fillRect(
        state.food.x * state.gridSize + 2,
        state.food.y * state.gridSize + 2,
        state.gridSize - 4,
        state.gridSize - 4
    );
    ctx.shadowBlur = 0;
}

function generateFood() {
    const state = gameStates.snake;
    const gridWidth = state.canvas.width / state.gridSize;
    const gridHeight = state.canvas.height / state.gridSize;
    
    do {
        state.food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (state.snake.some(segment => segment.x === state.food.x && segment.y === state.food.y));
}

function handleSnakeKeyPress(e) {
    const state = gameStates.snake;
    if (!state.gameRunning) return;
    
    const key = e.key.toLowerCase();
    let newDirection = state.direction;
    
    switch(key) {
        case 'arrowup':
        case 'w':
            if (state.direction !== 'down') newDirection = 'up';
            break;
        case 'arrowdown':
        case 's':
            if (state.direction !== 'up') newDirection = 'down';
            break;
        case 'arrowleft':
        case 'a':
            if (state.direction !== 'right') newDirection = 'left';
            break;
        case 'arrowright':
        case 'd':
            if (state.direction !== 'left') newDirection = 'right';
            break;
    }
    
    state.direction = newDirection;
    e.preventDefault();
}

function changeSnakeDirection(direction) {
    const state = gameStates.snake;
    if (!state.gameRunning) return;
    
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    
    if (state.direction !== opposites[direction]) {
        state.direction = direction;
    }
}

function updateSnakeStats() {
    const state = gameStates.snake;
    
    const levelSpan = document.getElementById('snake-current-level');
    const scoreSpan = document.getElementById('snake-score');
    const highScoreSpan = document.getElementById('snake-high-score');
    const lengthSpan = document.getElementById('snake-length');
    
    if (levelSpan) levelSpan.textContent = state.currentLevel;
    if (scoreSpan) scoreSpan.textContent = state.score;
    if (highScoreSpan) highScoreSpan.textContent = state.highScore;
    if (lengthSpan) lengthSpan.textContent = state.snake.length;
}

function gameOverSnake() {
    const state = gameStates.snake;
    state.gameRunning = false;
    
    if (state.gameLoop) {
        clearInterval(state.gameLoop);
    }
    
    document.removeEventListener('keydown', handleSnakeKeyPress);
    
    // Show game over message
    const ctx = state.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', state.canvas.width / 2, state.canvas.height / 2 - 20);
    ctx.fillText(`Score: ${state.score}`, state.canvas.width / 2, state.canvas.height / 2 + 20);
    
    speak(`Game Over! Your final score is ${state.score}`);
    saveGameProgress();
}

// Knowledge Quiz Game
function initializeKnowledgeQuiz() {
    const levelButtons = document.querySelectorAll('#knowledge-quiz-game .level-btn');
    
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            startKnowledgeQuiz(level);
        });
    });
    
    // Option selection
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quiz-option')) {
            selectQuizOption(e.target);
        }
    });
}

function startKnowledgeQuiz(level) {
    gameStates.knowledgeQuiz.currentLevel = level;
    gameStates.knowledgeQuiz.score = 0;
    gameStates.knowledgeQuiz.currentQuestion = 0;
    gameStates.knowledgeQuiz.streak = 0;
    
    generateKnowledgeQuestions(level);
    showGamePlay('knowledge-quiz');
    updateKnowledgeQuizStats();
    showNextKnowledgeQuestion();
}

function generateKnowledgeQuestions(level) {
    const questionSets = {
        1: [ // Science
            {
                question: "What is the largest planet in our solar system?",
                options: ["Earth", "Jupiter", "Saturn", "Mars"],
                correct: 1
            },
            {
                question: "What gas do plants absorb from the atmosphere?",
                options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                correct: 2
            },
            {
                question: "How many bones are in an adult human body?",
                options: ["106", "206", "306", "406"],
                correct: 1
            },
            {
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "NaCl", "O2"],
                correct: 0
            },
            {
                question: "Which organ pumps blood through the human body?",
                options: ["Brain", "Lungs", "Heart", "Liver"],
                correct: 2
            }
        ],
        2: [ // Technology
            {
                question: "What does 'WWW' stand for?",
                options: ["World Wide Web", "World Wide Wire", "Web Wide World", "Wide World Web"],
                correct: 0
            },
            {
                question: "Who founded Microsoft?",
                options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"],
                correct: 1
            },
            {
                question: "What does 'CPU' stand for?",
                options: ["Computer Processing Unit", "Central Processing Unit", "Central Program Unit", "Computer Program Unit"],
                correct: 1
            },
            {
                question: "Which company created the iPhone?",
                options: ["Samsung", "Google", "Apple", "Microsoft"],
                correct: 2
            },
            {
                question: "What does 'AI' stand for?",
                options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Intelligence", "Applied Intelligence"],
                correct: 1
            }
        ],
        3: [ // History
            {
                question: "In which year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1
            },
            {
                question: "Who was the first person to walk on the moon?",
                options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
                correct: 1
            },
            {
                question: "Which ancient wonder of the world was located in Egypt?",
                options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid", "Lighthouse of Alexandria"],
                correct: 2
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                correct: 2
            },
            {
                question: "In which year did India gain independence?",
                options: ["1946", "1947", "1948", "1949"],
                correct: 1
            }
        ],
        4: [ // Geography
            {
                question: "What is the capital of Australia?",
                options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                correct: 2
            },
            {
                question: "Which is the longest river in the world?",
                options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
                correct: 1
            },
            {
                question: "How many continents are there?",
                options: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "Which country has the most time zones?",
                options: ["Russia", "USA", "China", "Canada"],
                correct: 0
            },
            {
                question: "What is the smallest country in the world?",
                options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
                correct: 1
            }
        ],
        5: [ // Mixed Expert
            {
                question: "What is the speed of light in vacuum?",
                options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                correct: 0
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correct: 1
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Platinum"],
                correct: 2
            },
            {
                question: "Which planet is known as the 'Red Planet'?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                correct: 3
            }
        ]
    };
    
    gameStates.knowledgeQuiz.questions = questionSets[level] || questionSets[1];
}

function showNextKnowledgeQuestion() {
    const state = gameStates.knowledgeQuiz;
    
    if (state.currentQuestion >= state.questions.length) {
        completeKnowledgeQuiz();
        return;
    }
    
    const question = state.questions[state.currentQuestion];
    const questionText = document.getElementById('knowledge-question-text');
    const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
    const feedback = document.getElementById('knowledge-feedback');
    
    if (questionText) {
        questionText.textContent = question.question;
        speak(question.question);
    }
    
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.classList.remove('selected', 'correct', 'incorrect');
        option.disabled = false;
    });
    
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
}

function selectQuizOption(optionElement) {
    const state = gameStates.knowledgeQuiz;
    const options = document.querySelectorAll('#knowledge-quiz-game .quiz-option');
    const selectedIndex = Array.from(options).indexOf(optionElement);
    const question = state.questions[state.currentQuestion];
    const feedback = document.getElementById('knowledge-feedback');
    
    // Disable all options
    options.forEach(option => option.disabled = true);
    
    // Show correct answer
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === question.correct) {
        state.score += 10;
        state.streak++;
        feedback.textContent = `Correct! Streak: ${state.streak}`;
        feedback.className = 'feedback correct';
        speak('Correct!');
    } else {
        state.streak = 0;
        feedback.textContent = `Incorrect. The correct answer was: ${question.options[question.correct]}`;
        feedback.className = 'feedback incorrect';
        speak('Incorrect.');
    }
    
    setTimeout(() => {
        state.currentQuestion++;
        showNextKnowledgeQuestion();
        updateKnowledgeQuizStats();
    }, 3000);
    
    saveGameProgress();
}

function updateKnowledgeQuizStats() {
    const state = gameStates.knowledgeQuiz;
    
    const levelSpan = document.getElementById('knowledge-current-level');
    const scoreSpan = document.getElementById('knowledge-score');
    const progressSpan = document.getElementById('knowledge-progress');
    const streakSpan = document.getElementById('knowledge-streak');
    
    if (levelSpan) levelSpan.textContent = state.currentLevel;
    if (scoreSpan) scoreSpan.textContent = state.score;
    if (progressSpan) progressSpan.textContent = `${state.currentQuestion}/${state.totalQuestions}`;
    if (streakSpan) streakSpan.textContent = state.streak;
}

function completeKnowledgeQuiz() {
    const state = gameStates.knowledgeQuiz;
    const feedback = document.getElementById('knowledge-feedback');
    
    if (feedback) {
        feedback.textContent = `Quiz Complete! Final Score: ${state.score}`;
        feedback.className = 'feedback correct';
        speak(`Quiz Complete! Your final score is ${state.score} points!`);
    }
    
    saveGameProgress();
}

// Math Quiz Game
function initializeMathQuiz() {
    const levelButtons = document.querySelectorAll('#math-quiz-game .level-btn');
    
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.getAttribute('data-level'));
            startMathQuiz(level);
        });
    });
    
    // Answer submission
    const submitBtn = document.getElementById('math-submit-btn');
    const answerInput = document.getElementById('math-answer-input');
    
    if (submitBtn && answerInput) {
        submitBtn.addEventListener('click', submitMathAnswer);
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitMathAnswer();
            }
        });
    }
    
    // Action buttons
    const hintBtn = document.getElementById('math-hint-btn');
    const speakBtn = document.getElementById('math-speak-btn');
    
    if (hintBtn) hintBtn.addEventListener('click', showMathHint);
    if (speakBtn) speakBtn.addEventListener('click', speakMathQuestion);
}

function startMathQuiz(level) {
    gameStates.mathQuiz.currentLevel = level;
    gameStates.mathQuiz.score = 0;
    gameStates.mathQuiz.currentQuestion = 0;
    gameStates.mathQuiz.hints = 5;
    
    generateMathQuestions(level);
    showGamePlay('math-quiz');
    updateMathQuizStats();
    showNextMathQuestion();
}

function generateMathQuestions(level) {
    const questions = [];
    
    for (let i = 0; i < 10; i++) {
        let question;
        
        switch(level) {
            case 1: // Addition
                question = generateAdditionQuestion();
                break;
            case 2: // Subtraction
                question = generateSubtractionQuestion();
                break;
            case 3: // Multiplication
                question = generateMultiplicationQuestion();
                break;
            case 4: // Division
                question = generateDivisionQuestion();
                break;
            case 5: // Mixed
                const operations = [
                    generateAdditionQuestion,
                    generateSubtractionQuestion,
                    generateMultiplicationQuestion,
                    generateDivisionQuestion
                ];
                question = operations[Math.floor(Math.random() * operations.length)]();
                break;
            default:
                question = generateAdditionQuestion();
        }
        
        questions.push(question);
    }
    
    gameStates.mathQuiz.questions = questions;
}

function generateAdditionQuestion() {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    return {
        question: `${a} + ${b} = ?`,
        answer: a + b,
        hint: `Break it down: ${a} + ${b}`
    };
}

function generateSubtractionQuestion() {
    const a = Math.floor(Math.random() * 50) + 25;
    const b = Math.floor(Math.random() * 25) + 1;
    return {
        question: `${a} - ${b} = ?`,
        answer: a - b,
        hint: `Think: ${a} take away ${b}`
    };
}

function generateMultiplicationQuestion() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    return {
        question: `${a} × ${b} = ?`,
        answer: a * b,
        hint: `Remember your times tables: ${a} times ${b}`
    };
}

function generateDivisionQuestion() {
    const b = Math.floor(Math.random() * 10) + 2;
    const answer = Math.floor(Math.random() * 10) + 1;
    const a = b * answer;
    return {
        question: `${a} ÷ ${b} = ?`,
        answer: answer,
        hint: `How many ${b}s go into ${a}?`
    };
}

function showNextMathQuestion() {
    const state = gameStates.mathQuiz;
    
    if (state.currentQuestion >= state.questions.length) {
        completeMathQuiz();
        return;
    }
    
    const question = state.questions[state.currentQuestion];
    const questionText = document.getElementById('math-question-text');
    const answerInput = document.getElementById('math-answer-input');
    const feedback = document.getElementById('math-feedback');
    
    if (questionText) {
        questionText.textContent = question.question;
        speak(question.question);
    }
    
    if (answerInput) {
        answerInput.value = '';
        answerInput.focus();
    }
    
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
}

function submitMathAnswer() {
    const state = gameStates.mathQuiz;
    const answerInput = document.getElementById('math-answer-input');
    const feedback = document.getElementById('math-feedback');
    
    if (!answerInput || !feedback) return;
    
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = state.questions[state.currentQuestion].answer;
    
    if (userAnswer === correctAnswer) {
        state.score += 10;
        feedback.textContent = 'Correct! Well done!';
        feedback.className = 'feedback correct';
        speak('Correct! Well done!');
        
        setTimeout(() => {
            state.currentQuestion++;
            showNextMathQuestion();
            updateMathQuizStats();
        }, 2000);
    } else {
        feedback.textContent = `Incorrect. The answer was: ${correctAnswer}`;
        feedback.className = 'feedback incorrect';
        speak(`Incorrect. The answer was ${correctAnswer}`);
        
        setTimeout(() => {
            state.currentQuestion++;
            showNextMathQuestion();
            updateMathQuizStats();
        }, 3000);
    }
    
    saveGameProgress();
}

function showMathHint() {
    const state = gameStates.mathQuiz;
    const feedback = document.getElementById('math-feedback');
    
    if (state.hints > 0 && feedback) {
        state.hints--;
        const hint = state.questions[state.currentQuestion].hint;
        feedback.textContent = `Hint: ${hint}`;
        feedback.className = 'feedback hint';
        speak(`Hint: ${hint}`);
        updateMathQuizStats();
        saveGameProgress();
    }
}

function speakMathQuestion() {
    const state = gameStates.mathQuiz;
    const question = state.questions[state.currentQuestion].question;
    speak(question);
}

function updateMathQuizStats() {
    const state = gameStates.mathQuiz;
    
    const levelSpan = document.getElementById('math-current-level');
    const scoreSpan = document.getElementById('math-score');
    const progressSpan = document.getElementById('math-progress');
    const hintsSpan = document.getElementById('math-hints');
    
    if (levelSpan) levelSpan.textContent = state.currentLevel;
    if (scoreSpan) scoreSpan.textContent = state.score;
    if (progressSpan) progressSpan.textContent = `${state.currentQuestion}/${state.totalQuestions}`;
    if (hintsSpan) hintsSpan.textContent = state.hints;
}

function completeMathQuiz() {
    const state = gameStates.mathQuiz;
    const feedback = document.getElementById('math-feedback');
    
    if (feedback) {
        feedback.textContent = `Quiz Complete! Final Score: ${state.score}`;
        feedback.className = 'feedback correct';
        speak(`Quiz Complete! Your final score is ${state.score} points!`);
    }
    
    saveGameProgress();
}

// Game Management Functions
function restartGame(gameType) {
    // Stop any running timers or loops
    const state = gameStates[gameType];
    
    if (gameType === 'brainTeasers' && state.timer) {
        clearInterval(state.timer);
        state.timer = null;
        state.timeLeft = 60;
    }
    
    if (gameType === 'snake' && state.gameLoop) {
        clearInterval(state.gameLoop);
        state.gameLoop = null;
        state.gameRunning = false;
        document.removeEventListener('keydown', handleSnakeKeyPress);
    }
    
    // Reset game state
    Object.assign(state, {
        score: 0,
        currentQuestion: 0,
        currentWord: 0,
        hints: gameType === 'mathQuiz' ? 5 : 3,
        streak: 0
    });
    
    // Show level select
    showLevelSelect(gameType);
    
    // Clear any feedback
    const feedback = document.getElementById(`${gameType}-feedback`);
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
}

// Utility Functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Game Error:', e.error);
    // Optionally show user-friendly error message
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    // Save progress
    saveGameProgress();
    
    // Clean up any running intervals
    Object.values(gameStates).forEach(state => {
        if (state.timer) clearInterval(state.timer);
        if (state.gameLoop) clearInterval(state.gameLoop);
    });
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC key to go back/home
    if (e.key === 'Escape') {
        if (currentGame) {
            showHome();
        }
    }
});

// Initialize tooltips and help text
function initializeAccessibility() {
    // Add ARIA labels and descriptions where needed
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent) {
            button.setAttribute('aria-label', button.textContent);
        }
    });
}

// Call accessibility initialization
document.addEventListener('DOMContentLoaded', initializeAccessibility);