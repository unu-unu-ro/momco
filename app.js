// momco SPA for "HAR PENTRU HAOS" — mobile focused
(function () {
  const state = {
    zile: [],
    curenta: 1,
    total: 31,
  };

  const el = {
    scroller: document.getElementById("dayScroller"),
    prev: document.getElementById("prevBtn"),
    next: document.getElementById("nextBtn"),
    eyebrow: document.getElementById("eyebrow"),
    title: document.getElementById("dayTitle"),
    prayer: document.getElementById("dayPrayer"),
    verse: document.getElementById("dayVerse"),
    continueBtn: document.getElementById("continueBtn"),
    shareLink: document.getElementById("shareLink"),
  };

  // Helpers
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const setQS = (idx) => {
    const url = new URL(location.href);
    url.searchParams.set("zi", String(idx));
    history.replaceState({}, "", url);
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function persistProgress(day) {
    try {
      localStorage.setItem("momco-hph-day", String(day));
    } catch {}
  }
  function readProgress() {
    try {
      return parseInt(localStorage.getItem("momco-hph-day") || "1", 10);
    } catch {
      return 1;
    }
  }

  async function loadData() {
    const res = await fetch("./continut.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Nu pot încărca continut.json");
    const data = await res.json();
    state.zile = data;
    state.total = data.length;
  }

  function makeChip(i) {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", "false");
    b.textContent = `Ziua ${i}`;
    b.addEventListener("click", () => goTo(i));
    return b;
  }

  function renderChips() {
    el.scroller.innerHTML = "";
    for (let i = 1; i <= state.total; i++) el.scroller.appendChild(makeChip(i));
  }

  function renderDay(idx) {
    const item =
      state.zile.find((z) => (z.ziua || z.zi || z.ziIndex) === idx) ||
      state.zile[idx - 1];
    if (!item) return;
    const titlu = item.titlul || item.titlu || item.titluZi || "";
    el.eyebrow.textContent = `Ziua ${idx} din ${state.total}`;
    el.title.textContent = titlu;
    el.prayer.textContent = item.rugaciunea || item.rugaciune || "";
    el.verse.textContent = item.versetul || item.verset || "";

    // Update chips state
    const chips = el.scroller.querySelectorAll(".chip");
    chips.forEach((c, i) => {
      const active = i + 1 === idx;
      c.classList.toggle("active", active);
      c.setAttribute("aria-selected", active ? "true" : "false");
      if (active)
        c.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    });

    // Prev/Next disabled states
    el.prev.disabled = idx <= 1;
    el.next.disabled = idx >= state.total;

    // Share link for this day
    setQS(idx);
    el.shareLink.onclick = async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(location.href);
        toast("Link copiat");
      } catch {
        // fallback: open system share if possible
        if (navigator.share) {
          navigator
            .share({ title: document.title, url: location.href })
            .catch(() => {});
        }
      }
    };
  }

  function goTo(idx) {
    state.curenta = clamp(idx, 1, state.total);
    persistProgress(state.curenta);
    renderDay(state.curenta);
  }

  function next() {
    goTo(state.curenta + 1);
  }
  function prev() {
    goTo(state.curenta - 1);
  }

  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.position = "fixed";
      t.style.left = "50%";
      t.style.bottom = "24px";
      t.style.transform = "translateX(-50%)";
      t.style.background = "rgba(11,59,59,.96)";
      t.style.color = "#fff";
      t.style.padding = "10px 14px";
      t.style.borderRadius = "10px";
      t.style.boxShadow = "0 8px 20px rgba(0,0,0,.18)";
      t.style.zIndex = "9999";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => (t.style.opacity = "0"), 1500);
  }

  function initEvents() {
    el.next.addEventListener("click", next);
    el.prev.addEventListener("click", prev);
    el.continueBtn.addEventListener("click", () => {
      if (state.curenta < state.total) next();
      else goTo(1);
    });
    // progresul se salvează automat la navigare prin goTo()
    // Keyboard left/right for accessibility
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  // Bootstrap
  (async function start() {
    try {
      await loadData();
      renderChips();
      initEvents();
      const fromUrl = parseInt(qs("zi") || "", 10);
      const initial =
        Number.isFinite(fromUrl) && fromUrl >= 1 && fromUrl <= state.total
          ? fromUrl
          : readProgress();
      goTo(initial);
    } catch (err) {
      console.error(err);
      alert(
        "A apărut o problemă la încărcarea conținutului. Verifică fișierul continut.json."
      );
    }
  })();
})();
