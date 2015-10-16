
angular.module( "starter.controllers", [] )

.directive('impress',  ['$compile',

    function ($compile) {
        //Helper functions
        var pfx = (function () {

            var style = document.createElement('dummy').style,
                prefixes = 'Webkit Moz O ms Khtml'.split(' '),
                memory = {};

            return function (prop) {
                if (typeof memory[prop] === 'undefined') {

                    var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                        props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

                    memory[prop] = null;
                    for (var e in props) {
                        if (style[props[e]] !== undefined) {
                            memory[prop] = props[e];
                            break;
                        }
                    }

                }

                return memory[prop];
            };

        })();

        // `translate` builds a translate transform string for given data.
        var translate = function (t) {
            return ' translate3d(' + t.x + 'px,' + t.y + 'px,' + t.z + 'px) ';
        };

        // `rotate` builds a rotate transform string for given data.
        // By default the rotations are in X Y Z order that can be reverted by passing `true`
        // as second parameter.
        var rotate = function (r, revert) {
            var rX = ' rotateX(' + r.x + 'deg) ',
                rY = ' rotateY(' + r.y + 'deg) ',
                rZ = ' rotateZ(' + r.z + 'deg) ';

            return revert ? rZ + rY + rX : rX + rY + rZ;
        };

        // `scale` builds a scale transform string for given data.
        var scale = function (s) {
            return ' scale(' + s + ') ';
        };

        // `perspective` builds a perspective transform string for given data.
        var perspective = function (p) {
            return ' perspective(' + p + 'px) ';
        };

        var toNumber = function (numeric, fallback) {
            return isNaN(numeric) ? (fallback || 0) : Number(numeric);
        };

        var prefixer = function (props) {
            var key, pkey, rules = {};
            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    pkey = pfx(key);
                    if (pkey !== null) {
                        rules[pkey] = props[key];
                    }
                }
            }
            return rules;
        };
        // `computeWindowScale` counts the scale factor between window size and size
        // defined for the presentation in the config.
        var computeWindowScale = function (config) {
            var hScale = window.innerHeight / config.height,
                wScale = window.innerWidth / config.width,
                scale = hScale > wScale ? wScale : hScale;

            if (config.maxScale && scale > config.maxScale) {
                scale = config.maxScale;
            }

            if (config.minScale && scale < config.minScale) {
                scale = config.minScale;
            }

            return scale;
        };

        var throttle = function (fn, delay) {
            var timer = null;
            return function () {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        };

        var defaults = {
            width: 950,
            height: 950,
            maxScale: 20,
            minScale: 0,
            perspective: 5000,
            transitionDuration: 5000
        };

        return {
            restrict: 'C',
            replace: false,
            scope: false,
            link: function (scope, elem, attrs, controller)
          {
            
            },
            templateURL: 'templates/impress.html',
            controller: function ($scope, $element) {
                var slides = [],
                    data, step, currentState = {
                        scale: 1
                    }, activeStep, target = {
                        rotate: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        translate: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        scale: 1
                    },
                    stepData = [];
                $scope.currentSlide = 0;
                var duration = 1500,
                    zoomin = false;

                var rootStyles = {
                    position: 'absolute',
                    transformOrigin: 'top left',
                    transition: 'transform 2000ms ease-out',
                    transformStyle: 'preserve-3d'
                };


                var rootData = $element[0].dataset;
                var config = {
                    width: toNumber(rootData.width, defaults.width),
                    height: toNumber(rootData.height, defaults.height),
                    maxScale: toNumber(rootData.maxScale, defaults.maxScale),
                    minScale: toNumber(rootData.minScale, defaults.minScale),
                    perspective: toNumber(rootData.perspective, defaults.perspective),
                    transitionDuration: toNumber(rootData.transitionDuration, defaults.transitionDuration)
                };
                var rootCSS = prefixer(rootStyles);
                
    
                $scope.$on('initImpress', function () {
                    slides = $($element).find('.step');
               /*     var meta = $('meta[name="viewport"]') || document.createElement('meta');
                    meta.content = 'width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no';
                    if (meta.parentNode !== document.head) {
                        meta.name = 'viewport';
                        document.head.appendChild(meta[0]);
                    } */

                    document.documentElement.style.height = '100%';

                    $(document.body).css({
                        overflow: 'hidden'
                    });

                    window.addEventListener('resize', throttle(function () {
                        // force going to active step again, to trigger rescaling
                        $scope.$emit('goToSlide');
                    }));
                    $scope.canvas = $compile('<div ng-style="canvasStyle()""></div>')($scope, function (ele) {
                        $scope.canvasStyle = function () {

                            ele.css(
                            prefixer({
                                transform: rotate(target.rotate, true) + translate(target.translate),
                                transitionDuration: duration + 'ms',
                                transitionDelay: '500ms',
                                pointerEvents: 'auto'
                            }));
                            ele.css(rootCSS);
                        };

                        $scope.$on('updateCanvas', $scope.canvasStyle);
                    });
                   $scope.canvas.append($element.children('.step'));
                    $element.prepend($scope.canvas);

                    $scope.windowScale = computeWindowScale(config);

                    $element.css(rootCSS);
                    $element.css(prefixer({
                        top: '50%',
                        left: '50%',
                        transform: perspective(config.perspective / $scope.windowScale) + scale($scope.windowScale),
                        transition: 'all 20s ease-out'
                    }));

                    for (var fi = 0; fi < slides.length; fi++) {
                        data = slides[fi].dataset;
                        
                        console.log(data);
                        step = {
                            translate: {
                                x: toNumber(data.x),
                                y: toNumber(data.y),
                                z: toNumber(data.z)
                            },
                            rotate: {
                                x: toNumber(data.rotateX),
                                y: toNumber(data.rotateY),
                                z: toNumber(data.rotateZ || data.rotate)
                            },
                            scale: toNumber(data.scale, 1),
                            el: slides[fi]
                        };
                        stepData.push(step);

                        $(slides[fi]).css(prefixer({
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)' + translate(step.translate) + rotate(step.rotate) + scale(step.scale),
                            transformStyle: 'preserve-3d'
                        }));
                    }
                    $scope.goToSlide(0);

                    document.addEventListener('keydown', function (e) {
                        var keyCode = e.keyCode || e.which,
                            arrow = {
                                left: 37,
                                up: 38,
                                right: 39,
                                down: 40
                            };
                        switch (keyCode) {
                            case arrow.left:
                                $scope.$emit('previousSlide');
                                break;
                            case arrow.up:
                                //..
                                break;
                            case arrow.right:
                                $scope.$emit('nextSlide');
                                break;
                            case arrow.down:
                                //..
                                break;
                        }
                    });
                });

                $scope.goToSlide = function (index) {
                    window.scrollTo(0, 0);
                    if (!index) {
                        index = $scope.currentSlide;
                    } else {
                        $scope.currentSlide = index;
                    }

                    $('.step').removeClass('active');
                    $(stepData[index].el).addClass('active');
                    var step = stepData[index];

                    target = {
                        rotate: {
                            x: -step.rotate.x,
                            y: -step.rotate.y,
                            z: -step.rotate.z
                        },
                        translate: {
                            x: -step.translate.x,
                            y: -step.translate.y,
                            z: -step.translate.z
                        },
                        scale: 1 / step.scale
                    };

                    zoomin = target.scale >= currentState.scale;
                    currentState = target;
                    $scope.$emit('updateCanvas');

                    if (step === activeStep) {
                        $scope.windowScale = computeWindowScale(config);
                    }
                    activeStep = step;

                    var targetScale = target.scale * $scope.windowScale;

                    $element.css(prefixer({
                        transform: perspective(config.perspective / targetScale) + scale(targetScale),
                        transitionDuration: duration + 'ms',
                        transitionDelay: '0ms'
                    }));

                };

              
                $scope.$on('nextSlide', function () {
                    $scope.currentSlide += 1;
                    if ($scope.currentSlide >= slides.length) {
                        $scope.currentSlide = 0;
                    }
                    $scope.goToSlide();
                });

                $scope.$on('previousSlide', function () {
                    $scope.currentSlide -= 1;
                    if ($scope.currentSlide <= -1) {
                        $scope.currentSlide = slides.length - 1;
                    }
                    $scope.goToSlide();
                });

                
                
                


            }
        };
    }])
		
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
    


.controller('graphiqueCtrl', function($scope, $stateParams) {

   
       
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
      
      
                
})


  
  