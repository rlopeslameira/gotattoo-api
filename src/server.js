import app from './app';

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log(process.env.DB_DIALECT);

app.listen(3333, () => { console.log ('Server Started.')});
// app.listen(3333);
