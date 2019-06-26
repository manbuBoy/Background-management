import React,{Component} from 'react';

//页面里面跳转有三个路由所以咱们就在外面定义了三个路由，然后
//在引入进来
import { Route, Redirect, Switch } from 'react-router-dom';
import Index from './index/index';
import SaveUpdate from './save-update';
import Detail from './detail';


export default class Product extends Component{

    render() {
        return <Switch>
            <Route path='/product/index' component={Index} />
            <Route path='/product/save-update' component={SaveUpdate} />
            <Route path='/product/detail' component={Detail} />
            <Redirect to='/product/index' />
        </Switch>
    }

}