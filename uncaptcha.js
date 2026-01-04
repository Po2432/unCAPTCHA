(function(){
  const scripts = document.querySelectorAll('script[src$="uncaptcha.js"]');
  const scriptTag = scripts[scripts.length - 1];
  const mode = scriptTag ? scriptTag.getAttribute("data-mode") || "auto" : "auto";
  const theme = scriptTag ? scriptTag.getAttribute("data-theme") || "light" : "light";

  document.addEventListener("DOMContentLoaded", () => {
    const parent = scriptTag.parentElement;

    const widget = document.createElement("div");
    widget.className = `uncaptcha-widget uncaptcha-${theme}`;
    widget.innerHTML = `
      <div class="uncaptcha-row">
        <div class="checkbox-animation"></div>
        <span class="uncaptcha-text">I’m not a robot</span>
        <button class="popup-btn">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
        <a href="https://github.com/Po2432/unCAPTCHA" target="_blank" class="uncaptcha-logo-link">
          <img src="https://raw.githubusercontent.com/Po2432/unCAPTCHA/main/uncaptcha.png" alt="unCAPTCHA logo" class="uncaptcha-logo" />
        </a>
      </div>
      <div class="uncaptcha-challenge" style="display:none">
        <p class="challenge-instruction"></p>
        <div class="challenge-grid"></div>
        <button class="challenge-verify">Verify</button>
      </div>
    `;
    parent.insertBefore(widget, scriptTag);

    const checkbox = widget.querySelector(".uncaptcha-row");
    const anim = widget.querySelector(".checkbox-animation");
    const challenge = widget.querySelector(".uncaptcha-challenge");
    const grid = widget.querySelector(".challenge-grid");
    const verifyBtn = widget.querySelector(".challenge-verify");
    const instruction = widget.querySelector(".challenge-instruction");
    const popupBtn = widget.querySelector(".popup-btn");
    popupBtn.style.display = "none";

    const logoImg = widget.querySelector(".uncaptcha-logo");
    const scriptSrc = scriptTag.src;
    const baseURL = scriptSrc.replace(/\/[^\/]*$/, '/');
    logoImg.onerror = () => logoImg.src = baseURL + 'uncaptcha.png';

    let currentTarget = "dog";
    let locked = false;
    let mousePath = [];
    let clickTimes = [];
    let keyTimes = [];
    let scrollTimes = [];
    let decisionMade = false;
    let clickIntervals = []; // Track time between clicks
    let mouseSpeeds = []; // Track mouse speeds for consistency
    let interactionEvents = []; // Track types of interactions (click, key, scroll)

    document.addEventListener('mousemove', (e) => {
      mousePath.push({x: e.clientX, y: e.clientY, time: Date.now()});
      if (mousePath.length > 100) mousePath.shift(); // Keep last 100 points
      // Track speeds
      if (mousePath.length > 1) {
        let last = mousePath[mousePath.length - 1];
        let prev = mousePath[mousePath.length - 2];
        let dist = Math.sqrt((last.x - prev.x) ** 2 + (last.y - prev.y) ** 2);
        let timeDiff = last.time - prev.time;
        if (timeDiff > 0) mouseSpeeds.push(dist / timeDiff);
        if (mouseSpeeds.length > 99) mouseSpeeds.shift();
      }
    });

    document.addEventListener('click', () => {
      clickTimes.push(Date.now());
      if (clickTimes.length > 10) clickTimes.shift(); // Keep last 10 clicks
      // Track intervals
      if (clickTimes.length > 1) {
        clickIntervals.push(clickTimes[clickTimes.length - 1] - clickTimes[clickTimes.length - 2]);
        if (clickIntervals.length > 9) clickIntervals.shift(); // Keep last 9 intervals
      }
      interactionEvents.push('click');
      if (interactionEvents.length > 20) interactionEvents.shift();
    });

    document.addEventListener('keydown', () => {
      keyTimes.push(Date.now());
      if (keyTimes.length > 10) keyTimes.shift(); // Keep last 10 key presses
      interactionEvents.push('key');
      if (interactionEvents.length > 20) interactionEvents.shift();
    });

    document.addEventListener('scroll', () => {
      scrollTimes.push(Date.now());
      if (scrollTimes.length > 10) scrollTimes.shift(); // Keep last 10 scrolls
      interactionEvents.push('scroll');
      if (interactionEvents.length > 20) interactionEvents.shift();
    });

    checkbox.addEventListener("click", () => {
      if(anim.classList.contains("success") || locked) return;
      anim.className = "checkbox-animation loading";
      decisionMade = false; // Reset on new click
      setTimeout(() => {
        if (!decisionMade) {
          decisionMade = true;
          if (mode === "always" || (mode === "auto" && calculateBotScore() <= 0.5)) {
            showChallenge(grid, challenge, instruction);
            popupBtn.style.display = "block";
          } else {
            anim.className = "checkbox-animation success tick";
          }
        }
      }, 1200);
    });

    popupBtn.addEventListener("click", () => {
      challenge.classList.add("popup");
    });

    verifyBtn.addEventListener("click", () => {
      if(locked) return;

      const allImages = [...grid.querySelectorAll("img")];
      const correctImages = allImages.filter(img => img.dataset.type === currentTarget);
      const selectedImages = allImages.filter(img => img.classList.contains("selected"));

      // Must select ALL correct images, and ONLY correct images
      const allCorrect =
        selectedImages.length === correctImages.length &&
        selectedImages.every(img => img.dataset.type === currentTarget);

      if(allCorrect){
        anim.className = "checkbox-animation success tick";
        challenge.style.display = "none";
        challenge.classList.remove("popup");
        popupBtn.style.display = "none";
      } else {
        anim.className = "checkbox-animation fail cross";
        locked = true;
        grid.querySelectorAll("img").forEach(img => img.style.pointerEvents = "none");
        challenge.classList.remove("popup");
        popupBtn.style.display = "none";
      }
    });

    function showChallenge(grid, challenge, instruction){
      challenge.style.display = "block";
      grid.innerHTML = "";
      locked = false;

      currentTarget = Math.random() < 0.5 ? "dog" : "cat";
      instruction.textContent = `Select all ${currentTarget}s:`;

      const sources = [
        {src:"https://placedog.net/100/100?id=1", type:"dog"},
        {src:"https://placedog.net/100/100?id=2", type:"dog"},
        {src:"https://placedog.net/100/100?id=3", type:"dog"},
        {src:`https://cataas.com/cat?width=100&height=100&random=${Math.random()}`, type:"cat"},
        {src:`https://cataas.com/cat?width=100&height=100&random=${Math.random()}`, type:"cat"},
        {src:`https://cataas.com/cat?width=100&height=100&random=${Math.random()}`, type:"cat"},
        {src:"https://picsum.photos/100?random=1", type:"other"},
        {src:"https://picsum.photos/100?random=2", type:"other"},
        {src:"https://picsum.photos/100?random=3", type:"other"}
      ];

      shuffle(sources).forEach(item=>{
        const img = document.createElement("img");
        img.src = item.src;
        img.dataset.type = item.type;
        img.addEventListener("click", ()=>{
          if(!locked) img.classList.toggle("selected");
        });
        grid.appendChild(img);
      });
    }

    function calculateBotScore() {
      let score = 0.5; // Default

      // Mouse movement score (emphasize straightness, variance, and speed consistency)
      if (mousePath.length >= 10) {
        let start = mousePath[0];
        let end = mousePath[mousePath.length - 1];
        let straightDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
        let totalDist = 0;
        for (let i = 1; i < mousePath.length; i++) {
          totalDist += Math.sqrt((mousePath[i].x - mousePath[i - 1].x) ** 2 + (mousePath[i].y - mousePath[i - 1].y) ** 2);
        }
        let straightness = totalDist > 0 ? straightDist / totalDist : 1; // 1 = straight (bot-like)

        let avgSpeed = mouseSpeeds.reduce((a, b) => a + b, 0) / mouseSpeeds.length || 0;
        let speedVariance = mouseSpeeds.reduce((sum, s) => sum + (s - avgSpeed) ** 2, 0) / mouseSpeeds.length || 0;
        let speedConsistency = Math.min(speedVariance * 10000, 1); // Lower variance = more consistent (bot-like)

        // Near-perfect movement: High straightness + low variance + high consistency
        let mousePerfection = (straightness * 0.4) + ((1 - speedConsistency) * 0.3) + (speedConsistency * 0.3); // Higher = more perfect (bot-like)
        score = 1 - mousePerfection; // Invert to human-like score
      }

      // Clicking score: Penalize rapid clicks (>1 in 1s)
      let recentClicks = clickTimes.filter(t => Date.now() - t < 1000);
      let clickingScore = recentClicks.length <= 1 ? 1 : 0; // 1 = human, 0 = bot

      // Constant clicking: Penalize regular intervals (low std dev)
      let constantClickingScore = 1; // Default human
      if (clickIntervals.length >= 5) {
        let avgInterval = clickIntervals.reduce((a, b) => a + b, 0) / clickIntervals.length;
        let intervalVariance = clickIntervals.reduce((sum, i) => sum + (i - avgInterval) ** 2, 0) / clickIntervals.length;
        let stdDev = Math.sqrt(intervalVariance);
        constantClickingScore = stdDev > 50 ? 1 : 0; // High std dev = human, low = bot-like
      }

      // Keyboard score: Penalize no recent key presses
      let recentKeys = keyTimes.filter(t => Date.now() - t < 5000);
      let keyScore = recentKeys.length > 0 ? 1 : 0; // 1 = human, 0 = bot

      // Scrolling score: Penalize no recent scrolls
      let recentScrolls = scrollTimes.filter(t => Date.now() - t < 5000);
      let scrollScore = recentScrolls.length > 0 ? 1 : 0; // 1 = human, 0 = bot

      // Interaction variety: Penalize lack of mixed events
      let uniqueInteractions = new Set(interactionEvents).size;
      let varietyScore = uniqueInteractions >= 2 ? 1 : 0; // 1 = varied (human), 0 = bot-like

      // If rapid or constant clicking detected, force score to 0
      if (clickingScore === 0 || constantClickingScore === 0) {
        return 0;
      }

      // Average all scores
      score = (score + clickingScore + constantClickingScore + keyScore + scrollScore + varietyScore) / 6;

      return Math.max(0, Math.min(1, score)); // Clamp to 0-1
    }
  });

  function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
})();
