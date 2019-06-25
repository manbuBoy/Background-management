import  React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Form,Input,Select} from "antd";

const {Item} = Form ;
const { Option } = Select;

class AddCategoryForm extends Component{
    static propTypes = {
        categories:PropTypes.array.isRequired
    };
    //自定义规则，三个参数
    validator = (rule,value,callback) => {
        // 如果value没有值返回一个回调函数，表示请输入分类名称
        if (!value) return callback('请输入分类名称~');
        // 通过this.props拿到categories的所有数据，查找category里面的name等于这个值
        const result = this.props.categories.find((category) => category.name === value );
        if (result){
            callback('输入分类已经存在，请从新输入');

        }else {
            callback();
        }
    };
    render() {
        //之所以可那拿到他是因为被Form.create()(AddCategoryForm)
        //包裹的函数都会拥有form里面的属性
        const { getFieldDecorator } =this.props.form;
        return <Form>
            <Item label='所属分类'>
                {
                   getFieldDecorator(
                       "parentId",
                       {
                          initialValue:'0'
                       }
                   )(
                       <Select style={{width:'100%'}} onChange={this.handleChange}>
                           <Option value="0" key='0'>一级分类</Option>
                           {
                               this.props.categories.map((category) => {
                                   return <Option value={category._id } key={category._id}>{category.name}</Option>
                               })
                           }

                       </Select>

                   )
                }

            </Item>
            <Item label="所属分类">
                {
                    /*调用这个高阶函数*/
                    getFieldDecorator(
                        'categoryName',
                        {
                            rules:[{validator: this.validator}]
                        }
                    )(
                        <Input placeholder="请输入分类名称" />
                    )
                }
            </Item>
        </Form>
    }
}
export default Form.create()(AddCategoryForm);