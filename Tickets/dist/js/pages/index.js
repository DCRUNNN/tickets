var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
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
        }
        ]

    },
    methods:{
        login:function () {
            const self = this;
            this.$http.post("http://localhost:8080/user/login", {
                email: this.user.email,
                password: this.user.password
            }).then(function (response) {
                if (response.data.errorCode == 0) {
                    self.user = response.data.data;
                    var username = response.data.data.username;
                    this.setCookie('username', self.user.username, 1);
                    this.setCookie('welcomeWord', "欢迎您！"+self.user.username, 1);
                    self.welcomeWord = "欢迎您！" + username;
                    window.location.href = "../pages/index.html";
                } else if(response.data.errorCode==-1) {
                    alert("账户不存在！");
                }else if(response.data.errorCode == 2){
                    alert("邮箱密码不匹配！");
                }
            }).catch(function (error) {
                console.log(error);
                alert("发生了未知错误");
            });
        },

        logout:function () {
            this.deleteCookie('username');
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
        if(this.getCookieValue('username')!=""){
            document.getElementById("loginBT").style.display = "none";
            document.getElementById("signUpBT").style.display = "none";
            document.getElementById("logOutBT").style.display = "";

        }else{
            document.getElementById("loginBT").style.display = "block";
            document.getElementById("signUpBT").style.display = "block";
            document.getElementById("logOutBT").style.display = "none";
        }

    }

}) ;
