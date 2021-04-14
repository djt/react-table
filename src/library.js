import React from 'react'
import PropTypes from 'prop-types'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import update from 'immutability-helper'

export default class Table extends React.Component {

    // Lifecycle Methods

    static propTypes = {
        columns: PropTypes.arrayOf(PropTypes.object), //.isRequired,
        rows: PropTypes.array.isRequired,
        onRowChange: PropTypes.func,
        onSubmit: PropTypes.func,
        className: PropTypes.string,
        excelExport: PropTypes.any,
        collapsed: PropTypes.any,
        isFilterable: PropTypes.bool,
        isMassEditable: PropTypes.bool,
        updateOnBlur: PropTypes.bool,
        primary: PropTypes.string
    }

    state = {
        // Column format: {name: '', field: '', isFilterable: True, isSortable: True, background: '#FFFFF', editable: 'text/dropdown'}
        columns: this.props.columns,
        rows: this.props.rows,
        sortColumn: null,
        collapsed: this.props.collapsed || false,
        selected: 0,
        primary: this.props.primary
    }

    constructor(p) {
        super(p)
    }

    componentWillReceiveProps = (p) => {
        let columns = p.columns
        if (!columns && p.rows) columns = Object.keys(p.rows[0]).map(c => ({ name: c, field: c }))
        let pk = p.primary || columns.find(c => c.isPrimary)
        this.setState({
            columns: columns,
            rows: p.rows,
            primaryKey: pk ? pk.field || pk : null,
        })
    }

    sort = (field, e) => {
        e.preventDefault()
        let rows = this.state.rows;
        if (field == this.state.sortColumn) { // Sorting on currently sorted column
            rows = rows.reverse()
        } else if (field instanceof Array) { // Sorting on deeply nested column
            rows = rows.sort((a, b) => {
                let av = field.reduce((p, c) => p[c], a)
                let bv = field.reduce((p, c) => p[c], b)
                return av > bv ? 1 : bv > av ? -1 : 0
            })
        } else { // Sorting on normal column
            rows = rows.sort((a, b) => {
                return (a[field] && a[field] instanceof String && a[field].replace(/-/g, '') || a[field]) > (b[field] && b[field] instanceof String && b[field].replace(/-/g, '') || b[field]) ? 1 : (b[field] && b[field] instanceof String && b[field].replace(/-/g, '') || b[field]) > (a[field] && a[field] instanceof String && a[field].replace(/-/g, '') || a[field]) ? -1 : 0
            })
        }
        this.setState({ rows: rows, sortColumn: field })
        e.preventDefault()
    }

    change = (index, row) => {
        let rows = this.state.rows
        let sel = this.state.selected
        console.log('Changing index', index)
        rows[index] = Object.assign(rows[index], row)
        rows[index]['delta'] = Object.assign({}, rows[index]['delta'], row)
        if (rows[index]['delta'].selected) delete rows[index]['delta']['selected']
        if (row.selected !== undefined) {
            sel += row.selected ? 1 : -1
        }
        let x = Date.now()
        this.setState({ rows: update(this.state.rows, {index: {$set: rows[index]}}), selected: sel }, () => console.log('Updated index', (Date.now() - x) / 1000))
        console.log('Edited Row', index, rows[index])
        // if (this.props.onRowChange) this.props.onRowChange(row)
    }

    onRowUpdate = (r) => {
        if (!r.delta || !this.props.onRowUpdate) return
        this.props.onRowUpdate(r)
    }

    static _s2ab = s => {
        let view = new Uint8Array(new ArrayBuffer(s.length))
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
        return view
    }


    toExcel = e => {
        let rows = this.state.rows.map(r => this.state.columns.reduce((p, c) => {
            // if (c.excelToRaw) {
            //     p[c.name] = r[c.field]
            // } else
            if (c.ignore) {
                
            } else if (c.field instanceof Array) {
                p[c.name] = c.field.reduce((p, x) => p[x], r)
            } else if (c.field instanceof Function) {
                p[c.name] = c.field(r)
            } else {
                p[c.name] = r[c.field] // (c.formatters || []).reduce((p, x) => x(r, true), r[c.field])
            }
            return p
        }, {}))
        let ws = XLSX.utils.json_to_sheet(rows)
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws)
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' })

        FileSaver.saveAs(new Blob([Table._s2ab(wbout)], { type: "application/octet-stream" }), this.props.excelExport || 'Untitled Report.xlsx')

