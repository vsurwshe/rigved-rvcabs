
/* --------------------------------------------------------------------------------- */
function LoginCtrl($scope, $http, DotsCons, authService, $location, toaster, $localStorage) {
    var config1 = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    /* ------------Login------------------ */
    $scope.Login = function () {
        toaster.pop('success', "success", "text");
        $scope.loading = true;
        var data = {
            userName: $scope.userName,
            password: $scope.password,
            deviceToken: ""

        }
        $http.post(DotsCons.LOGIN_POINT, data, config1).then(function (res) {
            console.log("login result", res);
            var header = res.config.headers;
            $localStorage.myHeader = Object.keys(header);
            $localStorage.requestHeader = Object.values(header)

            if (res.status == "200") {
                authService.setCookie(res);
                $.iaoAlert({
                    msg: "Login Successfully",
                    type: "success",
                    mode: "dark",
                })
                if (authService.getCookie('globals') != undefined) {
                    var x = authService.getCookie('globals');
                    $scope.loading = false;
                    $location.path('/managetrip');

                    // if (x.currentUser.Role == 2) {
                    //     $location.path('/approveMember');
                    // } else if(x.currentUser.Role == 0){
                    //     $location.path('/maps');
                    // }else{
                    //     $location.path('/customerList'); 
                    // }


                } else {
                    $.iaoAlert({
                        msg: "Token not set!",
                        type: "error",
                        mode: "dark",
                    });
                    $scope.loading = false;
                }
            } else if (res.data.status == "$600") {
                $scope.Loginloading = false;
                $.iaoAlert({
                    msg: "UserId and passowrd did not match!",
                    type: "error",
                    mode: "dark",
                });
                $scope.loading = false;
            } else {
                $.iaoAlert({
                    msg: "Something went wrong! Try again.",
                    type: "error",
                    mode: "dark",
                });
                $scope.loading = false;
            }

        }, function (reason) {
            $.iaoAlert({
                msg: "Invalid Credentails (or) Server Down",
                type: "error",
                mode: "dark",
            })
            $scope.loading = false;
        });
    }



}

/* --------------------------------------------------------------------------------- */
function LogoutCtrl($http, DotsCons, $location, authService, $scope, $localStorage) {
    var token = authService.getCookie('globals');
    $localStorage.online_status = 3;
    if (token != undefined) {
        /* ------------------------------------------------ */
        var config1 = {
            headers: {
                'Content-Type': 'application/json',
                'h5cAuthToken': token.currentUser.h5cAuthToken
            }
        }
        /* ------------------Logout Point-------------------- */
        $http.get(DotsCons.LOGOUT_POINT, config1).then(function (response) {
            console.log('logout', response);
            $scope.RemoveCookie();

        }, function (reason) {
            console.log("Error : ", reason);
            $scope.RemoveCookie();
        });
        /* -------------------------------------------------- */
    } else {
        $scope.RemoveCookie();
    }

    /* ------------------------------------------------------ */
    $scope.RemoveCookie = function () {
        authService.removeCookie('globals');
        var token = authService.getCookie('globals');
        console.log("token", token);
        $location.path('/');
    }

}



/* --------------------------------------------------------------------------------- */
/* --------------------------------Customer List------------------------------------ */
/* --------------------------------------------------------------------------------- */
function customerListCtrl(authService, $location, $scope, $http, DotsCons,GET_CUSTMER_DATA) {

    if(GET_CUSTMER_DATA != null){
        $scope.customerList = GET_CUSTMER_DATA
    }
    var token = authService.getCookie('globals');
  $scope.registerTraveller = function(){
$scope.loading = true;
    var data ={
        "emailId": $scope.traveler_email,
        "mobileNumber": $scope.traveler_mobNum,
        "firstName": $scope.traveler_fname,
        "lastName": $scope.traveler_lname,
        "secMobileNumber": $scope.traveler_secMobNum,
     }
        
     $http({
        method: 'post',
        url: DotsCons.TRAVELLER_REGISTRATION,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response)
        if (response.status == '200') {
            $scope.loading = false;
            $.iaoAlert({
                msg: "Traveller Registered Successfully ..!",
                type: "success",
                mode: "dark",
            })
            $location.path('/customerList')
        } 
    },
        function (errResponse) {
            console.error('Error !!');
            $scope.loading = false;
            $.iaoAlert({
                msg: "Somthing went wrong...Try agian!",
                type: "error",
                mode: "dark",
            })
            return $q.reject(errResponse);
        })
  }
}
function addClientController(authService, $location, $scope, $http, DotsCons){
    var token = authService.getCookie('globals');


  $scope.addClient = function(){
      $scope.loading = true
    var reqBody = {
        "countryCode": "IN",
        "name": $scope.Book_cname,
        "emailId": $scope.emailId,
        "mobileNumber": $scope.mobileNum,
        "contactPerson": $scope.contactPerson,
        "gstNum": $scope.gstNum,
        "address": $scope.address,
        "area": $scope.area,
        "city": $scope.vendor_city,
        "state": $scope.vendor_state,
        "pincode": $scope.pincode,
        "active": true
        }
        
    $http({
        method: 'post',
        url: DotsCons.ADD_CLIENT,
        data: reqBody,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response)
        if (response.status == '200') {
            $scope.loading = false;
            $.iaoAlert({
                msg: "Client Registered Successfully ..!",
                type: "success",
                mode: "dark",
            })
            $location.path('/manageClient')
        } 
    },
        function (errResponse) {
            console.error('Error !!');
            $scope.loading = false;
            $.iaoAlert({
                msg: "Somthing went wrong...Try agian!",
                type: "error",
                mode: "dark",
            })
            return $q.reject(errResponse);
        })
  }
}
function manageClientCtrl(authService, $location, $scope, $http, DotsCons,GET_CLIENT_DATA){
    if(GET_CLIENT_DATA != null){
        $scope.client_list = GET_CLIENT_DATA;
    }
}







