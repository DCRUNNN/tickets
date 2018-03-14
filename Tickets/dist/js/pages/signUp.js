var vm=new Vue({
    el:'#container',
    data:{
        user:[{
            username:'',
            password:'',
            email:'',
            phoneNumber:'',
            userID:'',
            isVIP:1,
            vipLevel:1,
            balance:0,
            totalConsumption:0,
            state:'',
            activeCode:''
        }],

        venue:[{
            venueID:'',
            venueName:'',
            city:'',
            password:'',
            venueAddress:'',
            area:'',
            row:'',
            seat:'',
            venueInfo:'',
            applicationTime:'',
            income:'',
            state:''
        }]

    },
    methods:{
        signUp:function () {
            const self = this;
            this.$http.post("http://localhost:8080/user/addUser",{
                username:this.user.username,
                password:this.user.password,
                email:this.user.email,
                userID:"",
                isVIP:1,
                vipLevel:1,
                phoneNumber:this.user.phoneNumber,
                balance:0,
                totalConsumption:0,
                state:"未激活",
                activeCode:""
            }).then(function(response){
                if(response.data.errorCode==0) {
                    $(function () {
                        document.getElementById("activeEmailAddress").innerHTML = self.user.email;
                        $('#activeUserModal').modal('show')});
                }

            })
        },

        confirmActive:function () {
            const self = this;

            this.$http.get("http://localhost:8080/user/getUserPO/"+self.user.username, {
            }).then(function (response) {
                if (response.data.errorCode === 0) {
                    if (response.data.data.state == '未激活') {
                        alert("您尚未激活账户!")
                    } else if (response.data.data.state == '已激活') {
                        self.user = response.data.data;

                        //设置cookie

                        window.location.href = "../pages/index.html";
                    }
                }
            }).catch(function (error) {
                alert("发生了未知的错误");
            });
        },

        venueSignUp:function () {

            var password=  $('#venuePassword').val();
            var confirmPassword = $('#confirmVenuePassword').val();
            if(password!=confirmPassword) {
                alert("密码输入不一致！");
                return;
            }
            const self = this;
            this.$http.post("http://localhost:8080/venue/regVenue",{
                venueName:this.venue.venueName,
                venueID:'',
                password:this.venue.password,
                city:this.venue.city,
                venueAddress:this.venue.venueAddress,
                area:this.venue.area,
                row:this.venue.row,
                seat:this.venue.seat,
                venueInfo:this.venue.venueInfo,
                applicationTime:this.venue.applicationTime,
                state:'',
            }).then(function(response){
                if(response.data.errorCode==0) {
                    $(function () {
                        document.getElementById("activeVenueID").innerHTML = response.data.data;
                        $('#activeVenueModal').modal('show')});
                }

            })
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
        }
    }

}) ;
