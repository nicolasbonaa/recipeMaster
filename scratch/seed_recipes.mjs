import fs from 'node:fs';
import path from 'node:path';

const API_BASE = 'http://localhost:3000/api';
const IMAGES = [
    path.resolve('frontend-recipemaster/img/comidinhas.png'),
    path.resolve('frontend-recipemaster/img/download.jpg'),
    path.resolve('frontend-recipemaster/img/panelinha.png'),
    path.resolve('frontend-recipemaster/img/povao.png'),
    path.resolve('frontend-recipemaster/src/assets/hero.png')
];

const USERS = [
    {
        username: 'chef_paola',
        fullName: 'Paola Oliveira',
        email: 'paola.chef@recipemaster.com',
        password: 'senha123chef',
        bio: 'Chef pâtissière formada em gastronomia. Compartilhando segredos de massas e doces finos.'
    },
    {
        username: 'rodrigo_massa',
        fullName: 'Rodrigo Fontana',
        email: 'rodrigo.massa@recipemaster.com',
        password: 'senha123rodrigo',
        bio: 'Tradição italiana na mesa: pastas frescas, risotos cremosos e molhos autênticos.'
    },
    {
        username: 'ana_saudavel',
        fullName: 'Ana Clara Lima',
        email: 'ana.fit@recipemaster.com',
        password: 'senha123anaclara',
        bio: 'Receitas saudáveis, saborosas e sem neurose para o dia a dia.'
    },
    {
        username: 'marcelo_bbq',
        fullName: 'Marcelo Parrilla',
        email: 'marcelo.bbq@recipemaster.com',
        password: 'senha123marcelo',
        bio: 'Churrasco, defumação, cortes nobres e acompanhamentos rústicos.'
    },
    {
        username: 'dona_bete',
        fullName: 'Bete Rodrigues',
        email: 'bete.receitas@recipemaster.com',
        password: 'senha123donabete',
        bio: 'Cozinha afetiva com tempero de mãe e memória de casa de vó.'
    },
    {
        username: 'lucas_fit',
        fullName: 'Lucas Mendes',
        email: 'lucas.mendes@recipemaster.com',
        password: 'senha123lucas',
        bio: 'Praticidade total: marmitas da semana e refeições prontas em 20 minutos.'
    }
];

