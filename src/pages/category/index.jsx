
import React,{Component} from 'react';
import { Card, Button, Icon,Table,Modal,message} from 'antd';
import './index.less';
import { reqCategories,reqAddCategory } from '../../api';
import AddCategoryForm from './add-category-from';
import MyButton from '../../component/my-button';


export default class Category extends Component{
    state = {
        categories: [],//一级分类列表
        isShowAddCategory: false
    }

    async componentDidMount() {
        const result = await reqCategories('0');
        if (result) {
            this.setState({categories: result});
        }
    }

    showAddCategory = () => {
        console.log(11)
        this.setState({
            isShowAddCategory: true
        })

    }
    //隐藏商品
    hideAddCategory =() => {
        this.setState({
            isShowAddCategory: false
        })

    }
    //添加商品,思路，首先，进行表单验证，在此表单收集数据，最后发送请求
    addCategory = () => {
        //这个地方就是父组件拿到了，子组件的数据也就是下面通过组件自带的方法
        //wrappedComponentRef，之前我们是建一个函数的方式拿的,validateFields,来做
        //表单验证
        // this.addCategoryForm.props.form.validateFields(async (err,values) => {
        //     if (!err) {
        //         //表示验证通过，拿值,前面起的值得名字，表示id和名字，从开发api中得到。
        //         const { parentId, categoryName } = values;
        //         const result = await reqAddCategory(parentId, categoryName);
        //         if (result){
        //             //表示添加分类成功
        //             message.success('添加成功',2);
        //             this.setState({
        //                 isShowAddCategory: false
        //             })
        //         }
        //
        //     }
        //
        // })
        const { form } = this.addCategoryForm.props;
        form.validateFields(async(err,values) =>{
            if (!err) {
                const { parentId,categoryName } = values;
                //等待请求结束，得到结果。
                const result = await reqAddCategory(parentId, categoryName);
                //对结果进行判断处理
                if (result) {
                    message.success('添加分类成功',2);
                    //清空表单数据
                    form.resetFields(['parentId', 'categoryName']);
                    //创建一个对象里面有个他
                    const options = {
                      isShowAddCategory: false
                    };
                    //如果这个值等于0，说明他是一级，
                    if (result.parentId === '0') {
                        //把这个值展开来，把result添加到后面。
                        // 给这options添加一个变量接受值，方便下面的统一跟新
                        options.categories = [...this.state.categories,result];
                    }
                    //统一更新
                    this.setState(options);
                }
            }
        })
    };
    render() {
        const { categories,isShowAddCategory } = this.state;
        const columns = [
            {
                title: '品类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                dataIndex: 'address',
                className:"category-operation",
                render: text => {
                    return <div>
                        <MyButton>修改名称</MyButton>
                        <MyButton>查看其子品类</MyButton>

                    </div>
                },
            },
        ];

        // const data = [
        //     {
        //         key: '1',
        //         name: 'John Brown',
        //         money: '￥300,000.00',
        //         address: 'New York No. 1 Lake Park',
        //
        //     },
        //     {
        //         key: '2',
        //         name: 'Jim Green',
        //         money: '￥1,256,000.00',
        //         address: 'London No. 1 Lake Park',
        //     },
        //     {
        //         key: '3',
        //         name: 'Joe Black',
        //         money: '￥120,000.00',
        //         address: 'Sidney No. 1 Lake Park',
        //     },
        // ];

        return <Card title='一级分类列表'
                     extra={<Button type="primary" onClick={this.showAddCategory}>
                            <Icon type='plus'  />添加类品
                            </Button>}>
            <Table
                columns={columns}
                dataSource={this.state.categories}
                bordered
                pagination={{
                    pageSizeOptions:['3','6','9','12'],
                    defaultPageSize:3,
                    showSizeChanger:true,
                    showQuickJumper:true,
                }}

                rowKey = "_id"
            />

            <Modal
                title="Modal"
                //状态页面就改变
                visible={isShowAddCategory}
                // 自定义两个函数，表示隐藏和显示
                onOk={this.addCategory}
                onCancel={this.hideAddCategory}
                //确认取消按钮
                okText="确认"
                cancelText="取消"
            >
                {/*表示内容部分，把内容定义出去了*/}
                <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form} />

            </Modal>
        </Card>
    }
}