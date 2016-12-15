const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')
const path = require('path');

const r = require('rethinkdb');

const instanceIO = require('./src/server/instance.js');
instanceIO.start();

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(express.static(__dirname + '/public'))
app.use(webpackDevMiddleware(webpack(webpackConfig)))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

server.listen(3000)


app.post('/ps', (req, res, next) => {
    io.emit('message', {body: 'dummy', from: 'api'})
    console.log(req.body);
    res.send({state: 'ok'});
    res.end('done');
})

app.post('/stock_insert', (req, res, next) => {
   // r.db('test').table('stock_data').insert({stockName: req.body.name, stockExchange: req.body.exchange, date: new Date(), price: req.body.price }).run(dbConnect);
    res.send({state: 'ok'});
    res.end('done');
})

app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})
/*
io.on('connection', socket => {
  socket.on('message', body => {
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(12)
    })
  })
})

*/

io.on('connection', socket => {
  console.log(io.path());

  socket.on('message', body => {
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(12)
    })
  })
  

  socket.on('stock_insert', (stock =>{
    r.connect({db:'test'}, (err, conn) => {
        r.db('test').table('stock_data').insert({stockName: stock.name, stockExchange: stock.exchange, date: new Date(), price: stock.price }).run(conn);    
    })
  }))


  r.connect({db: instanceIO.getConfig().rethinkdb.db }, (err, conn) => {

    r.table('stock_data').orderBy({index: 'stocknameAndDate'}).run(conn, function(err, cursor) {

        if (err) throw err;
        cursor.each(function(err, result) {
            if (err) throw err;
            socket.emit('stats', result);
        });        
    })

  });
})


r.connect({db:'test'}, (err, conn) => {
    r.table('stock_data').changes().run(conn).then(function(cursor) {
      cursor.each(function(err, item) {
          if (item && item.new_val)
          io.sockets.emit('stats', item.new_val);
      });
    })

});
