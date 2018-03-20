var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
        user:[],
        show:[],
        showID:'',
        showPrice:[],
    },
    methods:{

        directPurchase:function () {

            var ticketAmount = $('#ticketAmountDiv input:radio:checked').val();
            var ticketPrice = $('#selectedPrice option:selected').text();

            this.$http.get("http://localhost:8080/order/directPurchaseOrder",{
                params:{
                    userID: this.user.userID,
                    showID: this.show.showID,
                    unitPrice: ticketPrice,
                    ticketAmount:parseInt(ticketAmount)
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("创建订单成功！请在15分钟之内完成支付！");

                    this.setCookie("unpayOrderID", response.data.data, 1);

                    window.location.href = "payOrder.html";
                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                console.log(error);
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
        this.showID = this.getCookieValue("concreteShowInfoID");
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

        this.$http.get("http://localhost:8080/show/getShowPO",{
            params:{
                showID:this.showID
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.show = response.data.data;
                this.showPrice = this.show.price.split('/');
                console.log(this.showPrice);
            }else{
                alert("get show info wrong");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });


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
            console.log(error);

            alert("获取信息失败，请刷新重试！");
        });
    }

}) ;
