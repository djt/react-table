import React from 'react'
import PropTypes from 'prop-types'

export default class InputDigit extends React.Component {

    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        quantity: PropTypes.number,
        className: PropTypes.string,

        onChange: PropTypes.func.isRequired
    }

    state = {
        quantity: this.props.quantity || 0
    }

    constructor(p) {
        super(p)
    }

    componentWillReceiveProps = () => { }

    componentDidMount = () => { }

    componentWillUnmount = () => { }

    render() {
        return (
            <div className={'mnml-input-digit-container ' + this.props.className}>
                <i className='fa fa-minus decrease' />
                <span>{this.state.quantity}</span>
                <i className='fa fa-plus increase' />
            </div>
        )
    }
}