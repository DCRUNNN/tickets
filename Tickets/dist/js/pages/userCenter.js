var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',

        user:[],
        allCoupons:[],
        couponRecords:[],
        recentOrders:[],
        userOrders:[],

    },
    methods:{


        getMenuItem(event){
            var selectedItem = event.currentTarget.innerText;
            $("#userCenterIndexPanel1").slideUp("slow");
            $("#userCenterIndexPanel2").slideUp("slow");

            document.getElementById("breadcrumbItem").innerText = selectedItem;

            if(selectedItem=="订单管理"){
                this.allPanelUp();
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

        logout:function () {
            this.deleteCookie('username');
            this.deleteCookie('venueName');
            this.deleteCookie('managerName')
            this.deleteCookie('managerEmail');
            this.deleteCookie('welcomeWord');
        },


        setCookie:function (cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*1000));
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

        if(this.getCookieValue('username')!=""||this.getCookieValue("venueName")!=""){
            document.getElementById("loginBT").style.display = "none";
            document.getElementById("signUpBT").style.display = "none";
            document.getElementById("logOutBT").style.display = "";
        }else{
            document.getElementById("loginBT").style.display = "block";
            document.getElementById("signUpBT").style.display = "block";
            document.getElementById("logOutBT").style.display = "none";
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
