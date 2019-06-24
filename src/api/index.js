
import ajaxt from './ajaxt';
import { message } from 'antd';
import jsonp from 'jsonp';

export const reqLogin = (username,password) => ajaxt('/login',{username,password},'POST');
export const reqValidateUserInfo = (id) => ajaxt('/validate/user', {id}, 'POST');


export const reqWeather = function () {

    return new Promise((resolve,reject) => {
        //官网建议使用jsnp来处理跨域问题
        //发送请求
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, function (err, data) {

            console.log(data);
            if (!err) {
                const { weather,dayPictureUrl } = data.results[0].weather_data[0];
                resolve({
                    //天气的图片
                    weatherImg: dayPictureUrl,
                    //天气的情况
                    weather

                });
            }else {
                message.error('请求天气信息失败~请刷新试试~');

                resolve();
            }
        })
    })
}
export const reqCategories = (parentId) => ajaxt('/manage/category/list', {parentId});
