import Cookies from 'js-cookie';

const ACCESS_DURATION = new Date(new Date().getTime() + 30 * 60 * 1000);
const REFRESH_DURATION = 30;


export default class User{
  static isLoggedIn(){
      var user = JSON.parse(window.localStorage.getItem('netid'))
      return user != null
  }
  static getRefreshToken(){
    return Cookies.get('refresh');
  }

  static getAccessToken(){
      return Cookies.get('access');
  }

  static setAccessToken(token){
    Cookies.remove('access');
    Cookies.set('access', token, {expires: ACCESS_DURATION})
  }

  static async checkAccess(user){
    var accessToken = Cookies.get('access');
    var refreshToken = Cookies.get('refresh')
    if(!accessToken){
        if(!refreshToken) {
            this.clearAccountInfo();
            return false;
        }
        else{
            await fetch('http://127.0.0.1:5000/refresh', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken,
                    user
                })
            })
            .then(response => response.json())
            .then(data =>{
                Cookies.set('access', data.access_token, {expires: ACCESS_DURATION})
            })
            return true;
        }
    }
    return true;
  }

    static saveAccountInfo(accountJson, accessToken, refreshToken){
        window.localStorage.setItem('netid', JSON.stringify(accountJson.netid));
        Cookies.set('access', accessToken, {expires: ACCESS_DURATION});
        Cookies.set('refresh', refreshToken, {expires: REFRESH_DURATION});
    }

    static clearAccountInfo(){
        window.localStorage.clear();
        Cookies.remove('access');
        Cookies.remove('refresh');
    }
}
