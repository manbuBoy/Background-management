import React,{ Component } from 'react';
import MyButton from '../my-button';
import './index.less';
import {withRouter} from 'react-router-dom';
import { getItem,removeItem } from '../../utils/storge-tools';
import { Modal } from 'antd';
import  dayjs from 'dayjs';
 //引入天气处理函数
import { reqWeather } from '../../api';
import menuList from '../../config/menu-config';

 class HeaderMain extends Component{

     state = {
         sysTime: Date.now(),
         weather: '晴',
         weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png'
     };

    componentWillMount() {
        // 获取这个用户的名字
        this.username = getItem().username;
        //当刚进入页面的时候，找到的title
        this.title = this.getTitle(this.props);

    }

    async componentDidMount() {
        this.ClearTime = setInterval(() => {
                    this.setState({
                        sysTime:Date.now()
                    })
                },1000)
        //发送请求，请求天气

        const {cancel, promise} = reqWeather();
        this.cancel = cancel;
        // 拿到请求回来的天气数据
        const result = await promise;

        //更新新天气
        if (result) {
            this.setState(result)
        }
    }
    //清除定时器，发送的请求。
     componentWillUnmount() {
        //清除定时器
        clearInterval(this.ClearTime);
        //清除天气的请求
         this.cancel();
     }

     //当刷新的时候触发的生命周期函数；
    //由于该函数拥props就有了三大属性，hository,location,match
     componentWillReceiveProps(nextProps) {
         this.title = this.getTitle(nextProps);
     }
     getTitle = (nextProps) => {
         // 因为当我点击的时候pathname会存在location中
         const { pathname } = nextProps.location;
         // 由于，我引入了数据，所以menuList的长度可以拿到
         //进行查找判断是一级菜单，还是二级菜单。
         for (let i = 0; i < menuList.length; i++) {
             const menu = menuList[i];
             if (menu.children){

                 for (let j = 0; j < menu.children.length; j++){
                     const item = menu.children[j];
                     if (item.key === pathname ) {
                         return item.title;
                     }
                 }
             }else{
                 if (menu.key === pathname ) {
                     return menu.title;
                 }
             }
         }
     };
    logout = () => {

        Modal.confirm({
            title: '您确认要退出登录吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // 清空本地数据
                removeItem();
                // 退出登录
                this.props.history.replace('/login');
            }
        })
    };
    render() {
        const {sysTime,weather,weatherImg} = this.state;
        return <div>
            <div className='header-main-top'>
                <span>欢迎，{this.username}</span>
                <MyButton onClick={this.logout}>退出</MyButton>
            </div>
            <div className='header-main-bottom'>
                {/*思路，这个值和路由地址有短息，一点跳转，他也会跟着变，通过上面的方式拿到title
                并且让他成为，this的一个属性,这个值需要出发所次，但是又不能放在render里面因为，定时器会不断的跟新、
                导致不断的刷新，所以最终，把他定义成一个函数，分别再，
                */}
                <span className='header-main-left'>{this.title}</span>
                {/*关于时间的天气的操作，我们使用一个叫dayjs的库来弄他
                本身有一个更好的moment但是无论你用了多少，他都快把所有的资源加载一边*/}
                <div className='header-main-right'>
                    <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <img src={weatherImg} alt=""/>
                    <span>{weather}</span>
                </div>


            </div>
        </div>
    }
}
//只要被Switch抱着，就会拥有路由的三大属性props,statch
export default withRouter(HeaderMain);