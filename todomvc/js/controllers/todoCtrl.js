/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', ['$scope', '$routeParams', '$filter', 'store', '$timeout', 'nga11yAnnounce', function TodoCtrl($scope, $routeParams, $filter, store, $timeout, nga11yAnnounce) {
		'use strict';

		var todos = $scope.todos = store.todos;

		$scope.newTodo = '';
		$scope.editedTodo = null;
		$scope.focusTodo = null;

		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		$scope.$watch(function () {
			return document.getElementById('todo-list');
		}, function(list) {
			$timeout(function () {
				var lis = list.querySelectorAll('li');
				nga11yAnnounce.assertiveAnnounce(lis.length + ' items being displayed');
			},500);
		});
		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';

			$scope.focusTodo = null;
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : null;
		});

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.trim(),
				completed: false
			};

			if (!newTodo.title) {
				return;
			}

			$scope.saving = true;
			store.insert(newTodo)
				.then(function success() {
					$scope.newTodo = '';
				})
				.finally(function () {
					$scope.saving = false;
				});
			$scope.focusTodo = null;
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			$scope.focusTodo = null;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function (todo) {
			$scope.focusTodo = todo;

			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			store[todo.title ? 'put' : 'delete'](todo)
				.then(function success() {}, function error() {
					todo.title = $scope.originalTodo.title;
				})
				.finally(function () {
					$scope.editedTodo = null;
				});
		};

		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
			$scope.focusTodo = todo;
		};

		$scope.removeTodo = function (todo) {
			// Make sure that the next (or previous) todo will inherit the focus
			var index = todos.indexOf(todo);
			if (index === todos.length - 1) {
				$scope.focusTodo = todos[index - 1];
			} else {
				$scope.focusTodo = todos[index + 1];
			}
			// delete the todo
			store.delete(todo);
		};

		$scope.saveTodo = function (todo) {
			store.put(todo);
		};

		$scope.blurTodo = function (todo) {
			if (todo !== $scope.editedTodo) {
				return;
			}
			$scope.saveEdits(todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			store.put(todo, todos.indexOf(todo))
				.then(function success() {}, function error() {
					todo.completed = !todo.completed;
				});
		};

		$scope.clearCompletedTodos = function () {
			store.clearCompleted();
		};

		$scope.mustFocus = function (todo) {
			var val = todo === $scope.focusTodo && (
				!document.activeElement ||
				document.activeElement.nodeName === 'BODY' ||
				angular.element(document.activeElement).hasClass('edit'));
			return val;
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});
		};
	}]);
