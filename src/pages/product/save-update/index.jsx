import {Component} from "react";
import React from "react";
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd';
import { reqCategories,reqAddProduct } from '../../../api';
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";
import RichTextEditor from './rich-text-editor';
import './index.less';

const { Item } = Form;

 class SaveUpdate extends Component{

    state = {
        options: []
    };

     richTextEditorRef = React.createRef();

    async componentDidMount() {
        const result = await reqCategories('0');
        if (result) {
            this.setState({
                options:result.map((item) => {
                    return{
                        value:item._id,
                        label: item.name,
                        isLeaf: false,
                    }
                })
            })
        }
    };

    loadData = async (selectedOptions) => {
        //获取数组最后一项
        const  targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading图片，会转动的圈圈；
        targetOption.loading = true;
        //发送请求，请求二级分类数据
        const result = await reqCategories(targetOption.value);
        if (result) {
            // 将loading改为false
            //如果有值说明，请求成功改变loading的状态
            targetOption.loading = false;
            //遍历里面的数据
            targetOption.children = result.map((item) => {
                // 展示
                return {
                    label: item.name,
                    value: item._id,
                }
            });
        //    更新状态
            this.setState({
                options:[...this.state.options],
            });
        }

    };

    //form表单事件的表单验证，收集数据，和发送请求
    addProduct = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err,values) => {

            if (!err) {
                //拿到文本编辑器的值

                const { editorState } = this.richTextEditorRef.current.state;

                //获取文本器的详情
                const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));

                //请求得到的值
                const { name,desc,price,categoriesId } = values;

                //他表示一级的id
                let pCategoryId = '0';
                //他表示二级id
                let categoryId = '';

                //判断如果是一级那么就只有一个id
                //如果二级就有两个id
                if ( categoriesId.length === 1 ) {
                    categoryId = categoriesId[0];
                } else {
                    pCategoryId = categoriesId[0];
                    categoryId = categoriesId[1];
                }
                //向后台发送请求，并传入参数
                const result = await reqAddProduct({ name, desc, price, categoryId, pCategoryId, detail })
               console.log(result)

                if (result) {
                    //result有值说明请求成功
                    // 返回到index页面，并且要显示的商品；
                    this.props.history.push('/product/index');
                }

            }
        })
    };

    //小箭头返回
    goBack = () => {
        //调用this.props.history里面的goBack函数。
        this.props.history.goBack();
        // console.log(this.props.history)
    };
    render() {

        const { options } = this.state;
        //由于我们下面使用了，Form.create()();
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        return <Card title={<div className="product-title"><Icon type="arrow-left" onClick={this.goBack} className='arrow-icon'/><span>添加商品</span></div>}>
            {/*当点击提交按钮时会触发form表单里面的addProduct，表单提交事件*/}
            <Form {...formItemLayout} onSubmit={this.addProduct}>
                <Item label="商品名称">

                    {
                        getFieldDecorator(
                            'name',
                            {
                                rules:[
                                    /*显示必填小星星*/
                                    {required: true,message: '请输入商品名称'}
                                ]

                            }
                        )(
                            <Input placeholder="请输入商品名称"/>
                        )
                    }

                </Item>
                <Item label="商品描述">
                    {
                        getFieldDecorator(
                            'desc',
                            {
                                rules: [
                                    {
                                        required: true, message: '请输入商品描述'
                                    }
                                ]
                            }
                        )(
                            <Input placeholder="请输入商品描述"/>)
                    }

                </Item>
                <Item label="选择分类" wrapperCol={{span: 5}}>

                    {
                        getFieldDecorator  (
                           "categoriesId",
                            {
                                rules:[
                                    {required: true, message: '请选择分类'}
                                ]
                            }
                        )(
                            <Cascader
                                options={options}
                                loadData={this.loadData}
                                changeOnSelect
                            />
                        )
                    }

                </Item>
                <Item label="商品价格">


                    {
                        getFieldDecorator (
                            'price',
                            {
                                rules: [
                                    {required: true, message: '请输入商品价格'}
                                ]
                            }

                        )(
                            <InputNumber
                                // 格式化，对输入的数据进行格式化
                                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                                className="input-number"
                            />

                        )
                    }

                </Item>
                <Item label="商品详情" wrapperCol={{span: 20}}>
                    {/*ref，获取普通元素时，拿的就是dom对象，如果是个组件，那么他那的就是
                    组件的实例对象，所以我可以通ref拿到EditorConvertToHTML的是咧对象*/}
                      <RichTextEditor ref={this.richTextEditorRef} />

                </Item>
                <Item>
                    <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
                </Item>
            </Form>
        </Card>;
    }

}
export default Form.create()(SaveUpdate);