var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
        user:[],
        venue:[],
        recentOrders:[],
        releaseShow:[],
        releaseShowArea:'',
        releaseShowRow:'',
        releaseShowSeat:'',
        modifyVenueName:'',
        modifyVenueAddress:'',
        modifyUserDescription:'',

        venueShow:[],
        onsaleShow:[],
        needToArrangeShow:[],

        ticketFinance:[],
        modifyPOs:[],


    },
    methods:{

        releaseShowPlan:function () {
            this.$http.post("http://localhost:8080/venue/releaseShowPlan",{
                area:this.releaseShowArea,
                row:this.releaseShowRow,
                seatInfo:this.releaseShowSeat,
                showPO:{
                    category:this.releaseShow.category,
                    showName:this.releaseShow.showName,
                    performer:this.releaseShow.performer,
                    photoSrc:this.releaseShow.photoSrc,
                    showDate:this.releaseShow.showDate,
                    price:this.releaseShow.price,
                    description:this.releaseShow.description,
                    city:this.venue.city,
                    venueID:this.venue.venueID,
                    venueName:this.venue.venueName,

                    area:this.releaseShowArea,
                    allRow:this.releaseShowRow,
                    seat:this.releaseShowSeat,
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("发布项目计划成功！");
                }else{
                    alert("mount error")
                }
            }).catch(function (error) {
                console.log(error);
                alert("发布项目信息失败，请刷新重试！");
            });
        },

        modifyVenueInfo:function (venueID) {

            var preVenue={
                venueName:this.venue.venueName,
                venueID:venueID,
                address:this.venue.address,
                venueInfo:this.venue.venueInfo
            };

            var postVenue={
                venueName:this.modifyVenueName,
                venueID:venueID,
                address:this.modifyVenueAddress,
                venueInfo:this.modifyUserDescription
            };

            this.$http.post("http://localhost:8080/venue/modifyVenueInfo",{
                applicationTime:'',
                postVenuePO:postVenue,
                preVenuePO:preVenue,
                state:'待审核'
            }).then(function (response) {
                console.log(response.data);
                if(response.data.errorCode==0) {
                    alert("已提交修改申请！待经理审核！");
                }else{
                    alert("提交申请失败！");
                }
            }).catch(function (error) {
                alert("提交信息失败，请刷新重试！");
            });

        },

        useDefaultSeat:function () {
            this.releaseShowArea = this.venue.area;
            this.releaseShowRow = this.venue.row;

            var seatInfo = this.venue.seat;
            // A-01-01,20;A-02-01,30;A-03-01,40/B-04-01,50;B-05-01,60;B-06-01,70;B-07-01,80;B-08-01,90/C-09-01,100;C-10-01,110;C-11-01,120;C-12-01,130
            var seatByArea = seatInfo.split("/");
            var result = "";
            for(var i=0;i<seatByArea.length;i++){
                var seatByRow = seatByArea[i].split(";")
                for (var j=0;j<seatByRow.length;j++){
                    result+=(seatByRow[j].split(",")[1])+("/");
                }
            }
            this.releaseShowSeat = result.substr(0, result.length - 1);
        },

        logout:function () {
            this.deleteCookie('username');
            this.deleteCookie('venueName');
            this.deleteCookie('welcomeWord');
        },

        getMenuItem(event){
            var selectedItem = event.currentTarget.innerText;
            $("#venueCenterIndexPanel1").slideUp("slow");
            $("#venueCenterIndexPanel2").slideUp("slow");

            document.getElementById("breadcrumbItem").innerText = selectedItem;

            if(selectedItem=="发布计划"){
                this.allPanelUp();
                $("#releasePlan").slideDown("slow");
            }else if(selectedItem=="场馆信息"){
                this.allPanelUp();
                $("#venueInfo").show();
                $("#venueInfo").slideDown("slow");
            }else if(selectedItem=="场馆演出"){
                this.allPanelUp();
                this.getShowPOByVenueID();
                $("#spotPurchase").show();
                $("#spotPurchase").slideDown("slow");
            }else if(selectedItem=="开票配票"){
                this.allPanelUp();
                this.getNeedToArrangeShow();
                $("#arrangeTicket").show();
                $("#arrangeTicket").slideDown("slow");

            } else if(selectedItem=="检票登记"){
                this.allPanelUp();
                $("#checkAndRegister").show();
                $("#checkAndRegister").slideDown("slow");
            }else if(selectedItem=="统计信息"){
                this.allPanelUp();

                this.getCharts1Data();
                this.getChartsData2();
                this.getChartsData3();
                this.getChartsData4();
                this.getFinanceData();

                $("#venueStatistics").show();
                $("#venueStatistics").slideDown("slow");

            }else if(selectedItem=="修改信息"){

                this.allPanelUp();
                $("#modifyVenueInfo").show();
                this.modifyVenueName = this.venue.venueName;
                this.modifyVenueAddress = this.venue.address;
                this.modifyUserDescription = this.venue.venueInfo;

                $("#modifyVenueInfo").slideDown("slow");

            }else if(selectedItem=="操作统计"){
                this.allPanelUp();

                this.getModifyPOData();
                $("#operationStatistics").show();
                $("#operationStatistics").slideDown("slow");
            }else if(selectedItem=="安全中心"){
                this.allPanelUp();
                $("#safeSetting").show();
                $("#safeSetting").slideDown("slow");
            }
        },

        setDataToUpdateShowStateModal:function (showID,showName) {
            $('#inputUpdateShowID').val(showID);
            $('#inputUpdateShowName').val(showName);
            $('#showUpdateShowStateModal').modal('show');
        },

        updateShowState:function () {
            var state = $('#citySelect').val();
            if(state=="进行中"){
                this.$http.get("http://localhost:8080/venue/setShowGoing",{
                    params:{
                        showID:$('#inputUpdateShowID').val()
                    }
                }).then(function (response) {
                    if(response.data.errorCode==0) {
                        alert("修改演出状态成功！")
                        window.location.href = "venueCenter.html";
                    }else{
                        alert("get user coupons wrong");
                    }
                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });
            }else if(state=="已结束"){
                this.$http.get("http://localhost:8080/venue/setShowDone",{
                    params:{
                        showID:$('#inputUpdateShowID').val()
                    }
                }).then(function (response) {
                    if(response.data.errorCode==0) {
                        alert("修改演出状态成功！")
                        window.location.href = "venueCenter.html";
                    }else{
                        alert("get user coupons wrong");
                    }
                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });
            }
        },

        allPanelUp:function () {
            $("#releasePlan").slideUp("fast");
            $("#venueInfo").slideUp("fast");
            $("#spotPurchase").slideUp("fast");
            $("#checkAndRegister").slideUp("fast");
            $("#venueStatistics").slideUp("fast");
            $("#modifyVenueInfo").slideUp("fast");
            $("#arrangeTicket").slideUp("fast");
            $("#operationStatistics").slideUp("fast");
            $("#safeSetting").slideUp("fast");
        },

        checkTicket:function () {

            this.$http.get("http://localhost:8080/venue/checkTicket",{
                params:{
                    orderID:$('#inputOrderID').val(),
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert(response.data.data);
                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                alert("获取检票登记信息失败，请刷新重试！");
            });
        },

        getCharts1Data:function () {

            this.$http.get("http://localhost:8080/venue/getHotShows",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    var showNames = response.data.data[0];
                    var nums = response.data.data[1];

                    var data2 = [];
                    for(var i=0;i<nums.length;i++) {
                        var obj={
                            value:nums[i],
                            name:showNames[i]
                        }
                        data2.push(obj);
                    }
                    initChart1(response.data.data[0], data2);

                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                alert("获取检票登记信息失败，请刷新重试！");
            });

        },

        getChartsData2:function () {
            this.$http.get("http://localhost:8080/venue/getUserPurchaseMethod",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    initChart2(response.data.data);
                }else{
                    alert("get user coupons wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        getChartsData3:function () {
            this.$http.get("http://localhost:8080/venue/getShowsIncomeInfo",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    initChart3(response.data.data[0],response.data.data[1]);
                }else{
                    alert("get user coupons wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },

        getChartsData4:function () {
            this.$http.get("http://localhost:8080/venue/getVenueOrdersStateInfo",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    initChart4(response.data.data);

                }else{
                    alert("get user coupons wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },


        modifyVenuePassword:function (venueID) {
            var previousPassword = $('#previous_password').val();
            var newPassword = $('#modify_password').val();
            var confirmNewPassword = $('#modify_confirm_password').val();
            if(newPassword!=confirmNewPassword) {
                alert("新密码两次输入不一致！");
                return;
            }else{
                this.$http.get("http://localhost:8080/venue/modifyVenuePassword",{
                    params:{
                        venueID:venueID,
                        previousPassword:previousPassword,
                        newPassword:confirmNewPassword
                    }
                }).then(function (response) {
                    if(response.data.errorCode==0) {
                        alert("修改密码成功！")
                        window.location.reload();
                    }else if(response.data.errorCode==-1){
                        alert("当前密码输入不正确！");
                    }else{
                        alert("修改密码失败!");
                    }
                }).catch(function (error) {
                    alert("修改密码失败，请刷新重试！");
                });
            }
        },

        getModifyPOData:function () {
            this.$http.get("http://localhost:8080/manager/getVenueModifyApps",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.modifyPOs = response.data.data;
                }else{
                    alert("get Venue modify applications Info wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        getFinanceData:function () {
            this.$http.get("http://localhost:8080/venue/getVenueFinanceInfo",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.ticketFinance = response.data.data;
                }else{
                    alert("get finance info wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },

        setDataToChooseSeatModal:function (showID,showState) {
            if(showState!="售票中"){
                alert("该演出已不可购票！");
                return;
            }else{
                $('#inputShowID').val(showID);
                $('#showChooseSeatModal').modal('show');
            }
        },

        fastArrangeTicket:function (showID) {
            this.$http.get("http://localhost:8080/venue/arrangeTicket",{
                params:{
                    showID:showID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("配票成功！");
                    for(var i=0;i<this.needToArrangeShow.length;i++) {
                        if(this.needToArrangeShow[i].showID==showID) {
                            this.needToArrangeShow.splice(i, 1);
                        }
                    }
                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                alert("获取场馆演出信息失败，请刷新重试！");
            });
        },

        chooseSeatPurchase:function() {

            var userID = $('#inputVipID').val();

            if(userID==""){
                this.setCookie('username', "现场购票用户", 1);
                this.setCookie('userID', "现场购票用户", 1);
            }else{
                this.setCookie('userID', userID, 1);
            }

            this.setCookie('concreteShowInfoID',$('#inputShowID').val(),1);

            window.location.href = "chooseSeatPurchase.html";
        },

        getShowPOByVenueID:function () {

            this.$http.get("http://localhost:8080/show/getShowPOByVenueID",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.onsaleShow = response.data.data;
                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                alert("获取场馆演出信息失败，请刷新重试！");
            });
        },

        getNeedToArrangeShow:function () {
            this.$http.get("http://localhost:8080/show/getVenueNeedToArrangeShow",{
                params:{
                    venueID:this.venue.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.needToArrangeShow = response.data.data;
                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                alert("获取场馆待分配座位演出信息失败，请刷新重试！");
            });
        },

        setCookie:function (cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        getCookieValue:function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },

        deleteCookie:function (cname) {
            this.setCookie(cname,"",-1);
            window.location.href="../pages/index.html"
        },
    },

    mounted(){
        this.welcomeWord = this.getCookieValue("welcomeWord");
        if(this.welcomeWord==""){
            alert("请先登录！");
            window.location.href = "../pages/login.html";
        }

        var venueID = this.getCookieValue("venueID");

        if(this.getCookieValue('username')!=""||this.getCookieValue("venueName")!="" || this.getCookieValue("managerName")!=""){
            document.getElementById("loginBT").style.display = "none";
            document.getElementById("signUpBT").style.display = "none";
            document.getElementById("logOutBT").style.display = "";

        }else{
            document.getElementById("loginBT").style.display = "block";
            document.getElementById("signUpBT").style.display = "block";
            document.getElementById("logOutBT").style.display = "none";
        }

        if(this.getCookieValue('username')!=""){
            $("#venueCenter").addClass("disabled");
            $("#managerCenter").addClass("disabled");
        }else if(this.getCookieValue("venueName")!=""){
            $("#userCenter").addClass("disabled");
            $("#managerCenter").addClass("disabled");
        }else if(this.getCookieValue("managerName")!=""){
            $("#userCenter").addClass("disabled");
            $("#venueCenter").addClass("disabled");
        }

        this.$http.get("http://localhost:8080/venue/getVenuePO",{
            params:{
                venueID:venueID
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.venue = response.data.data;
            }else{
                alert("get venue info wrong");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });

        this.$http.get("http://localhost:8080/venue/getVenueRecentOrders",{
            params:{
                venueID:venueID
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.recentOrders = response.data.data;
            }else{
                alert("get venue recent orders wrong");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });


    }

}) ;
