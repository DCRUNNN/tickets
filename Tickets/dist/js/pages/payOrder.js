var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
        user:[],
        show:[],
        showID:'',
        showPrice:[],
        unpayOrders:[],
        venue:[],
        coupons:[],
    },
    methods:{


        confirmPayOrder:function () {
            var orderID = $("#orderID").val();

            var couponID = $('#getCouponIDLabel').val();

            this.$http.get("http://localhost:8080/user/confirmPayOrder",{
                params:{
                    userID:this.getCookieValue("userID"),
                    orderID:orderID,
                    couponID:couponID,
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert(response.data.data);
                    // for(var i=0;i<this.unpayOrders.length;i++) {
                    //     if(this.unpayOrders[i].orderID==orderID) {
                    //         this.unpayOrders.splice(i, 1);
                    //     }
                    // }
                    $('#showCouponDialog').modal('hide');
                    window.location.href = "userCenter.html";

                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },


        cancelOrder:function () {
            this.$http.get("http://localhost:8080/order/cancelOrder",{
                params:{
                    orderID:$("#orderID").val()
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("取消订单成功！");
                    $('#showCouponDialog').modal('hide');
                    window.location.href = "userCenter.html";
                }else{
                    alert("取消订单失败！");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        setDataToCouponDialog:function (orderID,totalPrice,discount) {
            $('#orderID').val(orderID);
            $('#totalPrice').val(totalPrice);
            $('#vipDiscount').val(discount);
            var afterDiscountPrice = parseFloat(totalPrice) * parseFloat(discount);
            $('#afterDiscount').val(parseFloat(afterDiscountPrice.toFixed(2)));

            this.$http.get("http://localhost:8080/coupon/getCouponPOByState",{
                params:{
                    userID:this.getCookieValue("userID"),
                    state:"待使用"
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.coupons = response.data.data;

                    if(this.coupons.length==0) {
                        $("#couponTable").hide();
                        $('#noCouponWarning').show();
                    }else{
                        $("#couponTable").show();
                        $('#noCouponWarning').hide();
                    }
                    $('#showCouponDialog').modal('show');

                }else{
                    alert("get coupon info wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
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
            this.setCookie("username","",-1);
            this.setCookie("welcomeWord","",-1);
            window.location.href="../pages/index.html"
        },
    },

    mounted(){
        this.welcomeWord = this.getCookieValue("welcomeWord");
        var userID = this.getCookieValue("userID");
        var unpayOrderID = this.getCookieValue("unpayOrderID");

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

        this.$http.get("http://localhost:8080/order/getUnpayOrder",{
            params:{
                orderID:unpayOrderID,
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.unpayOrders = response.data.data;
                if(this.unpayOrders.orderState=="已支付") {
                    alert("恭喜您！没有待支付的订单！");
                    window.location.href = "userCenter.html";
                }else{
                    this.$http.get("http://localhost:8080/show/getShowPO",{
                        params:{
                            showID:this.unpayOrders.showID
                        }
                    }).then(function (response) {
                        if(response.data.errorCode==0) {
                            this.show = response.data.data;
                            this.showPrice = this.show.price.split('/');
                        }else{
                            alert("get show info wrong");
                        }
                    }).catch(function (error) {
                        console.log(error);
                        alert("获取信息失败，请刷新重试！");
                    });

                    this.$http.get("http://localhost:8080/venue/getVenuePO",{
                        params:{
                            venueID:this.unpayOrders.venueID
                        }
                    }).then(function (response) {
                        if(response.data.errorCode==0) {
                            this.venue = response.data.data;
                        }else{
                            alert("get venue info wrong");
                        }
                    }).catch(function (error) {
                        console.log(error);
                        alert("获取信息失败，请刷新重试！");
                    });

                    this.$http.get("http://localhost:8080/order/getPayLeftTime",{
                        params:{
                            orderID:this.unpayOrders.orderID
                        }
                    }).then(function (response) {
                        if(response.data.errorCode==0) {
                            this.setCookie("payLeftTime", response.data.data, 1);
                        }else{
                            alert("get pay left time wrong");
                        }
                    }).catch(function (error) {
                        console.log(error);
                        alert("获取信息失败，请刷新重试！");
                    });
                }

            }else{
                alert("get order info wrong");
            }
        }).catch(function (error) {
            console.log(error);
            alert("获取信息失败，请刷新重试！");
        });


    }

}) ;
