var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
        user:[],
        venue:[],
        manager:[],
        recentOrders:[],
        regApplications:[],
        modifyApplications:[],

    },
    methods:{


        logout:function () {
            this.deleteCookie('username');
            this.deleteCookie('venueName');
            this.deleteCookie('managerName');
            this.deleteCookie('managerEmail');
            this.deleteCookie('welcomeWord');
        },

        getMenuItem(event){
            var selectedItem = event.currentTarget.innerText;
            $("#mangerCenterIndexPanel1").slideUp("slow");

            document.getElementById("breadcrumbItem").innerText = selectedItem;

            if(selectedItem=="场馆注册申请"){
                this.allPanelUp();
                this.getVenueRegApplications();
                $("#venueRegApplication").slideDown("slow");
            }else if(selectedItem=="场馆修改信息申请"){
                this.allPanelUp();
                this.getVenueModifyApplications();
                $("#venueModifyApplication").show();
                $("#venueModifyApplication").slideDown("slow");
            }else if(selectedItem=="场馆结算"){
                this.allPanelUp();
                $("#venuePayment").show();
                $("#venuePayment").slideDown("slow");

            }else if(selectedItem=="场馆信息统计"){
                this.allPanelUp();
                $("#venueInfoStatistics").show();
                $("#venueInfoStatistics").slideDown("slow");
            }else if(selectedItem=="会员信息统计"){
                this.allPanelUp();

                $("#vipInfoStatistics").show();
                $("#vipInfoStatistics").slideDown("slow");

            }else if(selectedItem=="Tickets财务情况"){

                this.allPanelUp();
                $("#ticketsFinancial").show();
                $("#ticketsFinancial").slideDown("slow");
            }
        },

        getVenueRegApplications:function () {
            this.$http.get("http://localhost:8080/manager/getVenueRegApplications").then(function (response) {
                if(response.data.errorCode==0) {
                    this.regApplications = response.data.data;
                    for(var k=0;k<this.regApplications.length;k++){
                        var seatInfo = this.regApplications[k].seat;
                        // A-01-01,20;A-02-01,30;A-03-01,40/B-04-01,50;B-05-01,60;B-06-01,70;B-07-01,80;B-08-01,90/C-09-01,100;C-10-01,110;C-11-01,120;C-12-01,130
                        var seatByArea = seatInfo.split("/");
                        var result = "";
                        for(var i=0;i<seatByArea.length;i++){
                            var seatByRow = seatByArea[i].split(";")
                            for (var j=0;j<seatByRow.length;j++){
                                result+=(seatByRow[j].split(",")[1])+("/");
                            }
                        }
                        this.regApplications[k].seat = result.substr(0, result.length - 1);
                    }
                }else{
                    alert("get regApplications info wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        getVenueModifyApplications:function () {
            this.$http.get("http://localhost:8080/manager/getVenueModifyApplications").then(function (response) {
                if(response.data.errorCode==0) {
                    this.modifyApplications = response.data.data;
                }else{
                    alert("get modifyApplications info wrong");
                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        setDataToRegAppDialog:function(venueID,venueName,address,area,row,seat,venueInfo){
            $('#venueName').val(venueName);
            $('#venueAddress').val(address);
            $('#venueArea').val(area);
            $('#venueRow').val(row);
            $('#venueSeat').val(seat);
            document.getElementById('venueInfo').innerText = venueInfo;

            document.getElementById("venueIDLabel").innerText = venueID;

            $('#showRegConcreteInfoModal').modal('show');
        },

        setDataToModifyAppDialog:function(venueID,preVenueName,postVenueName,preAdd,postAdd,preInfo,postInfo){
            $('#venueIDLabel2').val(venueID);
            $('#preVenueName').val(preVenueName);
            $('#postVenueName').val(postVenueName);
            $('#preVenueAddress').val(preAdd);
            $('#postVenueAddress').val(postAdd);
            document.getElementById('preVenueInfo').innerText = preInfo;

            document.getElementById("postVenueInfo").innerText = postInfo;

            $('#showModifyConcreteInfoModal').modal('show');
        },

        confirmVenueReg:function () {
            var venueID = document.getElementById("venueIDLabel").innerText;
            this.$http.get("http://localhost:8080/manager/confirmRegVenue",{
                params:{
                    venueID:venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("审批通过成功！");
                    window.location.href = "../pages/managerCenter.html";
                }else{
                    alert("审批通过失败！");

                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        confirmVenueModify:function () {
            var venueID = $('#venueIDLabel2').val();
            this.$http.get("http://localhost:8080/manager/comfirmModifyVenueInfo",{
                params:{
                    venueID:venueID
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    alert("审批通过成功！");
                    window.location.href = "../pages/managerCenter.html";
                }else{
                    alert("审批通过失败！");

                }
            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });

        },

        allPanelUp:function () {
            $("#venueRegApplication").slideUp("fast");
            $("#venueModifyApplication").slideUp("fast");
            $("#venuePayment").slideUp("fast");
            $("#venueInfoStatistics").slideUp("fast");
            $("#vipInfoStatistics").slideUp("fast");
            $("#ticketsFinancial").slideUp("fast");
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

        var managerEmail = this.getCookieValue("managerEmail");

        if(this.getCookieValue('username')!=""||this.getCookieValue("venueName")!="" || this.getCookieValue("managerName")!=""){
            document.getElementById("loginBT").style.display = "none";
            document.getElementById("signUpBT").style.display = "none";
            document.getElementById("logOutBT").style.display = "";

        }else{
            document.getElementById("loginBT").style.display = "block";
            document.getElementById("signUpBT").style.display = "block";
            document.getElementById("logOutBT").style.display = "none";
        }

        this.$http.get("http://localhost:8080/manager/getManagerPO",{
            params:{
                email:managerEmail
            }
        }).then(function (response) {
            console.log(response.data);

            if(response.data.errorCode==0) {
                this.manager = response.data.data;
            }else{
                alert("get manager info wrong");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });

    }

}) ;
