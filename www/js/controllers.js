angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ListsCtrl', function($scope, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
  $scope.firstItems =[ 
    { titre: 'Premier item', description: 'Vidéo de démonstration', id: 1 },
    
    
    ];
    
    $scope.secondItems = [
    { titre: 'Deuxième item', description: 'Slide de présentation de projet', id: 2 },
    
    
    ];
    
    $scope.thirdItems = [
    { titre: 'Troisième item', description: 'Présentatoin d\'un graphique avec des logos (GMF, Casino...) ', id: 3 },
    
    
    ];
    
    $scope.fourthItems = [
    { titre: 'Quatrième item', description: 'Ex turba vero imae sortis et paupertinae in tabernis aliqui pernoctant vinariis, non nulli velariis umbraculorum theatralium latent, quae Campanam imitatus lasciviam Catulus', id: 4 }
    
    ];
    
     $scope.fiveItems = [
    { titre: 'Cinquième item', description: 'Ex turba vero imae sortis et paupertinae in tabernis aliqui pernoctant vinariis, non nulli velariis umbraculorum theatralium latent, quae Campanam imitatus lasciviam Catulus', id: 5 }
    
    ];
    
    $scope.showModal = function(templateUrl) {
 $ionicModal.fromTemplateUrl(templateUrl, {
 scope: $scope,
 animation: 'slide-in-up'
 }).then(function(modal) {
 $scope.modal = modal;
 $scope.modal.show();
 });
 }

 // Close the modal
 $scope.closeModal = function() {
 $scope.modal.hide();
 $scope.modal.remove();
 };

 $scope.clipSrc = 'img/Wildlife.wmv';


$scope.playVideo = function() {
 $scope.showModal('templates/video-popover.html');
}

 $scope.allImages = [{
 'src' : 'img/1.jpg'
 }, {
 'src' : 'img/2.jpg'
 }, {
 'src' : 'img/3.jpg'
 }, {
 'src' : 'img/4.jpg'
 }, {
 'src' : 'img/5.jpg'
 }, {
 'src' : 'img/6.jpg'
 }, {
 'src' : 'img/7.jpg'
 }];
 
 $scope.showImages = function(index) {
 $scope.activeSlide = index;
 $scope.showModal('templates/image-popover.html');
 }

  




/*$scope.playImpress = function() {
 $scope.showModal('templates/impress_demo.html');
} ;*/


   
})
    


.controller('DetailCtrl', function($scope, $stateParams) {

   
       
            // create some nodes
            
            var DIR = 'img/';
      nodes = [
        
        {id: 4,  shape: 'circularImage', image: DIR + 'discovery.jpg'},
        {id: 5,  shape: 'circularImage', image: DIR + 'inspeer.jpg'},
        {id: 6,  shape: 'circularImage', image: DIR + 'google_project.png'},
        {id: 7,  shape: 'circularImage', image: DIR + 'casino_1.png'},
        {id: 8,  shape: 'circularImage', image: DIR + 'cgi.jpg'},
        {id: 9,  shape: 'circularImage', image: DIR + 'swisslife.jpg'},
        {id: 10, shape: 'circularImage', image: DIR + 'Groupama3.jpg'},
        {id: 11, shape: 'circularImage', image: DIR + 'axa.jpg'},
        {id: 12, shape: 'circularImage', image: DIR + 'mma.jpg'},
        {id: 13, shape: 'circularImage', image: DIR + 'gmf.jpg'},
        {id: 14, shape: 'circularImage', image: DIR + 'sante.jpg'},
        {id: 15, shape: 'circularImage', image: DIR + 'obj_connecte.png'}
        
        
      ];

      // create connections between people
      // value corresponds with the amount of contact between two people
      edges = [
        {from: 1, to: 2},
        {from: 2, to: 3},
        {from: 2, to: 4},
        {from: 6, to: 5},
        {from: 13, to: 10},
        {from: 4, to: 6},
        {from: 6, to: 7},
        {from: 7, to: 8},
        {from: 5, to: 9},
        {from: 9, to: 4},
        {from: 8, to: 10},
        {from: 10, to: 11},
        {from: 11, to: 12},
        {from: 12, to: 13},
        {from: 8, to: 14},
        {from: 8, to: 15}
        
      ];

      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
        nodes: {
          borderWidth:4,
          size:30,
	      color: {
            border: '#222222',
            background: '#666666'
          },
          font:{color:'#eeeeee'}
        },
        edges: {
          color: 'lightgray'
        }
      };
      network = new vis.Network(container, data, options);

    
        
});
