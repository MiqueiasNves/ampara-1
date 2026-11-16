'use strict';

/* =========================================================
   Ampara | Segurança: hash de senha e token de sessão
   Usa só módulos nativos do Node (crypto), sem dependências.
========================================================= */

const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

/* ---------- Senhas (scrypt + salt aleatório) ---------- */
async function hashSenha(senha) {
    const salt = crypto.randomBytes(16);
    const hash = await scrypt(senha, salt, 64);
    return 'scrypt$' + salt.toString('hex') + '$' + hash.toString('hex');
}

async function confereSenha(senha, guardado) {
    const partes = String(guardado || '').split('$');
    if (partes.length !== 3 || partes[0] !== 'scrypt') return false;
    const esperado = Buffer.from(partes[2], 'hex');
    if (!esperado.length) return false;
    const calculado = await scrypt(senha, Buffer.from(partes[1], 'hex'), esperado.length);
    return crypto.timingSafeEqual(calculado, esperado);
}

/* ---------- Token assinado (HMAC-SHA256) ---------- */
function assinatura(corpo) {
    return crypto.createHmac('sha256', process.env.JWT_SECRET).update(corpo).digest();
}

function assinar(dados, segundosDeValidade) {
    const payload = Object.assign({}, dados, {
        exp: Math.floor(Date.now() / 1000) + segundosDeValidade
    });
    const corpo = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return corpo + '.' + assinatura(corpo).toString('base64url');
}

function verificar(token) {
    if (typeof token !== 'string') return null;
    const partes = token.split('.');
    if (partes.length !== 2) return null;

    const esperado = assinatura(partes[0]);
    const recebido = Buffer.from(partes[1], 'base64url');
    if (recebido.length !== esperado.length || !crypto.timingSafeEqual(recebido, esperado)) return null;

    try {
        const payload = JSON.parse(Buffer.from(partes[0], 'base64url').toString('utf8'));
        return payload.exp > Date.now() / 1000 ? payload : null;
    } catch (e) {
        return null;
    }
}

module.exports = { hashSenha, confereSenha, assinar, verificar };
