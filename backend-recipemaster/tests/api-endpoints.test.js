const request = require('supertest');
const { generateToken } = require('../config/jwt');

function mockControllerHandler(name) {
    return jest.fn((req, res) => res.status(200).json({
        success: true,
        endpoint: name,
        data: null
    }));
}

jest.mock('../modules/auth/authController', () => ({
    createLogin: mockControllerHandler('login')
}));

jest.mock('../modules/user/userController', () => ({
    register: mockControllerHandler('register'),
    getPublicProfile: mockControllerHandler('public-profile'),
    getUserProfile: mockControllerHandler('my-profile'),
    updateProfile: mockControllerHandler('update-profile')
}));

jest.mock('../modules/recipe/recipeController', () => ({
    create: mockControllerHandler('create-recipe'),
    getFeed: mockControllerHandler('feed'),
    getMyRecipes: mockControllerHandler('my-recipes'),
    getForEdit: mockControllerHandler('edit-recipe'),
    update: mockControllerHandler('update-recipe'),
    remove: mockControllerHandler('delete-recipe'),
    getDetails: mockControllerHandler('recipe-details')
}));

jest.mock('../modules/like/likeController', () => ({
    list: mockControllerHandler('liked-recipes'),
    toggle: mockControllerHandler('toggle-like'),
    status: mockControllerHandler('like-status')
}));

jest.mock('../modules/comment/commentController', () => ({
    create: mockControllerHandler('create-comment'),
    list: mockControllerHandler('list-comments')
}));

jest.mock('../modules/follow/followController', () => ({
    toggle: mockControllerHandler('toggle-follow'),
    status: mockControllerHandler('follow-status'),
    followers: mockControllerHandler('followers'),
    following: mockControllerHandler('following'),
    followingRecipes: mockControllerHandler('following-recipes')
}));

jest.mock('../modules/search/searchController', () => ({
    search: mockControllerHandler('search')
}));

jest.mock('../middlewares/recipeMulter', () => ({
    single: () => (req, res, next) => {
        req.file = { filename: 'test-recipe.png' };
        next();
    }
}));

jest.mock('../middlewares/profileMulter', () => ({
    single: () => (req, res, next) => {
        req.file = { filename: 'test-profile.png' };
        next();
    }
}));

const app = require('../app');

const token = generateToken({ id: 1 });
const auth = { Authorization: `Bearer ${token}` };

function apiRequest(method, path) {
    return request(app)[method.toLowerCase()](`/api${path}`);
}

function get(path, options = {}) {
    return apiRequest('GET', path).set(options);
}

function post(path, options = {}) {
    return apiRequest('POST', path).set(options);
}

function put(path, options = {}) {
    return apiRequest('PUT', path).set(options);
}

function del(path, options = {}) {
    return apiRequest('DELETE', path).set(options);
}

describe('API endpoint contract', () => {
    test.each([
        ['GET', '/', 'root'],
        ['POST', '/register', 'register'],
        ['POST', '/login', 'login'],
        ['GET', '/search?q=bolo', 'search'],
        ['GET', '/profile/maria', 'public-profile'],
        ['GET', '/recipes/10', 'recipe-details'],
        ['GET', '/recipes/10/comments', 'list-comments'],
        ['GET', '/recipes/10/like-status', 'like-status'],
        ['GET', '/users/2/followers', 'followers'],
        ['GET', '/users/2/following', 'following']
    ])('%s %s is publicly reachable', async (method, path, endpoint) => {
        const response = await apiRequest(method, path)
            .send(method === 'POST' ? {
                username: 'maria',
                email: 'maria@example.com',
                password: 'senha123',
                confirmPassword: 'senha123',
                fullName: 'Maria'
            } : undefined);

        expect(response.status).toBe(200);
        if (endpoint !== 'root') expect(response.body.endpoint).toBe(endpoint);
    });

    test.each([
        ['GET', '/profile/me', 'my-profile'],
        ['PUT', '/profile/me', 'update-profile'],
        ['GET', '/feed', 'feed'],
        ['GET', '/my-recipes', 'my-recipes'],
        ['POST', '/recipes', 'create-recipe'],
        ['GET', '/recipes/10/edit', 'edit-recipe'],
        ['PUT', '/recipes/10', 'update-recipe'],
        ['DELETE', '/recipes/10', 'delete-recipe'],
        ['GET', '/liked-recipes', 'liked-recipes'],
        ['POST', '/recipes/10/toggle-like', 'toggle-like'],
        ['POST', '/recipes/10/comments', 'create-comment'],
        ['POST', '/users/2/toggle-follow', 'toggle-follow'],
        ['GET', '/users/2/follow-status', 'follow-status'],
        ['GET', '/following-recipes', 'following-recipes']
    ])('%s %s reaches its protected controller', async (method, path, endpoint) => {
        const req = apiRequest(method, path).set(auth);

        if (method === 'POST' && path === '/recipes') {
            req.send({ title: 'Receita de teste', description: 'Descrição de teste' });
        } else if (method === 'PUT' && path === '/recipes/10') {
            req.send({ title: 'Receita atualizada', description: 'Descrição atualizada' });
        } else if (method === 'POST' && path === '/recipes/10/comments') {
            req.send({ content: 'Comentário de teste' });
        }

        const response = await req;
        expect(response.status).toBe(200);
        expect(response.body.endpoint).toBe(endpoint);
    });

    test.each([
        ['GET', '/profile/me'],
        ['PUT', '/profile/me'],
        ['GET', '/feed'],
        ['GET', '/my-recipes'],
        ['POST', '/recipes'],
        ['GET', '/recipes/10/edit'],
        ['PUT', '/recipes/10'],
        ['DELETE', '/recipes/10'],
        ['GET', '/liked-recipes'],
        ['POST', '/recipes/10/toggle-like'],
        ['POST', '/recipes/10/comments'],
        ['POST', '/users/2/toggle-follow'],
        ['GET', '/users/2/follow-status'],
        ['GET', '/following-recipes']
    ])('%s %s rejects unauthenticated requests', async (method, path) => {
        const response = await apiRequest(method, path);
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/não autenticado/i);
    });

    test('optional authentication keeps public detail endpoints available', async () => {
        const invalidToken = { Authorization: 'Bearer invalid-token' };

        await expect(get('/profile/maria', invalidToken)).resolves.toMatchObject({ status: 200 });
        await expect(get('/recipes/10', invalidToken)).resolves.toMatchObject({ status: 200 });
        await expect(get('/recipes/10/like-status', invalidToken)).resolves.toMatchObject({ status: 200 });
    });

    test('unknown routes return 404', async () => {
        const response = await get('/route-that-does-not-exist');
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });
});
