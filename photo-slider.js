
/*
Usage:
    Example:
          <img yk-photo-slider-trigger="" src="https://dl.dropboxusercontent.com/u/39215269/photo-slider/1.jpg">
          <img yk-photo-slider-trigger="" src="https://dl.dropboxusercontent.com/u/39215269/photo-slider/2.jpg">
          <img yk-photo-slider-trigger="" src="https://dl.dropboxusercontent.com/u/39215269/photo-slider/3.jpg">
      %yk-photo-slider{photos: [{url: "photos_pagth/1.png", title:"image1 title", width: 300px, height: 400}, {}, {}]}
      <yk-photo-slider photos: [{url: "photos_pagth/1.png", title:"image1 title", width: 300px, height: 400}, {}, {}]}"></yk-photo-slider>
 */

var PhotoSliderController;

angular.module('ykPhotoSlider').directive('ykPhotoSlider', function() {
  return {
    restrict: 'E',
    scope: {
      photos: '='
    },
    link: function(scope, element, attrs) {
      return scope.bindPhotoDomClickEvent();
    },
    templateUrl: 'template.html',
    controller: PhotoSliderController
  };
});

PhotoSliderController = [
  '$scope', function($scope) {
    var _init, _resetImageSize, _scaleSize, _setNextOrPrevSibling, _setThumbnailsVisibility;
    $scope.isThumbnailsVisible = false;
    $scope.sliderFooterHeight = 0;
    $scope.index = 0;
    $scope.bindPhotoDomClickEvent = function() {
      return angular.element("[yk-photo-slider-trigger]").bind('click', function(e) {
        var index;
        index = angular.element("[yk-photo-slider-trigger]").toArray().indexOf(this) || 0;
        $scope.setIndex(index);
        return $scope.$apply(function() {
          return $scope.open(e);
        });
      });
    };
    $scope.open = function(e) {
      $scope.preventDefaultBehaviour(e);
      $scope.visible = true;
      return _setNextOrPrevSibling();
    };
    $scope.close = function(e) {
      $scope.preventDefaultBehaviour(e);
      $scope.index = null;
      return $scope.visible = false;
    };
    $scope.next = function(e) {
      $scope.preventDefaultBehaviour(e);
      if ($scope.index < $scope.photos.length - 1) {
        $scope.index++;
      } else {
        _setThumbnailsVisibility(true);
      }
    };
    $scope.prev = function(e) {
      $scope.preventDefaultBehaviour(e);
      if ($scope.index > 0) {
        $scope.index--;
      } else {
        _setThumbnailsVisibility(true);
      }
    };
    $scope.setIndex = function(index) {
      $scope.index = index;
    };
    $scope.toggleThumbnails = function(e) {
      $scope.preventDefaultBehaviour(e);
      return _setThumbnailsVisibility(!$scope.isThumbnailsVisible);
    };
    $scope.$watch("index", function() {
      $scope.photo = $scope.photos[$scope.index];
      if ($scope.photo) {
        angular.element(".photo-wrapper").html("<img src='" + $scope.photo.url + "'>");
      }
      _setNextOrPrevSibling();
      _resetImageSize();
    });
    $scope.$watch("photos", function() {
      $scope.bindPhotoDomClickEvent();
    });
    _setNextOrPrevSibling = function() {
      $scope.hasPreviousSibling = !!$scope.photos[$scope.index - 1];
      return $scope.hasNextSibling = !!$scope.photos[$scope.index + 1];
    };
    $scope.preventDefaultBehaviour = function(e) {
      e.stopImmediatePropagation();
      return e.preventDefault();
    };
    _setThumbnailsVisibility = function(isVisible) {
      $scope.isThumbnailsVisible = isVisible;
      if ($scope.isThumbnailsVisible) {
        $scope.sliderFooterHeight = 82;
      } else {
        $scope.sliderFooterHeight = 0;
      }
      return _resetImageSize();
    };
    _resetImageSize = function() {
      var newSize;
      $scope.browserWidth = window.innerWidth - 160;
      $scope.browserHeight = window.innerHeight - 120 - $scope.sliderFooterHeight;
      if ($scope.photo) {
        newSize = _scaleSize($scope.browserWidth, $scope.browserHeight, $scope.photo.width, $scope.photo.height);
        angular.element(".photo-wrapper").css("width", newSize[0]).css("height", newSize[1]).css("left", ($scope.browserWidth - newSize[0]) / 2 + 80).css("top", ($scope.browserHeight - newSize[1]) / 2 + 60);
      }
    };
    _scaleSize = function(maxWidth, maxHeight, currentWidth, currentHeight) {
      var ratio;
      ratio = currentHeight / currentWidth;
      if (currentWidth >= maxWidth && ratio <= 1) {
        currentWidth = maxWidth;
        currentHeight = currentWidth * ratio;
      }
      if (currentHeight >= maxHeight) {
        currentHeight = maxHeight;
        currentWidth = currentHeight / ratio;
      }
      return [currentWidth, currentHeight];
    };
    _init = function() {
      window.onresize = _resetImageSize;
      return angular.element(document).bind('keydown', function(e) {
        if (e.keyCode === 27) {
          return $scope.$apply(function() {
            return $scope.close(e);
          });
        } else if (e.keyCode === 37) {
          return $scope.$apply(function() {
            return $scope.prev(e);
          });
        } else if (e.keyCode === 39) {
          return $scope.$apply(function() {
            return $scope.next(e);
          });
        }
      });
    };
    return _init();
  }
];
