import React,{Component} from 'react';
import { Card, Button, Icon,Table } from 'antd';
import './index.less';
import { reqCategories } from '../../api';

import MyButton from '../../component/my-button';

export default class Category extends Component{
    state = {
        categories: [],//一级分类列表
    }

    async componentDidMount() {
        const result = await reqCategories('0');
        if (result) {
            this.setState({categories: result});
        }
    }

    render() {
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
                     extra={<Button type="primary"><Icon type='plush' />添加类品</Button>}>

            <Table
                columns={columns}
                dataSource={this.state.categories}
                bordered
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['3', '6', '9', '12'],
                    defaultPageSize: 3,
                    showQuickJumper: true
                }}
            />

        </Card>
    }

}