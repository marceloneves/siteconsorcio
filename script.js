/* ===== CONFIGURAÇÃO DO REPRESENTANTE — edite aqui ===== */
const CONFIG = {
  nome: 'Nome do Representante',
  razao: 'Razão Social do Representante Ltda · CNPJ 00.000.000/0001-00',
  endereco: 'Rua Exemplo, 000 | Bairro | Cidade – UF | CEP: 00000-000',
  whatsapp: '5500000000000',          // DDI + DDD + número, só dígitos
  telefone: '(00) 00000-0000',
  email: 'contato@seudominio.com.br',
  sobre: 'Somos Representante Autorizado do Consórcio Yamaha, com atendimento próximo e transparente para ajudar você a planejar a conquista da sua moto ou produto náutico.',
  taxaAdm: 0.17,                      // taxa de administração total (ilustrativa — ajuste conforme o grupo)
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wa = txt => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* textos configuráveis */
$$('[data-cfg]').forEach(el => {
  const k = el.dataset.cfg;
  if (k === 'telLink') { el.textContent = CONFIG.telefone; el.href = wa('Olá! Gostaria de falar sobre o Consórcio Yamaha.'); el.target = '_blank'; el.rel = 'noopener'; }
  else if (k === 'emailLink') { el.textContent = CONFIG.email; el.href = 'mailto:' + CONFIG.email; }
  else el.textContent = CONFIG[k];
});

/* menu mobile */
const burger = $('.burger'), nav = $('#nav');
burger.addEventListener('click', () => {
  const o = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', o);
});
$$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* carrossel (só na home) */
const slides = $$('.slide'), dots = $('#dots');
if (slides.length) {
  let cur = 0, timer;
  slides.forEach((_, i) => { const d = document.createElement('i'); d.onclick = () => go(i, true); dots.append(d); });
  function go(i, user) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === cur));
    $$('i', dots).forEach((d, n) => d.classList.toggle('on', n === cur));
    if (user) { clearInterval(timer); timer = setInterval(() => go(cur + 1), 7000); }
  }
  $('#prev').onclick = () => go(cur - 1, true);
  $('#next').onclick = () => go(cur + 1, true);
  go(0, true);
}

/* simulador (estimativa: valor + taxa de adm. dividido pelo prazo) */
const valor = $('#valor');
if (valor) {
  const prazo = $('#prazo'), obj = $('#obj');
  const pre = new URLSearchParams(location.search).get('obj');
  if (pre) obj.value = pre;
  const sim = () => {
    const v = +valor.value, p = +prazo.value;
    const parcela = v * (1 + CONFIG.taxaAdm) / p;
    $('#valorOut').textContent = brl(v).replace(',00', '');
    $('#parcela').textContent = brl(parcela);
    $('#simWa').href = wa(`Olá! Fiz uma simulação no site: ${obj.selectedOptions[0].text}, bem de ${brl(v)} em ${p} meses (parcela estimada ${brl(parcela)}). Gostaria da proposta.`);
  };
  [valor, prazo, obj].forEach(e => e.addEventListener('input', sim));
  sim();
}

/* contato → WhatsApp */
const cf = $('#contactForm');
if (cf) cf.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  window.open(wa(`Olá! Sou ${f.get('nome')} (${f.get('tel')}). Interesse: ${f.get('interesse')}. ${f.get('msg') || ''}`), '_blank', 'noopener');
});

/* copiar link */
const copy = $('#copy');
if (copy) copy.addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Link copiado!'; }
  catch { e.target.textContent = 'Copie pela barra de endereço'; }
  setTimeout(() => e.target.textContent = 'Copiar link', 2500);
});
