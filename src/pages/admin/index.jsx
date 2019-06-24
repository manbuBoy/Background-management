import React,{Component} from 'react';
import { Layout } from 'antd';

import  './index.less';
import { reqValidateUserInfo } from '../../api';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Line from '../line';
import Bar from '../bar';
import Pie from '../pie';


import { Switch,Route,Redirect} from 'react-router-dom';
import LeftNav from '../../component/left-nav';
import HeaderMain from '../../component/hearder-main';
import { getItem } from "../../utils/storge-tools";

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component{
    //初始话一个状态
    state = {
        collapsed: false,
    };

// 建立一个函数，改变这个状态
    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    //只执行一次
  async componentWillMount() {
        //判断登录是佛成功
        const user = getItem();
        // if (!user || !user.id ) {
        //     //如登录没有成功，我就让他切换到、/login上面去
        //     this.props.history.replace('/login')
        // }
        if (user && user._id ) {
            const result = await reqValidateUserInfo(user._id);

            if (result) return;
        }
        this.props.history.replace('/login');
    }

    render() {
        //拿到状态，
       const { collapsed } = this.state;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                {/*当我点击的时候触发onCollapse函数，功能用于展开和收缩，改变collapsed的状态，通过下面的
                LeftNav组件把这个collapsed传的状态传过去。
                */}
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                    {/*把这里的内容放到一个非组件中进行操作，直接引入调用即可*/}
                    <LeftNav collapsed={collapsed} />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 ,minHeight:100}} >

                        {/*把头部的内容都放在下面这个组件中完成，为了更好的操作*/}
                        <HeaderMain />
                    </Header>



                    <Content style={{ margin: '25px 16px' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>


                            <Switch>
                                <Route path="/home" component={Home}/>
                                <Route path="/category" component={Category}/>
                                <Route path="/product" component={Product}/>
                                <Route path="/user" component={User}/>
                                <Route path="/role" component={Role}/>
                                <Route path="/charts/line" component={Line}/>
                                <Route path="/charts/bar" component={Bar}/>
                                <Route path="/charts/pie" component={Pie}/>
                                <Redirect to="/home"/>
                            </Switch>


                        </div>

                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>

        )
    }

}
//在这里写完，分别对引入的headermian和leftnav进行操作。
//这组件里，主要使用了antd的布局，然后在把布局修改成我们想要的，
//为了根号的操作，我们把布局的左侧部分和复杂的头部，引到外面的一个文件中进行操作。