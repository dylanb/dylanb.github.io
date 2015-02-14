/*global angular */

/**
 * Directive that implements the keyboard functionality for the entire todo application
 */
angular.module('todomvc')
	.directive('todoKbd', function () {
		'use strict';

		var ESCAPE_KEY = 27;
		var TAB_KEY = 9;
		var DELETE_KEY = 46;

		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem, attrs) {
				elem.on('keydown', function (event) {
					var focus = false;
					if (!scope.editedTodo && event.keyCode !== DELETE_KEY) {
						return;
					}
					if (event.keyCode === ESCAPE_KEY) {
						scope.revertEdits(scope.todo);
						focus = true;
					} else if (event.keyCode === DELETE_KEY) {
						scope.removeTodo(scope.todo);
					}
					scope.$apply();
					if (focus) {
						elem[0].querySelector('a').focus();
					}
				}).on('$destroy', function () {
					elem.off('keydown');
				});
			}
		};
	});