const RECIPES = [
    // Paola (Doces e panificação)
    {
        userIndex: 0,
        title: 'Torta Holandesa Cremosa com Chocolate Belga',
        description: 'Base crocante de biscoito calipso, creme aerado de baunilha fresca e ganache espelhada de chocolate belga meio amargo.'
    },
    {
        userIndex: 0,
        title: 'Bolo de Cenoura com Casquinha Crocante de Chocolate',
        description: 'Massa fofinha e dourada feita no liquidificador, coberta com calda quente de brigadeiro que endurece ao esfriar.'
    },
    {
        userIndex: 0,
        title: 'Pão de Fermentação Natural Rústico',
        description: 'Pão artesanal de casca estaladiça e miolo alveolado, fermentado por 24 horas a frio. Perfeito com azeite.'
    },
    {
        userIndex: 0,
        title: 'Cheesecake Clássica de Frutas Vermelhas',
        description: 'Recheio aveludado à base de cream cheese e raspas de limão siciliano, coberto com coulis artesanal de morango e amora.'
    },
    {
        userIndex: 0,
        title: 'Cookies Americanos com Gotas de Chocolate Duplo',
        description: 'Massa amanteigada macia no centro e dourada nas bordas, carregada de chocolate meio amargo e toque de flor de sal.'
    },

    // Rodrigo (Italiana)
    {
        userIndex: 1,
        title: 'Fettuccine ao Molho Alfredo Tradicional',
        description: 'Massa fresca salteada na manteiga de primeira qualidade e queijo parmesão ralado na hora com emulsão da água do cozimento.'
    },
    {
        userIndex: 1,
        title: 'Risoto de Cogumelos Frescos e Azeite Trufado',
        description: 'Arroz arbóreo cozido lentamente no caldo de legumes, shitake e shimeji tostados, finalizado com manteiga e parmesão.'
    },
    {
        userIndex: 1,
        title: 'Lasanha à Bolonhesa Clássica Italiana',
        description: 'Camadas de massa artesanal, ragù de carne cozido por 3 horas no vinho tinto e molho bechamel cremoso com noz-moscada.'
    },
    {
        userIndex: 1,
        title: 'Gnocchi de Batata ao Sugo com Manjericão',
        description: 'Nhoque artesanal leve como uma nuvem, servido com molho rústico de tomate pelati e folhas frescas de manjericão.'
    },
    {
        userIndex: 1,
        title: 'Focaccia Genovesa com Alecrim e Sal Grosso',
        description: 'Massa macia e aromática regada generosamente com azeite extravirgem, ramos de alecrim fresco e flor de sal marinho.'
    },

    // Ana (Saudável)
    {
        userIndex: 2,
        title: 'Bowl de Salmão Grelhado com Quinoa e Abacate',
        description: 'Refeição equilibrada com cubos de salmão selado, quinoa temperada, fatias de avocado e molho especial de gergelim e limão.'
    },
    {
        userIndex: 2,
        title: 'Panqueca Proteica de Banana e Aveia',
        description: 'Opção nutritiva para café da manhã sem adição de açúcar: banana madura, aveia em flocos e canela. Pronta em 5 minutos.'
    },
    {
        userIndex: 2,
        title: 'Salada Mediterrânea com Grão-de-Bico e Queijo Feta',
        description: 'Mix refrescante de pepino japonês, tomates-cereja doces, azeitonas pretas, ervas frescas e grão-de-bico crocante.'
    },
    {
        userIndex: 2,
        title: 'Creme de Abóbora Cabotiá com Gengibre e Croûtons',
        description: 'Sopa aveludada reconfortante com abóbora assada, toque aromático de gengibre e sementes de abóbora tostadas.'
    },
    {
        userIndex: 2,
        title: 'Muffin Salgado de Frango Desfiado com Ricota',
        description: 'Lanche prático e leve: peito de frango temperado com ervas, ricota fresca e massa aerada assada até dourar.'
    },

    // Marcelo (Carnes e BBQ)
    {
        userIndex: 3,
        title: 'Picanha na Parrilla com Manteiga de Ervas',
        description: 'Corte nobre selado na brasa alta com crosta crocante e centro suculento, finalizado com manteiga de alecrim e alho confit.'
    },
    {
        userIndex: 3,
        title: 'Costela Suína com Barbecue de Goiabada',
        description: 'Costelinha assada em fogo lento até soltar do osso, caramelizada com molho barbecue defumado feito com goiabada cascão.'
    },
    {
        userIndex: 3,
        title: 'Hambúrguer Artesanal com Queijo Cheddar e Bacon',
        description: 'Blend suculento de 180g de fraldinha e peito, cheddar derretido, fatias de bacon caramelizado e pão brioche tostado.'
    },
    {
        userIndex: 3,
        title: 'Bife Ancho com Purê de Mandioquinha Defumada',
        description: 'Steak alto com excelente marmoreio grelhado ao ponto, acompanhado de purê sedoso com manteiga tostada e chimichurri.'
    },
    {
        userIndex: 3,
        title: 'Frango Defumado ao Estilo Beer Can Chicken',
        description: 'Frango inteiro marinado por 12 horas, assado na churrasqueira com cerveja artesanal para garantir pele crocante e carne úmida.'
    },

    // Dona Bete (Comida de Vó)
    {
        userIndex: 4,
        title: 'Picadinho de Carne Tradicional com Farofa de Banana',
        description: 'Cubinhos tenros de carne bovina cozidos em caldo encorpado de legumes, servidos com farofa crocante de manteiga de garrafa.'
    },
    {
        userIndex: 4,
        title: 'Feijoada Completa com Couve e Torresmo Crocante',
        description: 'Feijão preto cozido com carnes nobres defumadas, arroz soltinho, couve mineira fininha e torresmo estaladiço.'
    },
    {
        userIndex: 4,
        title: 'Bolo de Fubá Cremoso com Erva-Doce',
        description: 'Receita clássica de família que forma uma camada cremosa no centro enquanto assa. O verdadeiro sabor da roça.'
    },
    {
        userIndex: 4,
        title: 'Vaca Atolada com Mandioca e Cheiro-Verde',
        description: 'Costela bovina cozida na panela de ferro até desmanchar, integrada a pedaços de mandioca amarela macia como manteiga.'
    },
    {
        userIndex: 4,
        title: 'Pudim de Leite Condensado Sem Furinhos',
        description: 'Pudim lisinho e super aveludado, assado em banho-maria com calda dourada de caramelo artesanal no ponto exato.'
    },

    // Lucas (Marmitas e Praticidade)
    {
        userIndex: 5,
        title: 'Strogonoff de Frango Cremoso com Cogumelos',
        description: 'Iscas de frango douradas, molho cremoso à base de creme de leite fresco e mostarda dijon, acompanhado de batata palha caseira.'
    },
    {
        userIndex: 5,
        title: 'Frango Xadrez Fácil com Pimentões e Amendoim',
        description: 'Cubos de peito de frango salteados na frigideira com pimentões coloridos, cebola, molho shoyu especial e amendoim tostado.'
    },
    {
        userIndex: 5,
        title: 'Arroz Biro-Biro com Bacon e Batata Crocante',
        description: 'Aproveitamento saboroso de arroz: puxado na frigideira com bacon dourado, ovos mexidos cremosos e batata palha fina.'
    },
    {
        userIndex: 5,
        title: 'Omelete Recheada com Queijo Brie e Tomatinhos',
        description: 'Ovos caipiras batidos com ervas, recheados com queijo brie derretido e tomates-uva salteados no azeite.'
    },
    {
        userIndex: 5,
        title: 'Wrap Rápido de Atum com Maionese de Abacate',
        description: 'Pão folha leve enrolado com atum desfiado, maionese verde de abacate, folhas crocantes de rúcula e cenoura ralada.'
    }
];

