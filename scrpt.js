var wordList = [
    { 
        id: "w1",
        word: "arduous", 
        def: "demanding sustained effort", 
        root: "from Latin arduus (steep, difficult)", 
        tr: "çetin, zorlu",
        sentence: "Preparing for the SAT is an arduous process.",
        week: 1
    },
    { 
        id: "w2",
        word: "candid", 
        def: "honest and direct", 
        root: "from Latin candidus (white, bright)", 
        tr: "samimi, içten",
        sentence: "She gave a candid opinion about the proposal.",
        week: 1 
    },
    { 
        id: "w3",
        word: "concise", 
        def: "brief and to the point", 
        root: "from Latin concisus (cut short)", 
        tr: "öz, kısa ve net",
        sentence: "His essay was short and concise.",
        week: 1 
    },
    { 
        id: "w4",
        word: "lucid", 
        def: "clear, easy to follow", 
        root: "from Latin lucidus (light, clear)", 
        tr: "açık, anlaşılır",
        sentence: "The teacher gave a lucid explanation.",
        week: 2 
    },
    { 
        id: "w5",
        word: "subtle", 
        def: "delicate, not obvious", 
        root: "from Latin subtilis (fine-woven)", 
        tr: "ince, göze çarpmayan",
        sentence: "There is a subtle difference between these two words.",
        week: 2 
    }
];

var masteredWords = loadProgress();

function loadProgress() {
    var saved = localStorage.getItem("sat_mastered_words");
    return saved ? JSON.parse(saved) : [];
}

function saveProgress() {
    localStorage.setItem("sat_mastered_words", JSON.stringify(masteredWords));
}

