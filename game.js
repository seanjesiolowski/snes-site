(function () {
    "use strict";

    // --- State ---
    let allowInteraction = false;
    let isSoundEnabled = true;
    let canReload = false;
    let matchElement1 = null;
    let matchValue1 = null;
    let matchElement2 = null;
    let matchValue2 = null;
    let matchesFound = 0;
    let isChallengeMode = true;
    let clickCount = 0;
    const maxGuesses = 50;

    // --- Audio ---
    const correctSnd = new Audio("aud/correct.mp3");
    correctSnd.volume = 0.3;
    const winSnd = new Audio("aud/win.mp3");
    const clickSnd = new Audio("aud/click_003.ogg");

    // --- DOM refs ---
    const settingsModal = document.getElementById("settingsModal");
    const soundToggle = document.getElementById("soundToggle");
    const modeToggle = document.getElementById("modeToggle");
    const inGameToggle = document.getElementById("inGameToggle");
    const startBtn = document.getElementById("startBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const fillElement = document.getElementById("fill");
    const clickMessage = document.getElementById("clickMessage");

    // --- Sound ---

    function playSound(audioObj) {
        if (!isSoundEnabled) return;
        try {
            audioObj.currentTime = 0;
            audioObj.play();
        } catch (_e) {
            // ignore play errors
        }
    }

    function setSetting(settingName, value) {
        switch (settingName) {
            case "sound":
                isSoundEnabled = !!value;
                updateUIForSoundState();
                break;
            case "challengeMode":
                isChallengeMode = !!value;
                updateUIForChallengeModeState();
                break;
        }
    }

    function loadSettingsToUI() {
        isSoundEnabled = true;
        isChallengeMode = true;
        if (soundToggle) soundToggle.checked = isSoundEnabled;
        if (modeToggle) modeToggle.checked = isChallengeMode;
    }

    function updateUIForSoundState() {
        if (soundToggle) {
            soundToggle.checked = isSoundEnabled;
        }
        if (inGameToggle) {
            if (isSoundEnabled) {
                inGameToggle.textContent = "\u{1F50A}";
                inGameToggle.setAttribute("aria-pressed", "true");
                inGameToggle.title = "Sound is ON \u2014 click to mute";
            } else {
                inGameToggle.textContent = "\u{1F507}";
                inGameToggle.setAttribute("aria-pressed", "false");
                inGameToggle.title = "Sound is OFF \u2014 click to unmute";
            }
            inGameToggle.disabled = !allowInteraction;
        }
    }

    function updateUIForChallengeModeState() {
        if (modeToggle) {
            modeToggle.checked = isChallengeMode;
        }
        updateClickMessage();
    }

    // --- Modal ---

    function showSettingsModal() {
        if (!settingsModal) return;
        loadSettingsToUI();
        settingsModal.style.display = "flex";
        allowInteraction = false;
        if (inGameToggle) inGameToggle.disabled = true;

        if (startBtn && cancelBtn) {
            if (matchesFound > 0 || canReload) {
                setTimeout(() => cancelBtn.focus(), 50);
            } else {
                setTimeout(() => startBtn.focus(), 50);
            }
        } else if (startBtn) {
            setTimeout(() => startBtn.focus(), 50);
        }
    }

    function hideSettingsModal() {
        if (!settingsModal) return;
        settingsModal.style.display = "none";
        allowInteraction = true;
        if (inGameToggle) inGameToggle.disabled = false;
        updateUIForSoundState();
    }

    // --- Game Logic ---

    function reloadPage() {
        if (canReload) {
            window.location.reload();
        }
    }

    function toggleDisplay(imgElement) {
        if (imgElement) {
            imgElement.style.display = imgElement.style.display === "none" ? "block" : "none";
        }
    }

    function handleComparison(divEl) {
        if (!allowInteraction) return;
        playSound(clickSnd);

        if (isChallengeMode && clickCount >= maxGuesses) return;

        const imgElement = divEl.querySelector("img");
        if (!imgElement) return;

        const imgSrc = imgElement.src;

        if (!matchValue1 || (!matchValue2 && divEl !== matchElement1)) {
            if (isChallengeMode) clickCount++;
            updateClickMessage();
        }

        if (!matchValue1) {
            matchElement1 = divEl;
            matchValue1 = imgSrc;
            toggleDisplay(imgElement);
        } else if (!matchValue2) {
            if (divEl === matchElement1) return;

            matchElement2 = divEl;
            matchValue2 = imgSrc;
            toggleDisplay(imgElement);

            if (matchValue1 === matchValue2) {
                playSound(correctSnd);
                matchesFound++;
                matchElement1.classList.remove("getsImg");
                matchElement2.classList.remove("getsImg");
                resetMatchState();

                if (matchesFound === matchGoal) {
                    togglePlayAgain();
                    playSound(winSnd);
                    if (clickMessage) {
                        clickMessage.textContent = "Congratulations! You\u2019ve found all matches!";
                        clickMessage.style.color = "lightgreen";
                    }
                }
            } else {
                allowInteraction = false;
                setTimeout(() => {
                    toggleDisplay(matchElement1.querySelector("img"));
                    toggleDisplay(matchElement2.querySelector("img"));
                    resetMatchState();
                    allowInteraction = true;
                }, 1000);
            }
        }
    }

    function resetMatchState() {
        matchElement1 = null;
        matchValue1 = null;
        matchElement2 = null;
        matchValue2 = null;
    }

    function updateClickMessage() {
        if (!clickMessage) return;
        if (isChallengeMode) {
            if (clickCount >= maxGuesses) {
                clickMessage.style.color = "red";
                clickMessage.textContent = "You have reached the maximum number of guesses. Try again!";
                togglePlayAgain();
            } else {
                clickMessage.textContent = "You have " + (maxGuesses - clickCount) + " tries left.";
                clickMessage.style.color = "white";
            }
        } else {
            clickMessage.textContent = "";
        }
    }

    function togglePlayAgain() {
        if (fillElement) {
            fillElement.textContent = "Play Again?";
            fillElement.style.color = "white";
        }
        canReload = true;
    }

    // --- Image Setup ---

    const srcArray = [
        "https://upload.wikimedia.org/wikipedia/en/8/89/SuperMarioRPGSNESCoverArtUS.jpg",
        "https://upload.wikimedia.org/wikipedia/en/e/e4/Smetroidbox.jpg",
        "https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png",
        "https://upload.wikimedia.org/wikipedia/en/a/a7/Chrono_Trigger.jpg",
        "https://upload.wikimedia.org/wikipedia/en/2/21/The_Legend_of_Zelda_A_Link_to_the_Past_SNES_Game_Cover.jpg",
        "https://upload.wikimedia.org/wikipedia/en/1/1f/EarthBound_Box.jpg",
        "https://upload.wikimedia.org/wikipedia/en/f/f1/Mega_Man_X_Coverart.png",
        "https://upload.wikimedia.org/wikipedia/en/1/1a/Donkey_Kong_Country_SNES_cover.png",
        "https://upload.wikimedia.org/wikipedia/en/3/38/Supermariokart_box.JPG",
        "https://upload.wikimedia.org/wikipedia/en/3/3c/Super_Mario_All_Stars_%28game_box_art%29.jpg",
        "https://upload.wikimedia.org/wikipedia/en/c/c3/DK_Country_2.jpg",
        "https://upload.wikimedia.org/wikipedia/en/9/9a/Yoshi%27s_Island_%28Super_Mario_World_2%29_box_art.jpg"
    ];
    const matchGoal = srcArray.length;

    // Fisher-Yates shuffle for unbiased randomization
    function shuffle(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    const srcArrayDoubleShuffled = shuffle([...srcArray, ...srcArray]);

    function assignImages() {
        const elements = document.querySelectorAll(".getsImg");
        elements.forEach((el, idx) => {
            const newChildImg = el.appendChild(document.createElement("img"));
            newChildImg.style.display = "none";
            newChildImg.src = srcArrayDoubleShuffled[idx];
        });
    }

    // --- Event Listeners ---

    document.addEventListener("DOMContentLoaded", () => {
        // Event delegation for tile clicks (replaces inline onclick)
        const gameBoard = document.querySelector("main");
        if (gameBoard) {
            gameBoard.addEventListener("click", (e) => {
                const tile = e.target.closest(".getsImg");
                if (tile) handleComparison(tile);
            });
        }

        if (startBtn && soundToggle && modeToggle) {
            startBtn.addEventListener("click", () => {
                setSetting("sound", soundToggle.checked);
                setSetting("challengeMode", modeToggle.checked);
                hideSettingsModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                loadSettingsToUI();
                hideSettingsModal();
            });
        }

        if (inGameToggle) {
            loadSettingsToUI();
            updateUIForSoundState();
            inGameToggle.addEventListener("click", () => {
                setSetting("sound", !isSoundEnabled);
            });
        }

        if (modeToggle) {
            modeToggle.addEventListener("change", function () {
                setSetting("challengeMode", this.checked);
            });
        }

        if (fillElement) {
            fillElement.addEventListener("click", reloadPage);
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && settingsModal && settingsModal.style.display !== "none") {
                loadSettingsToUI();
                hideSettingsModal();
            }
        });

        assignImages();
        showSettingsModal();
        updateClickMessage();
    });
})();
