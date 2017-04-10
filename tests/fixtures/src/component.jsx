import React from "react";
import SubComponent from "./sub-component";

export {React};

export default class Component extends React.Component {
    render() {
        return <div><SubComponent/></div>
    }
}
