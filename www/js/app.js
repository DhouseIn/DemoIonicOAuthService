'use strict';

/**
 * @name DemoIonicOauthService
 * @description Demo of ionicOauthService
 *
 * Demo of the service.
 */
angular.module('demoIonicOauthService', ['ionic', 'ui.router', 'ionicOAuthService'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function ($stateProvider, $urlRouterProvider) {
	
	/********************************************************************
	*								ROUTES								*
	*********************************************************************/
	// Login
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'views/loginDemo.html',
		controller: 'LoginDemoCtrl'
	});

	// Default
	$urlRouterProvider.otherwise('/login');
	/********************************************************************/
})

.service('UtilityService', ['$ionicPopup', function ($ionicPopup) {

	this.isNullOrBlank = function (value) {
		if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
			return true;
		}
		if (typeof value === 'object' && Object.keys(value).length === 0) {
			return true;
		}
		return false;
	};

	this.startsWith = function (fullValue, startsValue) {
		return fullValue.indexOf(startsValue) === 0;
	};

	this.showMsg = function(title, message) {
		$ionicPopup.alert({
			title: title,
			template: message
		});
	};
}])

.controller('LoginDemoCtrl', function($scope, $controller, $state, OAuthService, SOCIAL, UtilityService) {

	var oAuthService = OAuthService;
	var util = UtilityService;

	var PROBLEM_AUTHENTICATION = 'Problem authenticating';
	var THE_SIGN_IN_FLOW_WAS_CANCELED = 'The sign in flow was canceled';
	var BROWSER_AUTHENTICATION_FAILED = 'Browser authentication failed to complete';

	$scope.loginWithSocial = function(provider) {
		oAuthService.login(provider, $scope.loginSuccessCallback, $scope.loginErrorCallback);
	};

	$scope.loginSuccessCallback = function(provider, authData) {
		util.showMsg('Success', JSON.stringify(authData));
	};

	$scope.loginErrorCallback = function(provider, error) {
		var errorDefaultMsg = "Invalid authentication";
		var errorCancelMsg = null;
		switch(provider) {
			case SOCIAL.LINKEDIN.PROVIDER:
				errorDefaultMsg = "It's not possible to connect with your LinkedIn";
				errorCancelMsg = "The connection with your LinkedIn have been canceled";
				break;
			case SOCIAL.FACEBOOK.PROVIDER:
				errorDefaultMsg = "It's not possible to connect with your Facebook";
				errorCancelMsg = "The connection with your Facebook have been canceled";
				break;
			case SOCIAL.GOOGLE.PROVIDER:
				errorDefaultMsg = "It's not possible to connect with your Google+";
				errorCancelMsg = "The connection with your Google+ have been canceled";
				break;
			case SOCIAL.TWITTER.PROVIDER:
				errorDefaultMsg = "It's not possible to connect with your Twitter";
				errorCancelMsg = "The connection with your Twitter have been canceled";
				break;
			default:
				break;
		}
		showError(error, errorDefaultMsg, errorCancelMsg);
	};

	//Generic Functions
	var showError = function(error, errorDefaultMsg, errorCancelMsg) {
		var errorMessage = {
			title: "Error",
			msg: null
		};
		if (util.isNullOrBlank(error)) {
			errorMessage.msg = errorDefaultMsg;
		}
		if (util.startsWith(PROBLEM_AUTHENTICATION, error) || util.startsWith(THE_SIGN_IN_FLOW_WAS_CANCELED, error) || util.startsWith(BROWSER_AUTHENTICATION_FAILED, error)) {
			errorMessage.msg = errorCancelMsg;
		}
		if (!util.isNullOrBlank(error) && util.isNullOrBlank(errorMessage.msg)) {
			errorMessage.msg = error;
		}
		util.showMsg(errorMessage.title, errorMessage.msg);
	};
});