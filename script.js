/* ===== CONFIGURAÇÃO DO REPRESENTANTE — edite aqui ===== */
const CONFIG = {
  nome: 'Tamy de Almeida',
  razao: 'Seu Consórcio Administradora de Consórcios Ltda. · CNPJ 16.516.142/0001-46',
  endereco: 'Av. das Nações Unidas, 14.261, Ala B, 27º andar | Morumbi | São Paulo – SP',
  whatsapp: '5511982437169',          // DDI + DDD + número, só dígitos
  telefone: '(11) 9 8243-7169 / (11) 2729-4472',
  email: 'contato@seuconsorcioimobiliario.com.br',
  sobre: 'Somos Representante Autorizado do Consórcio Imobiliário, com atendimento próximo e transparente para ajudar você a planejar a conquista do seu imóvel.',
  taxaAdm: 0.17,                      // taxa de administração total (ilustrativa — ajuste conforme o grupo)
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wa = txt => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* textos configuráveis */
$$('[data-cfg]').forEach(el => {
  const k = el.dataset.cfg;
  if (k === 'telLink') { el.textContent = CONFIG.telefone; el.href = wa('Olá! Gostaria de falar sobre o Consórcio Imobiliário.'); el.target = '_blank'; el.rel = 'noopener'; }
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
    const imgs = $$('.hero__img');
    imgs.forEach((im, n) => im.classList.toggle('on', n === cur % imgs.length));
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

/* botão flutuante de WhatsApp (todas as páginas) */
const fab = document.createElement('a');
fab.className = 'wa-fab';
fab.href = wa('Olá! Gostaria de saber mais sobre o Consórcio Imobiliário.');
fab.target = '_blank';
fab.rel = 'noopener';
fab.setAttribute('aria-label', 'Falar no WhatsApp');
fab.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="#fff" d="M16 3C9.4 3 4 8.3 4 14.9c0 2.3.7 4.5 1.9 6.3L4 28l7-1.8c1.7.9 3.100 1.300 5 1.300 6.600 0 12-5.300 12-11.900S22.600 3 16 3zm0 21.700c-1.700 0-3.300-.5-4.700-1.300l-.3-.2-4.100 1.100 1.100-4-.2-.3c-1-1.400-1.500-3-1.500-4.700C6.300 9.600 10.700 5.300 16 5.300s9.700 4.300 9.700 9.600-4.400 9.800-9.700 9.800zm5.300-7.300c-.3-.1-1.700-.8-2-.9-.3-.1-.5-.1-.7.100-.2.300-.8.900-.9 1.100-.2.200-.3.200-.6.100-.3-.1-1.200-.4-2.300-1.400-.8-.8-1.400-1.700-1.600-2-.2-.3 0-.4.100-.6l.4-.5c.1-.2.200-.3.300-.5.100-.2 0-.4 0-.5l-.9-2.100c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.400-.3.300-1 1-1 2.400s1 2.800 1.200 3c.1.2 2 3.100 4.900 4.300.7.300 1.200.5 1.600.6.700.2 1.300.2 1.800.1.600-.1 1.700-.7 1.900-1.400.2-.7.200-1.200.2-1.400-.1-.1-.3-.2-.6-.3z"/></svg>';
document.body.append(fab);

/* animações de entrada ao rolar */
document.documentElement.classList.add('js');
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
$$('.title, .card, .steps li, .strip__in li, .panel, .portrait, .stats li, details, .side-img, .info').forEach((el, i) => {
  el.classList.add('rv'); io.observe(el);
});

/* garantia: se a animação de entrada não disparar, mostra tudo */
setTimeout(() => $$('.rv:not(.in)').forEach(el => el.classList.add('in')), 2500);
