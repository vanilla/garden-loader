import React, {PropTypes} from "react";

export {PropTypes};

export default class SubComponent extends React.Component {
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

SubComponent.defaultProps = {
    title: 'Sub ',
};

SubComponent.propTypes = {
    title: PropTypes.string,
};
