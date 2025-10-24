const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const I18N = {
  en: {
    tagline: "Premium Gaming & Digital Goods",
    sale_banner: "SALE: Up to 40% off all products",
    unlock_discount: "Unlock Discount",
    hero_sub: "High-quality items. Yellow & Black elegance.",
    categories_title: "Categories",
    paypal_only: "Payment: PayPal only",
    buy_now: "Buy with PayPal",
    footer_all_rights: "All rights reserved."
  },
  de: {
    tagline: "Premium Gaming & Digitale Güter",
    sale_banner: "SALE: Bis zu 40% Rabatt auf alle Produkte",
    unlock_discount: "Rabatt freischalten",
    hero_sub: "Hochwertige Artikel. Gelb & Schwarz Eleganz.",
    categories_title: "Kategorien",
    paypal_only: "Zahlung: Nur PayPal",
    buy_now: "Mit PayPal kaufen",
    footer_all_rights: "Alle Rechte vorbehalten."
  },
  ar: {
    tagline: "منتجات ألعاب رقمية مميزة",
    sale_banner: "تخفيضات: حتى 40% على جميع المنتجات",
    unlock_discount: "تفعيل الخصم",
    hero_sub: "عناصر عالية الجودة. أناقة الأصفر والأسود.",
    categories_title: "الفئات",
    paypal_only: "الدفع: PayPal فقط",
    buy_now: "اشتري عبر PayPal",
    footer_all_rights: "جميع الحقوق محفوظة."
  }
};

let state = {
  lang: 'en',
  products: [],
  discountActive: false
};

function setLang(lang){
  state.lang = lang;
  document.body.classList.toggle('rtl', lang === 'ar');
  $$('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = I18N[lang][key] || el.textContent;
  });
  // Re-render products to update text
  renderProducts(state.products);
}

async function loadProducts(){
  const res = await fetch('products.json');
  const data = await res.json();
  state.products = data;
  buildCategories(data);
  renderProducts(data);
}

function buildCategories(products){
  const list = $('#categoryList');
  list.innerHTML = '';
  const cats = [...new Set(products.map(p => p.category[state.lang]))];
  const mk = (name) => {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', () => {
      $$('#categoryList li').forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      const filtered = products.filter(p => p.category[state.lang] === name);
      renderProducts(filtered);
    });
    return li;
  };
  list.appendChild(mk('All'));
  cats.forEach(c => list.appendChild(mk(c)));
}

function renderProducts(list){
  const grid = $('#productGrid');
  grid.innerHTML = '';
  list.forEach(p => {
    const tmpl = $('#productCardTmpl').content.cloneNode(true);
    const title = $('.title', tmpl);
    const cat = $('.category', tmpl);
    const priceOld = $('.price-old', tmpl);
    const price = $('.price', tmpl);
    const buyBtn = $('.buy-btn', tmpl);
    const thumb = $('.thumb', tmpl);
    const badge = $('#discBadge', tmpl);

    // Set texts per language
    title.textContent = p.name[state.lang] || p.name.en;
    cat.textContent = p.category[state.lang] || p.category.en;

    // Discount logic
    let finalPrice = p.price;
    if(state.discountActive){
      badge.style.display = 'inline-block';
      priceOld.style.display = 'inline';
      priceOld.textContent = `$${p.price.toFixed(2)}`;
      finalPrice = +(p.price * 0.6).toFixed(2); // 40% off
    }
    price.textContent = `$${finalPrice.toFixed(2)}`;

    // Optional: replace placeholder background if you add real images later
    thumb.style.backgroundImage = "url('assets/logo.jpeg')";

    // PayPal button placeholder (render on click to avoid loading many iframes)
    buyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const slot = $('.paypal-slot', e.target.closest('.card'));
      if(slot.dataset.rendered) return;
      slot.dataset.rendered = "1";
      if(typeof paypal !== 'undefined'){
        paypal.Buttons({
          createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: finalPrice.toString() }, description: title.textContent }]
          }),
          onApprove: (data, actions) => actions.order.capture().then(() => {
            alert('Thanks for your purchase!');
          })
        }).render(slot);
      }else{
        slot.textContent = 'PayPal SDK not loaded. Add your Client ID in index.html.';
      }
    });

    grid.appendChild(tmpl);
  });
}

function initDiscount(){
  const input = $('#passInput');
  const btn = $('#passBtn');
  const stateText = $('#passState');
  btn.addEventListener('click', () => {
    const val = (input.value || '').trim();
    if(val.toUpperCase() === 'ELEGANCE40'){
      state.discountActive = true;
      stateText.textContent = state.lang === 'de' ? '40% Rabatt aktiviert' :
                              state.lang === 'ar' ? 'تم تفعيل خصم 40%' :
                              '40% discount activated';
      renderProducts(state.products);
    }else{
      stateText.textContent = state.lang === 'de' ? 'Falsches Passwort' :
                              state.lang === 'ar' ? 'كلمة مرور غير صحيحة' :
                              'Wrong password';
    }
  });
}

function initLangSwitch(){
  $$('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

function initYear(){
  $('#year').textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  initDiscount();
  initYear();
  loadProducts().then(() => setLang('en'));
});