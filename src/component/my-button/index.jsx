
import React from 'react';
import './index.less';
export default function MyButton(props) {
    // return <button className='my-button'>退出</button>
    return <button className='my-button' {...props} />
}
