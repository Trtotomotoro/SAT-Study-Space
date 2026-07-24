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

// found a simple confetti trick online, just makes little colored
// squares fly out from where you clicked and fall down while fading
function launchConfetti(originX, originY) {
    var colors = ["#2e7d32", "#ffd700", "#2b3a55", "#e74c3c", "#3498db"];
    var pieceCount = 18;

    for (var i = 0; i < pieceCount; i++) {
        var piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = originX + "px";
        piece.style.top = originY + "px";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // random direction for each piece so they scatter instead of
        // all flying the exact same way
        var xEnd = (Math.random() - 0.5) * 200;
        var yEnd = Math.random() * 150 + 80;
        var rotEnd = Math.random() * 360;

        piece.style.setProperty("--x-end", xEnd + "px");
        piece.style.setProperty("--y-end", yEnd + "px");
        piece.style.setProperty("--rot-end", rotEnd + "deg");

        document.body.appendChild(piece);

        // clean up the piece after the animation finishes so we don't
        // fill up the page with invisible leftover elements
        (function (el) {
            setTimeout(function () {
                el.remove();
            }, 1200);
        })(piece);
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

    for (var i = 0; i < wordList.length; i++) {
        var item = wordList[i];
        var isMastered = masteredWords.includes(item.id);
        
        var matchesWeek = (selectedWeek === "all" || item.week == selectedWeek);
        var matchesSearch = item.word.toLowerCase().includes(searchQuery) || 
                            item.def.toLowerCase().includes(searchQuery);

        if (matchesWeek && matchesSearch) {
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
        }
    }

    updateStats();
}

function flipCard(cardElement) {
    cardElement.classList.toggle("flipped");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

renderWords();


