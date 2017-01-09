/*
 * =========================================================================== *
 * Imports                                                                     *
 * =========================================================================== *
 */
const instanceIO = require('./src/server/instance.js');
const socketioJwt = require('socketio-jwt');

instanceIO.start();

// Get Routes
const indexRouter = require('./src/server/routes/index.js');
const publicRouter = require('./src/server/routes/public.js');
const privateRouter = require('./src/server/routes/private.js');
const apiRouter = require('./src/server/routes/api.js');



/*
 * =========================================================================== *
 * constants                                                                   *
 * =========================================================================== *
 */
const API_PATH = '/cavalier/api/';
const PUBLIC_PATH = '/cavalier/public';
const PRIVATE_PATH = '/cavalier/private';
const INDEX = '/*';

/*
 * =========================================================================== *
 * Get Frame from instance                                                     *
 * =========================================================================== *
 */
const expressApp = instanceIO.getExpress();
const socketIO = instanceIO.getSocketIO();

/*
 * =========================================================================== *
 * Routes - order matters!                                                     *
 * =========================================================================== *
 */
// Use Routers
// 1. API
// 2. Public 
// 3. Private
expressApp.use(API_PATH, apiRouter);
expressApp.use(PUBLIC_PATH, publicRouter);
expressApp.use(PRIVATE_PATH, privateRouter);

// last fallback catch-route
expressApp.use(INDEX, indexRouter);
/*
 * =========================================================================== *
 * Authentification                                                            *
 * =========================================================================== *
 */

instanceIO.listen();
// socketIO.use(socketioJwt.authorize({
//     secret: instanceIO.getJWTSecretBase64(),
//     handshake: true,
// }));

// socketIO.on('connection', (socket) => {

//     socket.on('message', (gg) => {
//         console.log('socket');
//     });

//     console.log(socket);
// });

// app.post('/stock_insert', (req, res, next) => {
//    // r.db('test').table('stock_data').insert({stockName: req.body.name, stockExchange: req.body.exchange, date: new Date(), price: req.body.price }).run(dbConnect);
//     res.send({state: 'ok'});
//     res.end('done');
// })


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

// io.on('connection', socket => {
//   console.log(io.path());

//   socket.on('message', body => {
//     socket.broadcast.emit('message', {
//       body,
//       from: socket.id.slice(12)
//     })
//   })
  

//   socket.on('stock_insert', (stock =>{
//     r.connect({db:'test'}, (err, conn) => {
//         r.db('test').table('stock_data').insert({stockName: stock.name, stockExchange: stock.exchange, date: new Date(), price: stock.price }).run(conn);    
//     })
//   }))


//   r.connect({db: instanceIO.getConfig().rethinkdb.db }, (err, conn) => {

//     r.table('stock_data').orderBy({index: 'stocknameAndDate'}).run(conn, function(err, cursor) {

//         if (err) throw err;
//         cursor.each(function(err, result) {
//             if (err) throw err;
//             socket.emit('stats', result);
//         });        
//     })

//   });
// })


// r.connect({db:'test'}, (err, conn) => {
//     r.table('stock_data').changes().run(conn).then(function(cursor) {
//       cursor.each(function(err, item) {
//           if (item && item.new_val)
//           io.sockets.emit('stats', item.new_val);
//       });
//     })

// });