        e.preventDefault()
    }

    filter = (i, v) => {
        let c = this.state.columns
        c[i].filter = v
        this.setState({ columns: c })
    }

    applyFilters = _ => {
        let f = this.state.columns.filter(c => c.filter)
        if (!f.length) return this.state.rows

        return this.state.rows.filter(r => {
            return f.every(x => {
                return String(r[x.field]).toLowerCase().indexOf(x.filter.toLowerCase()) >= 0
            })
        })
    }

    matchesFilters = r => {
        let f = this.state.columns.filter(c => c.filter)
        return f.length && f.every(x => String(r[x.field]).indexOf(x.filter) >= 0) || true
    }

    applyGlobal = v => {
        this.applyFilters().map((r, i) => (v.selected !== undefined || r.selected) && this.change(i, v))
    }

    render() {
        return (
            <div className='smpl-table'>
                {this.state.rows.length && !this.state.collapsed && this.props.excelExport ? <p className='excel-export'><a href='#' onClick={this.toExcel}>Export to excel</a></p> : null}

                <table className={this.props.className}>

                    {this.state.collapsed ? <thead className='pointer' onClick={e => this.setState({ collapsed: false })}><tr><th>{this.state.collapsed}</th></tr></thead> : null}

                    {!this.state.collapsed ? <TableHeader selected={this.state.selected} applyGlobal={this.applyGlobal} isSelectable={this.props.isMassEditable || this.props.isSelectable} isFilterable={this.props.isFilterable} isMassEditable={this.props.isMassEditable} sort={this.sort} columns={this.state.columns} filter={this.filter} /> : null}

                    {!this.state.collapsed &&
                        <tbody>
                            {this.state.rows && this.applyFilters().map((r, i) =>
                                true ? <TableRow key={`row-${r[this.state.primaryKey] || i}`}
                                    id={r[this.state.primaryKey] || i}
                                    index={i}
                                    columns={this.state.columns}
                                    row={r}
                                    onChange={this.change}
                                    onRowUpdate={this.onRowUpdate}
                                    isSelectable={this.props.isMassEditable || this.props.isSelectable}
                                    selectClass={this.props.rowSelectClass}
                                    hasRowUpdate={!!this.props.onRowUpdate}
                                    updateOnBlur={this.props.updateOnBlur} /> : null)}
                            {!this.state.rows.length && <tr><td className='align-center' colSpan={this.props.columns.length}>No rows could be found</td></tr>}
                        </tbody>}
                    {!this.state.collapsed && <TableFooter />}
                </table>
                {this.props.onSubmit ? <button type='button' disabled={this.state.submitDisabled} onClick={e => this.props.onSubmit(this.state.rows) && this.props.disableOnSubmit && this.setState({ submitDisabled: true })}>{this.props.buttonSubmitText || 'Submit'} {this.props.submitDisabled && <i className='fa fa-spinner fa-spin'></i>}</button> : null}
            </div>
        )
    }


}
class TableHeader extends React.Component {

    state = {
        edits: {}
    }
    constructor(p) {
        super(p)
    }


    _filterTimer = null

    applyFilter = (f, v) => {
        clearTimeout(this._filterTimer)
        this._filterTimer = setTimeout(this.props.filter(f, v), 200)
    }

    queueEdit = (f, v) => {
        let e = this.state.edits
        e[f] = v
        this.setState({ edits: e })
    }

    applyEdits = () => {
        this.props.applyGlobal(this.state.edits)
    }


    render() {
        if (!this.props.columns) return null

        return (
            <thead>
                {this.props.isMassEditable &&
                    <tr className='smpl-table-edit'>
                        {this.props.isSelectable && <td className='align-center'><button className='button-success' disabled={!this.props.selected || Object.keys(this.state.edits).length == 0} type='button' onClick={this.applyEdits}><i className='fa fa-check' /></button></td>}
                        {this.props.columns.map((c, i) => {
                            return <TableChangeCell key={`change-${c.name}`} index={i} {...c} queueEdit={this.queueEdit} />
                        })}
                    </tr>
                }
                <tr>
                    {this.props.isSelectable && <th className='align-center' key={`selected`}><input type='checkbox' defaultValue={false} onChange={e => this.props.applyGlobal({ selected: e.target.checked })} /></th>}
                    {this.props.columns.map((c, i) => {
                        return <TableHeaderCell key={`header-${c.name}`} index={i} {...c} sort={this.props.sort} applyFilter={this.applyFilter} applyGlobal={this.props.applyGlobal} />
                    })}
                </tr>
                {this.props.isFilterable &&
                    <tr className='smpl-table-filter'>
                        {this.props.isSelectable && <td>&nbsp;</td>}
                        {this.props.columns.map((c, i) => {
                            return c.isFilterable == false ? <td style={c.style} key={`filter-${c.field}`}>&nbsp;</td> : <TableFilterCell key={`filter-${c.field}`} index={i} {...c} sort={this.props.sort} applyFilter={this.applyFilter} />
                        })}
                    </tr>
                }
            </thead>
        )
    }
}

