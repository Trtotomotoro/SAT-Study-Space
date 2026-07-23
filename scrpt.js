var wordList = [
    { 
        word: "arduous", 
        def: "demanding sustained effort", 
        root: "from Latin arduus (steep, difficult)", 
        tr: "çetin, zorlu",
        sentence: "Preparing for the SAT is an arduous process.",
        week: 1
    },
    { 
        word: "candid", 
        def: "honest and direct", 
        root: "from Latin candidus (white, bright)", 
        tr: "samimi, içten",
        sentence: "She gave a candid opinion about the proposal.",
        week: 1 
    },
    { 
        word: "concise", 
        def: "brief and to the point", 
        root: "from Latin concisus (cut short)", 
        tr: "öz, kısa ve net",
        sentence: "His essay was short and concise.",
        week: 1 
    },
    { 
        word: "lucid", 
        def: "clear, easy to follow", 
        root: "from Latin lucidus (light, clear)", 
        tr: "açık, anlaşılır",
        sentence: "The teacher gave a lucid explanation.",
        week: 2 
    },
    { 
        word: "subtle", 
        def: "delicate, not obvious", 
        root: "from Latin subtilis (fine-woven)", 
        tr: "ince, göze çarpmayan",
        sentence: "There is a subtle difference between these two words.",
        week: 2 
    }
];

function renderWords() {
    var grid = document.getElementById("wordGrid");
    var selectedWeek = document.getElementById("weekFilter").value;
    var searchQuery = document.getElementById("searchInput").value.toLowerCase();
    
    grid.innerHTML = "";

    for (var i = 0; i < wordList.length; i++) {
        var item = wordList[i];
        
        var matchesWeek = (selectedWeek === "all" || item.week == selectedWeek);
        var matchesSearch = item.word.toLowerCase().includes(searchQuery) || 
                            item.def.toLowerCase().includes(searchQuery);

        if (matchesWeek && matchesSearch) {
            var cardHtml = 
                '<div class="word-card" onclick="flipCard(this)">' +
                    '<div class="card-inner">' +
                        '<div class="card-front">' +
                            '<h3 class="word-title">' + item.word + '</h3>' +
                            '<p class="card-hint">Click to flip</p>' +
                        '</div>' +
                        '<div class="card-back">' +
                            '<p class="word-def">' + item.def + '</p>' +
                            '<p class="word-root">' + item.root + '</p>' +
                            '<p class="word-tr">TR: ' + item.tr + '</p>' +
                            '<p class="word-sentence">"' + item.sentence + '"</p>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            grid.innerHTML += cardHtml;
        }
    }
}

function flipCard(cardElement) {
    cardElement.classList.toggle("flipped");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

renderWords();



