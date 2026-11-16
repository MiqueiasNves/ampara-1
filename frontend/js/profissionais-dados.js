/* ===================================== */
/* AMPARA - DADOS COMPARTILHADOS DOS PROFISSIONAIS */
/* profissionais-dados.js */
/* Usado pela página pública (profissionais.html) */
/* e pela página do admin (gerenciar-profissionais.html) */
/* ===================================== */

const AMPARA_PROF_CHAVE = "ampara_profissionais";

const AMPARA_ESPECIALIDADES = [
    "Ansiedade",
    "Depressão",
    "Estresse e Burnout",
    "Luto",
    "Relacionamentos",
    "Autoestima",
    "Jovens e adolescentes"
];

const AMPARA_TIPOS = ["Psicólogo(a)", "Psiquiatra", "Terapeuta"];

const AMPARA_MODALIDADES = ["Online", "Presencial", "Online e presencial"];

const AMPARA_STATUS = {
    ativo: "Ativo",
    pendente: "Pendente",
    inativo: "Inativo"
};

/* Profissionais FICTÍCIOS, apenas para demonstração do projeto */
const AMPARA_PROF_EXEMPLOS = [
    {
        id: 1,
        nome: "Dra. Helena Duarte",
        tipo: "Psicólogo(a)",
        registro: "CRP 06/00001",
        especialidade: "Ansiedade",
        modalidade: "Online e presencial",
        valor: 120,
        email: "helena.duarte@exemplo.com",
        telefone: "(11) 90000-0001",
        disponibilidade: "Seg a Qui, 9h às 17h",
        bio: "Atua com terapia cognitivo-comportamental, ajudando pessoas a lidar com ansiedade, crises de pânico e preocupação excessiva. Atendimento acolhedor e sem julgamentos.",
        status: "ativo"
    },
    {
        id: 2,
        nome: "Dr. Rafael Monteiro",
        tipo: "Psiquiatra",
        registro: "CRM-SP 000002",
        especialidade: "Depressão",
        modalidade: "Online",
        valor: 280,
        email: "rafael.monteiro@exemplo.com",
        telefone: "(11) 90000-0002",
        disponibilidade: "Ter e Qui, 14h às 20h",
        bio: "Psiquiatra com foco em transtornos de humor. Trabalha em conjunto com psicólogos para um acompanhamento completo e humanizado.",
        status: "ativo"
    },
    {
        id: 3,
        nome: "Dra. Camila Azevedo",
        tipo: "Psicólogo(a)",
        registro: "CRP 06/00003",
        especialidade: "Estresse e Burnout",
        modalidade: "Online",
        valor: 100,
        email: "camila.azevedo@exemplo.com",
        telefone: "(11) 90000-0003",
        disponibilidade: "Seg a Sex, 18h às 21h",
        bio: "Especialista em saúde mental no trabalho. Ajuda profissionais a reconhecer sinais de esgotamento e a reconstruir uma relação mais saudável com a rotina.",
        status: "ativo"
    },
    {
        id: 4,
        nome: "Marcos Vieira",
        tipo: "Psicólogo(a)",
        registro: "CRP 06/00004",
        especialidade: "Jovens e adolescentes",
        modalidade: "Presencial",
        valor: 90,
        email: "marcos.vieira@exemplo.com",
        telefone: "(11) 90000-0004",
        disponibilidade: "Sáb, 8h às 14h",
        bio: "Atendimento voltado a jovens e adolescentes, com escuta atenta para temas como pressão escolar, ansiedade social e construção de identidade.",
        status: "ativo"
    },
    {
        id: 5,
        nome: "Dra. Beatriz Lacerda",
        tipo: "Psicólogo(a)",
        registro: "CRP 06/00005",
        especialidade: "Luto",
        modalidade: "Online e presencial",
        valor: 0,
        email: "beatriz.lacerda@exemplo.com",
        telefone: "(11) 90000-0005",
        disponibilidade: "Qua e Sex, 10h às 16h",
        bio: "Acompanha pessoas em processos de perda e luto. Mantém vagas de atendimento social gratuito para quem não pode arcar com os custos.",
        status: "ativo"
    },
    {
        id: 6,
        nome: "Dr. Thiago Nascimento",
        tipo: "Psicólogo(a)",
        registro: "CRP 06/00006",
        especialidade: "Relacionamentos",
        modalidade: "Online",
        valor: 150,
        email: "thiago.nascimento@exemplo.com",
        telefone: "(11) 90000-0006",
        disponibilidade: "Seg, Qua e Sex, 19h às 22h",
        bio: "Trabalha dificuldades de relacionamento, comunicação e limites, tanto em atendimento individual quanto de casal.",
        status: "ativo"
    },
    {
        id: 7,
        nome: "Juliana Prado",
        tipo: "Terapeuta",
        registro: "REG 00007",
        especialidade: "Autoestima",
        modalidade: "Online",
        valor: 80,
        email: "juliana.prado@exemplo.com",
        telefone: "(11) 90000-0007",
        disponibilidade: "Ter a Sex, 13h às 18h",
        bio: "Terapeuta com foco em autoestima e autoconhecimento, usando práticas de atenção plena para fortalecer a relação consigo mesmo.",
        status: "ativo"
    },
    {
        id: 8,
        nome: "Dra. Renata Figueiredo",
        tipo: "Psiquiatra",
        registro: "CRM-SP 000008",
        especialidade: "Ansiedade",
        modalidade: "Presencial",
        valor: 300,
        email: "renata.figueiredo@exemplo.com",
        telefone: "(11) 90000-0008",
        disponibilidade: "Seg e Qua, 8h às 12h",
        bio: "Cadastro aguardando aprovação da equipe administrativa.",
        status: "pendente"
    }
];

function carregarProfissionais() {
    try {
        const salvo = localStorage.getItem(AMPARA_PROF_CHAVE);
        if (salvo) return JSON.parse(salvo);
    } catch (e) { /* usa os exemplos */ }
    return JSON.parse(JSON.stringify(AMPARA_PROF_EXEMPLOS));
}

function salvarProfissionais(lista) {
    try {
        localStorage.setItem(AMPARA_PROF_CHAVE, JSON.stringify(lista));
    } catch (e) { /* armazenamento indisponível */ }
}

function iniciaisDoNome(nome) {
    const partes = nome
        .split(/\s+/)
        .filter(p => p && !/^(dr|dra)\.?$/i.test(p));

    if (partes.length === 0) return "?";
    if (partes.length === 1) return partes[0][0].toUpperCase();

    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function formatarValor(valor) {
    const numero = Number(valor) || 0;
    if (numero === 0) return "Gratuito / social";
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}