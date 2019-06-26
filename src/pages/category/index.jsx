
import React,{Component} from 'react';
import { Card, Button, Icon,Table,Modal,message} from 'antd';
import './index.less';
import { reqCategories,reqAddCategory,reqUpdateCategoryName } from '../../api';
import AddCategoryForm from './add-category-from';
import UpdateCategoryNameForm from './update-category-name';
import MyButton from '../../component/my-button';


export default class Category extends Component{
    state = {
        categories: [],//一级分类列表
        subCategories:[],//二级分类列表
        isShowSubCategories: false,//是佛显示二级分类列表
        isShowAddCategory: false,//显示添加分类
        isShowUpdateCategoryName:false,//显示修改名称
    };

    //下面要用到这个值，但是如果不给他定义一个对象，初始化，在运行时就会报错。
    //this.category.name报错
    category = {};

    async componentDidMount() {
        const result = await reqCategories('0');
        if (result) {
            this.setState({categories: result});
        }
    }


    //对函数进行优化的操作，省去很多代码
    toggleDisplay = (stateName,stateValue) => {
        return () => {
            this.setState({
                [stateName]:stateValue
            })
        }
    };
    //由于上一句代码，所以这届代码可以不用了，包括下一句代码。
    // showAddCategory = () => {
    //     console.log(11)
    //     this.setState({
    //         isShowAddCategory: true
    //     })
    //
    // }
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
                    const {isShowSubCategories} = this.state;
                    //如果这个值等于0，说明他是一级，
                    //如果是二级显示，当前的一级，不用展示，当前的二级分类，需要满足一级分类和当前显示的一级分类一样
                    // 才显示，佛则不显示，
                    if (result.parentId === '0') {
                        //把这个值展开来，把result添加到后面。
                        // 给这options添加一个变量接受值，方便下面的统一跟新
                        options.categories = [...this.state.categories,result];
                        //通过他的状态来判断是几集与后面的表示，一级分类和二级显示的一级分类保持一至
                    } else if ( isShowSubCategories && result.parentId === this.parentCategory._id) {
                       //满足条件，进入判断，拿到的数据，把result添加在后面
                        options.categories = [...this.state.subCategories, result];
                    }
                    //统一更新
                    this.setState(options);
                }
            }
        })
    };

    //在这里做，隐藏对话框，并且清空输入框里的值
    hideUpdateCategoryName = () => {
        //清空输入框的值
        this.updateCategoryNameForm.props.form.resetFields(['categoryName']);
        //隐藏对话框处理
        this.setState({
            isShowUpdateCategoryName: false
        })
    };
    //保存数据
    saveCategory = (category) => {
        return () => {
        //    保存要更新的分类数据
            this.category = category;
            //改变状态
         this.setState({
             isShowUpdateCategoryName: true
         })

        }
    };
    //更新分类的名字
    updateCategoryName = () => {
        const { form } = this.updateCategoryNameForm.props;
        //表单验证，收集数据
        form.validateFields(async (err,values) => {
            if (!err) {
                const { categoryName } = values;
                const categoryId = this.category._id;
            //    等待请求结果出来给了result进行操作,请求放在了api里面
                const result = await reqUpdateCategoryName(categoryId, categoryName);

                if (result) {

                    //二级列表修改数据
                    const { parentId } = this.category;
                    let  categoryData = this.state.categories;
                    let stateName = 'categories';
                    //表示这个id是二级
                    if (parentId !== '0') {
                        //得到二级数据列表
                        categoryData = this.state.subCategories;
                        //把值变成二级的
                        stateName = 'subCategories';
                    }
                    //不想修改元数据
                    const categories = categoryData.map((category) => {
                        let {_id,name,parentId } = category;
                    //找到对应的id的category,并且修改他的名称
                        if (_id === categoryId ) {
                            //在这里替换名字
                            name = categoryName;
                            //把这个结果，返回出去，
                            return {
                                _id,
                                name,
                                parentId
                            }
                        }
                    //    没有修改的数据直接返回
                        return category
                    });
                    //清空表单里面的值，并且隐藏
                    form.resetFields(['categoryName']);
                //    信息更新成功以后的提示
                    message.success('更新分类名称成功~', 2);
                    this.setState({
                        //改变状态
                        isShowUpdateCategoryName: false,
                        //categories他存着的是改变的值
                       [stateName] :categories
                    })

                }else {
                   message.error('shibao ')
                }
            }
        })
    }

    fetchCategories =async (parentId) => {

        //初始化，londing的状态
        this.setState({
            loading:false
        })

        //获取我点击的id,通过id去发送请求后台的子列表数据
        const result = await reqCategories(parentId);
        if (result){
            if (parentId === '0') {
                //说明是一级列表，
                this.setState({
                    category:result
                })
            }else{
                //他是二级列表
                this.setState({
                    // 把请求回来的数据给
                    subCategories: result,
                    //并且改变，他的状态。
                    isShowSubCategories: true
                })
            }
        }

        this.setState({
            loding:false
        })
    }
    showSubCategory = ( category ) => {
        return  () => {
            //请求二级分类数据
            this.parentCategory = category;
            //改变页面的状态，显示子数据
            this.fetchCategories(category._id);

        }

    };

    goBack = () => {
        this.setState({
            //通过这个状态来进行判断
            isShowSubCategories: false
        })
    }


    render() {

        const {
            categories,
            subCategories,
            isShowAddCategory,
            isShowUpdateCategoryName,
            isShowSubCategories,
            loading
            } = this.state;
        const columns = [
            {
                title: '品类名称',
                // dataIndex: 'name',
                dataIndex: 'name',
            },
            {
                title: '操作',
                className:"category-operation",
                render: category => {
                    // console.log(category);
                    return <div>
                        <MyButton onClick={this.saveCategory(category)}>修改名称</MyButton>
                        {
                            this.state.isShowSubCategories ? null : <MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>

                        }

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

        return <Card title={isShowSubCategories ? <div><MyButton onClick={this.goBack}>一级分类</MyButton><Icon type="arrow-right"/>&nbsp;{this.parentCategory.name}</div>:"一级列表"}
                     extra={<Button type="primary" onClick={this.toggleDisplay('isShowAddCategory', true)}>
                            <Icon type='plus'  />添加类品
                            </Button>}>
            <Table
                columns={columns}
                dataSource={isShowSubCategories ? subCategories :categories}

                bordered
                pagination={{
                    pageSizeOptions:['3','6','9','12'],
                    defaultPageSize:3,
                    showSizeChanger:true,
                    showQuickJumper:true,
                }}
                rowKey = "_id"
                loading={loading}
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

            <Modal
                title="修改分类名称"
                visible={isShowUpdateCategoryName}
                onOk={this.updateCategoryName}
                onCancel={this.hideUpdateCategoryName}
                okText="确认"
                cancelText="取消"
                width={250}
            >
                {/*在外部进行处理*/}

                <UpdateCategoryNameForm categoryName={this.category.name}  wrappedComponentRef={(form) => this.updateCategoryNameForm = form}/>
            </Modal>
        </Card>
    }
}