class TableHeaderCell extends React.Component {

    state = {
        filter: false
    }

    constructor(p) {
        super(p)
    }

    render() {
        return <th style={this.props.style}>
            {!this.props.name && this.props.checkbox ? <input type='checkbox' defaultValue={false} onChange={e => this.props.applyGlobal({ [this.props.field]: e.target.checked })} /> : null}
            {/*{this.props.isFilterable ? <i className='fa fa-filter pointer margin-right-small' onClick={e => { this.setState({filter: !this.state.filter})} } /> : null }*/}
            {!this.props.checkbox && this.props.isSortable !== false ? <a href='#' onClick={e => this.props.sort(this.props.field, e)}>{this.props.name}</a> : this.props.name}
            {/*{this.props.isFilterable == true ? <div hidden={!this.state.filter}><input className='smpl-filter' type='text' name={this.props.field} onChange={e => this.props.applyFilter(this.props.index, e)} /></div> : null }*/}
        </th>

    }
}

const TableFilterCell = (p) => (
    <td style={p.style}>
        {p.checkbox && <input type='checkbox' name={p.field} onChange={e => p.applyFilter(p.field, e.target.checked)} />}

        {p.choices &&
            <select className='u-full-width' onChange={e => p.applyFilter(p.field, e.target.value)}>
                <option></option>
                {p.choices.map((c, i) => <option key={`change-${p.name}-${i}`} value={c.value}>{c.name}</option>)}
            </select>
        }
        {!p.choices && !p.checkbox && <input className='smpl-filter' type='text' name={p.field} onChange={e => p.applyFilter(p.index, e.target.value)} />}
    </td>
)

const TableChangeCell = (p) => (
    <td style={p.style}>
        {p.checkbox && <input type='checkbox' name={p.field} onChange={e => p.queueEdit(p.field, e.target.checked)} />}
        {p.choices &&
            <select className='u-full-width' onChange={e => p.queueEdit(p.field, e.target.value)}>
                <option></option>
                {p.choices.map((c, i) => <option key={`change-${p.name}-${i}`} value={c.value}>{c.name}</option>)}
            </select>
        }
        {!p.checkbox && !p.choices && p.isEditable && <input type='text' name={p.field} onChange={e => p.queueEdit(p.field, e.target.value)} />}
    </td>
)

class TableRow extends React.Component {

    constructor(p) {
        super(p)
        this.state = p.row || null
    }

    shouldComponentUpdate = (p) => {
        return false;
    }

    componentWillReceiveProps = (p) => {

        if (p.row && p.row.delta && p.index == this.props.index)  {
            this.setState(p.row)
            this.forceUpdate()
        }
    }

    onRowUpdate = e => {

        // if (!this.state._changes) return
        // this.props.onChange(this.props.index, this.state._changes)
        // this.props.onRowUpdate(this.props.row)
    }

    onChange = (column, value) => {
        // let changes = this.state._changes || []
        // value = (column.field.parsers || []).reduce((p, c) => c(p), value)
        // changes[column.field] = value
        // this.setState({ [column.field]: value, _changes: changes })
        this.props.onChange(this.props.index, { [column.field]: value })
    }

