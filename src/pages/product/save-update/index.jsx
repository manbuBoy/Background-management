import {Component} from "react";
import React from "react";
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd';
import { reqCategories,reqAddProduct,reqUpdateProduct } from '../../../api';
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

     getCategories= async (parentId) => {
         //向后台请求数据得到，列表数据
         const result = await reqCategories(parentId);
         if (result) {
             //判断如果是二级
             if(parentId === '0') {
                 //改变options里面的值
                this.setState({
                    //说明数据是一级,遍历得到数据列表
                    options: result.map((item) => {
                        return {
                            //用这个两只属性存着，id和名字
                            value: item._id,
                            label: item.name,
                            isLeaf: false
                        }

                    })
                })

             } else {
                 //说明是二级列表,这个时候，我拿的就是，一级列表下的子列表
                 //所以我需要先拿到父级在进行遍历得到子列表的数据
                 this.setState({
                     options: this.state.options.map((item) => {
                         //得到这个id和parentId一样

                         if (item.value === parentId) {
                         //遍历这个id的数据下面的数据
                             item.children = result.map((item) => {
                                 return {
                                     value: item._id,
                                     label: item.name
                                 }

                             })
                         }
                         return item;
                     })
                 })
             }
         }
     }


    async componentDidMount() {
        // 调用上面那个封装好的函数传个零，表示，去请求一级的
        //数据列表，也是初始化展现在我们面前的数据
        this.getCategories('0');
        /*
      如果是一级分类：pCategoryId: 0  categoryId: 一级分类id
      如果是二级分类：pCategoryId:一级分类id  categoryId: 二级分类id
     */

        const product = this.props.location.state;
        // console.log(this.props)
        let categoriesId = [];
        if (product) {
            //说明是二级
            if (product.pCategoryId !== '0') {
                categoriesId.push(product.pCategoryId);
                //在这里得到了二级的id通过调用，这个函数得到
                //二级的数据
                this.getCategories(product.pCategoryId);
            }
            //这个代码，要先执行，这个代码，不论一级还是二级都会触发
            categoriesId.push(product.categoryId);
        }


        //
        // const result = await reqCategories('0');
        // if (result) {
        //     this.setState({
        //         options:result.map((item) => {
        //             return{
        //                 value:item._id,
        //                 label: item.name,
        //                 isLeaf: false,
        //             }
        //         })
        //     })
        // }
        //把这个，添加给了这个组件的实例对象上了
        this.categoriesId = categoriesId;
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



                let promise = null;//创建一个promise对象；
                //拿到this.props上的值
                const product = this.props.location.state;
                //创建一个option对象里面放这些值
                const options = { name, desc, price, categoryId, pCategoryId, detail };
                //发送请求
                if( product ) {
                    //在这里做更改、更新的操作
                    // product._id只是在input里面更改的值，还没有真正的改掉
                    options._id = product._id;
                    //向后台发送请求,也就是，把上面的_id传了过去
                    promise = reqUpdateProduct(options);

                } else {
                    //如果product里面没有值，说明，他是添加操作，这个时候，我们直接，添加即可
                    promise = reqAddProduct(options);
                }

                //等待这个promise执行完毕以后，再来进行接下来的操作。
                const result = await promise;

                //向后台发送请求，并传入参数
                // const result = await reqAddProduct({ name, desc, price, categoryId, pCategoryId, detail })
               // console.log(result)

                if (result) {
                    //result有值说明请求成功
                    // 返回到index页面，并且要显示的商品；
                    //到这一步也就是说，已经更改完毕了，调回到下面这个页面
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

        // 如果是添加产品，product是undefined，如果是修改产品，product是对象
        const product = this.props.location.state;

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
                                ],
                                initialValue: product ? product.name : ''

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
                                    { required: true, message: '请输入商品描述'}
                                ],
                                initialValue: product ? product.desc : ''

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
                                ],
                                //他是一二级所以，我们直接拿添加时的值
                                initialValue: this.categoriesId
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
                                ],
                                initialValue: product ? product.price : ''
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
                <Item label="商品图片" >
                    {/*<PictureWall imgs={product ? product.imgs : []} id={product ? product._id : ''}/>*/}
                </Item>
                <Item label="商品详情" wrapperCol={{span: 20}}>
                    {/*ref，获取普通元素时，拿的就是dom对象，如果是个组件，那么他那的就是
                    组件的实例对象，所以我可以通ref拿到EditorConvertToHTML的是咧对象*/}
                      <RichTextEditor ref={this.richTextEditorRef} detail={product ? product.detail : ''} />

                </Item>
                <Item>
                    <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
                </Item>
            </Form>
        </Card>;
    }

}
export default Form.create()(SaveUpdate);