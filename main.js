const instanceIO = require('./src/server/instance.js');
const socketioJwt = require('socketio-jwt');
const path = require('path');
/*
 * =========================================================================== *
 * constants                                                                   *
 * =========================================================================== *
 */
const ROUTE_NAMESPACE = '/cavalier/';
const INDEX = '/';

/*
 * =========================================================================== *
 * Starting instance of the server                                             *
 * =========================================================================== *
 */
instanceIO.start();

const expressApp = instanceIO.getExpress();
const socketIO = instanceIO.getSocketIO();

/*
 * =========================================================================== *
 * Routes                                                                      *
 * =========================================================================== *
 */
// // Get Routes
// const indexRouter = require('./src/server/routes/index.js');
// const publicRouter = require('./src/server/routes/public.js');
// const privateRouter = require('./src/server/routes/private.js');
 const apiRouter = require('./src/server/routes/api.js');

// // Use Routers
// expressApp.use(INDEX, indexRouter);
// expressApp.use(ROUTE_NAMESPACE, publicRouter);
// expressApp.use(ROUTE_NAMESPACE, privateRouter);
expressApp.use(ROUTE_NAMESPACE, apiRouter);
const AuthUnit = require('./src/server/units/auth.js');
const RequestIP = require('./src/server/utils/requestip');


expressApp.use('/cavalier/', function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

expressApp.get('/cavalier/', function(req, res, next) {
    res.send('2312');
});

expressApp.get('/cavalier/public', function(req, res, next) {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'public', 'index.html'));
});
 
expressApp.get('/cavalier/private', function(req, res, next) {
    res.sendFile(path.resolve('src', 'client', 'entrys', 'private', 'index.html'));
});

expressApp.use((req, res, next) => {
    next();
});


expressApp.get('/*', function(req, res, next) {
    const auth = new AuthUnit();
    const requestIP = new RequestIP(req).getIP();

    if (req.url) {
        auth.verifyToken(req.url.slice(15), requestIP).then(() => {
            // everthing is fine
            res.redirect('/cavalier/private');
        }, () => {
            // next middleware or route
            res.redirect('/cavalier/public');
            
        });
    } else {
        res.redirect('/cavalier/public');
        
    }
});
 

// expressApp.use('/', (req, res, next) => {
//     const auth = new AuthUnit();
//     const requestIP = new RequestIP(req).getIP();

//     if (req.query.access_token) {
//         auth.verifyToken(req.query.access_token, requestIP).then(() => {
//             // everthing is fine
//             res.redirect('/cavalier/private');
//         }, () => {
//             // next middleware or route
//             next();
//         });
//     }
//     next();
// });

// expressApp.get('/', (req, res) => {
//     res.redirect('/cavalier/public');
// });

// expressApp.use('/cavalier/', (req, res, next) => {
//     const auth = new AuthUnit();
//     const requestIP = new RequestIP(req).getIP();

//     if (req.query.access_token) {
//         auth.verifyToken(req.query.access_token, requestIP).then(() => {
//             // everthing is fine
//             res.redirect('/cavalier/private');
//         }, () => {
//             // next middleware or route
//             next();
//         });
//     }
//     next();
// });

// expressApp.get('/private', (req, res, next) => {
//     res.redirect('www.google.de');
// });

// expressApp.get('/public', (req, res, next) => {
//     res.redirect('www.facebook.com');
// });

// // Check Index route
// expressApp.use('/*', (req, res, next) => {
//   // if (req.query.access_token) {
//   //   res.redirect('/cavalier/private');
//   // } else {
//   //   res.redirect('/cavalier/public');
//   // }
// //    res.redirect('/cavalier/public');
//  //   next();
// });

/*
 * =========================================================================== *
 * Authentification                                                            *
 * =========================================================================== *
 */
socketIO.use(socketioJwt.authorize({
    secret: instanceIO.getJWTSecretBase64(),
    handshake: true,
}));

socketIO.on('connection', (socket) => {
    console.log(socket);
});

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
