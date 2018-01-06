hiragana_list = [
    ["\u3042", "a", 0], ["\u3044", "i", 0], ["\u3046", "u", 0], ["\u3048", "e", 0], ["\u304A", "o", 0], ["\u304B", "ka", 0], ["\u304C", "ga", 1], ["\u304D", "ki", 0], ["\u304E", "gi", 1], ["\u304F", "ku", 0],
    ["\u3050", "gu", 1], ["\u3051", "ke", 0], ["\u3052", "ge", 1], ["\u3053", "ko", 0], ["\u3054", "go", 1], ["\u3055", "sa", 0], ["\u3056", "za", 1], ["\u3057", "shi", 0], ["\u3058", "ji", 1], ["\u3059", "su", 0], ["\u305A", "zu", 1], ["\u305B", "se", 0], ["\u305C", "ze", 1], ["\u305D", "so", 0], ["\u305E", "zo", 1], ["\u305F", "ta", 0],
    ["\u3060", "da", 1], ["\u3061", "chi", 0], ["\u3062", "ji", 1], /* ["\u3063", "ko", 0],*/ ["\u3064", "tsu", 0], ["\u3065", "zu", 1], ["\u3066", "te", 0], ["\u3067", "de", 1], ["\u3068", "to", 0], ["\u3069", "do", 1], ["\u306A", "na", 1], ["\u306B", "ni", 0], ["\u306C", "nu", 0], ["\u306D", "ne", 0], ["\u306E", "no", 0], ["\u306F", "ha", 0],
    ["\u3070", "ba", 1], ["\u3071", "pa", 2], ["\u3072", "hi", 0], ["\u3073", "bi", 1], ["\u3074", "pi", 2], ["\u3075", "fu", 0], ["\u3076", "zu", 1], ["\u3077", "pu", 2], ["\u3078", "he", 0], ["\u3079", "be", 1], ["\u307A", "pe", 2], ["\u307B", "ho", 1], ["\u307C", "bo", 1], ["\u307D", "po", 2], ["\u307E", "ma", 0], ["\u307F", "mi", 0],
    ["\u3080", "mu", 0], ["\u3081", "me", 0], ["\u3082", "mo", 0], /*["\u3083", "bi", 0],*/ ["\u3084", "ya", 0], /*["\u3085", "su", 0],*/ ["\u3086", "yu", 0], /*["\u3087", "pu", 2],*/ ["\u3088", "yo", 0], ["\u3089", "ra", 0], ["\u308A", "ri", 0], ["\u308B", "ru", 0], ["\u308C", "re", 0], ["\u308D", "ro", 0], /*["\u308E", "wa", 0],*/ ["\u308F", "wa", 0],
    /*["\u3090", "wi", 0], ["\u3091", "we", 0],*/ ["\u3092", "wo", 0], ["\u3093", "n", 0] /*["\u3094", "vu", 0], ["\u3095", "ka", 0], ["\u3096", "ke", 0],*/];

duolingo_levels = [
    ['\u3044', '\u3061', '\u306b', '\u3093', '\u3055', '\u3088', '\u308d', '\u304f', '\u306a', '\u304a', '\u306f', '\u3046', '\u3057', '\u3042', '\u304b'],
    ['\u3080', '\u304d', '\u308b', '\u3084', '\u3051', '\u306e', '\u3059', '\u3066', '\u308a', '\u307e', '\u307b', '\u305f', '\u3053', '\u3089', '\u308f'],
    ['\u306c', '\u306d', '\u3068', '\u305b', '\u307f', '\u3081', '\u3075', '\u3086', '\u3064', '\u3082', '\u3072', '\u308c', '\u3048', '\u3078', '\u305d'],
    ['\u304c', '\u304e', '\u3050', '\u3052', '\u3054', '\u3056', '\u3058', '\u305a', '\u305c', '\u305e', '\u3060', '\u3062', '\u3065', '\u3067', '\u3069', '\u3070', '\u3073', '\u3076', '\u3079', '\u307c', '\u3071', '\u3074', '\u3077', '\u307a', '\u307d']
];

settings = {
    ruthless: false,
    delay_hit: 10,
    delay_miss: 400,
    include_dakouten: true,
    duolingo_level: 4
};

state = {
    input_lock: false,
    score: [0, 0],
    current_hiragana: hiragana_list[0]
};

