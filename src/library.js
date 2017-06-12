import React from 'react'
import PropTypes from 'prop-types'

export default class Table extends React.Component {

    // Lifecycle Methods

    static propTypes = {
        columns: PropTypes.arrayOf(PropTypes.object).isRequired,
        rows: PropTypes.array.isRequired,
        onRowChange: PropTypes.func,
        changeTrigger: PropTypes.oneOf(['focus', 'rowFocus']),
        className: PropTypes.string
    }

    state = {
        // Column format: {name: '', field: '', isFilterable: True, isSortable: True, background: '#FFFFF', editable: 'text/dropdown'}
        meta: this.props.columns,
        data: this.props.rows
    }

    constructor(p) {
        super(p)
    }

    componentWillReceiveProps = () => {}

    componentDidMount = () => {}

    componentWillUnmount = () => {}


    // Data manipulation


    render() {
        return (
            <table className={this.props.className}>
                <TabularDataHeader />
                {/*<TabularDataBody />*/}
            </table>
        )
    }


}

class TabularDataHeader extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    render = () => {
        return (
            <thead>

            </thead>
        )
    }
}

class TabularDataBody extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    render = () => {
        return (
            <tbody>

            </tbody>
        )
    }
}

class TabularDataRow extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    render = () => {
        return (
            <tr>

            </tr>
        )
    }

}

class TabularDataCell extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    render = () => {
        return (
            <td>

            </td>
        )
    }

}

