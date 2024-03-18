const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')
const profileRoutes = require('./profileRoutes')
const relationRoutes = require('./relationRoutes')

const routes = [authRoutes, userRoutes, profileRoutes, relationRoutes]

module.exports = routes