function speakWord(wordText, event) {
    event.stopPropagation();
    if ('speechSynthesis' in window) {
        var utterance = new SpeechSynthesisUtterance(wordText);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
}

function shuffleWords() {
    for (var i = wordList.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = wordList[i];
        wordList[i] = wordList[j];
        wordList[j] = temp;
    }
    renderWords();
}

function toggleMastered(wordId, event) {
    event.stopPropagation();
    
    var index = masteredWords.indexOf(wordId);
    if (index === -1) {
        masteredWords.push(wordId);
        launchConfetti(event.clientX, event.clientY);
    } else {
        masteredWords.splice(index, 1);
    }

    saveProgress();
    renderWords();
    updateStats();
}

function launchConfetti(originX, originY) {
    var colors = ["#2e7d32", "#ffd700", "#2b3a55", "#e74c3c", "#3498db"];
    var pieceCount = 18;

    for (var i = 0; i < pieceCount; i++) {
        var piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = originX + "px";
        piece.style.top = originY + "px";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        var xEnd = (Math.random() - 0.5) * 200;
        var yEnd = Math.random() * 150 + 80;
        var rotEnd = Math.random() * 360;

        piece.style.setProperty("--x-end", xEnd + "px");
        piece.style.setProperty("--y-end", yEnd + "px");
        piece.style.setProperty("--rot-end", rotEnd + "deg");

        document.body.appendChild(piece);

        (function (el) {
            setTimeout(function () {
                el.remove();
            }, 1200);
        })(piece);
    }
}

function populateWeekFilter() {
    var select = document.getElementById("weekFilter");
    if (!select) return;

    var weeks = [];

    for (var i = 0; i < wordList.length; i++) {
        var w = wordList[i].week;
        if (weeks.indexOf(w) === -1) {
            weeks.push(w);
        }
    }

    weeks.sort(function (a, b) {
        return a - b;
    });

    select.innerHTML = '<option value="all">All Weeks</option>';

    for (var j = 0; j < weeks.length; j++) {
        select.innerHTML += '<option value="' + weeks[j] + '">Week ' + weeks[j] + '</option>';
    }
}

function resetProgress() {
    var confirmed = confirm("Are you sure you want to reset all your progress? This cannot be undone.");
    if (confirmed) {
        masteredWords = [];
        saveProgress();
        renderWords();
        updateStats();
    }
}

function updateStats() {
    var total = wordList.length;
    var count = masteredWords.length;
    var percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    document.getElementById("progressText").innerText = count + " / " + total + " Words Mastered";
    document.getElementById("progressPercent").innerText = percentage + "%";
    document.getElementById("progressBarFill").style.width = percentage + "%";
}

function renderWords() {
    var grid = document.getElementById("wordGrid");
    var selectedWeek = document.getElementById("weekFilter").value;
    var searchQuery = document.getElementById("searchInput").value.toLowerCase();
    
    grid.innerHTML = "";

    var matchCount = 0;

    for (var i = 0; i < wordList.length; i++) {
        var item = wordList[i];
        var isMastered = masteredWords.includes(item.id);
        
        var matchesWeek = (selectedWeek === "all" || item.week == selectedWeek);
        var matchesSearch = item.word.toLowerCase().includes(searchQuery) || 
                            item.def.toLowerCase().includes(searchQuery);
        var hideMasteredCheckbox = document.getElementById("hideMasteredCheckbox");
        var hideMastered = hideMasteredCheckbox ? hideMasteredCheckbox.checked : false;
        var passesMasteredFilter = !hideMastered || !isMastered;

        if (matchesWeek && matchesSearch && passesMasteredFilter) {
            var cardClass = isMastered ? "word-card mastered" : "word-card";
            var buttonText = isMastered ? "Mastered ✓" : "Mark as Mastered";

            var cardHtml = 
                '<div class="' + cardClass + '" onclick="flipCard(this)">' +
                    '<div class="card-inner">' +
                        '<div class="card-front">' +
                            '<span class="master-badge">Mastered</span>' +
                            '<h3 class="word-title">' + item.word + '</h3>' +
                            '<p class="card-hint">Click to flip</p>' +
                            '<div class="card-actions">' +
                                '<button class="audio-btn" onclick="speakWord(\'' + item.word + '\', event)">🔊 Listen</button>' +
                                '<button class="master-btn" onclick="toggleMastered(\'' + item.id + '\', event)">' + buttonText + '</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="card-back">' +
                            '<p class="word-def">' + item.def + '</p>' +
                            '<p class="word-root">' + item.root + '</p>' +
                            '<p class="word-tr">TR: ' + item.tr + '</p>' +
                            '<p class="word-sentence">"' + item.sentence + '"</p>' +
                            '<button class="master-btn" onclick="toggleMastered(\'' + item.id + '\', event)">' + buttonText + '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            grid.innerHTML += cardHtml;
            matchCount = matchCount + 1;
        }
    }

    if (matchCount === 0) {
        grid.innerHTML = '<p class="no-results">No words match your search. Try a different word or clear the filter.</p>';
    }

    updateStats();
}

function flipCard(cardElement) {
    cardElement.classList.toggle("flipped");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

var quizQuestions = [];
var quizIndex = 0;
var quizScore = 0;
var quizAnswered = false;

function startQuiz() {
    quizQuestions = wordList.slice();

    for (var i = quizQuestions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = quizQuestions[i];
        quizQuestions[i] = quizQuestions[j];
        quizQuestions[j] = temp;
    }

    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;

    document.getElementById("wordGrid").style.display = "none";
    document.getElementById("controlsContainer").style.display = "none";
    document.getElementById("quizContainer").style.display = "block";

    showQuizQuestion();
}

function showQuizQuestion() {
    quizAnswered = false;

    var question = quizQuestions[quizIndex];

    var wrongDefs = [];
    for (var i = 0; i < wordList.length; i++) {
        if (wordList[i].id !== question.id) {
            wrongDefs.push(wordList[i].def);
        }
    }

    for (var i = wrongDefs.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = wrongDefs[i];
        wrongDefs[i] = wrongDefs[j];
        wrongDefs[j] = temp;
    }

    var choices = wrongDefs.slice(0, 3);
    choices.push(question.def);

    for (var i = choices.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = choices[i];
        choices[i] = choices[j];
        choices[j] = temp;
    }

    var questionHtml = '<p class="quiz-progress">Question ' + (quizIndex + 1) + ' of ' + quizQuestions.length + '</p>';
    questionHtml += '<h3 class="quiz-word">' + question.word + '</h3>';
    questionHtml += '<p class="quiz-instruction">What does this word mean?</p>';
    questionHtml += '<div class="quiz-choices">';

    for (var i = 0; i < choices.length; i++) {
        questionHtml += '<button class="quiz-choice-btn" onclick="checkQuizAnswer(this, \'' + question.def.replace(/'/g, "\\'") + '\')">' + choices[i] + '</button>';
    }

    questionHtml += '</div>';
    questionHtml += '<p id="quizFeedback" class="quiz-feedback"></p>';
    questionHtml += '<button id="quizNextBtn" class="action-btn quiz-next-btn" onclick="nextQuizQuestion()" style="display:none;">Next Question</button>';

    document.getElementById("quizContainer").innerHTML = questionHtml;
}

function checkQuizAnswer(buttonEl, correctDef) {
    if (quizAnswered) {
        return;
    }
    quizAnswered = true;

    var allButtons = document.getElementsByClassName("quiz-choice-btn");
    var isCorrect = buttonEl.innerText === correctDef;

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].disabled = true;
        if (allButtons[i].innerText === correctDef) {
            allButtons[i].classList.add("quiz-correct");
        }
    }

    if (isCorrect) {
        quizScore = quizScore + 1;
        document.getElementById("quizFeedback").innerText = "Correct!";
        document.getElementById("quizFeedback").className = "quiz-feedback quiz-feedback-correct";
    } else {
        buttonEl.classList.add("quiz-wrong");
        document.getElementById("quizFeedback").innerText = "Not quite, the correct answer is highlighted above.";
        document.getElementById("quizFeedback").className = "quiz-feedback quiz-feedback-wrong";
    }

    document.getElementById("quizNextBtn").style.display = "inline-block";
}

function nextQuizQuestion() {
    quizIndex = quizIndex + 1;

    if (quizIndex >= quizQuestions.length) {
        showQuizResults();
    } else {
        showQuizQuestion();
    }
}

function showQuizResults() {
    var percentage = Math.round((quizScore / quizQuestions.length) * 100);

    var resultsHtml = '<h3 class="quiz-word">Quiz Complete!</h3>';
    resultsHtml += '<p class="quiz-instruction">You scored ' + quizScore + ' out of ' + quizQuestions.length + ' (' + percentage + '%)</p>';
    resultsHtml += '<button class="action-btn" onclick="startQuiz()">Try Again</button> ';
    resultsHtml += '<button class="action-btn quiz-exit-btn" onclick="exitQuiz()">Back to Word List</button>';

    document.getElementById("quizContainer").innerHTML = resultsHtml;
}

function exitQuiz() {
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("wordGrid").style.display = "grid";
    document.getElementById("controlsContainer").style.display = "flex";
}

populateWeekFilter();
renderWords();