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

function toggleMastered(wordId, event) {
    event.stopPropagation();
    
    var index = masteredWords.indexOf(wordId);
    if (index === -1) {
        masteredWords.push(wordId);
    } else {
        masteredWords.splice(index, 1);
    }

    saveProgress();
    renderWords();
    updateStats();
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
                            '<button class="master-btn" onclick="toggleMastered(\'' + item.id + '\', event)">' + buttonText + '</button>' +
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