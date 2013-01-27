#  See  http://vimeo.com/38069416
#         Node.JS + Socket.IO Cursor Tracking

express = require 'express'
socketio = require 'socket.io'
http = require 'http'
_ = require 'underscore'
routes = require './routes'

app = express()
port = 3000

server = http.createServer(app)
io = socketio.listen(server)
io.set 'log level', 1

app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session(secret: "your secret here")
  app.use require("stylus").middleware(src: __dirname + "/public")
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", () -> app.use express.errorHandler { dumpExceptions: true, showStack: true }

app.configure "production", () -> app.use express.errorHandler()

server.listen(port)
console.log "Server listening on port #{port} in #{app.settings.env} mode"


app.get "/", routes.index

friends = []

io.sockets.on "connection", (socket) ->
  id = socket.id
  addUser id
  socket.emit "connected", { player: id, friends: friends }
  socket.broadcast.emit "new friend", { player: id, friends: friends }
  console.log "---- connected #{id}"

  socket.on "disconnect",  ->
    id = this.id
    removeUser id
    socket.broadcast.emit "bye friend", { player: id, friends: friends }
    console.log "---- disconnected #{id}"

  socket.on "move", (data) ->
    socket.broadcast.emit "move", data

  socket.on 'drawClick', (data) ->
    socket.broadcast.emit 'drawClick', data

  socket.on "key", (data) ->
    socket.broadcast.emit "key", data

addUser = (id) ->
  friends.push id

removeUser = (id) ->
  friends = _.reject(friends, (v) -> v == id)
