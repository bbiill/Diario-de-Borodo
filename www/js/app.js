// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('AppCtrl', function($scope, HttpService, $ionicModal) {

  $scope.CalculaDistancia = function(){
   $('#litResultado').html('Aguarde...');
              var service = new google.maps.DistanceMatrixService();
              service.getDistanceMatrix(
                {
                    //Origem
                    origins: [$scope.txtOrigem],
                    //Destino
                    destinations: [$scope.txtDestino],
                    //Modo (DRIVING | WALKING | BICYCLING)
                    travelMode: google.maps.TravelMode.DRIVING,
                    //Sistema de medida (METRIC | IMPERIAL)
                    unitSystem: google.maps.UnitSystem.METRIC
                    //Vai chamar o callback
                }, callback);

}
          function callback(response, status) {
              if (status != google.maps.DistanceMatrixStatus.OK)
                  //Se o status não for "OK"
                  $('#litResultado').html(status);
              else {
                  //Se o status for OK
                  //Endereço de origem = response.originAddresses
                  //Endereço de destino = response.destinationAddresses
                  //Distância = response.rows[0].elements[0].distance.text
                  //Duração = response.rows[0].elements[0].duration.text
                  $('#litResultado').html("<strong>Origem</strong>: " + response.originAddresses +
                      "<br /><strong>Destino:</strong> " + response.destinationAddresses +
                      "<br /><strong>Distância</strong>: " + response.rows[0].elements[0].distance.text +
                      " <br /><strong>Duração</strong>: " + response.rows[0].elements[0].duration.text
                      );
                  //Atualizar o mapa
                  $("#map").attr("src", "https://maps.google.com/maps?saddr=" + response.originAddresses + "&daddr=" + response.destinationAddresses + "&output=embed");
              }
          };

 $ionicModal.fromTemplateUrl('my-modal.html', {
   scope: $scope,
   animation: 'slide-in-up'
 }).then(function(modal) {
   $scope.modal = modal;
 });

 $scope.inserirDiario = function(){
   var teste = JSON.parse(HttpService.getProdutosLocal());
   for (var i in teste) {

        //HttpService.insereAcoesLocal(teste[i]);
        HttpService.inserirDiario(teste[i])
          .then(function(response) {
              $scope.xx = response;
           });
   }
alert("Sincronização com sucesso!");
};
  HttpService.getComboAtividades()
 .then(function(response) {
       var produtos = [];
       if (typeof localStorage.acoes != 'undefined'){
           produtos = JSON.parse(localStorage.acoes);
       }
       produtos = produtos.filter(function (produtos){
         return produtos.id == 0;
       });
       var paraString = JSON.stringify(produtos);
       localStorage.setItem('acoes', paraString);
       for (var i in response) {
            HttpService.insereAcoesLocal(response[i]);
       }
  });

  $scope.listaAtividades = JSON.parse(HttpService.getProdutosLocal());
  $scope.listAtividades = JSON.parse(HttpService.getAcoesLocal());

$scope.myFunction =  function () {
  now = new Date
    var currentMonth=('0'+(now.getMonth())).slice(-2)
    var currentHours=('0'+(now.getHours())).slice(-2)
    document.getElementById("inicio").value =  now.getFullYear() + "-" +currentMonth +"-"  + now.getDate() + "T" + addZero(now.getHours()) + ":" + addZero(now.getMinutes()) ;
    document.getElementById("fim").value =  now.getFullYear() + "-" +currentMonth +"-"  + now.getDate() + "T" + addZero(now.getHours()) + ":" + addZero(now.getMinutes()) ;
  }

  function addZero(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }


$scope.insere = function(){
    HttpService.insereProduto($scope.prod)
   .then(function(response) {
       $scope.produtos = response;
       alert("Inserção com sucesso");

    });
 }

 $scope.insereLocal = function(){
    HttpService.insereProdutoLocal($scope.gravar);
    alert("Inserção Local com sucesso !!");

 }

$scope.deleteItem = function(item){
  var resposta = confirm("Confirma a exclusão deste elemento?");
  if (resposta == true){
        HttpService.removeProduto(item)
        .then(function (response){
                  alert("Remoção com sucesso");
                });
  }
}

$scope.deleteItemLocal = function(item){
  var resposta = confirm("Confirma a exclusão deste elemento?");
  if (resposta == true){
        HttpService.removeProdutoLocal(item);
         alert("Remoção Local com sucesso");
  }
}

$scope.atualiza = function(){
    HttpService.atualizaProduto($scope.prod)
   .then(function(response) {
       $scope.produtos = response;
       alert("Atualização com sucesso");

    });
 }

$scope.openModal = function(prod) {
    $scope.modal.show();
   // $scope.prod = prod; // permite que o conteúdo vá para Modal
};

$scope.closeModal = function() {
    $scope.modal.hide();

 };
})

.service('HttpService', function($http) {
 return {
     getComboAtividades: function() {
       // $http returns a promise, which has a then function, which also returns a promise.
       return $http.get('http://localhost:3000/dropdown')
         .then(function(response) {
           // In the response, resp.data contains the result. Check the console to see all of the data returned.
           return response.data;
        });
     },

    inserirDiario: function(itens){
      return $http.post('http://localhost:3000/diarios/new', itens)
        .then(function (response){
          return response.data;
        }
      );
    },
   getProdutosLocal: function() {
     // retorna conteúdo da chave produtos
     return localStorage.atividades;
   },
   getAcoesLocal: function() {
     // retorna conteúdo da chave produtos
     return localStorage.acoes;
   },
  insereProdutoLocal: function(novo) {
      // guarda os produtos
      var produtos = [ ];
      // verifica se a chave existe
      if (typeof localStorage.atividades != 'undefined'){
          // recupera conteúdo da chave e transforma em JSON
          produtos = JSON.parse(localStorage.atividades);
      }
      // adiciona produto novo no vetor
     produtos.push(novo);
     console.log(novo);
      var paraString = JSON.stringify(produtos);
      // armazena conteúdo do vetor em localStorate
      localStorage.setItem('atividades', paraString);
      return novo;
   },
   insereAcoesLocal: function(novo) {
       var produtos = [ ];
       if (typeof localStorage.acoes != 'undefined'){
           produtos = JSON.parse(localStorage.acoes);
       }
       produtos.push(novo);
       var paraString = JSON.stringify(produtos);
       localStorage.setItem('acoes', paraString);
       return novo;
    },
  removeProdutoLocal: function(prod){
      var produtos = [];
    // verifica se chave existe e monta vetor
      if (typeof localStorage.atividades != 'undefined'){
          produtos = JSON.parse(localStorage.atividades);
      }
      // cria um vetor com somente os produtos que não
      // tenham o código em prod
      produtos = produtos.filter(function (produtos){
        return produtos.id != prod.id;
      });
      // transforma em String
      var paraString = JSON.stringify(produtos);
      // armazena em localStorage
      localStorage.setItem('atividades', paraString);
     // return novo;
  }
 };
});
