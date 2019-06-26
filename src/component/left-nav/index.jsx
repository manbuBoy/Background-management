import React,{ Component } from 'react';

//这个引入来自官网的，他告诉我们使用这个布局要引入的东西
import { Icon, Menu } from "antd";
//因为我们使用了组件路由，所以我们需要引入他的包
import  { Link,withRouter} from 'react-router-dom';
//这个包为我们限定输入的内容的类型
import PropTypes from 'prop-types';

//引入外部的数据
import menuList from '../../config/menu-config';

import './index.less';

//引入需要的图片,由于这个图片好几个地方要用，所以把他放在公公的文件中
//asstes专门存放，公共的东西
import logo from '../../assets/images/logo.png';

//官网告诉这摸玩的
const { SubMenu, Item } = Menu;

//定义一个组件leftnav

class LeftNav extends Component {
    //定义一个静态，限制类型，collapsed为必填collapsed他的，类型是，bool
    static propType = {
        collapsed:PropTypes.bool.isRequired
    };
//    创建一个函数，等待调用。
    createMenu = (menu) => {
        //表示第几个，就像id一样
        return <Item key={menu.key}>
            {/*跳转到哪里*/}
            <Link to={menu.key}>
                {/*你点击的拿个他的头标*/}
            <Icon type={menu.icon} />
                {/*点击的是谁*/}
                <span> {menu.title}</span>
            </Link>
        </Item>
    }
//    因为你点击的他，可能会展开，它里面也有一层所以下面的操作也就应运而生了

    componentWillMount() {
            //拿到他的路径
            let { pathname } = this.props.location;
            // 对路径进行正则效验
            const pathnameReg = /^\/product\//;


            if (pathnameReg.test(pathname)) {

                pathname = pathname.slice(0, 8);
                console.log(pathname)
            }
            let isHome = true;


            this.menus = menuList.map((menu) => {
                //判断是一级还是二级菜单
                const children = menu.children;

                if (children) {
                    //表示是二级
                    return <SubMenu key={menu.key} title={
                        <span>
                          <Icon type={menu.icon} />
                          <span>{menu.title}</span>
                        </span>}>
                        {
                            //如果它里面有children说明他是二级菜单，children下面存着，所有的子菜单
                            //遍历得到他
                            children.map((item) => {
                                if (item.key === pathname) {
                                    // 说明当前地址是一个二级菜单，需要展开一级菜单
                                    // 初始化展开的菜单
                                    this.openKey = menu.key;
                                    isHome = false;
                                }
                                //这个item是二级菜单里面的点击的位置
                                return this.createMenu(item);
                            })
                        }
                    </SubMenu>
                } else {
                        if (menu.key === pathname ) isHome = false;
                        //说明你点击的是个一级菜单所以直接返回去就可以了。
                        return this.createMenu(menu);
                }
            });
            //初始化选中菜单
        this.selectedKey = isHome ? '/home' : pathname;
    }







    render() {
        const { collapsed } = this.props;

        return <div>
            <Link className="left-nav-logo" to='/home'>
                <img src={logo} alt="logo"/>
                <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
            </Link>
            <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
                {
                    this.menus
                }
            </Menu>
        </div>;
    }

}
//出现了错误，下面这个高阶函数没有调用，在上面的生命周期函数中，报错，不能读取，pathname,为undifind
export default withRouter(LeftNav);



//在这里做了什么事
//主要干了一些，我点击的是个哪个菜单，就通过组件路由去到哪里，展示呢个路由的信息。
//我们先创建一个一级菜单函数，当我们点击的不是二级的菜单时，直接调用这个函数，
//如果是二级需要对二级里面进行遍历，拿到你点击的子菜单。