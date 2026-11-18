/* =========================================================
   LandMark — lead form: country picker + Resend submit
   Requires: countries.js, a #lead-form in the page
   ========================================================= */
(function () {
  "use strict";

  const FLAG = (iso) => `https://flagcdn.com/w40/${iso}.png`;
  const DEFAULT_ISO = "eg";
  const THANK_YOU_URL = "thank-you.html";
  const API_URL = "/api/lead";

  /* ---------- attribution (UTM / GCLID) — first touch per session ---------- */
  const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"];
  let attr = {};
  try {
    attr = JSON.parse(sessionStorage.getItem("lm_attr") || "{}");
    const qs = new URLSearchParams(location.search);
    let changed = false;
    ATTR_KEYS.forEach((k) => { if (qs.get(k) && !attr[k]) { attr[k] = qs.get(k); changed = true; } });
    if (!attr.landing) { attr.landing = location.pathname; changed = true; }
    if (changed) sessionStorage.setItem("lm_attr", JSON.stringify(attr));
  } catch (_) {}

  /* ---------- country picker ---------- */
  function initPicker(root) {
    const btn = root.querySelector(".cc__btn");
    const flag = root.querySelector(".cc__flag");
    const code = root.querySelector(".cc__code");
    const pop = root.querySelector(".cc__pop");
    const search = root.querySelector(".cc__search");
    const list = root.querySelector(".cc__list");
    const hidden = root.querySelector('input[type="hidden"]');

    const norm = (s) => s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");

    function render(q) {
      const nq = norm(q.trim().replace(/^\+/, ""));
      const items = COUNTRIES.filter(([iso, en, ar, dial]) =>
        !nq || norm(en).includes(nq) || (ar && norm(ar).includes(nq)) || dial.startsWith(nq) || iso === nq
      );
      list.innerHTML = items.length
        ? items.map(([iso, en, ar, dial]) => `
            <li role="option" tabindex="-1" data-iso="${iso}" aria-selected="${iso === root.dataset.iso}">
              <img src="${FLAG(iso)}" alt="" width="22" height="16" loading="lazy">
              <span class="cc__name">${ar || en}</span>
              <span class="cc__dial">+${dial}</span>
            </li>`).join("")
        : `<li class="cc__empty">مفيش نتايج</li>`;
    }

    function select(iso) {
      const c = COUNTRIES.find((x) => x[0] === iso) || COUNTRIES[0];
      root.dataset.iso = c[0];
      root.dataset.dial = c[3];
      flag.src = FLAG(c[0]);
      flag.alt = c[1];
      code.textContent = `+${c[3]}`;
      if (hidden) hidden.value = c[0];
    }

    function open() {
      pop.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      search.value = "";
      render("");
      setTimeout(() => search.focus(), 20);
    }
    function close() {
      pop.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", () => (pop.hidden ? open() : close()));
    search.addEventListener("input", () => render(search.value));
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); const f = list.querySelector("li[data-iso]"); if (f) { select(f.dataset.iso); close(); } }
      if (e.key === "Escape") { e.stopPropagation(); close(); btn.focus(); }
    });
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-iso]");
      if (li) { select(li.dataset.iso); close(); root.closest("form")?.elements.phone?.focus(); }
    });
    document.addEventListener("click", (e) => { if (!root.contains(e.target)) close(); });

    select(DEFAULT_ISO);
    return { get dial() { return root.dataset.dial; }, get iso() { return root.dataset.iso; } };
  }

  /* ---------- submit ---------- */
  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    const picker = initPicker(form.querySelector(".cc"));
    const submitBtn = form.querySelector('[type="submit"]');
    const errEl = form.querySelector(".form-error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (errEl) errEl.hidden = true;

      const name = form.elements.fullName.value.trim();
      const phone = form.elements.phone.value.replace(/\D/g, "").replace(/^0+/, "");
      if (form.elements.website && form.elements.website.value) return; // honeypot
      if (name.length < 2) { form.elements.fullName.focus(); return; }
      if (phone.length < 7) { form.elements.phone.focus(); return; }

      const payload = {
        name,
        phone: `+${picker.dial}${phone}`,
        country: picker.iso,
        project: form.dataset.project || document.body.dataset.project || "",
        unitType: form.elements.unitType ? form.elements.unitType.value : "",
        detail: form.elements.detail ? form.elements.detail.value : "",
        page: location.href.split("#")[0],
        ...attr,
      };

      submitBtn.disabled = true;
      const label = submitBtn.textContent;
      submitBtn.textContent = "جاري الإرسال…";

      try {
        const r = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error("bad status " + r.status);
        try { sessionStorage.setItem("lm_last_page", location.pathname); } catch (_) {}
        location.href = THANK_YOU_URL;
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
        if (errEl) errEl.hidden = false;
      }
    });
  });
})();
