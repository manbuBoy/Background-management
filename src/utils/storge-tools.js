
const USER_TIME ='USER_TIME';
const USER_KEY = 'USER_KEY';
//限定过期时间
const EXPIRES_IN = 1000*3600*24*7;

export const getItem = function () {
    //获取现在的时间
    const startTime =  localStorage.getItem(USER_TIME);
    //做判断，看看有没超过定期时间
    if (Date.now() - startTime > EXPIRES_IN) {
        //调用函数删除信息
        removeItem();
        //必须有返回值，不然会报错
        return {}
    }
    //不然就没有过期,读取用户信息
    return JSON.parse(localStorage.getItem(USER_KEY))

    
}
//把第一次的时间和用户信息存到localstorge
export const setItem = function (data) {
    //存储第一次登陆的时间，为七天登陆做铺垫
    localStorage.setItem(USER_TIME, Date.now());
    //从data里，也就是他的result值，把这个信息存起来。
    localStorage.setItem(USER_KEY, JSON.stringify(data));
};
export const removeItem = function () {
    //移出用户的信息
    localStorage.removeItem(USER_KEY);
    //移出时间
    localStorage.removeItem(USER_TIME);
}