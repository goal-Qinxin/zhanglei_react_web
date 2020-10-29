import React from "react";
import "./app.less";
// 引入路由组件
import RouteComponent from "@/routes/index.js";
import NotFound from "@/components/default/not-found";
import ToTop from "@/components/top/top";

// 路由组件
function MyRoutes() {
    return (
        <React.Suspense fallback={null}>
            <RouteComponent />
        </React.Suspense>
    );
}

// 根组件
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        isError: false,
    };
    componentDidMount() {
        this.setState({
            scrollDom: ReactDOM.findDOMNode(this)
        });
    }
    componentWillUnmount() { }
    // 当suspense组件加载组件出错时通过此静态方法
    static getDerivedStateFromError(error) {
        return { isError: true };
    }

    render() {
        // if (this.state.isError) {
        //     return (<NotFound />);
        // }
        return (
            <div className="app">
                {/* <header>头部</header> */}
                <MyRoutes />
                {/* <footer>尾部</footer> */}
                <ToTop scrollDom={this.state.scrollDom} />
            </div>
        );
    }
}

export default App;
