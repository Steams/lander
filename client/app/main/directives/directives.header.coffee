angular.module 'lander.directives.header', []
.directive 'myHeader', () ->
  return {
    restrict : 'E'
    scope : {
      data : '='
    }
    replace : true
    templateUrl: 'app/main/partials/header.html'
    controller : "@"
    name : "controllerName"
  }