async function postJson(endpoint, data, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });
    return res.json();
}

async function uploadRecipe(token, recipe, imagePath) {
    const formData = new FormData();
    formData.append('title', recipe.title);
    formData.append('description', recipe.description);

    const buffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).slice(1);
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const blob = new Blob([buffer], { type: mime });
    formData.append('image', blob, path.basename(imagePath));

    const res = await fetch(`${API_BASE}/recipes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return res.json();
}

async function followUser(token, targetUserId) {
    const res = await fetch(`${API_BASE}/users/${targetUserId}/toggle-follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
}

async function main() {
    console.log('--- INICIANDO SEED DE USUARIOS E RECEITAS ---');

    const createdUsers = [];

    // 1. Cadastrar e logar usuários
    for (const u of USERS) {
        console.log(`Verificando/cadastrando usuário @${u.username}...`);
        try {
            await postJson('/register', {
                username: u.username,
                email: u.email,
                password: u.password,
                confirmPassword: u.password,
                fullName: u.fullName
            });
        } catch (_) {}

        const loginRes = await postJson('/login', { email: u.email, password: u.password });
        if (!loginRes?.data?.token) {
            console.error(`Falha no login do usuário ${u.username}:`, loginRes);
            continue;
        }

        const token = loginRes.data.token;

        // Atualizar bio
        const meRes = await fetch(`${API_BASE}/profile/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());

        const userId = meRes.data.id;

        // Atualiza a bio se ainda não tiver
        const formBio = new FormData();
        formBio.append('fullName', u.fullName);
        formBio.append('bio', u.bio);
        await fetch(`${API_BASE}/profile/me`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formBio
        });

        createdUsers.push({ ...u, id: userId, token });
        console.log(`-> Usuário @${u.username} (ID: ${userId}) pronto.`);
    }

    // 2. Criar 30 receitas
    console.log(`\nPublicando ${RECIPES.length} receitas...`);
    let count = 0;
    for (let i = 0; i < RECIPES.length; i++) {
        const item = RECIPES[i];
        const author = createdUsers[item.userIndex];
        const imagePath = IMAGES[i % IMAGES.length];

        const res = await uploadRecipe(author.token, item, imagePath);
        if (res.success) {
            count++;
            console.log(`[${count}/${RECIPES.length}] OK: "${item.title}" por @${author.username}`);
        } else {
            console.error(`Erro ao criar "${item.title}":`, res.message);
        }
    }

    // 3. Estabelecer conexões de 'seguir' para popular o feed filtrado
    console.log('\nConfigurando conexões de seguidores entre os chefs...');
    for (let i = 0; i < createdUsers.length; i++) {
        const current = createdUsers[i];
        // Cada um segue os próximos 2 chefs da lista
        for (let offset = 1; offset <= 2; offset++) {
            const target = createdUsers[(i + offset) % createdUsers.length];
            await followUser(current.token, target.id);
            console.log(`@${current.username} começou a seguir @${target.username}`);
        }
    }

    console.log('\n=== SEED CONCLUIDO COM SUCESSO! ===');
    console.log(`Total de usuários: ${createdUsers.length}`);
    console.log(`Total de receitas publicadas: ${count}`);
}

main().catch(err => {
    console.error('Erro na execução do seed:', err);
    process.exit(1);
});