/* --------------------------------------------------------------------------------- */
/* --------------------------------Car Ctrl-------toke---------------------------------- */
function approveMemberCtrl($scope, $http, DotsCons, authService, $localStorage, $q, $log,Upload, $timeout, $location,GET_Drivet_LIST){
    if(GET_Drivet_LIST != null){
        $scope.driverList = GET_Drivet_LIST
    }
}
/* --------------------------------------------------------------------------------- */
function addTripController($scope, $http, DotsCons, authService, $localStorage, $q, $log,Upload, $timeout, $location,) {
    // $scope.rideList = GET_RIDE_LIST;
   
    var token = authService.getCookie('globals');
    var myheader = $localStorage.myHeader[0];
    var requestHeader = $localStorage.requestHeader[0]
    /* ------------------------------------------------ */
    var config = {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": token.currentUser.tokenDto.token

        }
    }
    $http({
        method: 'GET',
        url: DotsCons.SEARCH_BRAND,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response);
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    $http({
        method: 'GET',
        url: DotsCons.SEARCH_BRAND,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        $scope.allBrands = response.data;
        console.log($scope.allBrands)
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })

    $http({
        method: 'GET',
        url: DotsCons.SEARCH_MODEL,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response);
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    $http({
        method: 'GET',
        url: DotsCons.SEARCH_CAR_COLOR,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response);
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    $http({
        method: 'GET',
        url: DotsCons.COMPANY_DETAILS,
        data: 'val',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        $scope.companyDetails = response.data;
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })





        $scope.getCostCenter = function(val){
            if(val =="" || val == undefined || val == null){
                val = ""
            }
            return $http({
                method: 'GET',
                url: DotsCons.GET_COST_CENTER+0+"/10/"+val,
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
            // return $http.get(DotsCons.GET_COST_CENTER+0+"/10/"+val,config).then(function(response){
            //     return response.data
            // })
        }
        $scope.getTravelId = function(val){
            if(val =="" || val == undefined || val == null){
                val = ""
            }
            return $http({
                method: 'GET',
                url: DotsCons.GET_TRAVEL_ID+"/"+0+"/10/"+val,
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
        
        }
    $scope.getCompany = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.COMPANY_DETAILS+"/"+0+"/10/"+val,
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
    }
    $scope.getCarBarand = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_BRAND+'0/10/'+val,
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

    }
    $scope.getSubType = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.SUB_TYPE+0+"/10/"+val,
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

    }
    
    $scope.getDriverList = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.DRIVER_SEARCH+0+"/10/"+val,
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

    }
    $scope.getForUse = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.FOR_USE+0+"/10/"+val,
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

    }

    var that = this;

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };



    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),

    };
    $scope.dateOptions1 = {
        //   dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }



    $scope.open1 = function () {
        $scope.popup1.opened = true;
        // alert($scope.dt)
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
        // alert($scope.dt)
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };
    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.onCompanySelected = function (item, model, label) {
        $scope.gstNum = item.gstnumber;
        $scope.costCen = item.costCenter;

   
    };



    $scope.tripBooking = function () {
$scope.loading = true;
console.log($scope.releasetime)
console.log($scope.picktime)
 var drpTime ="Wed Mar 25 2015 "+$scope.releasetime+":00 GMT+0530 (India Standard Time)";
var pickTime ="Wed Mar 25 2015 "+$scope.picktime+":00 GMT+0530 (India Standard Time)";
 console.log(pickTime)
 console.log(Date.parse(pickTime))

console.log($scope.repAdd,$scope.pickUpLocation,$scope.fromCity)

        var data = {

            "carHire": $scope.carHire,
            // "carUse": $scope.forUse,
            "companyDetailDto": {
                "id": $scope.company.id,
                "costCenter":$scope.costCenter.name
            },
            "driverAccountId": $scope.driver.id,
            "dropDate": $scope.toDate.getTime(),
            "dropTime": Date.parse(drpTime),
            "instruction": $scope.specificIns,
            // "notificationExpTime": "2020-04-30T05:15:45.660Z",
            "pickUpAddress": $scope.repAdd,
            "pickUpCity": $scope.fromCity,
            "pickUpDate": $scope.fromDate.getTime(),
            "pickUpLocation": $scope.pickUpLocation,
            "pickUpTime": Date.parse(pickTime),
            "releaseAddress": $scope.relAdd,
            "releaseLocation": $scope.dropLocation,
            "sysBookingRequestTypeDto": {
                "id": $scope.forUse.id,
            },
            "sysCarCategoryDto": {
                "id": $scope.carSegName.id,

            },
            "sysCarMasterDto": {
                "id": $scope.carBrand.id,
            },
            "travelId": $scope.travel_Id,
            "traveldeskEmailId": $scope.Book_email,
            "traveldeskname": $scope.Book_req,
            "travelerDetailDto": {

                "employeeId": $scope.empId,
                "firstName": $scope.fname,
                "lastName": $scope.lname,
                "mobileNumber": $scope.travelerMobNum


            },
            "tripStatus": ""
        }

        // Old payload code fixes
        // var data = {
        //     "carHire": $scope.carHire,
        //     "carUse": $scope.forUse,
        //     "companyDetailDto": {
        //         "companyName": $scope.company.companyName,
        //         "emailId": $scope.Book_email,
        //         "gstnumber": $scope.gstNum,
        //         "traveldeskname": $scope.Book_req
        //     },
        //     "driverAccountId": $scope.driver.id,
        //     "dropDate": $scope.toDate,
        //     "dropTime": $scope.releasetime,
        //     "instruction": $scope.specificIns,
        //     "pickUpAddress": $scope.repAdd,
        //     "pickUpCity": $scope.fromCity,
        //     "pickUpDate": $scope.fromDate,
        //     "pickUpLocation": $scope.pickUpLocation,
        //     "pickUpTime": $scope.picktime,
        //     "releaseAddress": $scope.relAdd,
        //     "releaseLocation": $scope.dropLocation,
        //     "sysBookingRequestTypeDto": {
        //         "id": $scope.carSegName.id,
        //         "name": $scope.carSegName.name,
        //         "sysMaster": $scope.carSegName.sysMaster
        //     },
        //     "sysCarCategoryDto": {
        //         "id": $scope.carBrand.id,
        //         "name": $scope.carBrand.name,
        //         "sysMaster": $scope.carBrand.sysMaster
        //     },
        //     "travelId": $scope.empId,
        //     "travelerDetailDto": {
        //         "employeeId": $scope.empId,
        //         "firstName": $scope.fname,
        //         "lastName": $scope.lname,
        //         "mobileNumber": $scope.travelerMobNum
        //     },
        //     "tripStatus": 0
        // }


       // alert($scope.picktime)
        console.log(data)
        // $http({
        //     method: 'post',
        //     url: DotsCons.TRIP_BOOKING,
        //     data: data,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': token.currentUser.tokenDto.token
        //     }
        // }).then(function (response) {
        //     console.log(response)
        //     if (response.status == '200') {
        //         $scope.loading = false;
        //         $.iaoAlert({
        //             msg: "Trip Booked Successfully ..!",
        //             type: "success",
        //             mode: "dark",
        //         })
        //     }
        //     $location.path('/managetrip')
        // },
        //     function (errResponse) {
        //         $.iaoAlert({
        //             msg: "Trip Booked Successfully ..!",
        //             type: "success",
        //             mode: "dark",
        //         })
        //     })

    }


    // function addvendorCtrl($scope, $http, DotsCons, authService, $localStorage, $q, toaster) {
    //     var token = authService.getCookie('globals');
    //     $scope.addVendor = function () {
    //         var postData = {
    //             "companyName": $scope.Book_cname,
    //             "costCenter": $scope.vendor_city,
    //             "emailId": $scope.emailId,
    //             "gstnumber": $scope.gstNum,
    //             "traveldeskname": $scope.contactPerson
    //         }
    //         $http({
    //             method: 'post',
    //             url: DotsCons.ADD_COMPANY,
    //             data: postData,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': token.currentUser.tokenDto.token
    //             }
    //         }).then(function (response) {
    //             console.log(response)
    //             if (response.data.status == '200') {
    //                 toaster.pop('success', "success", "text");
    //             }
    //         },
    //             function (errResponse) {
    //                 console.error('Error !!');
    //                 return $q.reject(errResponse);
    //             })
    //     }
    // }
    $scope.getCarInterrior = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_INTERRIOR+0+'/10/'+val,
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
    }
    $scope.getCarColor = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_CAR_COLOR+0+'/10/'+val,
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
    };
    $scope.getCarModal = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_MODEL+0+"/"+$scope.carBrandSubType.id,
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

    }
    $scope.getCarBrand = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_BRAND+0+'/10/'+val,
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
    }

   $scope.acc1 = function(){
       $scope.card = true;
   }
   $scope.acc2 = function(){
    $scope.card1 = true;
}
    $scope.uploadFile = function () {
        $scope.showFile = true;
    }
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        console.log($scope.f)
        
        var reader = new FileReader()
        reader.onloadend = function(){
        $localStorage.blob = reader.result.split(',')[1];
           
        }
        
        var rdata = [{
            fileName:$scope.f.name,
            content:$localStorage.blob,
            "description":"9986063632",
	        "contentType":$scope.f.type
        }]
        console.log(rdata)
        reader.readAsDataURL(file);
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            setTimeout(function(){
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: rdata,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
                $localStorage.getUrl = response.data
            //    $localStorage.getFile = response.data[0]
            //     console.log("path",getFile);
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            },2000)
            setTimeout(function(){
            $http({
                method: 'GET',
                url: "http://103.224.240.187:9000/file/getFile?path="+$localStorage.getUrl,
                data: '',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log(response.data);
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            },4000)
        }   
    }
    $scope.Uploading = function () {
      $scope.loading = true;
       
        $scope.sizeIsmore = false;
        if ($scope.dffiles.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.dffiles.length; i++) {
                var fname = $scope.dffiles[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.dffiles[i].base64;
                var fname = $scope.dffiles[i].filename;
                var ftype = $scope.dffiles[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.dffiles[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope.driver_frontd = uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                $scope.driver_front = response.data
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                        console.log(response.data);
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingBack= function () {
      
        $scope.loading = true;
        $scope.sizeIsmore = false;
        if ($scope.dbfiles.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.dbfiles.length; i++) {
                var fname = $scope.dbfiles[i].filename.split(".");
                console.log(fname[0])
                var bArray = $scope.dbfiles[i].base64;
                var fname = $scope.dbfiles[i].filename;
                var ftype = $scope.dbfiles[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.dbfiles[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope.driverd_back = uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                $scope.driver_back = response.data
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingPan= function () {
      
        $scope.loading = true;
        $scope.sizeIsmore = false;
        if ($scope.panfiles.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.panfiles.length; i++) {
                var fname = $scope.panfiles[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.panfiles[i].base64;
                var fname = $scope.panfiles[i].filename;
                var ftype = $scope.panfiles[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.panfiles[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope.pan_front = uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingPan1= function () {
      
       $scope.loading = true;
        $scope.sizeIsmore = false;
        if ($scope.pan1files.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.pan1files.length; i++) {
                var fname = $scope.pan1files[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.pan1files[i].base64;
                var fname = $scope.pan1files[i].filename;
                var ftype = $scope.pan1files[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.pan1files[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope.pan_back = uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingAdhar= function () {
      
       $scope.loading = true
        $scope.sizeIsmore = false;
        if ($scope.adharfiles.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.adharfiles.length; i++) {
                var fname = $scope.adharfiles[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.adharfiles[i].base64;
                var fname = $scope.adharfiles[i].filename;
                var ftype = $scope.adharfiles[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.adharfiles[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope.adhar_front = uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);

             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingAdhar1= function () {
      
       $scope.loading = true
        $scope.sizeIsmore = false;
        if ($scope.adhar1files.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.adhar1files.length; i++) {
                var fname = $scope.adhar1files[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.adhar1files[i].base64;
                var fname = $scope.adhar1files[i].filename;
                var ftype = $scope.adhar1files[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.adhar1files[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope.adhar_back = uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.acc4 = function(){
        $scope.card3 = true
    } 
    $scope.acc3 = function(){
        $scope.card2 = true
    } 
    $scope.acc6 = function(){
        $scope.card5= true
    } 
    $scope.acc7= function(){
        $scope.card6 = true
    } 
    $scope.UploadingPV= function () {
      $scope.loading = true
       
        $scope.sizeIsmore = false;
        if ($scope.pvfiles.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.pvfiles.length; i++) {
                var fname = $scope.pvfiles[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.pvfiles[i].base64;
                var fname = $scope.pvfiles[i].filename;
                var ftype = $scope.pvfiles[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.pvfiles[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope. pvFront= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingPV1= function () {
      
       $scope.loading = true
        $scope.sizeIsmore = false;
        if ($scope.pv1file.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.pv1file.length; i++) {
                var fname = $scope.pv1file[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.pv1file[i].base64;
                var fname = $scope.pv1file[i].filename;
                var ftype = $scope.pv1file[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.pv1file[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope. pvBack= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.acc5 = function(){
        $scope.card4 = true
    } 
    $scope.UploadingVR= function () {
      
       $scope.loading = true
        $scope.sizeIsmore = false;
        if ($scope.vrFiles.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.vrFiles.length; i++) {
                var fname = $scope.vrFiles[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.vrFiles[i].base64;
                var fname = $scope.vrFiles[i].filename;
                var ftype = $scope.vrFiles[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.vrFiles[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope. pvFront= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.UploadingVR1= function () {
      
       $scope.loading = true
        $scope.sizeIsmore = false;
        if ($scope.vr1Files.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.vr1Files.length; i++) {
                var fname = $scope.vr1Files[i].filename.split(".");
                console.log(fname)
                var bArray = $scope.vr1Files[i].base64;
                var fname = $scope.vr1Files[i].filename;
                var ftype = $scope.vr1Files[i].filetype.split("/");
                console.log(ftype)
                var bArray = $scope.vr1Files[i].base64;
               
                docData = {
                    fileName: fname[0],
                    content: bArray,
                    contentType :ftype[1],
                    "description" :"DriverDocument"
                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            $scope. rvBack= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
            
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log("res",response.data);
             if(response.data  != null){
                
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_FILES,
                        data: '',
                        params : {"path":response.data},
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.loading = false;
                        $.iaoAlert({
                            msg: "File Uploaded Successfully ..!",
                            type: "success",
                            mode: "dark",
                        })
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
        
             }
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            
        }
    
    }
    $scope.Uploadingin= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.infiles.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.infiles.length; i++) {
                 var fname = $scope.infiles[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.infiles[i].base64;
                 var fname = $scope.infiles[i].filename;
                 var ftype = $scope.infiles[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.infiles[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.insurance_front= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
     $scope.Uploadingin1= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.in1file.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.in1file.length; i++) {
                 var fname = $scope.in1file[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.in1file[i].base64;
                 var fname = $scope.in1file[i].filename;
                 var ftype = $scope.in1file[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.in1file[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.insurance_back= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
     $scope.Uploadingvep= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.in1file.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.vepfiles.length; i++) {
                 var fname = $scope.vepfiles[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.vepfiles[i].base64;
                 var fname = $scope.vepfiles[i].filename;
                 var ftype = $scope.vepfiles[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.vepfiles[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.vep_front= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
     $scope.Uploadingvep1= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.in1file.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.vep1file.length; i++) {
                 var fname = $scope.vep1file[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.vep1file[i].base64;
                 var fname = $scope.vep1file[i].filename;
                 var ftype = $scope.vep1file[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.vep1file[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.vep_back= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
     $scope.UploadingRD= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.rdfiles.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.rdfiles.length; i++) {
                 var fname = $scope.rdfiles[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.rdfiles[i].base64;
                 var fname = $scope.rdfiles[i].filename;
                 var ftype = $scope.rdfiles[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.rdfiles[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.rd_front= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
     $scope.UploadingRD1= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.rd1file.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.rd1file.length; i++) {
                 var fname = $scope.rd1file[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.rd1file[i].base64;
                 var fname = $scope.rd1file[i].filename;
                 var ftype = $scope.rd1file[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.rd1file[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.rd_back= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
    // $scope.documentType = function(){
    //     $http({
    //         method: 'GET',
    //         url: DotsCons.DOCUMENT_SEARCH,
    //         data: '',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': token.currentUser.tokenDto.token
    //         }
    //     }).then(function (response) {
    //         console.log(response)
    //         $scope.filesDropDown = response.data
    //     },
    //         function (errResponse) {

    //             console.error('Error !!');
    //             return $q.reject(errResponse);
    //         })

    // }
    // $scope.documentType()
    $scope.UploadingFT= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.ftfiles.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.ftfiles.length; i++) {
                 var fname = $scope.ftfiles[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.ftfiles[i].base64;
                 var fname = $scope.ftfiles[i].filename;
                 var ftype = $scope.ftfiles[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.ftfiles[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.ft_front= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
     $scope.UploadingFT1= function () {
      
        $scope.loading = true
         $scope.sizeIsmore = false;
         if ($scope.ft1file.length != 0) {
             var uploadedFiles = [];
             var docData;
             for (var i = 0; i < $scope.ft1file.length; i++) {
                 var fname = $scope.ft1file[i].filename.split(".");
                 console.log(fname)
                 var bArray = $scope.ft1file[i].base64;
                 var fname = $scope.ft1file[i].filename;
                 var ftype = $scope.ft1file[i].filetype.split("/");
                 console.log(ftype)
                 var bArray = $scope.ft1file[i].base64;
                
                 docData = {
                     fileName: fname[0],
                     content: bArray,
                     contentType :ftype[1],
                     "description" :"DriverDocument"
                 }
                 uploadedFiles.push(docData);
                 console.log(uploadedFiles)
             }
             $scope.ft_back= uploadedFiles[0].fileName+"."+uploadedFiles[0].contentType;
             
             $http({
                 method: 'POST',
                 url: DotsCons.UPLOAD_FILES,
                 data: uploadedFiles,
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token.currentUser.tokenDto.token
                 }
             }).then(function (response) {
                 console.log("res",response.data);
              if(response.data  != null){
                 
                     $http({
                         method: 'GET',
                         url: DotsCons.GET_FILES,
                         data: '',
                         params : {"path":response.data},
                         headers: {
                             'Content-Type': 'application/json',
                             'Authorization': token.currentUser.tokenDto.token
                         }
                     }).then(function (response) {
                         console.log(response.data);
                         $scope.loading = false;
                         $.iaoAlert({
                             msg: "File Uploaded Successfully ..!",
                             type: "success",
                             mode: "dark",
                         })
                     },
                         function (errResponse) {
                             console.error('Error !!');
                             return $q.reject(errResponse);
                         })
         
              }
             },
                 function (errResponse) {
                     console.error('Error !!');
                     return $q.reject(errResponse);
                 })
             
         }
     
     }
    $scope.driverRegistration = function () {
        $scope.loading = true;
        $scope.docData = [];
        if( $scope.card == true){
           
            var dldoc =  {
                "documentType":{"id":1},
                "docName": "Driving Licence",
                "description": null,
                "active": true,
                "keyName": "DL Number:,Firt Name:,Last Name:,Date of Birth:,Blood Group:,RTO Name:,Issued Date:,Date of Expiry:,Type of Vehicle:,Remark:,Front Image:,Back Image:,",
                "documentField": {
                  "Remark": "",
                  "Back Image": $scope.driver_back[0],
                  "Issued Date": $scope.issueDate,
                  "Date of Expiry": $scope.expiryDate,
                  "Date of Birth": '',
                  "Front Image": $scope.driver_back[0],
                  "DL Number": $scope.dlno,
                  "Blood Group": $scope.blGroup,
                  "Type of Vehicle": $scope.typevehi,
                  "Firt Name": $scope.driver_fname,
                  "RTO Name": $scope.rtoName,
                  "Last Name": $scope.driver_lname
                }
              }

            
            $scope.docData.push(dldoc)
           
        }
         if($scope.card2 == true){
            
            var adharData = {
                "documentType": {'id':2},
                "docName": "Adhar Card",
                "description": null,
                "active": true,
                "keyName": "Aadhar Number:,Aadhar Name:,Aadhar Last Name:,Aaddhar DOB:,Gender:,AadharAddress,Front Image:,Back Image:,",
                "documentField": {
                  "Gender": "",
                  "Back Image": "",
                  "AadharAddress": "",
                  "Aaddhar DOB": $scope.dob,
                  "Aadhar Name": $scope.adhar_fname,
                  "Front Image": "",
                  "Aadhar Last Name": $scope.adhar_lname,
                  "Aadhar Number": $scope.adharno,
                }
              
            }
            $scope.docData.push(adharData)
        }
        if($scope.card1 ==true){
            var pandata = {
                
                "documentType": {'id':3},
                    "docName": "Pan Card",
                    "description": null,
                    "active": true,
                    "keyName": "Permanent  Account Number:,PAN First Name:,PAN Last Name:,Father's Name:,PAN DOB:,Front Image:,Back Image:,",
                    "documentField": {
                      "Permanent  Account Number": $scope.panno,
                      "Back Image": "",
                      "Father's Name": $scope.fatherName,
                      "PAN First Name": $scope.pan_fname,
                      "PAN DOB": $scope.panDob,
                      "Front Image": "",
                      "PAN Last Name": $scope.pan_lname
                    }
                  }
                  $scope.docData.push(pandata)
        }
        if($scope.card3 ==true){
            var pvdata = {
                
                "documentType": {'id':4},
                "docName": "Police Verification",
                "description": null,
                "active": true,
                "keyName": "Police Station Name:,Authority Name:,Document Number:,Front Image:,Back Image:,",
                "documentField": {
                  "Authority Name": $scope.author_name,
                  "Back Image": "",
                  "Document Number": $scope.dcn,
                  "Police Station Name": $scope.psn,
                  "Front Image": ""
                }
                }
                  $scope.docData.push(pvdata)
        }
        if($scope.card4 ==true){
            var regdata = {
                "documentType": {'id':5},
                "docName": "Vehicle Registration",
                "description": null,
                "active": true,
                "keyName": "Registration Number:,Registration Date:,Registration Office:,Owner Name:,Gender:,Age:,Manufacturer:,Vehicle Model:,Vehicle Base:,Manufacturer Date:,FuelType:,Reg Upto:,Tax Upto:,Class:,Vehicle Color:,Front Image:,Back Image:,",
                "documentField": {
                  "Registration Office": $scope.rto,
                  "Gender": $scope.gender,
                  "Back Image": "",
                  "Class": $scope.class,
                  "Reg Upto": $scope.regUpto,
                  "Manufacturer Date": $scope.manufacDate,
                  "Tax Upto": $scope.tax,
                  "Front Image": "",
                  "Age": $scope.age,
                  "regNumber":$scope.regNo,
                  "Manufacturer": $scope.manfact,
                  "Vehicle Color": $scope.color,
                  "Vehicle Model": $scope.vhName,
                  "Vehicle Base": $scope.vhBase,
                  "Owner Name": $scope.owName,
                  "FuelType": $scope.fuel,
                  "Registration Number": $scope.regno,
                  "Registration Date": $scope.regDate
                }
                }
                  $scope.docData.push(regdata)
        }
        if($scope.card5 ==true){
            var vidata = {
                
                "documentType": {'id':6},
                "docName": "Vehicle Insurance",
                "description": null,
                "active": true,
                "keyName": "Policy Number:,Issued Date:,Expiry Date:,Insurance Provider:,Document Number:,Insurance Type:,Front Image:,Back Image:,",
                "documentField": {
                "Insurance Type": $scope.inType,
                "Back Image": "",
                "Document Number": $scope.docNo,
                "Issued Date": $scope.inIssueDate,
                "Insurance Provider": $scope.inProvider,
                "Expiry Date": $scope.inExpiryDate,
                "Front Image": "",
                "Policy Number": $scope.polacyno
                }
                }
                  $scope.docData.push(vidata)
        }
        if($scope.card7 == true){
            var vhper = {
                "documentType": {'id':7},
                "docName": "Vehicle Permit",
                "description": null,
                "active": true,
                "keyName": "Permit Number:,Issued Date:,Expiry Date:,Permit Sate:,Permit Type:,Vehicle Number:,Front Image:,Back Image:,",
                "documentField": {
                  "Permit Number": $scope.perno,
                  "Back Image": "",
                  "Issued Date": $scope.vpissueDate,
                  "Permit Sate": $scope.perstate,
                  "Expiry Date": $scope.vpexpiryDate,
                  "Front Image": "",
                  "Vehicle Number": $scope.vehcle_num,
                  "Permit Type": $scope.PermitType
                }
              
            }
            $scope.docData.push(vhper)
        }
        if($scope.card9 == true){
            var tax = {
                "documentType": {'id':9},
                "docName": "Road Tax",
                "description": null,
                "active": true,
                "keyName": "Document Number:,Issued Date:,Expiry Date:,Front Image:,Back Image:,",
                "documentField": {
                  "Back Image": "",
                  "Document Number": $scope.taxno,
                  "Issued Date": $scope.taxissueDate,
                  "Expiry Date": $scope.taxexpiryDate,
                  "Front Image": ""
                }
            }
            $scope.docData.push(tax)
        }
     if($scope.card10 == true){
         var fc = {
            "documentType": {'id':10},
            "docName": "Fittness Certificate",
            "description": null,
            "active": true,
            "keyName": "Document Number:,Issued Date:,Expiry Date:,Front Image:,Back Image:,",
            "documentField": {
              "Back Image": "",
              "Document Number": $scope.docuNo,
              "Issued Date": $scope.fcissueDate,
              "Expiry Date": $scope.fcexpiryDate ,
              "Front Image": ""
            }
         }
     }
        var postdata =  {

                    "address": "George Street",
                    "area": "M G Road",
                    "branchId": 0,
                    "city": "Bangalore",
                    "countryCode": "IN",
                    "createdBy": "04da390e-7f95-4b73-a541-4d3c7dd0c891",
                    "customerId": "",
                    "dateOfBirth": "2020-03-13T07:30:45.076Z",
                    "emailId": $scope.driver_email,
                    "extension": "string",
                    "firstName": $scope.driver_fname,
                    "gender": "Male",
                    "lastName":$scope.driver_lname,
                    "mobileNumber": $scope.driver_mobNum,
                    "password": "Abc@12def",
                      "userType": "Driver", 
                      "pincode": 12345,
                      
                  "carDetailDto":{           
                    "type": {
                    "id": $scope.carBrand.id

                },
                "subType": {
                    "id": $scope.carSegName.id

                },
                "carColor": {
                    "id": $scope.carColor.id

                },
                "carInterrior": {
                    "id": $scope.Interrior.id

                },
                "carCategory": {
                    "id": $scope.carBrandSubType.id

                }
                  },
                   "documentDetailDtos":$scope.docData,
                   
                
                    "state": "Bangalore"
                
       }
  

        console.log(postdata)
        $http({
            method: 'post',
            url: DotsCons.DRIVER_REGISTRATION,
            data: postdata,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            console.log(response)
            if (response.status == '200') {
                $scope.loading = false;
                $.iaoAlert({
                    msg: "Driver Registered Successfully ..!",
                    type: "success",
                    mode: "dark",
                })
                $location.path('/approveMember')
            } 

        },
            function (errResponse) {
                console.error('Error !!');
                $scope.loading = false;
                $.iaoAlert({
                    msg: "Somthing went wrong...Try agian!",
                    type: "error",
                    mode: "dark",
                })
                return $q.reject(errResponse);
            })

    }

}
function manageTripController($scope, $http, DotsCons, authService, $localStorage, $q, $log, $location, GET_RIDE_LIST) {
    var ridelist
    if (GET_RIDE_LIST != null) {
        ridelist = GET_RIDE_LIST;
    }

    $scope.getFinishList = function(){
        $scope.loading = true;
            var token = authService.getCookie('globals');
             $http({
                method: 'GET',
                url: DotsCons.GET_FINISHED_LIST,
                data: "",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                $scope.finishList = response.data;
                $scope.loading = false;
            },
                function (errResponse) {
                    console.error('Error !!');
                     $q.reject(errResponse);
                })
        
    }
    
    console.log(ridelist)

    var bigCities = [];
    var pastRides = []
    for (let i = 0; i < ridelist.length; i++) {
        if (ridelist[i].status == 2 || ridelist[i].status == 3 || ridelist[i].status == 4 || ridelist[i].status == 0) {
            bigCities.push(ridelist[i]);
        } else if (ridelist[i].status == 5 || ridelist[i].status == 6 || ridelist[i].status == 7) {
            pastRides.push(ridelist[i]);
        }
    }
    $scope.upcomingList = bigCities;
    $scope.pastRides = pastRides;
    $scope.addTrip = function () {
        $location.path('/addtrip')
    }
    $scope.getDetails = function (data,boolean) {
        $scope.loading = true;
        console.log("1",boolean)
        if(boolean == 1){
            $scope.view = true;
            $scope.accept = false;
        }else if(boolean == 2){
            $scope.accept = true;
            $scope.view = false;

        }
        $http({
            method: 'GET',
            url: DotsCons.GET_DATA_BY_BOOKINGID+'/'+data.id,
            data: '',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
           //console.log(response)
            $scope.complteDetails = response.data;

         //   console.log($scope.companyDetails);
            if($scope.complteDetails.tripStatus == 0 ){
                $scope.status = "Driver Not Available";
                console.log($scope.status)
            }else if($scope.complteDetails.tripStatus == 1 ){
                $scope.status = "Ride Expired";
            }else if($scope.complteDetails.tripStatus == 2 ){
                $scope.status = "Ride Assigned";
            }
            else if($scope.complteDetails.tripStatus == 3 ){
                $scope.status = "Ride Accepted";
            }
            else if($scope.complteDetails.tripStatus == 4 ){
                $scope.status = "Ride Started";
            }
            else if($scope.complteDetails.tripStatus == 5 ){
                $scope.status = "Ride Compelted";
            }
            else if($scope.complteDetails.tripStatus == 6 ){
                $scope.status = "Expired";
            }
            else if($scope.complteDetails.tripStatus == 7 ){
                $scope.status = "Declined";
            }
            $scope.loading = false;
        },
            function (errResponse) {
                console.error('Error !!');
                    return $q.reject(errResponse);
                })

        
        // $scope.companyName = data.companyName;
        // $scope.pickUpCity = data.pickUpCity;
        // $scope.pickUpDate = data.pickUpDate;
        // $scope.pickUpTime = data.pickUpTime;
        // $scope.pickUpLocation = data.pickUpLocation;
        // $scope.releaseAddress = data.releaseAddress;
        // $scope.releaseLocation = data.releaseLocation;
        // $scope.name = data.travellerName;
        // $scope.teId = data.id;
        // $scope.mobile = data.travellerMobile;
        // $scope.empId = data.empId;

     }
     $scope.getDriverList = function (val) {
        if(val =="" || val == undefined || val == null){
            val = ""
        }
        return $http({
            method: 'GET',
            url: DotsCons.DRIVER_SEARCH+0+"/10/"+val,
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

    }
     
    var token = authService.getCookie('globals');
    var myheader = $localStorage.myHeader[0];
    var requestHeader = $localStorage.requestHeader[0]
    /* ------------------------------------------------ */
    var config1 = {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": token.currentUser.tokenDto.token

        }
    }
    $http({
        method: 'GET',
        url: DotsCons.SEARCH_BRAND,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response);
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    $http({
        method: 'GET',
        url: DotsCons.SEARCH_BRAND,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        $scope.allBrands = response.data;
        console.log($scope.allBrands)
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })

    $http({
        method: 'GET',
        url: DotsCons.SEARCH_MODEL,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response);
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    $http({
        method: 'GET',
        url: DotsCons.SEARCH_CAR_COLOR,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        console.log(response);
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    $http({
        method: 'GET',
        url: DotsCons.COMPANY_DETAILS,
        data: 'val',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        $scope.companyDetails = response.data;
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })


$scope.acceptRide = function(data){
    $scope.loading = true;
    $http({
        method: 'GET',
        url: DotsCons.ACCPET_RIDE+"/"+1+"/"+data.id+"/"+data.driverAccountId,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
         console.log(response.data);
         if (response.data.status == 'true') {
            $scope.loading = false;
            $.iaoAlert({
                msg: "Trip Accepted Successfully ..!",
                type: "success",
                mode: "dark",
            })
            $("#exampleModal").modal("hide")
        }
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
  
}
$scope.reAssignRide = function(data){

    if($scope.driver != null || $scope.driver != undefined){
    $scope.loading = true;
    $http({
        method: 'GET',
        url: DotsCons.RE_ASSIGN_RIDE+data.id+"/"+$scope.driver.id,
        data: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
         console.log(response.data);
         if (response.data != null) {
            $scope.loading = false;
            $.iaoAlert({
                msg: "Trip Assigned Successfully ..!",
                type: "success",
                mode: "dark",
            })
            $("#exampleModal1").modal("hide")
        }
    },
        function (errResponse) {
            $scope.loading = false;
            $.iaoAlert({
                msg: "Unable to Re assign Trip...please try again..!",
                type: "error",
                mode: "dark",
            })
            $("#exampleModal1").modal("hide")
            console.error('Error !!');
            return $q.reject(errResponse);
        })
    }else{
        alert("please select a Driver")
    }
}

  
    $scope.getCompany = function (val) {
        $scope.loading = true
        if(val == null || val == undefined || val == ''){
            val = null
        }
        return $http({
            method: 'GET',
            url: DotsCons.COMPANY_DETAILS+'/'+val,
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
            $scope.loading = false
    }
    $scope.getCarBarand = function (val) {
        $scope.loading = true
        if(val == '' || val == undefined || val == null){
            val = null
        }
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_BRAND+"/"+val,
            data: "",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            return response.data;
            $scope
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })

    }
    $scope.getSubType = function (val) {
        return $http({
            method: 'GET',
            url: DotsCons.SUB_TYPE,
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

    }
   // $scope.carSegNameId =$scope.carBrandSubType.id
    var that = this;

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };



    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.dateOptions1 = {
        //   dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
       $scope.dateOptions3= {
        //   dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(1900, 2, 23),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }



    $scope.open1 = function () {
        $scope.popup1.opened = true;
        // alert($scope.dt)
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
        // alert($scope.dt)
    };
    $scope.open3 = function () {
        $scope.popup3.opened = true;
        // alert($scope.dt)
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup3 = {
        opened: false
    };
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };
    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };
    $scope.tripBooking = function () {
        //  $scope.loading = true;
        console.log("to", $scope.toDate)
        console.log("from", $scope.fromDate)
        console.log("ptime", $scope.picktime)
        console.log("ptime", $scope.releasetime)
        var data = {
            "carHire": $scope.carHire,
            "carUse": $scope.forUse,
            "companyDetailDto": {
                "companyName": $scope.company.companyName,
                "emailId": $scope.Book_email,
                "gstnumber": $scope.gstNum,
                "traveldeskname": $scope.Book_req
            },
            "driverAccountId": $scope.driver.id,
            "dropDate": $scope.toDate,
            "dropTime": $scope.releasetime,
            "instruction": $scope.specificIns,
            "pickUpAddress": $scope.repAdd,
            "pickUpCity": $scope.fromCity,
            "pickUpDate": $scope.fromDate,
            "pickUpLocation": $scope.pickUpLocation,
            "pickUpTime": $scope.picktime,
            "releaseAddress": $scope.relAdd,
            "releaseLocation": $scope.dropLocation,
            "sysBookingRequestTypeDto": {
                "id": $scope.carSegName.id,
                "name": $scope.carSegName.name,
                "sysMaster": $scope.carSegName.sysMaster
            },
            "sysCarCategoryDto": {
                "id": $scope.carBrand.id,
                "name": $scope.carBrand.name,
                "sysMaster": $scope.carBrand.sysMaster
            },
            "travelId": $scope.empId,
            "travelerDetailDto": {
                "employeeId": $scope.empId,
                "firstName": $scope.fname,
                "lastName": $scope.lname,
                "mobileNumber": $scope.travelerMobNum
            },
            "tripStatus": 0
        }
       // alert($scope.picktime)
        console.log(data)
        $http({
            method: 'post',
            url: DotsCons.TRIP_BOOKING,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            console.log(response)
            if (response.status == '200') {
                $scope.loading = false;
                $.iaoAlert({
                    msg: "Trip Booked Successfully ..!",
                    type: "success",
                    mode: "dark",
                })
            }
            $location.path('/managetrip')
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })

    }



    $scope.getCarInterrior = function (val) {
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_INTERRIOR,
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
    }
    $scope.getCarColor = function (val) {
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_CAR_COLOR,
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
    };
    $scope.getCarModal = function (val) {
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_MODEL,
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

    }
    $scope.getCarBrand = function (val) {
        return $http({
            method: 'GET',
            url: DotsCons.SEARCH_BRAND,
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
    }
    $scope.uploadFile = function () {
        $scope.showFile = true;
    }
    $scope.Uploading = function () {
        $scope.sizeIsmore = false;
        if ($scope.files.length != 0) {
            var uploadedFiles = [];
            var docData;
            for (var i = 0; i < $scope.files.length; i++) {
                var fname = $scope.files[i].filename;

                var bArray = $scope.files[i].base64;
                docData = {
                    fileName: fname,
                    content: bArray,

                }
                uploadedFiles.push(docData);
                console.log(uploadedFiles)
            }
            var getFile
            $http({
                method: 'POST',
                url: DotsCons.UPLOAD_FILES,
                data: uploadedFiles,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log(response.data);
                getFile = response.data[0]
                console.log($scope.fileResonse);
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
            $http({
                method: 'GET',
                url: DotsCons.GET_FILES + "?path=" + getFile,
                data: '',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                console.log(response.data);
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })


        }
    }

    // $scope.driverRegistration = function () {
    //     alert("harisj")
    //     var driverData = {
    //         "address": "fdff",
    //         "area": "fgdfgdfg",
    //         "branchId": 0,
    //         "city": "Bangalore",
    //         "countryCode": "USA",
    //         "createdBy": "04da390e-7f95-4b73-a541-4d3c7dd0c891",
    //         "customerId": "9kdkc-kkdk",
    //         "dateOfBirth": "2020-03-13T07:30:45.076Z",
    //         "emailId": "sivagsak.gvs@gmail.com",
    //         "extension": "string",
    //         "firstName": $scope.driver_fname,
    //         "gender": "Male",
    //         "lastName": $scope.driver_lname,
    //         "mobileNumber": $scope.driver_mobNum,
    //         "password": "Abc@12def",
    //         "userType": "DRIVER",
    //         "pincode": 12345,
    //         "carDetailDto": {
    //             "type": {
    //                 "id": $scope.carBrand.id

    //             },
    //             "subType": {
    //                 "id": $scope.carSegName.id

    //             },
    //             "carColor": {
    //                 "id": $scope.carColor.id

    //             },
    //             "carInterrior": {
    //                 "id": $scope.Interrior.id

    //             },
    //             "carCategory": {
    //                 "id": $scope.carBrandSubType.id

    //             }

    //         },
    //         "documentDetailDtos": [
    //             {
    //                 "backImagePath": "assets/img/download1.jpg",
    //                 "documentType": { "id": 1 },
    //                 "frontImagePath": "assets/img/download.jpg",
    //                 "fieldDetails": "DLnum:'1234',fName:'harish',lName:'deva',dob:'23-11-1995',bloodGroup:'B+',rtoName:'23456',issuedDate:'23-11-2019',dateOfExpiry:23-11-2030,typeOfVehicle:'LWM',remark:'no'"
    //             }

    //         ],
    //         "state": "Bangalore"
    //     }

    //     console.log(driverData)
    //     $http({
    //         method: 'post',
    //         url: DotsCons.DRIVER_REGISTRATION,
    //         data: driverData,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': token.currentUser.tokenDto.token
    //         }
    //     }).then(function (response) {
    //         console.log(response)
    //         if (response.status == '200') {
    //             $scope.loading = false;
    //             $.iaoAlert({
    //                 msg: "Driver Registered Successfully ..!",
    //                 type: "success",
    //                 mode: "dark",
    //             })
    //         } else {
    //             $.iaoAlert({
    //                 msg: "Somthing went wrong...Try agian!",
    //                 type: "error",
    //                 mode: "dark",
    //             })
    //         }

    //     },
    //         function (errResponse) {
    //             console.error('Error !!');
    //             return $q.reject(errResponse);
    //         })

    // }

}
function addvendorCtrl($scope, $http, DotsCons, authService, $localStorage, $q,$location, toaster) {
    var token = authService.getCookie('globals');
    $scope.addVendor = function () {
        $scope.loading = true;
        var postData = {
            // "companyName": $scope.Book_cname,
            // "costCenter": $scope.vendor_city,
            // "emailId": $scope.emailId,
            // "gstnumber": $scope.gstNum,
            // "traveldeskname": $scope.contactPerson
            
                "companyName": $scope.Book_cname,
                "address":"",
                "city": $scope.vendor_city,
                "gstnumber": $scope.gstNum,
                "state":$scope.vendor_state ,
                "pincode": "",
                "contactPersonDtoList": [
                  {
                    "firstName": $scope.contactPerson,
                    "lastName": "",
                    "emailId": $scope.emailId,
                    "mobileNumber": $scope.mobileNum
                  }
                ]
              
        }
        $http({
            method: 'post',
            url: DotsCons.ADD_COMPANY,
            data: postData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            console.log(response)
            if (response.status == '200') {
                $scope.loading = false;
                $.iaoAlert({
                    msg: "Vendor Created Successfully ..!",
                    type: "success",
                    mode: "dark",
                })
                $location.path('/manageVendor')
            }
        },
            function (errResponse) {
                console.error('Error !!');
                $scope.loading = false;
                $.iaoAlert({
                    msg: "Error While Creating Vendor ..!",
                    type: "error",
                    mode: "dark",
                })
                return $q.reject(errResponse);
            })
    }
}
function travelBillingCtrl($scope, $http, DotsCons,$rootScope, authService, $localStorage,$location, $q,toaster,GET_CURRENT_DATA){
    var token = authService.getCookie('globals');
    $http({
        method: 'GET',
        url: DotsCons.COMPANY_DETAILS+"/0/10",
        data: "",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        $scope.contacts = response.data;
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
        $http({
            method: 'GET',
            url: DotsCons.SUB_TYPE+"0/10",
            data: "",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            $scope.categery = response.data;
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })
            $http({
                method: 'GET',
                url: DotsCons.SEARCH_MODEL+'/1',
                data: "",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                $scope.carModals = response.data;
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
                $http({
                    method: 'GET',
                    url: DotsCons.FOR_USE+"0/10",
                    data: "",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token.currentUser.tokenDto.token
                    }
                }).then(function (response) {
                    $scope.forUse = response.data;
                },
                    function (errResponse) {
                        console.error('Error !!');
                        return $q.reject(errResponse);
                    })
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_COST_CENTER+"0/10",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        $scope.costCenters = response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                        $http({
                            method: 'GET',
                            url: DotsCons.GET_EMPLOYEE_ID+"/0/10",
                            data: "",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token.currentUser.tokenDto.token
                            }
                        }).then(function (response) {
                            $scope.empIds = response.data;
                        },
                            function (errResponse) {
                                console.error('Error !!');
                                return $q.reject(errResponse);
                            })
                            $http({
                                method: 'GET',
                                url: DotsCons.GET_TRAVEL_ID+"/0/10",
                                data: "",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token.currentUser.tokenDto.token
                                }
                            }).then(function (response) {
                                $scope.travelIds = response.data;
                            },
                                function (errResponse) {
                                    console.error('Error !!');
                                    return $q.reject(errResponse);
                                })
  
    // $scope.contacts = [{name: 'Blinky', email: 'red@pacman.com'},
    // {name: 'Pinky', email: 'pink@pacman.com'},
    // {name: 'Inky', email: 'cyan@pacman.com'},
    // {name: 'Clyde', email: 'yellow@pacman.com'}];
    $scope.no_morerecord = false;
$scope.filtersApply = function(){
    $scope.typeDuty = []
    $scope.companyData = []
    $scope.slectGST = []
    $scope.SelctSeg = []
    $scope.selectMOdal = []

    if($scope.selectedCompany !=null){
    $scope.selectedC = $scope.selectedCompany;
   
    for (let value of Object.values($scope.selectedC)) {
        $scope.companyData.push(value.companyName); // John, then 30
}  
    }else{
        $scope.companyData = null
    }
    
//console.log($scope.companyData)
if($scope.selectedGst !=null){
$scope.gst = $scope.selectedGst;
for (let value of Object.values($scope.gst)) {
    $scope.slectGST.push(value.gstnumber); // John, then 30
}  
}else{
    $scope.slectGST = []
}
//console.log($scope.slectGST)
if($scope.selectedsDuty !=null){
$scope.selectedDuty = $scope.selectedsDuty;
for (let value of Object.values($scope.selectedDuty )) {
    $scope.typeDuty.push(value.name); // John, then 30
} 
}else{
    $scope.typeDuty = []
}
//console.log($scope.typeDuty)
if($scope.selectedsSeg !=null){
$scope.selectedseg = $scope.selectedsSeg;
for (let value of Object.values($scope.selectedseg )) {
    $scope.SelctSeg.push(value.name); // John, then 30
} 
}else{
    $scope.SelctSeg = []
}
//console.log($scope.SelctSeg)
if($scope.selectedsModel !=null){
$scope.selectedModel = $scope.selectedsModel;
for (let value of Object.values($scope.selectedModel )) {
    $scope.selectMOdal.push(value.name); // John, then 30
} 
}else{
    $scope.selectMOdal = []
}
//console.log($scope.selectMOdal)
var fromDate = '';
if($scope.fromDate !=null){
var d = new Date($scope.fromDate),
month = '' + (d.getMonth() + 1),
day = '' + d.getDate(),
year = d.getFullYear();

if (month.length < 2) 
month = '0' + month;
if (day.length < 2) 
day = '0' + day;

fromDate = [year, month, day].join('-');
}else{
    fromDate = ""
}
var toDate = '';
if($scope.endDate !=null){
var d = new Date($scope.endDate),
month = '' + (d.getMonth() + 1),
day = '' + d.getDate(),
year = d.getFullYear();

if (month.length < 2) 
month = '0' + month;
if (day.length < 2) 
day = '0' + day;

toDate = [year, month, day].join('-');
}else {
    $scope.endDate = ""
}
//console.log(fromDate)
$rootScope.data = {
    
    "startDate": fromDate,

    "endDate": toDate,
    "dutyTypes": $scope.typeDuty,
    "companyNames": $scope.companyData,
    "vechicleType":  $scope.selectMOdal,
    "gstNum":  $scope.slectGST,
    "costCenter": [],
    "employeeIds": [],
    "travelIds": [],
    "vechicleSeg": $scope.SelctSeg
}
    // var data = {
        
    //         "startDate": $scope.fromDate,
    //         "endDate": $scope.endDate,
    //         "dutyTypes": [
    //          $scope.forUse.name
    //         ],
    //         "companyNames": [
    //             $scope.selectedCompany.name
    //         ],
    //         "vechicleType": [$scope.carModals],
    //         "gstNum": [$scope.selectedGst.gstnumber],
    //         "costCenter": [$scope.constCenter],
    //         "employeeIds": [$scope.empId],
    //         "travelIds": [$scope.travelId],
    //         "vechicleSeg": [$scope.categery.name],
        
    // }
   // console.log(data)
    $http({
        method: 'post',
        url: DotsCons.GET_FILTERD_DATA+"/0/10/",
        data: $rootScope.data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        if(response.data != null){
        $rootScope.filtedData = response.data;
        $scope.no_morerecord =true
        console.log( $scope.filtedData)
        $location.path('/travelBilling')
        }
        
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
}
if(GET_CURRENT_DATA != null){
    $rootScope.filtedData = GET_CURRENT_DATA
}
$scope.index = 0;
$scope.numbers = 10;
	$scope.showMorefilterData = function(){
        $scope.index++;
        $scope.numbers +10;
        //console.log("count",$scope.count);
        $http({
            method: 'post',
            url: DotsCons.GET_FILTERD_DATA+"/"+$scope.index+"/"+$scope.numbers,
            data: $rootScope.data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            if(response.data != null){
            //$rootScope.filtedData = response.data;
            for(i=0;i<response.data.length;i++)
            $rootScope.filtedData.push(response.data[i]);
            }
          //  console.log($rootScope.filtedData)
            
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })
		
	}

$scope.download = function(){
    //$scope.dateReport = new Date($scope.ReportDate);

    $http({
        method: 'post',
        url: DotsCons.GET_ALL_DATA,
        data: $rootScope.data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        if(response.data != null){
        $rootScope.filtedData = response.data;
        //console.log( $scope.filtedData)
       // debugger
        //$location.path('/travelBilling')
        }
        
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })

    setTimeout(function(){

        console.log("Harish")

        $("#tableDta").table2excel({
            filename: "example"
        });
    // kendo.drawing.drawDOM($("#listDataTable8")).then(function(group) {
        

    //  kendo.drawing.pdf.toDataURL(group, function(dataURL){ 
            
    //      $scope.uploadFilesD = dataURL;

    //      console.log("$scope.uploadFilesD",$scope.uploadFilesD)
        
            
    //      console.log("pdf_file :: ",$scope.uploadFilesD);
    //      var pdfData = dataURL.replace("data:application/pdf;base64,", "");
    //  })
    // })
    },3000)

    
    
}
var reqIds = []
$scope.generateInvoice = function(){
    for (var i = 0; i < $rootScope.filtedData.length; i++) {
        if ($rootScope.filtedData[i].Selected) {
            var fruitId = $rootScope.filtedData[i].id;
           // var fruitName = $scope.Fruits[i].Name;
          // var  message = "Value: " + fruitId + " Text: " + fruitName + "\n";
        }
    }
   reqIds.push(fruitId)
    var reqData = {
        reqIds
    }
        
    
    $http({
        method: 'post',
        url: DotsCons.GENERATE_INVOICE,
        data:reqData.reqIds,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        if(response.data != null){
        $rootScope.invoiceData = response.data;
        //console.log( $scope.filtedData)
       // debugger
        //$location.path('/travelBilling')
        }
        
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
   
   
     $('#exampleModal').modal('show');
     setTimeout(function(){
        kendo.drawing.drawDOM($("#pdfData")).then(function(group) {
            //kendo.drawing.pdf.saveAs(group, "Prescription_Health5c.pdf");
    
            kendo.drawing.pdf.toDataURL(group, function(dataURL){ 
                console.log("pdf_file :: ",dataURL);
                $scope.uploadFiles = dataURL;
               // console.log($scope.uploadFiles)
                var pdfData = dataURL.replace("data:application/pdf;base64,", "");
                console.log(pdfData)
    
                setTimeout(function(){
                    $scope.downloadPDF(pdfData,"invoice")
                },3000)
                
          //console.log(pdfData)
            
             });
            
        });
     },5000)
  
}
$scope.downloadPDF = function(pdfUrl,name){
    let pdfWindow = window.open("");
  pdfWindow.document.write("<html<head><title>"+name+"</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
  pdfWindow.document.write("<body><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(pdfUrl)+"#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>");

    //window.open("data:application/octet-stream;charset=utf-16le;base64,"+pdfUrl)


}
}
function travelBillingCtrl1($scope, $http, DotsCons,$rootScope, authService, $localStorage,$location, $q,toaster){
    var token = authService.getCookie('globals');
    $http({
        method: 'GET',
        url: DotsCons.COMPANY_DETAILS+"/0/10",
        data: "",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        $scope.contacts = response.data;
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
        $http({
            method: 'GET',
            url: DotsCons.SUB_TYPE+"0/10",
            data: "",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            $scope.categery = response.data;
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })
            $http({
                method: 'GET',
                url: DotsCons.SEARCH_MODEL+'/1',
                data: "",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.currentUser.tokenDto.token
                }
            }).then(function (response) {
                $scope.carModals = response.data;
            },
                function (errResponse) {
                    console.error('Error !!');
                    return $q.reject(errResponse);
                })
                $http({
                    method: 'GET',
                    url: DotsCons.FOR_USE+"0/10",
                    data: "",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token.currentUser.tokenDto.token
                    }
                }).then(function (response) {
                    $scope.forUse = response.data;
                },
                    function (errResponse) {
                        console.error('Error !!');
                        return $q.reject(errResponse);
                    })
                    $http({
                        method: 'GET',
                        url: DotsCons.GET_COST_CENTER+"0/10",
                        data: "",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.currentUser.tokenDto.token
                        }
                    }).then(function (response) {
                        $scope.costCenters = response.data;
                    },
                        function (errResponse) {
                            console.error('Error !!');
                            return $q.reject(errResponse);
                        })
                        $http({
                            method: 'GET',
                            url: DotsCons.GET_EMPLOYEE_ID+"/0/10",
                            data: "",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token.currentUser.tokenDto.token
                            }
                        }).then(function (response) {
                            $scope.empIds = response.data;
                        },
                            function (errResponse) {
                                console.error('Error !!');
                                return $q.reject(errResponse);
                            })
                            $http({
                                method: 'GET',
                                url: DotsCons.GET_TRAVEL_ID+"/0/10",
                                data: "",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token.currentUser.tokenDto.token
                                }
                            }).then(function (response) {
                                $scope.travelIds = response.data;
                            },
                                function (errResponse) {
                                    console.error('Error !!');
                                    return $q.reject(errResponse);
                                })
  
    // $scope.contacts = [{name: 'Blinky', email: 'red@pacman.com'},
    // {name: 'Pinky', email: 'pink@pacman.com'},
    // {name: 'Inky', email: 'cyan@pacman.com'},
    // {name: 'Clyde', email: 'yellow@pacman.com'}];
    $scope.no_morerecord = false;
$scope.filtersApply = function(){
    $scope.typeDuty = []
    $scope.companyData = []
    $scope.slectGST = []
    $scope.SelctSeg = []
    $scope.selectMOdal = []

    if($scope.selectedCompany !=null){
    $scope.selectedC = $scope.selectedCompany;
   
    for (let value of Object.values($scope.selectedC)) {
        $scope.companyData.push(value.companyName); // John, then 30
}  
    }else{
        $scope.companyData = null
    }
    
//console.log($scope.companyData)
if($scope.selectedGst !=null){
$scope.gst = $scope.selectedGst;
for (let value of Object.values($scope.gst)) {
    $scope.slectGST.push(value.gstnumber); // John, then 30
}  
}else{
    $scope.slectGST = []
}
//console.log($scope.slectGST)
if($scope.selectedsDuty !=null){
$scope.selectedDuty = $scope.selectedsDuty;
for (let value of Object.values($scope.selectedDuty )) {
    $scope.typeDuty.push(value.name); // John, then 30
} 
}else{
    $scope.typeDuty = []
}
//console.log($scope.typeDuty)
if($scope.selectedsSeg !=null){
$scope.selectedseg = $scope.selectedsSeg;
for (let value of Object.values($scope.selectedseg )) {
    $scope.SelctSeg.push(value.name); // John, then 30
} 
}else{
    $scope.SelctSeg = []
}
//console.log($scope.SelctSeg)
if($scope.selectedsModel !=null){
$scope.selectedModel = $scope.selectedsModel;
for (let value of Object.values($scope.selectedModel )) {
    $scope.selectMOdal.push(value.name); // John, then 30
} 
}else{
    $scope.selectMOdal = []
}
//console.log($scope.selectMOdal)
var fromDate = '';
if($scope.fromDate !=null){
var d = new Date($scope.fromDate),
month = '' + (d.getMonth() + 1),
day = '' + d.getDate(),
year = d.getFullYear();

if (month.length < 2) 
month = '0' + month;
if (day.length < 2) 
day = '0' + day;

fromDate = [year, month, day].join('-');
}else{
    fromDate = ""
}
var toDate = '';
if($scope.endDate !=null){
var d = new Date($scope.endDate),
month = '' + (d.getMonth() + 1),
day = '' + d.getDate(),
year = d.getFullYear();

if (month.length < 2) 
month = '0' + month;
if (day.length < 2) 
day = '0' + day;

toDate = [year, month, day].join('-');
}else {
    $scope.endDate = ""
}
//console.log(fromDate)
$rootScope.data = {
    
    "startDate": fromDate,

    "endDate": toDate,
    "dutyTypes": $scope.typeDuty,
    "companyNames": $scope.companyData,
    "vechicleType":  $scope.selectMOdal,
    "gstNum":  $scope.slectGST,
    "costCenter": [],
    "employeeIds": [],
    "travelIds": [],
    "vechicleSeg": $scope.SelctSeg
}
    // var data = {
        
    //         "startDate": $scope.fromDate,
    //         "endDate": $scope.endDate,
    //         "dutyTypes": [
    //          $scope.forUse.name
    //         ],
    //         "companyNames": [
    //             $scope.selectedCompany.name
    //         ],
    //         "vechicleType": [$scope.carModals],
    //         "gstNum": [$scope.selectedGst.gstnumber],
    //         "costCenter": [$scope.constCenter],
    //         "employeeIds": [$scope.empId],
    //         "travelIds": [$scope.travelId],
    //         "vechicleSeg": [$scope.categery.name],
        
    // }
   // console.log(data)
    $http({
        method: 'post',
        url: DotsCons.GET_FILTERD_DATA+"/0/10/",
        data: $rootScope.data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        if(response.data != null){
        $rootScope.filtedData = response.data;
        $scope.no_morerecord =true
        console.log( $scope.filtedData)
        $location.path('/travelBilling')
        }
        
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
}
// if(GET_CURRENT_DATA != null){
//     $rootScope.filtedData = GET_CURRENT_DATA
// }
$scope.index = 0;
$scope.numbers = 10;
	$scope.showMorefilterData = function(){
        $scope.index++;
        $scope.numbers +10;
        //console.log("count",$scope.count);
        $http({
            method: 'post',
            url: DotsCons.GET_FILTERD_DATA+"/"+$scope.index+"/"+$scope.numbers,
            data: $rootScope.data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            if(response.data != null){
            //$rootScope.filtedData = response.data;
            for(i=0;i<response.data.length;i++)
            $rootScope.filtedData.push(response.data[i]);
            }
          //  console.log($rootScope.filtedData)
            
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })
		
	}

$scope.download = function(){
    //$scope.dateReport = new Date($scope.ReportDate);

    $http({
        method: 'post',
        url: DotsCons.GET_ALL_DATA,
        data: $rootScope.data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        if(response.data != null){
        $rootScope.filtedData = response.data;
        //console.log( $scope.filtedData)
       // debugger
        //$location.path('/travelBilling')
        }
        
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })

    setTimeout(function(){

        console.log("Harish")

        $("#tableDta").table2excel({
            filename: "example"
        });
    // kendo.drawing.drawDOM($("#listDataTable8")).then(function(group) {
        

    //  kendo.drawing.pdf.toDataURL(group, function(dataURL){ 
            
    //      $scope.uploadFilesD = dataURL;

    //      console.log("$scope.uploadFilesD",$scope.uploadFilesD)
        
            
    //      console.log("pdf_file :: ",$scope.uploadFilesD);
    //      var pdfData = dataURL.replace("data:application/pdf;base64,", "");
    //  })
    // })
    },3000)

    
    
}
var reqIds = []
$scope.generateInvoice = function(){
    for (var i = 0; i < $rootScope.filtedData.length; i++) {
        if ($rootScope.filtedData[i].Selected) {
            var fruitId = $rootScope.filtedData[i].id;
           // var fruitName = $scope.Fruits[i].Name;
          // var  message = "Value: " + fruitId + " Text: " + fruitName + "\n";
        }
    }
   reqIds.push(fruitId)
    var reqData = {
        reqIds
    }
        
    
    $http({
        method: 'post',
        url: DotsCons.GENERATE_INVOICE,
        data:reqData.reqIds,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.currentUser.tokenDto.token
        }
    }).then(function (response) {
        if(response.data != null){
        $rootScope.invoiceData = response.data;
        //console.log( $scope.filtedData)
       // debugger
        //$location.path('/travelBilling')
        }
        
    },
        function (errResponse) {
            console.error('Error !!');
            return $q.reject(errResponse);
        })
   
   
     $('#exampleModal').modal('show');
     setTimeout(function(){
        var doc = new jsPDF();
        var elementHTML = $('#exampleModal').html();
        var specialElementHandlers = {
            '#elementH': function (element, renderer) {
                return true;
            }
        };
        doc.fromHTML(elementHTML, 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });

        // Save the PDF
        doc.save('sample-document.pdf');
       },3000)
            
    //  kendo.drawing.drawDOM($("#exampleModal")).then(function(group) {
    //     //kendo.drawing.pdf.saveAs(group, "Prescription_Health5c.pdf");

    //     kendo.drawing.pdf.toDataURL(group, function(dataURL){ 
    //         console.log("pdf_file :: ",dataURL);
    //         $scope.uploadFiles = dataURL;
    //         var pdfData = dataURL.replace("data:application/pdf;base64,", "");
    //         console.log(pdfData)
    //         setTimeout(function(){
    //           //  $scope.downloadPDF(pdfData)
    //         },3000)
            
    //   //console.log(pdfData)
        
    //      });
        
    // });
}
$scope.downloadPDF = function(pdfUrl){
        const file = new Blob([pdfUrl], {type: 'application/pdf'});
        // process to auto download it
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = "FileName"+ ".pdf"; 
        link.click();
   
}

}
function profileCtrl($scope, $http, DotsCons, authService, $localStorage, $q, toaster){
    var token = authService.getCookie('globals');
    //console.log(token)
    $scope.changePass = function(){
        var data = {
            "accountId": token.currentUser.tokenDto.accountId,
            "confirmPassword": $scope.confPassword,
            "newPassword": $scope.newPasswrd,
            "oldPassword": $scope.oldPassword
          }
          $http({
            method: 'post',
            url: DotsCons.CHANGE_PASSWORD,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.currentUser.tokenDto.token
            }
        }).then(function (response) {
            console.log(response)
            if (response.status == '200') {
                $scope.loading = false;
                $.iaoAlert({
                    msg: "Driver Registered Successfully ..!",
                    type: "success",
                    mode: "dark",
                })
            } else {
                $.iaoAlert({
                    msg: "Somthing went wrong...Try agian!",
                    type: "error",
                    mode: "dark",
                })
            }
    
        },
            function (errResponse) {
                console.error('Error !!');
                return $q.reject(errResponse);
            })
    }

}
function managevendortrl (GET_VENDOR_DATA,$scope, $http, DotsCons, authService, $localStorage, $q, toaster){
    if(GET_VENDOR_DATA != null){
        $scope.vendorList = GET_VENDOR_DATA
     }
}