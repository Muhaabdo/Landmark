/* =========================================================
   Al Burouj — main script
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => n.toLocaleString("en-US");

  const waLink = (msg) => {
    const text = encodeURIComponent(msg || SITE_CONFIG.defaultWaMessage);
    const num = SITE_CONFIG.whatsappNumber;
    return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
  };
  const ICON = (id) => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;
  const ARROW = '<svg class="d-label__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

  /* ---------- generic WhatsApp buttons ---------- */
  $$("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.msg)));

  /* ---------- units ---------- */
  const unitsGrid = $("#units-grid");
  if (unitsGrid) {
    unitsGrid.innerHTML = UNIT_TYPES.map((u) => {
      const rooms = (u.rooms || [])
        .map((r) => `<button type="button" class="d-label d-label--room" data-open-form data-type="${u.id}" data-detail="${r}">${r}${ARROW}</button>`)
        .join("");
      const deliv = u.delivery
        .map((d) => `<button type="button" class="d-label d-label--${d}" data-open-form data-type="${u.id}" data-detail="${DELIVERY[d]}">${DELIVERY[d]}${ARROW}</button>`)
        .join("");
      return `
        <article class="unit-card">
          <div class="unit-card__media">
            <img src="${u.img}" alt="${u.title} للبيع في كمبوند البروج الشروق" loading="lazy" width="640" height="480">
            <span class="unit-card__years">تقسيط حتى <b>${u.years}</b> سنين</span>
            ${u.zeroDown ? `<span class="unit-card__zero">0% مقدم</span>` : ""}
          </div>
          <div class="unit-card__body">
            <div class="unit-card__top">
              <h3 class="unit-card__title">${u.title}</h3>
              <span class="unit-card__area">من <bdi>${fmt(u.area[0])}</bdi> لـ <bdi>${fmt(u.area[1])}</bdi> م²</span>
            </div>
            <div class="unit-card__price">
              <span class="unit-card__price-lbl">يبدأ من</span>
              <strong>${fmt(u.from)}</strong>
              <span class="unit-card__price-cur">ج.م</span>
            </div>
            ${rooms ? `<div class="unit-card__labels">${rooms}</div>` : ""}
            <div class="unit-card__labels">${deliv}</div>
            <a class="btn btn--wa btn--block" href="${waLink(`مرحبًا، أرغب في معرفة أسعار ${u.title} في كمبوند البروج`)}" target="_blank" rel="noopener" data-conv="whatsapp" data-unit="${u.id}">${ICON("i-wa")}اسأل عن ${u.title} على واتساب</a>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- payment plans ---------- */
  const payGrid = $("#payment-grid");
  if (payGrid) {
    payGrid.innerHTML = PAYMENT_PLANS.map((p) => {
      const opts = (p.options || [])
        .map((o) => {
          const lbl = o.discount ? `خصم ${o.discount}%` : "بخصم";
          return `<button type="button" class="d-label d-label--dark" data-open-form data-title="نسبة الخصم على تقسيط ${o.years} سنين – ${p.title}">${o.years} سنين · ${lbl}${ARROW}</button>`;
        })
        .join("");
      return `
        <article class="plan">
          <span class="plan__tag">${p.title}</span>
          <div class="plan__main">
            ${p.down ? `<div><small>مقدم</small><b>${p.down}</b></div>` : ""}
            <div><small>تقسيط ${p.options ? "حتى" : "على"}</small><b>${p.years} سنين</b></div>
          </div>
          <p class="plan__units">${p.units}</p>
          ${opts ? `<p class="plan__note">أو اختار مدة أقصر بخصم:</p><div class="unit-card__labels">${opts}</div>` : ""}
          <button type="button" class="plan__cta" data-open-form data-title="احسب قسطك – ${p.title}">احسب قسطك الشهري ${ARROW}</button>
        </article>`;
    }).join("");
  }

  /* ---------- gallery + lightbox ---------- */
  const galGrid = $("#gallery-grid");
  const lb = $("#lightbox");
  const lbImg = $("#lightbox-img");
  let lbIndex = 0;
  if (galGrid) {
    const SHOW = 13; /* 1 large + 12 = full 4-col grid */
    const extra = GALLERY.length - SHOW;
    galGrid.innerHTML = GALLERY.slice(0, SHOW).map(
      (src, i) => `<button type="button" class="gallery__item" data-lb="${i}" aria-label="عرض الصورة ${i + 1}"><img src="${src}" alt="صورة من كمبوند البروج ${i + 1}" loading="lazy">${i === SHOW - 1 && extra > 0 ? `<span class="gallery__more">+${extra}</span>` : ""}</button>`
    ).join("");
  }
  const showLb = (i) => {
    if (!lb) return;
    lbIndex = (i + GALLERY.length) % GALLERY.length;
    lbImg.src = GALLERY[lbIndex];
    lb.hidden = false;
    document.body.classList.add("no-scroll");
  };
  const hideLb = () => { lb.hidden = true; document.body.classList.remove("no-scroll"); };

  /* ---------- lead modal ---------- */
  const modal = $("#lead-modal");
  const form = $("#lead-form");
  const titleEl = $("#lead-title");
  const UT = typeof UNIT_TYPES !== "undefined" ? UNIT_TYPES : [];

  function openForm(ds) {
    const u = UT.find((x) => x.id === ds.type);
    let title = ds.title;
    if (!title && u) title = ds.detail ? `أسعار ${u.title} – ${ds.detail}` : `أسعار ومساحات ${u.title} المتاحة`;
    form.elements.unitType.value = u ? u.title : "";
    form.elements.detail.value = ds.detail || ds.title || "";
    titleEl.textContent = title || "أسعار ومساحات البروج المتاحة";
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    setTimeout(() => form.elements.fullName.focus(), 50);
  }
  const closeForm = () => { modal.hidden = true; document.body.classList.remove("no-scroll"); };


  /* ---------- global click handling ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const opener = t.closest("[data-open-form]");
    if (opener && modal) { openForm(opener.dataset); return; }
    if (modal && (t.closest("[data-close-form]") || t === modal)) { closeForm(); return; }

    const g = t.closest("[data-lb]");
    if (g) { showLb(+g.dataset.lb); return; }
    if (lb && (t.closest("[data-lb-close]") || t === lb)) { hideLb(); return; }
    if (t.closest("[data-lb-next]")) { showLb(lbIndex + 1); return; }
    if (t.closest("[data-lb-prev]")) { showLb(lbIndex - 1); return; }

    if (t.closest("[data-cookie-ok]")) { const c = $("#cookie"); if (c) c.hidden = true; }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (modal && !modal.hidden) closeForm(); if (lb && !lb.hidden) hideLb(); }
    if (lb && !lb.hidden && e.key === "ArrowLeft") showLb(lbIndex + 1);
    if (lb && !lb.hidden && e.key === "ArrowRight") showLb(lbIndex - 1);
  });

  /* ---------- header on scroll ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- cookie banner: once per session, auto-hide ---------- */
  try {
    if (!sessionStorage.getItem("cookieSeen")) {
      const c = $("#cookie");
      if (c) c.hidden = false;
      sessionStorage.setItem("cookieSeen", "1");
      if (c) setTimeout(() => (c.hidden = true), 8000);
    }
  } catch (_) { /* storage blocked */ }

  /* ---------- year ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
