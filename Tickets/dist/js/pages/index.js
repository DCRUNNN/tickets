var vm=new Vue({
    el:'#container',
    data:{
        welcomeWord:'',
        user:[],
        venue:[],
        manager:[],
        guessYouLikes:[],
        todayRecommends:[],
        cityConcerts:[],
        citySports:[],
        cityDramaOperas:[],
        allSports:[],
        allConcerts:[],
        allDramaOperas:[],
        allDances:[],
        allCities:[],

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
                    this.setCookie('userID', self.user.userID, 1);
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

        venueLogin:function () {
            const self = this;
            this.$http.post("http://localhost:8080/venue/login", {
                venueID: $('#loginVenueID').val(),
                password: $('#loginVenuePassword').val()
            }).then(function (response) {
                console.log(response);
                if (response.data.errorCode == 0) {
                    self.venue = response.data.data;
                    var venueName = response.data.data.venueName;
                    this.setCookie('venueName', self.venue.venueName, 1);
                    this.setCookie('venueID', self.venue.venueID, 1);
                    this.setCookie('welcomeWord', "欢迎您！"+self.venue.venueName, 1);
                    self.welcomeWord = "欢迎您！" + venueName;
                    window.location.href = "../pages/index.html";
                } else if(response.data.errorCode==-1) {
                    alert("账户不存在！");
                }else if(response.data.errorCode == 2){
                    alert("账号密码不匹配！");
                }
            }).catch(function (error) {
                console.log(error);
                alert("发生了未知错误");
            });
        },

        managerLogin:function () {
            const self = this;
            this.$http.post("http://localhost:8080/manager/login", {
                email: $('#loginManagerEmail').val(),
                password: $('#loginManagerPassword').val(),
            }).then(function (response) {
                console.log(response);
                if (response.data.errorCode == 0) {
                    self.manager = response.data.data;
                    var managerName = response.data.data.name;
                    this.setCookie('managerName', self.manager.name, 1);
                    this.setCookie('managerEmail', self.manager.email, 1);
                    this.setCookie('welcomeWord', "欢迎您！"+self.manager.name, 1);
                    self.welcomeWord = "欢迎您！" + managerName;
                    window.location.href = "../pages/index.html";
                } else if(response.data.errorCode==-1) {
                    alert("账户不存在！");
                }else if(response.data.errorCode == 2){
                    alert("账号密码不匹配！");
                }
            }).catch(function (error) {
                console.log(error);
                alert("发生了未知错误");
            });
        },

        logout:function () {
            this.deleteCookie('username');
            this.deleteCookie('venueName');
            this.deleteCookie('managerName')
            this.deleteCookie('managerEmail');
            this.deleteCookie('welcomeWord');
        },

        changeFirstPanel:function (event) {
            var category=event.target.text;
            if(category=="猜您喜欢"){
                this.$http.get("http://localhost:8080/show/guessYouLike").then(function (response) {
                    if(response.data.errorCode==0) {
                        this.guessYouLikes = response.data.data;
                    }else{
                        alert("get guess you like show wrong!");
                    }
                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });

            }else if(category=="今日推荐"){
                this.$http.get("http://localhost:8080/show/todayRecommend").then(function (response) {
                    if(response.data.errorCode==0) {
                        this.todayRecommends = response.data.data;
                    }else{
                        alert("get guess you like show wrong!");
                    }
                }).catch(function (error) {
                    alert("获取信息失败，请刷新重试！");
                });
            }else if(category=="即将开售"){

            }

        },

        changeCityShowPanel:function (event) {
            var category=event.target.text;
            this.$http.get("http://localhost:8080/show/getShowPOByCityAndCategory", {
                params: {
                    city:$('#citySelect option:selected').text(),
                    category: category
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    if(category=="演唱会"){
                        this.cityConcerts = response.data.data;
                    }else if(category=="体育赛事"){
                        this.citySports = response.data.data;
                    }else if(category=="话剧歌剧") {
                        this.cityDramaOperas = response.data.data;
                    }
                }else{
                    alert("get city show wrong!");
                }

            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        getCityShow:function (ele) {
            // var category = $('#myCityTab li:active').text();
            var city = ele.target.value;
            var category = $("#myCityTab .active").text();
            this.$http.get("http://localhost:8080/show/getShowPOByCityAndCategory", {
                params: {
                    city : city,
                    category: category
                }
            }).then(function (response) {
                if(response.data.errorCode==0) {
                    if(category=="演唱会"){
                        this.cityConcerts = response.data.data;
                    }else if(category=="体育赛事"){
                        this.citySports = response.data.data;
                    }else if(category=="话剧歌剧") {
                        this.cityDramaOperas = response.data.data;
                    }
                }else{
                    alert("get city show wrong!");
                }

            }).catch(function (error) {
                alert("获取信息失败，请刷新重试！");
            });
        },

        showConcreteShowInfo:function (showID) {
            this.setCookie('concreteShowInfoID', showID, 1);
            window.location.href = "../pages/showInfo.html";
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



        this.$http.get("http://localhost:8080/show/guessYouLike").then(function (response) {
            if(response.data.errorCode==0) {
                this.guessYouLikes = response.data.data;
            }else{
                alert("get guess you like show wrong!");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });

        this.$http.get("http://localhost:8080/show/getShowPOByCityAndCategory",{
            params:{
                city: "南京",
                category:"演唱会"
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.cityConcerts = response.data.data;
            }else{
                alert("get cityConcerts show wrong!");
            }
        }).catch(function (error) {
            alert("获取信息失败，请刷新重试！");
        });


        this.$http.get("http://localhost:8080/show/getShowPOByCategory", {
            params: {
                category: "演唱会"
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.allConcerts = response.data.data;
            }else{
                alert("mount error")
            }
        }).catch(function (error) {
            alert("获取演唱会信息失败，请刷新重试！");
        });

        this.$http.get("http://localhost:8080/show/getShowPOByCategory", {
            params: {
                category: "体育赛事"
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.allSports = response.data.data;
            }else{
                alert("mount error")
            }
        }).catch(function (error) {
            alert("获取体育赛事信息失败，请刷新重试！");
        });

        this.$http.get("http://localhost:8080/show/getShowPOByCategory", {
            params: {
                category: "话剧歌剧"
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.allDramaOperas = response.data.data;
            }else{
                alert("mount error")
            }
        }).catch(function (error) {
            alert("获取话剧歌剧信息失败，请刷新重试！");
        });

        this.$http.get("http://localhost:8080/show/getShowPOByCategory", {
            params: {
                category: "舞蹈艺术"
            }
        }).then(function (response) {
            if(response.data.errorCode==0) {
                this.allDances = response.data.data;
            }else{
                alert("mount error")
            }
        }).catch(function (error) {
            alert("获取舞蹈艺术信息失败，请刷新重试！");
        });


        this.$http.get("http://localhost:8080/show/allCities").then(function (response) {
            if(response.data.errorCode==0) {
                this.allCities = response.data.data;
            }else{
                alert("mount error")
            }
        }).catch(function (error) {
            alert("获取城市信息失败，请刷新重试！");
        });


    }

}) ;
