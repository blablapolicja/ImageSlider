angular.module('myApp', ['ui.bootstrap','ngTouch'])

.controller('myController', function($scope, $modal){
	$scope.slides = [
		{impressions: 23},
		{impressions: 45},
		{impressions: 20},
		{impressions: 34}
	];
	$scope.showPreview = false;

	$scope.getImpressions = function(){ //get number of impressions from local storage if present
		var savedImpressions = (localStorage["Saved impressions"] == "true");
		if (savedImpressions) {
			for (var i = 0; i < 4; i++) {
				$scope.slides[i].impressions = parseInt(localStorage["Picture " + (i + 1)]);
			}
		}
	};

	$scope.getActiveSlide = function () { //get index of active slide in carousel
	    return $scope.slides.filter(function (s) {
	    	if (s.active === true){
	    		return $scope.slides.indexOf(s);
	    	}
	    })[0];
	};

	$scope.downloadPicture = function(){ //random pictures, names and rates for slides
		for (var i = 0; i < 4; i++) {
			var newWidth = 600 + $scope.slides.length + i;
			$scope.slides[i].image = 'http://placekitten.com/' + newWidth + '/300';
			$scope.slides[i].name = 'Picture ' + (i + 1);
			$scope.slides[i].rate = Math.floor(Math.random() * 5);
		}
	};

	$scope.downloadPicture();
	$scope.getImpressions();
	localStorage["Saved impressions"] = "true";

	$scope.$watch(function () { //watch function to detect carousel events and increase impressions
		for (var i = 0; i < $scope.slides.length; i++) {
			if ($scope.slides[i].active) {
				return $scope.slides[i];
			}
		}
	}, function (currentSlide, previousSlide) {
		if (currentSlide !== previousSlide) {
			currentSlide.impressions = currentSlide.impressions + 1;
			localStorage[currentSlide.name] = currentSlide.impressions;
		}
	});

	$scope.imageUpload = function (){ //image uploader and preview
		$scope.showPreview = true;
		var preview = document.querySelector('#preview');
		var file    = document.querySelector('#imageUpload').files[0];
		var reader  = new FileReader();

		reader.onload = function () {
			preview.src = reader.result;
			$scope.slides.push({
				image: reader.result,
				name: 'My picture ' + ($scope.slides.length + 1),
				impressions: Math.floor(Math.random() * 50),
				rate: Math.floor(Math.random() * 5)
			});
		};

		if (file) {
			reader.readAsDataURL(file);
		} else {
			preview.src = "";
		}
	};

	$scope.open = function (size) { //open modal
	    var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'modal',
			size: size,
			resolve: {
				slides: function () {
					return $scope.slides;
				}
			}
	    });
	};
})

.controller('modal', function($scope, $modalInstance, slides, $interval){
	$scope.slides = slides;
	$scope.image = null;

	var interval = $interval(function(){
		$scope.image = null;
		var random = Math.floor(Math.random() * $scope.slides.length);
		$scope.image = $scope.slides[random].image;
		$scope.slides[random].impressions = $scope.slides[random].impressions + 1;
		localStorage[$scope.slides[random].name] = $scope.slides[random].impressions;
	}, 1500);

	$scope.cancel = function () {
		$interval.cancel(interval);
	    $modalInstance.dismiss('cancel');
	};
});