    render() {
        if (!this.props.row || !this.props.columns) return null

        return (
            <tr className={this.state.selectedVisual && this.props.selectClass || ''} onClick={e => e.target.nodeName != 'INPUT' && this.setState({ selectedVisual: !!!this.state.selectedVisual })}>
                {this.props.isSelectable && <td className='align-center'><input type='checkbox' checked={this.state.selected} onChange={e => this.props.onChange(this.props.index, { selected: e.target.checked })} /></td>}
                {this.props.columns.map(c => {

                    let v = c.field instanceof Array ? c.field.reduce((p, c) => p[c], this.state) : this.state[c.field]

                    v = (c.formatters || []).reduce((p, x) => x(this.props.row), v)
                    let t = c.alt && c.alt(this.props.row)
                    return (
                        c.isEditable ?
                            (c.choices ?
                                <EditableTableCellDropdown updateOnBlur={this.props.updateOnBlur} key={`${this.props.id}-${c.field}`} id={`${this.props.id}-${c.field}`} column={c} onChange={this.onChange} data={v} /> :
                                c.checkbox ?
                                    <EditableTableCellCheckbox updateOnBlur={this.props.updateOnBlur} key={`${this.props.id}-${c.field}`} id={`${this.props.id}-${c.field}`} column={c} onChange={this.onChange} data={v} /> :
                                    <EditableTableCellText updateOnBlur={this.props.updateOnBlur} key={`${this.props.id}-${c.field}`} id={`${this.props.id}-${c.field}`} column={c} data={v} onChange={this.onChange} title={t} />) :
                            <TableCell updateOnBlur={this.props.updateOnBlur} key={`${this.props.id}-${c.field}`} id={`${this.props.id}-${c.field}`} column={c} data={v} row={this.props.row} title={t} />
                    )
                })}
                {this.props.hasRowUpdate && this.props.row.delta ? <td className='vertical-align-middle' style={{ borderBottom: 0 }}><button type='button' className='button-success margin-bottom-none'>✔</button></td> : null}
            </tr>
        )
    }
}


class TableCell extends React.Component {

    constructor(p) {
        super(p)
    }

    render = () => {
        return (
            <td style={this.props.column.style} title={this.props.title || ''}>
                {this.props.data}
            </td>
        )
    }

}

class EditableTableCellText extends React.Component {

    state = {
        value: this.props.data
    }

    constructor(p) {
        super(p)
    }

    onLocalChange = e => {
        console.log('local change')
        this.setState({value: e.target.value})
    }

    onChange = e => {
        console.log('global change')
        // this.setState({ value: e.target.value })
        this.props.onChange(this.props.column, e.target.value)

    }

    componentWillReceiveProps = p => {
        if (this.props.data != p.data) this.setState({ value: p.data })
    }

    // _changeTimer = null
    // applyChange = (f, v) => {
    //     clearTimeout(this._filterTimer)
    //     this._filterTimer = setTimeout(this.props.filter(f, v), 200)
    // }

    render = () => {
        return (
            <td style={this.props.column.style} title={this.props.title}>
                <input className='u-full-width' type='text' title={this.props.title} value={this.state.value} onChange={this.props.updateOnBlur ? this.onLocalChange : this.onChange} onBlur={this.props.updateOnBlur ? this.onChange : null} />
            </td>
        )
    }
}


class EditableTableCellDropdown extends React.Component {

    state = {
        value: this.props.data
    }

    constructor(p) {
        super(p)
    }

    onLocalChange = e => {
        console.log('local change')
        this.setState({value: e.target.value})
    }

    onChange = e => {
        console.log('global change')
        this.props.onChange(this.props.column, e.target.value)
    }

    componentWillReceiveProps = p => {
        if (this.props.data != p.data) this.setState({ value: p.data })
    }

    render = () => {
        return (
            <td style={this.props.column.style}>
                <select className='u-full-width' value={this.state.value}  onChange={this.props.updateOnBlur ? this.onLocalChange : this.onChange} onBlur={this.props.updateOnBlur ? this.onChange : null}>
                    {this.props.column.choices.map(c => {
                        return <option key={`${this.props.id}-${c.value}`} value={c.value}>{c.name}</option>
                    })}
                </select>
            </td>
        )
    }
}

class EditableTableCellCheckbox extends React.Component {

    state = {
        value: this.props.data
    }

    constructor(p) {
        super(p)
    }

    componentWillReceiveProps = p => {
        if (this.props.data != p.data) this.setState({ value: p.data })
    }

    onLocalChange = e => {
        console.log('local change')
        this.setState({value: e.target.checked})
    }

    onChange = e => {
        console.log('global change')
        this.props.onChange(this.props.column, e.target.checked)
    }

    render = () => {
        return (
            <td style={this.props.column.style}>
                 <input type='checkbox' checked={this.state.value} /*onChange={this.onChange}*/  onChange={this.props.updateOnBlur ? this.onLocalChange : this.onChange} onBlur={this.props.updateOnBlur ? this.onChange : null} />
            </td>
        )
    }
}

class TableFooter extends React.Component {

    constructor(p) {
        super(p)
    }

    render = () => {
        return (
            <tfoot>
                <tr>

                </tr>
            </tfoot>
        )
    }
}