elements = {
    history: document.getElementById("history"),
    input_prompt: document.getElementById("input_prompt"),
    score_hits: document.getElementById("hits"),
    score_misses: document.getElementById("misses"),
    settings: {
        overlay: document.getElementById("settings-overlay"),
        duolingo_level: document.getElementById("setting-duolingo-level"),
        include_dakouten: document.getElementById("setting-include-dakouten"),
        ruthless: document.getElementById("setting-ruthless"),
        save: document.getElementById("save-settings"),
        open: document.getElementById("settings-button")
    }
};

show_new_hiragana = function () {
    var previous_hiragana = state.current_hiragana;

    elements.input_prompt.value = "";
    state.current_hiragana = hiragana_list[Math.floor(Math.random() * hiragana_list.length)];

    while (!settings.include_dakouten && state.current_hiragana[2] > 0 || state.current_hiragana === previous_hiragana
    || !matches_duolingo_level(state.current_hiragana[0], settings.duolingo_level)) {
        state.current_hiragana = hiragana_list[Math.floor(Math.random() * hiragana_list.length)];
    }

    document.getElementById("hiragana").innerHTML = state.current_hiragana[0];
    state.input_lock = false;
};

matches_duolingo_level = function (hiragana_char, level) {
    if (level >= 4) {
        return true;
    }

    for (var i = 0; i <= level; ++i) {
        if (duolingo_levels[i].indexOf(hiragana_char) !== -1) {
            console.log(i, hiragana_char);
            return true;
        }
    }

    return false;
};

register_guess = function (hiragana) {
    state.score[0] += 1;
    update_score();
    push_history(hiragana, true);
    show_new_hiragana();
};

register_miss = function (hiragana) {
    state.score[1] += 1;
    update_score();
    push_history(hiragana, false);
    show_new_hiragana();
};

update_score = function () {
    elements.score_hits.innerText = state.score[0];
    elements.score_misses.innerText = state.score[1];
};

push_history = function (hiragana, hit) {
    var new_element = document.createElement("div");
    new_element.className = hit ? "hit" : "miss";
    new_element.innerText = hiragana[0];

    if (!hit) {
        var elem_solution = document.createElement("span");
        elem_solution.innerText = "(" + hiragana[1] + ")";
        new_element.appendChild(elem_solution);
    }

    elements.history.insertBefore(new_element, elements.history.children[0]);
};

/**
 * Settings
 */
show_settings = function () {
    elements.settings.overlay.className = "";
    elements.settings.ruthless.checked = settings.ruthless;
    elements.settings.include_dakouten.checked = settings.include_dakouten;
    elements.settings.duolingo_level.selectedIndex = settings.duolingo_level;
};

save_settings = function () {
    elements.settings.overlay.className = "hidden";
    settings.ruthless = elements.settings.ruthless.checked;
    settings.include_dakouten = elements.settings.include_dakouten.checked;
    settings.duolingo_level = elements.settings.duolingo_level.selectedIndex;

    show_new_hiragana();
};

/**
 * Main code
 */
init_listeners = function () {
    elements.input_prompt.addEventListener("focus", function () {
        elements.input_prompt.value = "";
        elements.input_prompt.placeholder = "";
    }, true);

    elements.input_prompt.addEventListener("blur", function () {
        elements.input_prompt.value = "";

        elements.input_prompt.placeholder = settings.ruthless ? "??" : state.current_hiragana[1];
    }, true);

    elements.input_prompt.addEventListener("input", function () {
        if (state.input_lock) {
            return;
        }

        if (elements.input_prompt.value.toLowerCase() === state.current_hiragana[1].toLowerCase()) {
            setTimeout(function () {
                register_guess(state.current_hiragana)
            }, settings.delay_hit);
            state.input_lock = true;
        } else if (settings.ruthless && state.current_hiragana[1].indexOf(elements.input_prompt.value) !== 0) {
            setTimeout(function () {
                register_miss(state.current_hiragana)
            }, settings.delay_miss);
            state.input_lock = true;
        }
    }, true);

    elements.input_prompt.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            setTimeout(function () {
                register_miss(state.current_hiragana)
            }, settings.delay_hit);
            state.input_lock = true;
        }
    }, true);

    elements.settings.save.addEventListener("click", function () {
        save_settings();
    });

    elements.settings.open.addEventListener("click", function () {
        show_settings();
    });
};

init_listeners();
show_new_hiragana();
elements.input_prompt.placeholder = state.current_hiragana[1];
elements.input_prompt.focus();