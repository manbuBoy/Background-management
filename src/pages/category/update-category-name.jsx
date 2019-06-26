
import React,{ Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';


class UpdateCategoryNameForm extends Component {
    //自定义的，要对他进行限定类型
    static propTypes = {
        categoryName: PropTypes.string.isRequired
    };
    //自定义限定
    validator = (rule, value, callback) => {
        //如果没有值，
        if (!value) {
            callback('请输入分类名称');
        //    有值，在看看这个值等于categoryName吗？
        } else if ( value === this.props.categoryName) {
            //满足条件
            callback('请不要输入之前的名字')
        }else{
            callback();
        }
    };

    render() {
        const { getFieldDecorator }  = this.props.form;

        const { name } = this.props.categoryName;

        return <Form>
            <Form.Item>
                {
                    getFieldDecorator(
                        'categoryName',
                        {

                            rules: [{
                                validator: this.validator
                            }],
                            initialValue: name
                        }
                    )(
                        <Input />
                    )
                }
            </Form.Item>
        </Form>;
    }
    
}
export default Form.create()(UpdateCategoryNameForm);



