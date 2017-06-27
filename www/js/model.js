var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var core_use = require('cors');
var pg = require('pg');

app.use(core_use());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = {
  user: 'postgres', //env var: PGUSER
  database: 'GLABS_JORNADA', //env var: PGDATABASE
  password: '123456', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);

//CRUD de Diário
app.get('/diarios/all', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * from diario where status = 1;',
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          console.log(result.rows);
          res.json(result.rows);
        });
  });
});

app.get('/diarios/:id', function (req, res) {
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * from diario where codigo = ' + id +';',
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(result.rows);
        });
  });
});

app.post('/diarios/new', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
      client.query('select id from atividades where descricao = \'' + req.body.id + '\';', function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        } else {
          client.query('insert into diario(ID_USUARIO,ID_VEICULO,ID_ATIVIDADE,HINICIO,HFIM,OBS)  values('
                + 1 + ','
                + 1 + ','
                + result.rows[0].id + ','
                + '\'' + req.body.inicio + '\'' + ','
                + '\'' + req.body.fim + '\'' + ','
                + '\'' + req.body.obs + '\'' + ');', function(err, result) {
            done();
            if(err) {
              return console.error('error running query', err);
            }
            res.setHeader('Access-Control-Allow-Origin','*');
            res.json('Inserido com sucesso!');
          });
        }
      });

  });
});

app.put('/diarios/update', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('select fn_grava_diario('
          + req.body.id + ','
          + req.body.id_usuario + ','
          + req.body.id_veiculo + ','
          + req.body.id_atividade  + ','
          + req.body.hinicio  + ','
          + req.body.hfim  + ','
          + req.body.obs  + ','
          + req.body.status  +', \'A\');', function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json('Atualizado com sucesso!');
        });
  });
});

app.delete('/diarios/remove/:codigo', function (req, res) {
  var codigo = req.params.codigo
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
    client.query('select fn_grava_diario('
          + req.body.id + ','
          + req.body.id_usuario + ','
          + req.body.id_veiculo + ','
          + req.body.id_atividade  + ','
          + req.body.hinicio  + ','
          + req.body.hfim  + ','
          + req.body.obs  + ','
          + req.body.status  +', \'D\');', function(err, result) {
            done();
            if(err) {
              return console.error('error running query', err);
            }
            res.setHeader('Access-Control-Allow-Origin','*');
            res.json('Deletado com sucesso!');
          });
    });
});

//Dropdown
app.get('/dropdown', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
        'SELECT * FROM ( SELECT ID, DESCRICAO, ORDEM FROM ATIVIDADES WHERE ORDEM > 0 and ORDEM IS not NULL) X UNION SELECT ID, DESCRICAO, ORDEM FROM ATIVIDADES WHERE ORDEM IS NULL ORDER BY ORDEM',
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(result.rows);
        });
  });
})

// Dados da viagem
app.get('/viagem', function (req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
        'SELECT A.DESCRICAO AS ATIVIDADE, D.HINICIO, D.HFIM, D.OBS FROM DIARIO D INNER JOIN ATIVIDADES A ON (A.ID = D.ID_ATIVIDADE) INNER JOIN VEICULO V ON (V.ID = D.ID_VEICULO) INNER JOIN USUARIO U ON (U.ID = D.ID_USUARIO);',
        function(err, result) {
          done();
          if(err) {
            return console.error('error running query', err);
          }
          res.setHeader('Access-Control-Allow-Origin','*');
          res.json(result.rows);
        });
  });
})
app.listen(3000)
