import React, { Component, useState, useEffect } from 'react';
import styles from "./index.module.less";
import http from "@/http/request";
import { connect } from "react-redux";
import { isNumber, isString, isUndefined } from "@/utils/type";

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSend: false,
            arr: ['1111', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444', '222222', '33333', '444444'],
            current: ""
        };
    }
    static defaultProps = {
        type: '分类'
    }

    componentDidMount() {
        http.get({
            url: '/list'
        }).then(res => {
            console.log(res);
        });
    }

    handle = () => {
        this.setState({
            isSend: true
        });
    }

    clickInfo = (item) => {
        this.props.history.push(`home/info/${item}`);
    }

    clickDom = (item) => {
        this.setState({
            current: item
        });
        setTimeout(() => {
            this.props.history.push({ pathname: `home/info/${item}`, search: 'name=张磊' });
            // window.location.pathname = `/home/info/${item}?name=zhanglei`;
        }, 1000);
    }
    show = () => {
        console.log(222222);
    }

    render() {
        const { current, arr } = this.state;
        return (
            <div>
                <div points="woshihaoren" className={styles["home"]}>首页</div>
                <div event-name="handle-point" onClick={this.show}>当前：{current}</div>
                {
                    arr.map((item, index) => {
                        return <p onClick={() => this.clickDom(item)} style={{ fontSize: '30px' }} key={index}><a>{index + '-' + item}</a></p>;
                    })
                }
            </div>
        );
    }
};

export default Category;
