/* =========================================================
   Ampara | Menu do usuário (ícone de pessoa no topo)
   Salvar em: frontend/js/usuario-menu.js

   - Visitante: mantém o menu que está no HTML (Entrar / Criar conta / Sou profissional).
   - Logado: o menu passa a mostrar as iniciais, o nome, "Minha área" (ou "Área do profissional") e "Sair".
   A sessão é a mesma gravada por api.js: chave "ampara_sessao".
========================================================= */
(function () {
  'use strict';
  var menu = document.querySelector('.user-menu');
  if (!menu) return;
  var btn = menu.querySelector('.user-menu-btn');
  var box = menu.querySelector('.user-menu-dropdown');

  /* ---------- caminho da raiz do site (calculado a partir deste arquivo) ---------- */
  var script = document.currentScript;
  var root = '';
  if (script && script.src) root = script.src.replace(/js\/usuario-menu\.js.*$/, '');

  /* ---------- sessão ---------- */
  var CHAVE = 'ampara_sessao';
  function getSessao() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE) || localStorage.getItem(CHAVE) || 'null');
    } catch (e) { return null; }
  }
  function sair() {
    try { sessionStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
    try { localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
    window.location.href = root + 'index.html';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function iniciais(nome) {
    var p = String(nome).trim().split(/\s+/);
    return ((p[0] ? p[0][0] : '?') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }

  /* ---------- usuário logado: troca o conteúdo do menu ---------- */
  var sessao = getSessao();
  if (sessao && sessao.nome) {
    var profissional = sessao.tipo === 'profissional';
    var destino = root + 'pages/' + (profissional ? 'area-profissional.html' : 'minha-area.html');

    btn.setAttribute('aria-label', 'Menu da conta de ' + sessao.nome.split(' ')[0]);
    btn.innerHTML = '<span aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;' +
      'width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7fbfa3,#b9a5df);' +
      'color:#fff;font-weight:600;font-size:.8rem">' + esc(iniciais(sessao.nome)) + '</span>';

    box.innerHTML =
      '<div style="padding:8px 14px 10px;border-bottom:1px solid rgba(0,0,0,.08);margin-bottom:4px">' +
      '<strong style="display:block;font-size:.9rem">' + esc(sessao.nome) + '</strong>' +
      (sessao.email ? '<small style="opacity:.7">' + esc(sessao.email) + '</small>' : '') +
      '</div>' +
      '<a href="' + destino + '">' + (profissional ? 'Área do profissional' : 'Minha área') + '</a>' +
      '<a href="#" id="menu-sair">Sair</a>';

    box.querySelector('#menu-sair').addEventListener('click', function (e) {
      e.preventDefault();
      sair();
    });
  }

  /* ---------- abrir / fechar ---------- */
  function fechar() { box.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var abrir = box.hidden;
    box.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
  });
  document.addEventListener('click', function (e) { if (!menu.contains(e.target)) fechar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
})();