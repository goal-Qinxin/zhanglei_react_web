import React, { Component } from 'react';
import { getPositionInPage } from "@/utils/dom";
/**
 * 拖拽缩放组件
 * 实现原理：通过改变宽高来实现缩放，所以只支持右边框和下边框点击拖拽缩放
 * 使用: 
 *       <DragResize>
 *          被包裹
 *       </DragResize>
 * 参数: minWidth minHeight: 缩小的最小宽高
 */
class DragResize extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // false事件冒泡(从里到外依次触发)，true事件捕获（从外到里依次触发）
        this.draggableDom && this.draggableDom.addEventListener('mousedown', this.doDown, false);
        this.draggableDom && this.draggableDom.addEventListener('touchstart', this.doDown, false);
        document.addEventListener('mousemove', this.doMove, false);
        document.addEventListener('touchmove', this.doMove, false);
    }

    componentWillUnmount() {
        this.removeEvent();
        document.removeEventListener('mousemove', this.doMove);
        document.removeEventListener('touchmove', this.doMove);
    }

    // 移除事件
    removeEvent = () => {
        this.draggableDom && this.draggableDom.removeEventListener('mousedown', this.doDown);
        document.removeEventListener('mouseup', this.doUp);
        document.removeEventListener('touchcancel', this.doUp);
        document.removeEventListener('touchend', this.doUp);
        document.removeEventListener('dragover', this.doOver);
        document.removeEventListener('mouseup', this.doUp);
    }

    // 获取事件触发点在目标盒子内的位置 = 触发点可视化区域位置 - 盒子边框可视化区域位置
    getPosition = (e, element) => {
        e = e || window.event;
        const x = getPositionInPage(e).x;
        const y = getPositionInPage(e).y;
        return {
            x: x - element.getBoundingClientRect().left,
            y: y - element.getBoundingClientRect().top
        };
    }

    // 获取鼠标的位置
    getMousePosition = (e, element) => {
        let positions = '';
        const { x, y } = this.getPosition(e, element);
        const distance = 10;
        // 上边
        if (y < distance && y > -distance) positions += 'n';
        // 下边
        else if (y > element.offsetHeight - distance && y < element.offsetHeight + distance) positions += 's';
        // 左边
        if (x < distance && x > -distance) positions += 'w';
        // 右边
        else if (x > element.offsetWidth - distance && x < element.offsetWidth + distance) positions += 'e';
        // 否则返回空字符串表示不在边缘
        return positions;
    };

    // 鼠标点击事件
    doDown = (e) => {
        const element = this.draggableDom;
        // 如果点击的是其他区域则不做操作
        const positions = this.getMousePosition(e, element);
        if (positions == '') return;

        e.stopPropagation();
        // e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        // 是否可以拖拽
        this.isDraggable = true;
        // 存储拖拽前的信息
        this.setState({
            positions: positions,
            preEventX: getPositionInPage(e).x,
            preEventY: getPositionInPage(e).y,
            preWidth: element.offsetWidth,
            preHeight: element.offsetHeight
        });
        document.addEventListener('dragover', this.doOver, false);
        document.addEventListener('mouseup', this.doUp, false);
        document.addEventListener('touchcancel', this.doUp, false);
        document.addEventListener('touchend', this.doUp, false);
    };

    doUp = () => {
        this.isDraggable = false;
        this.removeEvent();
        this.draggableDom && this.draggableDom.addEventListener('mousedown', this.doDown, false);
        this.draggableDom && this.draggableDom.addEventListener('touchstart', this.doDown, false);
    };

    doOver = () => {
        this.isDraggable = false;
    }

    // 鼠标移动事件
    doMove = (e) => {
        // e.stopPropagation();
        e.preventDefault();
        this.setMouseStyle(e, this.draggableDom);
        this.dragChange(e, this.draggableDom);
    }

    // 鼠标移动时实时设置鼠标的样式 e鼠标事件 element目标dom
    setMouseStyle = (e, element) => {
        const positions = this.getMousePosition(e, element);
        if (positions === 'n' || positions === 's') {
            element.style.cursor = 'row-resize';
        } else if (positions === 'w' || positions === 'e') {
            element.style.cursor = 'col-resize';
        } else if (positions === '') {
            element.style.cursor = 'default';
        } else {
            element.style.cursor = positions + '-resize';
        }
    }

    // 鼠标拖拽过程中目标发生的变化 e事件 element目标dom
    dragChange = (e, element) => {
        if (!this.isDraggable) {
            return;
        }
        // 初始位置
        const { positions, preEventX, preEventY, preWidth, preHeight } = this.state;
        // 最小宽度和最小高度
        const minWidth = this.props.minWidth || 0;
        const minHeight = this.props.minHeight || 0;
        const x = getPositionInPage(e).x;
        const y = getPositionInPage(e).y;
        // 计算对应的style属性
        const rules = {
            e: {
                width: Math.max(minWidth, preWidth + x - preEventX) + 'px'
            },
            s: {
                height: Math.max(minHeight, preHeight + y - preEventY) + 'px'
            },
            w: {
                width: Math.max(minWidth, preWidth - x + preEventX) + 'px'
            },
            n: {
                height: Math.max(minHeight, preHeight - y + preEventY) + 'px'
            }
        };

        Object.keys(rules).map(item => {
            if (positions.indexOf(item) > -1) {
                const setStyle = rules[item];
                // 遍历当前样式赋值
                Object.keys(setStyle).map(property => {
                    if (property) {
                        element.style[property] = setStyle[property];
                    }
                });
            }
        });
    };

    render() {
        return (
            <div style={{ display: 'flex', overflow: 'hidden', border: '1px solid red', padding: '1px' }} ref={(node) => { this.draggableDom = node; }}>
                {this.props.children}
            </div>
        );
    }
}

export default DragResize;
