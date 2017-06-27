angular.module('starter')
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('menu',{
      url: '/menu',
      templateUrl: 'templates/menu.html',
      abstract: true
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'userController'
    })

    .state('menu.home',{
      url:'/home',
      views :{
        'menuConteudo' : {
          templateUrl: 'templates/home.html'
        }
      }
    })

    .state('menu.Jornada',{
      url:'/Jornada',
      views: {
        'menuConteudo' : {
          templateUrl: 'templates/Jornada.html',
          controller: 'disciplinasController'
        }
      }
    })

    .state('menu.maps',{
      url:'/maps',
      views: {
        'menuConteudo' : {
          templateUrl: 'templates/maps.html',
          controller: 'disciplinasController'
        }
      }
    })


    .state('menu.Pesquisa',{
      url:'/Pesquisa',
      views: {
        'menuConteudo' : {
          templateUrl: 'templates/Pesquisa.html'
        }
      }
    })

    $urlRouterProvider.otherwise('/login');
  })
