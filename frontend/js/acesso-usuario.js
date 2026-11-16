/* =========================================================
   Ampara | Ícone de acesso do usuário
   Salvar em: js/acesso-usuario.js

   O que faz:
   - Visitante: mostra o botão "Entrar" (ícone de pessoa).
   - Logado: mostra o avatar com as iniciais e um menu
     (Minha área / Sair).
   - Funciona na raiz (index.html) e dentro de /pages/ sem
     precisar mudar nada: os caminhos são calculados a partir
     do local deste próprio arquivo.
========================================================= */
(function () {
    'use strict';

    /* ---------- CONFIGURAÇÃO (ajuste os nomes se necessário) ---------- */
    var SESSION_KEY = 'ampara_sessao';        // mesma chave usada em minha-area.html
    var PAGINA_LOGIN = 'pages/login.html';    // <- troque pelo nome da sua tela de login
    var PAGINA_AREA = 'pages/minha-area.html';
    var PAGINA_AREA_PROFISSIONAL = 'pages/area-profissional.html';
    var PAGINA_INICIO = 'index.html';

    /* ---------- CAMINHO BASE (raiz do site) ---------- */
    var script = document.currentScript;
    var root = '';
    if (script && script.src) {
        root = script.src.replace(/js\/acesso-usuario\.js.*$/, '');
    }

    /* ---------- SESSÃO ---------- */
    function getSessao() {
        try {
            return JSON.parse(
                sessionStorage.getItem(SESSION_KEY) ||
                localStorage.getItem(SESSION_KEY) ||
                'null'
            );
        } catch (e) {
            return null;
        }
    }

    function sair() {
        try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignora */ }
        try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignora */ }
        window.location.href = root + PAGINA_INICIO;
    }

    /* ---------- UTILITÁRIOS ---------- */
    function esc(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function iniciais(nome) {
        var partes = String(nome).trim().split(/\s+/);
        var a = partes[0] ? partes[0][0] : '?';
        var b = partes.length > 1 ? partes[partes.length - 1][0] : '';
        return (a + b).toUpperCase();
    }

    var ICONE_USUARIO =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/></svg>';

    /* ---------- MONTAGEM ---------- */
    function montar() {
        var navbar = document.querySelector('.navbar');
        if (!navbar || navbar.querySelector('.user-access')) return;

        var sessao = getSessao();
        var wrap = document.createElement('div');
        wrap.className = 'user-access';

        if (!sessao || !sessao.nome) {
            /* ----- VISITANTE ----- */
            wrap.innerHTML =
                '<a class="user-access-btn" href="' + root + PAGINA_LOGIN + '" aria-label="Entrar na sua conta">' +
                ICONE_USUARIO + '<span class="user-access-label">Entrar</span>' +
                '</a>';
        } else {
            /* ----- LOGADO ----- */
            var primeiro = sessao.nome.split(' ')[0];
            var ehProfissional = sessao.tipo === 'profissional';
            wrap.innerHTML =
                '<button class="user-access-btn is-logged" type="button" id="ua-toggle" ' +
                'aria-haspopup="true" aria-expanded="false" aria-controls="ua-menu" ' +
                'aria-label="Menu da conta de ' + esc(primeiro) + '">' +
                '<span class="user-access-avatar" aria-hidden="true">' + esc(iniciais(sessao.nome)) + '</span>' +
                '<span class="user-access-label">' + esc(primeiro) + '</span>' +
                '</button>' +
                '<div class="user-access-menu" id="ua-menu" role="menu" hidden>' +
                '<div class="user-access-head">' +
                '<strong>' + esc(sessao.nome) + '</strong>' +
                (sessao.email ? '<small>' + esc(sessao.email) + '</small>' : '') +
                '</div>' +
                '<a role="menuitem" href="' + root + (ehProfissional ? PAGINA_AREA_PROFISSIONAL : PAGINA_AREA) + '">' +
                (ehProfissional ? 'Área do profissional' : 'Minha área') + '</a>' +
                '<button role="menuitem" type="button" id="ua-sair">Sair</button>' +
                '</div>';
        }

        /* Coloca o ícone antes do botão "Converse com a Ampara" */
        var cta = navbar.querySelector('.nav-button');
        if (cta) navbar.insertBefore(wrap, cta);
        else navbar.appendChild(wrap);

        if (!sessao || !sessao.nome) return;

        /* ----- Interações do menu ----- */
        var toggle = wrap.querySelector('#ua-toggle');
        var menu = wrap.querySelector('#ua-menu');

        function abrir() {
            menu.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
        }
        function fechar() {
            menu.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (menu.hidden) abrir(); else fechar();
        });

        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) fechar();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !menu.hidden) {
                fechar();
                toggle.focus();
            }
        });

        wrap.querySelector('#ua-sair').addEventListener('click', sair);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', montar);
    } else {
        montar();
    }
})();