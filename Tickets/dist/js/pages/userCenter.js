var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',

        user:[],
        allCoupons:[],
        couponRecords:[],
        recentOrders:[],
        userOrders:[],
        venue:[],
        show:[],

    },
    methods:{


        getMenuItem(event){
            var selectedItem = event.currentTarget.innerText;
            $("#userCenterIndexPanel1").slideUp("slow");
            $("#userCenterIndexPanel2").slideUp("slow");

            document.getElementById("breadcrumbItem").innerText = selectedItem;

            if(selectedItem=="订单管理"){
                this.allPanelUp();
                document.getElementById("orderType").value = "全部订单";
                this.getUserOrders();
                $("#orderManage").slideDown("slow");
            }else if(selectedItem=="我的优惠券"){
                this.allPanelUp();
                this.getUserCoupons();
                $("#myCoupon").show();
                $("#myCoupon").slideDown("slow");
            }else if(selectedItem=="我的积分"){
                this.allPanelUp();
                $("#memberPoint").show();
                $("#memberPoint").slideDown("slow");

            }else if(selectedItem=="统计信息"){
                this.allPanelUp();
                $("#myStatistics").show();
                $("#myStatistics").slideDown("slow");
            }else if(selectedItem=="收货地址"){
                this.allPanelUp();

                $("#receivingAddress").show();
                $("#receivingAddress").slideDown("slow");

            }else if(selectedItem=="账号设置"){

                this.allPanelUp();
                $("#accountSetting").show();
                $("#editInfoSection").show();
                $("#accountSetting").slideDown("slow");
            }else if(selectedItem=="安全中心"){
                this.allPanelUp();
                $("#safeSetting").show();
                $("#safeSetting").slideDown("slow");
            }
        },

        getUserOrders:function () {
            this.$http.get("http://localhost:8080/order/getAllOrders",{
                params:{
                    userID:this.getCookieValue("userID")
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.userOrders = response.data.data;
                }else{
                    alert("get user all orders wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        getOrderType:function (ele) {
            // var category = $('#myCityTab li:active').text();
            var orderState = ele.target.value;

            if(orderState=="全部订单") {
                this.getUserOrders();
            }else{
                this.$http.get("http://localhost:8080/order/getOrdersByState", {
                    params: {
                        userID : this.getCookieValue("userID"),
                        state: orderState
                    }
                }).then(function (response) {
                    if(response.data.errorCode==0) {
                        this.userOrders = response.data.data;
                    }else{
                        alert("get order by state wrong!");
                    }

                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });
            }
        },


        changeCouponInfoPanel:function(event) {
            var choose = event.target.text.trim();
            if(choose=="优惠券消费记录"){
                this.$http.get("http://localhost:8080/coupon/getCouponPOByState",{
                    params:{
                        userID:this.getCookieValue("userID"),
                        state:"已使用"
                    }
                }).then(function (response) {
                    if(response.data.errorCode==0) {
                        this.couponRecords = response.data.data;
                    }else{
                        alert("get user coupon records wrong");
                    }
                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });
            }else if(choose=="我的优惠券"){
                this.getUserCoupons();
            }
        },

        getUserCoupons:function () {
            this.$http.get("http://localhost:8080/coupon/getAllCoupons",{
                params:{
                    userID:this.getCookieValue("userID")
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.allCoupons = response.data.data;
                }else{
                    alert("get user coupons wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        getCouponRecords:function () {
            this.$http.get("http://localhost:8080/coupon/getCouponPOByState",{
                params:{
                    userID:this.getCookieValue("userID"),
                    state:"已使用"
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.couponRecords = response.data.data;
                }else{
                    alert("get user coupon records wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        changeCouponTypePanel:function (event) {
            var title=event.target.text;
            if(title=="我的优惠券"){
                alert("666");
                this.getUserCoupons();
            }else if(title=="优惠券消费记录"){
                alert("888")
                this.getCouponRecords();
            }
        },

        modifyUserInfo:function (userID) {
            var username=  $('#modify_username').val();
            var phoneNumber = $('#modify_phoneNumber').val();
            this.$http.get("http://localhost:8080/user/modifyUserInfo",{
                params:{
                    userID : userID,
                    username : username,
                    phoneNumber : phoneNumber
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.user = response.data.data;
                    this.setCookie('username', username, 1);
                    alert("修改成功！")
                    window.location.reload();
                }else{
                    alert("修改失败！");
                }
            }).catch(function (error) {
                console.log(error);
                alert("修改信息失败，请刷新重试！");
            });
        },

        modifyUserPassword:function (userID) {
            var previousPassword = $('#previous_password').val();
            var newPassword = $('#modify_password').val();
            var confirmNewPassword = $('#modify_confirm_password').val();
            if(newPassword!=confirmNewPassword) {
                alert("新密码两次输入不一致！");
                return;
            }else{
                this.$http.get("http://localhost:8080/user/modifyUserPassword",{
                    params:{
                        userID:userID,
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

        allPanelUp:function () {
            $("#orderManage").slideUp("fast");
            $("#myCoupon").slideUp("fast");
            $("#memberPoint").slideUp("fast");
            $("#myStatistics").slideUp("fast");
            $("#receivingAddress").slideUp("fast");
            $("#accountSetting").slideUp("fast");
            $("#safeSetting").slideUp("fast");
        },

        setDataToGetCouponModal:function(memberPoints) {
            $("#nowMemberPoints").text(memberPoints);
            $("#getCouponModal").show();
        },

        confirmGetCoupon:function() {
            this.$http.post("http://localhost:8080/coupon/addCoupon",{
                couponID: '',
                couponName: '积分优惠券',
                description: "积分兑换的优惠券",
                lastTerm: '',
                orderID: '',
                state: '待使用',
                usedMemberPoint: parseInt($('#usedMemberPoints').val()),
                usedTime: '',
                userID: this.user.userID,
                value: parseFloat($('#couponValue').val())
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("兑换优惠券成功！");
                    window.location.href = "userCenter.html";
                }else{
                    alert("兑换优惠券失败！");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        setDataToOrderInfoModal:function(order) {
            this.$http.get("http://localhost:8080/venue/getVenuePO",{
                params:{
                    venueID:order.venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.venue = response.data.data;

                    this.$http.get("http://localhost:8080/show/getShowPO",{
                        params:{
                            showID:order.showID
                        }
                    }).then(function (response) {
                        if(response.data.errorCode==0) {
                            this.show = response.data.data;

                            $('#orderID').val(order.orderID);
                            $('#showID').val(order.showID);
                            $('#showName').val(order.showName);
                            $('#seat').val(order.seat);
                            $('#purchaseMethod').val(order.purchaseMethod);
                            $('#totalPrice').val(order.totalPrice);
                            $('#vipDiscount').val(order.discount);
                            $('#ticketsAmount').val(order.ticketsAmount);
                            $('#orderState').val(order.orderState);
                            $('#venueName').val(this.venue.venueName);
                            $('#venueAddress').val(this.venue.address);
                            $('#showDate').val(this.show.showDate);

                            if(order.orderState=="待支付"){
                                $('#refundOrderBT').hide();
                                $('#payOrderBT').show();
                                $('#cancelOrderBT').show();
                            }else if(order.orderState=="已支付"){
                                $('#refundOrderBT').show();
                                $('#payOrderBT').hide();
                                $('#cancelOrderBT').hide();
                            }else {
                                $('#refundOrderBT').hide();
                                $('#payOrderBT').hide();
                                $('#cancelOrderBT').hide();
                            }

                        }else{
                            alert("get show info wrong");
                        }
                    }).catch(function (error) {
                        alert("获取信息失败，请刷新重试！");
                    });

                }else{
                    alert("get venue info wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },

        payOrder:function () {
            this.setCookie('unpayOrderID', $('#orderID').val());
            window.location.href = "payOrder.html";
        },

        cancelOrder:function () {
            this.$http.get("http://localhost:8080/order/cancelOrder",{
                params:{
                    orderID:$('#orderID').val()
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("取消订单成功！");
                    $('#showConcreteOrderInfoModal').modal('hide');
                    for(var i=0;i<this.userOrders.length;i++) {
                        if(this.userOrders[i].orderID==$('#orderID').val()) {
                            this.userOrders.splice(i, 1);
                        }
                    }
                }else{
                    alert("取消订单失败！");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        refundOrder:function(){

            var orderID = $('#orderID').val();

        },

        logout:function () {
            this.deleteCookie('username');
            this.deleteCookie('venueName');
            this.deleteCookie('managerName')
            this.deleteCookie('managerEmail');
            this.deleteCookie('welcomeWord');
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
            this.setCookie("username","",-1);
            this.setCookie("welcomeWord","",-1);
            window.location.href="../pages/index.html"
        },
    },

    mounted(){
        this.welcomeWord = this.getCookieValue("welcomeWord");
        if(this.welcomeWord==""){
            alert("请先登录！");
            window.location.href = "../pages/login.html";
        }


        var userID = this.getCookieValue("userID");

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

        this.$http.get("http://localhost:8080/user/getUserPOByUserID",{
            params:{
                userID:userID
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.user = response.data.data;
            }else{
                alert("get user info wrong");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });

        this.$http.get("http://localhost:8080/order/getRecentOrders",{
            params:{
                userID:userID
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.recentOrders = response.data.data;
            }else{
                alert("get recent orders wrong");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });

    }

}) ;
