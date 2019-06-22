

import React,{Component} from 'react';
import {Form,Icon,Input,Button,message} from 'antd';
//引入图片资源
import  logo from './logo.png';
//引入样式文件
import './index.less';
import axios from 'axios';
const Item =Form.Item;

class Login extends Component {

    login = (e) => {

        e.preventDefault();
        // 用来校验表单并获取表单的值
        this.props.form.validateFields((error, values) => {
            // console.log(error, values);

            if (!error) {
                // 校验通过
                const { username, password } = values;
                // 发送请求，请求登录,这请求路径本身是5000，但是由于我们搞了一个
                //代理服务器解决跨域问题，又因为，我们上线的时候不存在跨域问题。所以，我们直接写/Login

                axios.post('/login',{ username,password })

                .then((res) =>{

                    const { data } = res;
                    console.log(data);

                    if ( data.status===0 ) {
                        this.props.history.replace('/')

                    }else{
                        message.error(data.msg, 2);
                        this.props.form.resetFields(['password']);
                    }
                })
                .catch((error) =>{
                    message.error('网络连接错误', 2);
                    this.props.form.resetFields(['password']);
                })


            } else {
                // 校验失败
                console.log('登录表单校验失败：', error);
            }
        })
    }

    /**
     * 自定义校验规则函数
     * @returns {*}
     */
    validator = (rule, value, callback) => {
        // callback必须调用
        // console.log(rule, value);

        const name = rule.fullField === 'username' ? '用户名' : '密码';

        if (!value) {
            // 没有输入
            callback(`必须输入${name}！`);
        } else if (value.length < 4) {
            callback(`${name}必须大于4位`);
        } else if (value.length > 15) {
            callback(`${name}必须小于15位`);
        } else if (!/^[a-zA-Z_0-9]+$/.test(value)) {
            callback(`${name}只能包含英文字母、数字和下划线`);
        } else {
            // 不传参代表校验通过，传参代表校验失败
            callback();
        }

    }

    render() {
        // getFieldDecorator也是一个高阶组件
        const { getFieldDecorator } = this.props.form;

        return <div className="login">
            <header className="login-header">
                <img src={logo} alt="logo"/>
                <h1>React项目: 后台管理系统</h1>
            </header>
            <section className="login-content">
                <h2>用户登录</h2>
                <Form onSubmit={this.login} className="login-form">
                    <Item>
                        {
                            getFieldDecorator(
                                'username',
                                {
                                    rules: [
                                       
                                        {
                                            validator: this.validator
                                        }
                                    ]
                                }
                            )(
                                <Input className="login-input" prefix={<Icon type="user" />} placeholder="用户名"/>
                            )
                        }
                    </Item>
                    <Item>
                        {
                            getFieldDecorator(
                                'password',
                                {
                                    rules: [
                                        {
                                            validator: this.validator
                                        }
                                    ]
                                }
                            )(
                                <Input className="login-input" prefix={<Icon type="lock" />} placeholder="密码" type="password"/>
                            )
                        }
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
                    </Item>
                </Form>
            </section>
        </div>;
    }
}

// 返回值是一个包装组件   <Form(Login)><Login></Form(Login)>
// 通过Form(Login)包装组件向Login组件中传递form属性
export default Form.create()(Login);