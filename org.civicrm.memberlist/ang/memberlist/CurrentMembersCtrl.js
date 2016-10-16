(function(angular, $, _) {

  angular.module('memberlist').config(function($routeProvider) {
      $routeProvider.when('/current-members', {
        controller: 'MemberlistCurrentMembersCtrl',
        templateUrl: '~/memberlist/CurrentMembersCtrl.html',

        // Once the page loads, list it out contacts with current memberships under "resolve".
        resolve: {
          currentMembers: function(crmApi) {
            return crmApi('Membership', 'get',{
                "sequential": 1,
                "return": ["contact_id.display_name","join_date","start_date","end_date","contact_id.source","membership_type_id.name","status_id.name"],
                "status_id": "Current"
              });
          }
        }
      });
    }
  );

  // This controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   currentMembers -- The contacts with current memberships returned in the "resolve" in the module.config above
  angular.module('memberlist').controller('MemberlistCurrentMembersCtrl', function($scope, crmApi, crmStatus, crmUiHelp, currentMembers) {

      var ts = $scope.ts = CRM.ts('memberlist');// The ts() and hs() functions help load strings for this module.
      var hs = $scope.hs = crmUiHelp({file: 'CRM/memberlist/CurrentMembersCtrl'}); // See: templates/CRM/memberlist/CurrentMembersCtrl.hlp

      $scope.currentMembers = currentMembers.values;

      /* internal function to handle filtering by date start from and to */
      $scope.doFilter = function(dateFrom,dateTo){
          var parseDate = function(input){
              //parse the input as date for easier comparison of the value irrespective of the input format
              return Date.parse(input);
          };
          //get members from the config section above which has been injected into this controller
          var members = currentMembers.values;

          if(dateFrom.length === 0){
              dateFrom = '01-01-1980';  //set default value for start date in the situation where no value was entered
          };
          if(dateTo.length === 0){
              dateTo = '01-01-2030';    //set default value for end date in the situation where no value was entered
          };

          var from = parseDate(dateFrom);   // call parseDate on start date
          var to = parseDate(dateTo);       // call parseDate on end date
          var result = [];                  // prepare empty array to store record objects that match filter

          for (var i = 0; i < members.length; i++) {            //loop through the array of member objects
              var startDate = parseDate(members[i].start_date); //get the start date for the current iteration
              if (startDate >= from && to >= startDate) {       //compare dates
                  result.push(members[i]);                      //store in results if it matches filter
              }
          }
          $scope.currentMembers = result; //assign the final result array to the current members in the current scope
      }


  });

})(angular, CRM.$, CRM._);





