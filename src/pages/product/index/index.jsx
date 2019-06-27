import React,{Component} from 'react';
import { Card, Button, Icon, Table, Select, Input } from 'antd';
import MyButton from '../../../component/my-button';
import { reqProducts } from '../../../api';
import './index.less';


const { Option } = Select;

export default class Index extends Component {
    state = {
        products: [],
        total:0,//表示请求数据的总数量
        loading:true//决定loading图片的开关
    };


   componentDidMount() {
        //初始化的请求数量
        this. getProducts(1,3);

    }

    //根据请求的数据生成分页的数量
    getProducts = async (pageNum,pageSize) => {
       //产生loading
       this.setState({
           loading:true
       })
        //发送请求，之请求一个页面的三个数据
        const result = await reqProducts(pageNum,pageSize);

        if (result) {
            this.setState({
                //得到总的数据有多少
                total:result.total,
                //更新他的值,拿到请求回来的值
                //并把它存在products数组中
                products:result.list,
            //    请求成功loading图片消失
                loading: false
            })
        }
    };
    //触发这个函数切换页面，由于需要返回上一页所以用push
    showAddProduct = () => {
        this.props.history.push('/product/save-update')
    };
    //出发的修改事件
    showUpdateProduct = (product) => {
        //主要做的就是页面的跳转，和传数据
        return () => {
            //因为这句话的执行，所以，我们接下来的操作，在/product/save-update
            //里面进行操作
            this.props.history.push('/product/save-update',product)
        }
    }
    render() {
        const { products,total,loading } = this.state;
        const columns = [
            {
                title:'商品名称',
                dataIndex:'name',
            },
            {
                title:'商品描述',
                dataIndex:'desc',
            },
            {
                title:'价格',
                dataIndex:'price'
            },
            {
                className:'product-status',
                title:'状态',
                dataIndex:'status',
                render: (status) => {
                    return status === 1
                        ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
                        : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
                }
            },
            {
                className: 'product-status',
                title: '操作',
                render: (product) => {
                    return <div>
                        <MyButton>详情</MyButton>
                        <MyButton onClick={this.showUpdateProduct(product)}>修改</MyButton>
                    </div>
                }
            },
        ];
        return <Card
            title={ <div>
                    <Select defaultValue={0}>
                        <Option key={0} value={0}>根据商品名称</Option>
                        <Option key={1} value={1}>根据商品描述</Option>
                    </Select>
                    <Input placeholder="关键字" className="search-input"/>
                    <Button type="primary">搜索</Button>
                </div> }
            extra={<Button type="primary" onClick={this.showAddProduct}>
                <Icon type="plus"/>添加产品</Button>}>
            <Table
                columns={columns}
                dataSource={products}
                bordered
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['3', '6', '9', '12'],
                    defaultPageSize: 3,
                //    根据条件生成分页的页数需要添加的属性
                    total,
                    onChange:this.getProducts,
                    onShowSizeChange:this.getProducts,
                }}
                rowKey='_id'
                loading={loading}
            />
        </Card>;


    }
}