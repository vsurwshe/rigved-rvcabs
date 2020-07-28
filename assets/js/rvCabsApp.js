var app = angular.module('rvCabsApp', ['ngRoute', 'ngCookies', 'ngStorage', 'toaster', 'ngFileUpload','infinite-scroll', 'google-maps', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ngFileUpload', 'naif.base64', 'ngImgCrop']);
/* var lip=  location.protocol+"//"+location.host;
console.log("Local IP::",lip);
 */

//var ip = 'https://dotstaxi.com/dot-services/';
var ip = 'http://103.224.240.187:9000/'; 
// var ip = 'https://staging.health5c.com/dot-services/';
app.constant('DotsCons', {
    'LOGIN_POINT': ip + 'public/signIn/',
    'LOGOUT_POINT': ip + 'authenticate/logOut',
    'CHANGE_PASSWORD':ip +'public/changePassword',
    'DRIVER_REGISTRATION': ip + 'file/signup',
    'GET_COST_CENTER': ip+'masterdata/costCenterSearch/',
    'GET_TRAVEL_ID': ip +'masterdata/travelIdSearch',
    'GET_EMPLOYEE_ID': ip +'masterdata/costEmployIdSearch',
    'SEARCH_MODEL': ip + 'masterdata/carBrandSubTypeSearch/',
    'SEARCH_BRAND': ip + 'masterdata/carBrandSearch/',
    'SUB_TYPE': ip + 'masterdata/carCategorySearch/',
    'SEARCH_INTERRIOR': ip + 'masterdata/carIntColorSearch/',
    'SEARCH_CAR_COLOR': ip + 'masterdata/carColorSearch/',
    'COMPANY_DETAILS': ip + 'masterdata/companyDetailsSearch',
    'GET_DATA_BY_BOOKINGID':ip +'booking/getBooking',
    'DRIVER_SEARCH': ip + 'masterdata/driverSearch/',
    'FOR_USE': ip + 'masterdata/bookingSearch/',
    'TRIP_BOOKING': ip + 'booking/bookTrip',
    'ADD_COMPANY': ip + 'masterdata/addCompany/',
    'DOCUMENT_SEARCH':ip+'masterdata/documentSearch/',
    'UPLOAD_FILES': ip + 'file/upload',
    'GET_FILES': ip + 'file/getFile',
    'GET_RIDE_LIST': ip + 'booking/bookingByAccountIdFrAdmin',
    'GET_FINISHED_LIST':ip+'booking/finishedTripByDriverFrAdmin',
    'GET_FILTERD_DATA':ip+'bill/retriveData',
    'GET_ALL_DATA': ip+'bill/report',
    'GENERATE_INVOICE': ip+'bill/generateInvoice',
    'CUSTEMER_LIST':ip+'masterdata/costomerSearch',
    'VENDOR_LIST' :ip + 'masterdata/companyDetailsSearch',
    'TRAVELLER_REGISTRATION' : ip+"file/userSignup",
    'ADD_CLIENT':ip+'masterdata/addCustomer',
    'GET_CLIENT_LIST':ip+ 'masterdata/costomerSearch',
    //'APPROVE_MEMBER_LIST': ip + 'userInfo/driverApproveList',
    'ACCPET_RIDE':ip + 'booking/bookingNotificationResponse',
    'RE_ASSIGN_RIDE' :ip +"booking/allotingDriver/",
    'UPDATE_EACH_DOCUMENT': ip + 'userInfo/updateDoc',
    'APPROVE_MEMBER': ip + 'userInfo/approveDriver/',
    'MY_MEMBER_LIST': ip + 'userInfo/masterCUGList', 
    'DRIVER_CUSTOMER_LIST': ip + 'userInfo/driverCUGList',
    'CAB_BOOKING': ip + 'booking/bookingCab',
    'CAB_BOOKING_MASTER': ip + 'booking/bookingCab',
    'CAB_BOOKING_FOR_CUSTOMER': ip + 'booking/bookingCabWithReg',
    'USER_UPCOMING_RIDE': ip + 'booking/upcomingRideList',
    'DRIVER_UPCOMING_RIDE': ip + 'booking/upcomingBookingList',
    'USER_OTHER_RIDE': ip + 'booking/otherRideList',
    'DRIVER_OTHER_RIDE': ip + 'booking/otherBookingList',
    'READ_TRIP_DETAIL': ip + 'booking/read/',
    'CANCLE_TRIP': ip + 'booking/cancleTrip/',
    'CREATE_FARE': ip + 'masterCard/create',
    'USER_PROFILE_DATA': ip + 'userInfo/readProfile',
    'USER_PROFILE_PIC': ip + 'userInfo/uploadProfPic',
    'DRIVER_DOCUMENT_UPDATE': ip + 'userInfo/updateDoc/',
    'PROFILE_DATA_UPDATE': ip + 'userInfo/updateProfile/',
    //'CHANGE_PASSWORD': ip + 'forgotPassword/setNewPassword',
    'FORGOT_PASSWORD': ip + 'forgotPassword/forgotPasswordotp/',
    'RESEND_FORGOT_PASSWORD': ip + 'forgotPassword/resendOTP/',
    'LIST_FARE_TABLE': ip + 'masterCard/rateListByDay/',
    'DELETE_FARE_BY_ID': ip + 'masterCard/deleteById/',
    'SEARCH_CUSTOMER_BY_NAME': ip + 'userSearchByMobile/',
    'ONLINE_OFFLINE': ip + 'userInfo/statusChange/',



});

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');

}]);
app.config(['$compileProvider', function ($compileProvider) {
    //$compileProvider.debugInfoEnabled(false);
    //$compileProvider.commentDirectivesEnabled(false);
    //$compileProvider.cssClassDirectivesEnabled(false);
    //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|ftp|blob):|data:image\//);
}]);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
  

        .when('/privacyPolicy', {
            templateUrl: 'assets/pages/privacyPolicy.html',

        }).when('/privacy', {
            templateUrl: 'assets/pages/privacy.html'
        })
        .when('/termsCondition', {
            templateUrl: 'assets/pages/termsCondition.html'

        }).when('/howItWorks', {
            templateUrl: 'assets/pages/howItWorks.html'
        }).when('/faq', {
            templateUrl: 'assets/pages/faq.html'
        }).when('/forgotPass', {
            templateUrl: 'assets/pages/forgotPassword.html',
            
        }).when('/managetrip', {
            templateUrl: 'assets/pages/manageTrip.html',
            controller: manageTripController,
            resolve: {
                GET_RIDE_LIST: function (authService, DotsCons, $http) {
                    var token = authService.getCookie('globals');
                    return $http({
                        method: 'GET',
                        url: DotsCons.GET_RIDE_LIST,
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
        }).when('/addtrip', {
            templateUrl: 'assets/pages/addtrip.html',
            controller: addTripController
        })
        .when('/approveMember',{
            templateUrl : 'assets/pages/approveDriver.html',
            controller :approveMemberCtrl,
            resolve: {
                GET_Drivet_LIST: function (authService, DotsCons, $http) {
                    var token = authService.getCookie('globals');
                    return $http({
                        method: 'GET',
                        url: DotsCons.DRIVER_SEARCH+0+"/10/",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
        })
        .when('/', {
            templateUrl: 'assets/pages/login.html',
            controller: LoginCtrl,
            resolve: {
                CHECK_AUTH: function (authService, $location, DotsCons, $http) {

                    var token = authService.getCookie('globals');
                    if (token != undefined) {
                        $http.get(DotsCons.CHECK_IF_LOGIN + token.currentUser.h5cAuthToken).then(function (res) {
                            console.log('token', res);
                            if (res.data.singleResult == true) {
                                switch (token.currentUser.Role) {
                                    case "0":
                                        $location.path('/maps');
                                        break;
                                    case "1":
                                        $location.path('/customerList');
                                        break;
                                    case "2":
                                        $location.path('/approveMember');
                                        break;
                                    default:
                                        $location.path('/logout');
                                        break;
                                }
                            }


                        }, function (reason) {
                            console.log('reason', reason);
                            $location.path('/logout');
                        })

                    }

                }
            }
        })
      
        .when('/travelBilling', {
            templateUrl: 'assets/pages/travelBilling.html',
            controller: travelBillingCtrl,
            resolve: {
                GET_CURRENT_DATA: function (authService, DotsCons,$rootScope, $http) {
                    var token = authService.getCookie('globals');
                    if($rootScope.data != null){
                        var data = $rootScope.data
                    }else{
                        var data = {}
                     }
                    return $http({
                        method: 'post',
                        url: DotsCons.GET_FILTERD_DATA+"/0/10/",
                        data: data,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
        })
        .when('/travelBillingFilters', {
            templateUrl: 'assets/pages/travelBillingFilters.html',
            controller: travelBillingCtrl1
     
        })
        .when('/customerList', {
            templateUrl: 'assets/pages/customerList.html',
            controller: customerListCtrl,
            resolve: {
                GET_CUSTMER_DATA: function (authService, DotsCons, $http) {
                    var token = authService.getCookie('globals');
                    return $http({
                        method: 'get',
                        url: DotsCons.CUSTEMER_LIST+"/0/10/",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
            
        })
       
        .when('/driverReg', {
            templateUrl: 'assets/pages/driverRegistration.html',
            controller: addTripController

        }).when('/travelerReg', {
            templateUrl: 'assets/pages/travelerRegistration.html',
            controller :customerListCtrl,
            resolve: {
                GET_CUSTMER_DATA: function (authService, DotsCons, $http) {
                    var token = authService.getCookie('globals');
                    return $http({
                        method: 'get',
                        url: DotsCons.CUSTEMER_LIST+"/0/10/",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
        }).when('/manageVendor', {
            templateUrl: 'assets/pages/manageVendor.html',
            controller : managevendortrl,
            resolve: {
                GET_VENDOR_DATA: function (authService, DotsCons, $http) {
                    var token = authService.getCookie('globals');
                    return $http({
                        method: 'get',
                        url: DotsCons.VENDOR_LIST+"/0/20/",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
        }).when('/addVendor', {
            templateUrl: 'assets/pages/addVendor.html',
            controller: addvendorCtrl
        })
        .when('/manageClient', {
            templateUrl: 'assets/pages/manageClient.html',
            controller : manageClientCtrl,
            resolve: {
                GET_CLIENT_DATA: function (authService, DotsCons, $http) {
                    var token = authService.getCookie('globals');
                    return $http({
                        method: 'get',
                        url: DotsCons.GET_CLIENT_LIST+"/0/20/",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        return response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                    
                },
            
            }
        }).when('/addClient', {
            templateUrl: 'assets/pages/addClient.html',
            controller : addClientController,
        })
        .when('/profile', {
            templateUrl: 'assets/pages/profile.html',
            controller :profileCtrl
        })
        
        .when('/help',{
            templateUrl:'assets/pages/help.html'
        })
      
   
        .when("/logout", {
            templateUrl: "assets/pages/login.html",
            controller : LogoutCtrl

        }).when("/terms", {
            templateUrl: 'assets/pages/terms.html'
        }).when("/support", {
            templateUrl: 'assets/pages/support.html'
        })
      
        .otherwise({
            redirectTo: '/pagenotfound'
        });
    /* ----to remove # tag from url---- */
    /*$locationProvider.html5Mode({
                 enabled: true,
                 requireBase: false
          });*/

}]);
app.run(function ($rootScope, $localStorage) {
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        var fullRoute = current.$$route.originalPath,
            routeParams = current.params,
            resolvedRoute;
        $localStorage.RouteName = fullRoute;
        /*console.log(fullRoute);
        console.log(routeParams);*/
        //resolvedRoute = fullRoute.replace(/:id/, routeParams.id);
        //console.log(resolvedRoute);

    });
    /*dependency: $templateCache
    $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
    });*/
});

/* ------------------------Clean template chache-------------- */
/* ----------------------------------------------------------- */
app.controller("NavBarCtrl", function ($scope, $route, $localStorage) {
    /* ---------------------------------------------- */
    $scope.routeRefresh = function () {
        $route.refresh();
    }
    /* ---------------------------------------------- */
    switch ($localStorage.RouteName) {
        case '/':
            $scope.loginActive = "active";
            break;
        case '/Registration':
            $scope.RegistrationActive = "active";
            break;
        case '/Registration-user':
            $scope.RegistrationuserActive = "active";
            break;
        case '/mycars':
            $scope.carActive = "active";
            break;

    }
});

app.controller("DashNavBarCtrl", function ($scope, $http, authService, $location, DotsCons, $localStorage, $route) {
    var token = authService.getCookie('globals');
    /* ------------------------------------------------ */
    if (token != undefined) {
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'h5cAuthToken': token.currentUser.h5cAuthToken
            }
        }
        /* ----------Logout function from nav bar----------- */
        $scope.logout = function () {
            $location.path('/logout');

        }
        $scope.ShowSidebar = true;
        $scope.shownav = function () {
            $scope.ShowSidebar = !$scope.ShowSidebar;
        }
        /* ---------------------------------------------- */
        // $scope.gotoProfileA = function(){
        //     $location.path('/profileA');
        // }
        $scope.gotoProfile = function () {
            $location.path('/profile');
        }
        /* ---------------------------------------------- */
        $scope.gotoRideList = function () {
            $location.path('/rideList');
        }
        $scope.filters = function (){
            $location.path('/travelBillingFilters')
        }
        /* ---------------------------------------------- */
        $scope.routeRefresh = function () {
            $route.refresh();
        }
        /* ---------------------------------------------- */
        switch ($localStorage.RouteName) {
            case '/rideList':
                $scope.Route = "Ride History";
                break;
            case '/customerList':
                $scope.Route = "Customer List";
                $scope.travellerList = true
                break;
            case '/approveMember':
                $scope.Route = "Approve Member";
                break;
            case '/myMember':
                $scope.Route = "My Member";
                break;
            case '/ratecard':
                $scope.Route = "Manage Fare Card";
                break;
            case '/bookcab':
                $scope.Route = "Book Your Ride Now";
                break;
            case '/bookride':
                $scope.Route = "Book Ride For Customers";
                break;
            case '/farechart':
                $scope.Route = "Manage Cab Fare";
                break;
            case '/profile':
                $scope.Route = "Manage Profile";
                break;
            case '/help':
                $scope.Route = "Help And Support";
                break;

            case '/terms':
                $scope.Route = " Terms And Conditions";
                break;
            case '/privacy':
                $scope.Route = "Privacy Policy";
                break;
            case '/support':
                $scope.Route = "Support";
                break;
            case '/managetrip':
                $scope.Route = "Manage Trip";
                break;
            case '/addtrip':
                $scope.Route = "Add Trip";
                break;
            case '/driverReg':
                $scope.Route = "Register Driver";
                break;
            case '/travelerReg':
                $scope.Route = "Register Traveller";
                break;
            case '/manageVendor':
                $scope.Route = "Manage Vendor";
                break;
            case '/addVendor':
                $scope.Route = "Add Vendor";
                break;
            case '/manageClient':
                $scope.Route = "Manage Client";
                break;
            case '/addClient':
                $scope.Route = "Add Client";

            break;
            case '/travelBilling':
            $scope.Route = "Travel Billing";
            $scope.travelBilling = true;
            break;
            case '/travelBillingFilters':
                $scope.Route = "Filters"
                $scope.travelBillingFilter = true
        }
        /* -----------GEtting profile info------------- */
        $scope.UserprofileData = function () {
            $http.get(DotsCons.USER_PROFILE_DATA, config).then(function (res) {
                console.log("user details", res);
                if (res.data.status == '$200') {
                    $scope.profileData = res.data.singleResult;
                    $scope.acctdetail = $scope.profileData.accountDto.role

                }
            }, function (reason) {
                if (reason.status == 403) {
                    $location.path('/logout');
                }
            });
        }
        $scope.UserprofileData();
        /* -------------------------------------------- */
        $scope.$on("call", function () {
            $scope.UserprofileData();
        });



        $scope.online = $localStorage.online_status;
        /* ------------ONLINE OFFLINE TOGGLE----------- */
        $scope.ToggleOnline = function (flag) {

            $http.get(DotsCons.ONLINE_OFFLINE + flag, config).then(function (res) {
                if (res.data.singleResult != undefined) {
                    $scope.online = res.data.singleResult;
                } else {
                    $scope.online = false;
                }
                /* ----------------------------------- */
                if (res.data.singleResult == true) {
                    $localStorage.online_status = 1;
                } else {
                    $localStorage.online_status = 0;
                }
            }, function (reason) {

            })
        }
        /* ------------------------------------------- */
        if ($localStorage.online_status == 3) {
            $scope.ToggleOnline(true);
        } else if ($localStorage.online_status == 1) {
            $scope.ToggleOnline(true);
        } else if ($localStorage.online_status == 0) {
            $scope.ToggleOnline(false);
        }


    }

});

app.controller("sidebarCtrl", function ($scope, $http, authService, $location, DotsCons, $localStorage) {
    var token = authService.getCookie('globals');
    $scope.LoginRole = token.currentUser.tokenDto.token;
    if (token != undefined) {
        /* ------------------------------------------------ */
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'h5cAuthToken': token.currentUser.h5cAuthToken
            }
        }
        /* ----------Logout function from nav bar----------- */
        $scope.logout = function () {
            $location.path('/logout');
        }
        /* ---------------------------------------------- */
        switch ($localStorage.RouteName) {
            case '/rideList':
                $scope.rideList = "active";
                break;
            case '/customerList':
                $scope.customerList = "active";
                break;
            case '/approveMember':
                $scope.approveMember = "active";
                break;
            case '/myMember':
                $scope.myMember = "active";
                break;
            case '/ratecard':
                $scope.ratecard = "active";
                break;
            case '/bookcab':
                $scope.bookcab = "active";
                break;
            case '/bookride':
                $scope.bookcab = "active";
                break;
            case '/farechart':
                $scope.farechart = "active";
                break;
            case '/maps':
                $scope.bookyourrides = "active";
                break;
            case '/ride-history':
                $scope.yourrides = "active";
                break;
            case '/':
                $scope.loginActive = "active";
                break;
            case '/Registration':
                $scope.RegistrationActive = "active";
                break;
            case '/Registration-user':
                $scope.RegistrationuserActive = "active";
                break;
            case '/profile':
                $scope.profile = "active";
                break;
            case '/support':
                $scope.support = "active";
                break;
            case '/managetrip':
                $scope.manageTrip = "active";
                break;
            case '/manageVendor':
                $scope.manageVendor = "active";
                break;
            case '/manageClient':
                $scope.manageClient = "active";
                break;
            case '/travelerReg':
                $scope.travelerReg = "active";


        }
    }

});

app.factory("authService", ['$cookies', '$q', function ($cookies, $q) {
    var globals;
    var deferred = $q.defer();
    /*function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }*/
    /* ------------------------------------------------------ */
    function setCookie(res) {
        cookieObj = {
            currentUser: res.data

        }
        $cookies.putObject('globals', cookieObj);
        console.log("cookieObj", cookieObj);
    }
    /* ------------------------------------------------------ */
    function getCookie(cookieName) {
        return $cookies.getObject(cookieName);
    }
    /* ------------------------------------------------------ */
    function removeCookie(obj) {
        return $cookies.remove(obj);
    }
    return {
        setCookie: setCookie,
        getCookie: getCookie,
        removeCookie: removeCookie

    };
}]);

/* -------Factory method for Save Document Details---------- */
app.factory("UPDATE_DOCUMENT", [function () {
    var data = {
        "id": "",
        "frontImagePath": "",
        "backImagePath": "",
        "documentNumber": "",
        "documentType": "",
        "driverId": "",
        "field1": "",
        "field2": "",
        "field3": "",
        "field4": "",
        "field5": "",
        "field6": "",
        "field7": "",
        "source": "Self"
    };
    return {
        Setid: function (a) {
            data.id = a;
        },
        SetfrontImagePath: function (b) {
            data.frontImagePath = b;
        },
        SetbackImagePath: function (c) {
            data.backImagePath = c;
        },
        SetdocumentNumber: function (d) {
            data.documentNumber = d;
        },
        SetdocumentType: function (e) {
            data.documentType = e;
        },
        SetdriverId: function (f) {
            data.driverId = f;
        },
        Setfield1: function (g) {
            data.field1 = g;
        },
        Setfield2: function (h) {
            data.field2 = h;
        },
        Setfield3: function (i) {
            data.field3 = i;
        },
        Setfield4: function (j) {
            data.field4 = j;
        },
        Setfield5: function (k) {
            data.field5 = k;
        },
        Setfield6: function (l) {
            data.field6 = l;
        },
        Setfield7: function (n) {
            data.field7 = n;
        },

        getData: function () {
            return data;
        }

    }

}]);


/*---------------------------Change Password ------------------*/

app.factory('CHANGE_PASS', [function () {
    var data = {
        "newPassword": "",
        "accountId": ""

    };
    return {
        setPass: function (pass) { data.newPassword = pass; },
        setAcc: function (accId) { data.accountId = accId; },

        getData: function () { return data; }
    };

}]);



app.directive('myDatepicker', function() {
    return {
        restrict: 'E',
        scope: {
            ngModel: "=",
            myid: "@"
        },
        templateUrl: 'assets/pages/datepicker.html',
          require: 'ngModel',
        link: function(scope, element) {
          
            scope.popupOpen = false;
            scope.openPopup = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.popupOpen = true;
            };
  
            scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              scope.opened = true;
            };
  
        }
    };
  });


/* -------------Factory Method for Add fare card------------ */
app.factory("ADD_FARE_CHART", [function () {
    var data = {
        driverId: "",
        dayId: "",
        modelId: "",
        fromTiming: "",
        toTiming: "",
        rate: ""
    };
    return {
        setdriverId: function (a) { data.driverId = a; },
        setdayId: function (b) { data.dayId = b; },
        setmodelId: function (c) { data.modelId = c; },
        setfromTiming: function (d) { data.fromTiming = d; },
        settoTiming: function (e) { data.toTiming = e; },
        setrate: function (f) { data.rate = f; },
        getData: function () { return data; }
    }
}]);

/* -------------------Profile Pic Upload-------------------- */
app.factory("PROFILE_PIC_UPLOAD", [function () {
    var data = {
        "fileName": "",
        "contentType": "",
        "content": ""
    };
    return {
        set_fileName: function (a) { data.fileName = a; },
        set_contentType: function (b) { data.contentType = b; },
        set_content: function (c) { data.content = c; },
        getData: function () { return data }

    }
}]);
app.factory("tripBooking", [function () {
    var data = {
        "carHire": "",
        "carUse": "",
        "companyDetailDto": {
            "companyName": "",
            "emailId": "",
            "gstnumber": "",
            "traveldeskname": ""
        },
        "driverAccountId": "",
        "dropDate": "",
        "dropTime": "2020-03-20T17:55:08.072Z",
        "instruction": "string",
        "pickUpAddress": "4th Cross,3rd Block",
        "pickUpCity": "Banglore",
        "pickUpDate": "2020-03-20T17:55:08.072Z",
        "pickUpLocation": "Jayanagar",
        "pickUpTime": "2020-03-20T17:55:08.072Z",
        "releaseAddress": "5th cross,1st Block",
        "releaseLocation": "Koramangala",
        "sysBookingRequestTypeDto": {
            "id": 1,
            "name": "string",
            "sysMaster": true
        },
        "sysCarCategoryDto": {
            "id": 1,
            "name": "string",
            "sysMaster": true
        },
        "travelId": "TN0u8u",
        "travelerDetailDto": {
            "employeeId": "string",
            "firstName": "string",
            "lastName": "string",
            "mobileNumber": 8088661978
        },
        "tripStatus": 0
    }
}])
app.factory("DOCUMENT_UPDATE", [function () {
    var data =
    {
        "source": "",
        "id": "",
        "driverId": "",
        "documentType": "",
        "frontImagePath": "",
        "backImagePath": "",
        "documentNumber": "",
        "field1": "",
        "field2": "",
        "field3": "",
        "field4": "",
        "field5": "",
        "field6": "",
        "field7": ""
    };
    return {
        set_source: function (source) { data.source = source; },
        set_id: function (id) { data.id = id; },
        set_driverId: function (driId) { data.driverId = driId; },
        set_documentType: function (docType) { data.documentType = docType; },
        set_frontImagePath: function (frontImgPath) { data.frontImagePath = frontImgPath; },
        set_backImagePath: function (backImgpath) { data.backImagePath = backImgpath; },
        set_documentNumber: function (docNum) { data.documentNumber = docNum; },
        set_field1: function (field1) { data.field1 = field1; },
        set_field2: function (field2) { data.field2 = field2; },
        set_field3: function (field3) { data.field3 = field3; },
        set_field4: function (field4) { data.field4 = field4; },
        set_field5: function (field5) { data.field5 = field5; },
        set_field6: function (field6) { data.field6 = field6; },
        set_field7: function (field7) { data.field7 = field7; },

        getData: function () { return data }

    }
}]);
app.directive('typeahead', function ($filter) {
    return {
        restict: 'AEC',
        scope: {
          items: '='
        },
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
          var blur = false;
          var original = scope.items;
          scope.focused = false;
          scope.list = [];
          ngModel.$modelValue = [];
          scope.filteredItems = scope.items;
          scope.selPos = 0;
          
          scope.focusIn = function() {
            if (!scope.focused){
              scope.focused = true;
              blur = false;
              scope.selPos = 0;
            }
          };
          scope.focusOut = function() {
            if (!blur) {
              scope.focused = false;
            } else {
              console.log("focusing");
              angular.element(elem).find('input')[0].focus();
              blur = false;
            }
          };
          
          scope.getDisplayItem = function(item) {
            return item[attrs.displayitem];
          };
          
          scope.getDisplayTag = function(item) {
            return item[attrs.displaytag];
          };
          
          scope.addItem = function(item) {
            scope.list.push(item);
            scope.itemsearch = "";
            blur = true;
            if (scope.selPos >= scope.filteredItems.length-1) {
              scope.selPos--;
            }
            ngModel.$setViewValue(scope.list);
          }
          
          scope.removeItem = function(item) {
            scope.list.splice(scope.list.indexOf(item), 1);
            ngModel.$setViewValue(scope.list);
            
          }

          scope.hover = function(index) {
            scope.selPos = index;
          }
          scope.keyPress = function(evt) {
            console.log(evt.keyCode);
            var keys = {
              38: 'up',
              40: 'down',
              8 : 'backspace',
              13: 'enter',
              9 : 'tab',
              27: 'esc'
            };
            
            switch (evt.keyCode) {
              case 13: 
                if(scope.selPos > -1) {
                  scope.addItem(scope.filteredItems[scope.selPos]);
                }
                break;
              case 8: 
                if (!scope.itemsearch || scope.itemsearch.length == 0) {
                  if (scope.list.length > 0) {
                    scope.list.pop();
                  }
                }
                break;
              case 38: 
                if (scope.selPos > 0) {
                  scope.selPos--;
                } 
                break;
              case 40: 
                if (scope.selPos < scope.filteredItems.length-1) { 
                  scope.selPos++; 
                }
                break;
              default:
                scope.selPos = 0; //clear selection
                scope.focusIn();
            }
          };
        },
      template: '<div class="typeahead">\
        <ul data-ng-class="{\'focused\': focused}" \
            class="tags" data-ng-click="focusIn()">\
          <li class="tag" data-ng-repeat="s in list track by $index">\
            {{getDisplayTag(s)}} <span data-ng-click="removeItem(s)">x</span>\
          </li> \
          <li class="inputtag">\
            <input data-ng-blur="focusOut()" focus="{{focused}}" type="text" data-ng-model="itemsearch" data-ng-keydown="keyPress($event)"/>\
          </li>\
        </ul>\
        <ul class="list" data-ng-show="focused">\
          <li data-ng-class="{\'active\': selPos == $index}" data-ng-repeat="item in (filteredItems = (items | filter: itemsearch | notin: list)) track by $index" data-ng-mousedown="addItem(item)" data-ng-mouseover="hover($index)">\
{{getDisplayItem(item)}}</li>\
        </ul>\
      </div>'
    };
})
// app.directive('focus', function () {
//     return {
//       restrict: 'A',
//       link: function (scope, element, attrs) {
//         attrs.$observe('focus', function (newValue) {
//           if (newValue == 'true') {
//             element[0].focus();
//           }
//         });
//       }
//     }
//   })
//   app.filter('notin', function() {
//     return function(listin, listout) {
//       return listin.filter(function(el) { 
//         return listout.indexOf(el) == -1 ;
//       });
//     };
//   });
