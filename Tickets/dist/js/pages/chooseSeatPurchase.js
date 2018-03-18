var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
        user:[],
        show:[],
        showID:'',
        showPrice:[],
        showArea:'',
        showRow:0,
        showSeat:'',
        soldSeat:[],
        totalPrice:0,
        ticketAmount:0,


    },
    methods:{

        changePrice:function (ele) {

            var price=parseFloat(ele.target.value);

            var index = 0;

            for(var i=0;i<this.showPrice.length;i++) {
                if(this.showPrice[i]==price){
                    index = i;
                    break;
                }
            }

            var row = this.showArea.split('/')[index].split('-')[1];

            var rowStartIndex = 0;
            var rowEndIndex = 0;
            for(var i=0;i<index;i++) {
                rowStartIndex += parseInt(this.showArea.split('/')[i].split('-')[1]);
            }

            for(var i=0;i<index+1;i++) {
                rowEndIndex += parseInt(this.showArea.split('/')[i].split('-')[1]);
            }

            // alert(rowStartIndex);
            // alert(rowEndIndex);

            var seat =[];
            for(var i=rowStartIndex;i<rowEndIndex;i++) {
                seat.push(this.showSeat.split('/')[i]);

            }

            //设置已售出的座位

            // initMap(price,row,seat.join("/"),"seat_area");

            for(var i=0;i<this.showPrice.length;i++) {
                if(i!=index) {
                    $('#seat_area' + i).hide();
                }
            }
            $('#seat_area' + index).show();


            this.$http.get("http://localhost:8080/seat/getSoldSeat",{
                params:{
                    showID:this.showID,
                    price:price
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    this.soldSeat = response.data.data;
                    var soldSeatInfo = [];
                    for(var i=0;i<this.soldSeat.length;i++) {
                        soldSeatInfo.push(this.soldSeat[i].row + '_' + this.soldSeat[i].seat);
                    }
                    initMap(price,row,seat.join("/"),"seat_area"+index,soldSeatInfo);

                }else{
                    alert("get sold seat wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },

        purchaseTicket:function() {
            var seatInfo = [];
            $("#seats_chose li").each(function(){
                var y = $(this);
                seatInfo.push(y.text());
            });

            this.$http.post("http://localhost:8080/order/createOrder",{
                discount: 0,
                orderDate: '',
                orderID: '',
                orderState: '待支付',
                purchaseMethod: "选座购买",
                seat: seatInfo.join(","),
                showID: this.show.showID,
                showName: this.show.showName,
                ticketsAmount: document.getElementsByClassName('mySelectSeat').length,
                totalPrice: document.getElementById("tempTotalPrice").innerText,
                unitPrice: 0,
                userID: this.user.userID,
                username: this.user.username,
                venueID: this.show.venueID
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("创建订单成功！请在15分钟之内完成支付！");
                    window.location.href = "payOrder.html";
                }else{
                    alert(response.data.data);
                }
            }).catch(function (error) {
                console.log(error);
                alert("获取信息失败，请刷新重试！");
            });

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
                this.showArea = this.show.area;
                this.showRow = this.show.allRow;
                this.showSeat = this.show.seat;

                var firstPrice = parseFloat(this.showPrice[0]);
                var firstRow = this.showArea.split('/')[0].split('-')[1];
                var index=find(this.showSeat,'/',firstRow-1);

                for(var i=0;i<this.showPrice.length;i++) {
                    if(i!=0) {
                        $("#mySeatPanel").prepend("<div id="+'seat_area'+i+" style='display:none'><div class=\"front\">屏幕</div></div>");
                    }else{
                        $("#mySeatPanel").prepend("<div id="+'seat_area'+i+"><div class=\"front\">屏幕</div></div>");
                    }
                }

                this.$http.get("http://localhost:8080/seat/getSoldSeat",{
                    params:{
                        showID:this.showID,
                        price:firstPrice
                    }
                }).then(function (response) {
                    if(response.data.errorCode==0) {
                        this.soldSeat = response.data.data;
                        var soldSeatInfo = [];
                        for(var i=0;i<this.soldSeat.length;i++) {
                            soldSeatInfo.push(this.soldSeat[i].row + '_' + this.soldSeat[i].seat);
                        }
                        initMap(firstPrice,firstRow,this.showSeat.substr(0, index),"seat_area0",soldSeatInfo);
                    }else{
                        alert("get sold seat wrong");
                    }
                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });
            }else{
                alert("get show info wrong");
            }
        }).catch(function (error) {
            console.log(error)
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
