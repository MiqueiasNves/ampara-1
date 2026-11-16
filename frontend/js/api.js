/* =========================================================
   Ampara | Cliente da API
   Salvar em: frontend/js/api.js
   Carregue ANTES de acesso-usuario.js e chatbot.js.

   - Abrindo o site pelo servidor Node (http://localhost:3000):
     as chamadas vão para o mesmo endereço.
   - Abrindo pelo Live Server (porta 5500) ou direto pelo arquivo:
     as chamadas vão para http://localhost:3000.
========================================================= */
(function () {
    'use strict';

    var BASE = (location.port === '3000') ? '' : 'http://localhost:3000';

    var CHAVE = 'ampara_sessao';

    function sessao() {
        try {
            return JSON.parse(
                sessionStorage.getItem(CHAVE) || localStorage.getItem(CHAVE) || 'null'
            );
        } catch (e) {
            return null;
        }
    }

    function token() {
        var s = sessao();
        return s && s.token ? s.token : null;
    }

    function limparSessao() {
        try { sessionStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
        try { localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
    }

    /* Guarda { nome, email, token, tipo } — o mesmo formato que minha-area.html e
       acesso-usuario.js já leem (o campo "tipo" é novo: 'usuario' ou 'profissional').
       "manter" = continua após fechar o navegador. */
    function salvarSessao(resposta, manter) {
        var dados = JSON.stringify({
            nome: resposta.usuario.nome,
            email: resposta.usuario.email,
            token: resposta.token,
            tipo: resposta.usuario.tipo || 'usuario'
        });
        limparSessao();
        try { (manter ? localStorage : sessionStorage).setItem(CHAVE, dados); } catch (e) { /* ignora */ }
    }

    /* ---------- Sessão do administrador (separada da de usuário/profissional) ----------
       Fica só no sessionStorage (fecha o navegador, sai). "adminLogado" continua sendo gravado
       porque as telas do painel admin já checam essa chave. */
    var CHAVE_ADMIN = 'ampara_admin';

    function sessaoAdmin() {
        try { return JSON.parse(sessionStorage.getItem(CHAVE_ADMIN) || 'null'); } catch (e) { return null; }
    }

    function limparSessaoAdmin() {
        try { sessionStorage.removeItem(CHAVE_ADMIN); } catch (e) { /* ignora */ }
        try { sessionStorage.removeItem('adminLogado'); } catch (e) { /* ignora */ }
    }

    function salvarSessaoAdmin(resposta) {
        limparSessaoAdmin();
        try {
            sessionStorage.setItem(CHAVE_ADMIN, JSON.stringify({
                nome: resposta.admin.nome,
                email: resposta.admin.email,
                token: resposta.token
            }));
            sessionStorage.setItem('adminLogado', 'true');
        } catch (e) { /* ignora */ }
    }

    /* Faz a chamada com o token indicado; se o servidor responder 401, chama aoVencer() (limpa a sessão) */
    function requisitar(caminho, opcoes, t, aoVencer) {
        opcoes = opcoes || {};
        var headers = { 'Content-Type': 'application/json' };
        if (t) headers.Authorization = 'Bearer ' + t;

        return fetch(BASE + caminho, {
            method: opcoes.method || 'GET',
            headers: headers,
            body: opcoes.body ? JSON.stringify(opcoes.body) : undefined
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (dados) {
                if (res.status === 401 && t) aoVencer(); // token vencido
                if (!res.ok) {
                    var erro = new Error(dados.erro || ('O servidor respondeu ' + res.status));
                    erro.status = res.status; // permite tratar 404, 409 etc. na tela
                    throw erro;
                }
                return dados;
            });
        });
    }

    function chamar(caminho, opcoes) {
        return requisitar(caminho, opcoes, token(), limparSessao);
    }

    function chamarAdmin(caminho, opcoes) {
        var s = sessaoAdmin();
        return requisitar(caminho, opcoes, s && s.token ? s.token : null, limparSessaoAdmin);
    }

    window.AmparaAPI = {
        base: BASE,
        sessao: sessao,
        token: token,
        chamar: chamar,
        salvarSessao: salvarSessao,
        limparSessao: limparSessao,
        cadastrar: function (nome, email, senha) {
            return chamar('/api/cadastro', { method: 'POST', body: { nome: nome, email: email, senha: senha } });
        },
        cadastrarProfissional: function (dados) {
            return chamar('/api/profissionais/cadastro', { method: 'POST', body: dados });
        },
        entrar: function (email, senha) {
            return chamar('/api/login', { method: 'POST', body: { email: email, senha: senha } });
        },

        /* administrador */
        sessaoAdmin: sessaoAdmin,
        salvarSessaoAdmin: salvarSessaoAdmin,
        limparSessaoAdmin: limparSessaoAdmin,
        chamarAdmin: chamarAdmin,
        entrarAdmin: function (email, senha) {
            // sem token: uma senha errada aqui não pode derrubar a sessão de um usuário que esteja logado
            return requisitar('/api/admin/login', { method: 'POST', body: { email: email, senha: senha } }, null, function () {});
        }
    };
})();