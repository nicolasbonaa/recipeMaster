import api from "./api";

export function register(payload){
    return api.post('/register', payload, { silent: true });
}

export function login(payload){
    return api.post('/login', payload, { silent: true });
}

// Sem corpo (undefined): com null o axios enviava o texto "null", o express.json() recusava com 400
// e, como o cors vinha depois dos parsers, o navegador mostrava um erro de CORS no Console.
export function logout(){
    return api.post('/logout', undefined, { silent: true });
}