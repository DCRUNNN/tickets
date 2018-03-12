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
        ],
    },
    methods:{



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
        this.showID = this.getCookieValue("concreteShowInfoID");

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
