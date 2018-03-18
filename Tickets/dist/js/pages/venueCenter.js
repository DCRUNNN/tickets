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
            }else if(selectedItem=="现场购票"){
                this.allPanelUp();
                $("#spotPurchase").show();
                $("#spotPurchase").slideDown("slow");

            }else if(selectedItem=="检票登记"){
                this.allPanelUp();
                $("#checkAndRegister").show();
                $("#checkAndRegister").slideDown("slow");
            }else if(selectedItem=="统计信息"){
                this.allPanelUp();

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
                $("#operationStatistics").show();
                $("#operationStatistics").slideDown("slow");
            }else if(selectedItem=="安全中心"){
                this.allPanelUp();
                $("#safeSetting").show();
                $("#safeSetting").slideDown("slow");
            }
        },

        allPanelUp:function () {
            $("#releasePlan").slideUp("fast");
            $("#venueInfo").slideUp("fast");
            $("#spotPurchase").slideUp("fast");
            $("#checkAndRegister").slideUp("fast");
            $("#venueStatistics").slideUp("fast");
            $("#modifyVenueInfo").slideUp("fast");
            $("#operationStatistics").slideUp("fast");
            $("#safeSetting").slideUp("fast");
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

    }

}) ;
