const jwt = require('jsonwebtoken');

exports.checkAuthMiddleware = (request, response, next) => {
  const { authorization } = request.headers;
  
  // Se não houver token presente, redirecione para a tela de login
  if (!authorization) {
    return response.redirect('/home');
  }

  const [, token] = authorization?.split(' ');

  if (!token) {
    return response.redirect('/home');
  }

  try {
    const decoded = jwt.verify(token, 'seuSegredoDoToken');

    request.user = decoded;

    // Se o usuário estiver autenticado (token válido), siga para a próxima rota
    return next();
  } catch (err) {
    // Se o token for inválido, redirecione para a tela de login
    return response.redirect('/home');
  }
}
