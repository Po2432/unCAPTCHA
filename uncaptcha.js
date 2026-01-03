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
        <a href="" target="_blank" class="uncaptcha-logo-link">
          <img src="uncaptcha.png" alt="unCAPTCHA logo" class="uncaptcha-logo" />
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

    let currentTarget = "dog";
    let locked = false;

    checkbox.addEventListener("click", () => {
      if(anim.classList.contains("success") || locked) return;
      anim.className = "checkbox-animation loading";
      setTimeout(() => {
        if(mode === "always" || Math.random() < 0.5){
          showChallenge(grid, challenge, instruction);
          popupBtn.style.display = "block";
        } else {
          anim.className = "checkbox-animation success tick";
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
  });

  function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
})();