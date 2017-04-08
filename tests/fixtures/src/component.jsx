import React, {PropTypes} from "react";

export {PropTypes};

export default class Component extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],
            hasMoreItems: true,
            nextHref: null
        };
    }

    render() {
        return <div>{this.props.title}</div>
    }
}

Component.defaultProps = {
    title: 'Vanilla',
};

Component.propTypes = {
    title: PropTypes.string,
};
