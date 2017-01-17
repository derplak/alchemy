import React, { Component } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DropTarget } from 'react-dnd'
import Octicon from './Octicon'

import convert from '../api'

const fileTarget = {
  drop(props, monitor, component) {
    const { files } = monitor.getItem()
    const filtered = files.filter(file => file.type.includes('image'))

    if (filtered.length) {
      const [ref] = filtered
      const outputPath = ref.path.slice(0, ref.path.length - ref.name.length)

      component.setState({
        status: 'CONVERTING'
      })
      console.log('Converting...')
      convert({
        files: filtered.map(f => f.path),
        outputPath
      }, () => {
        console.log('Done.')
        component.setState({
          status: 'DONE'
        })
        setTimeout(() => {
          component.setState({
            status: 'IDLE'
          })
        }, 2000)
      })
    } else {
      component.setState({
        status: 'IDLE'
      })
    }
  }
}

const color = 'rgba(130, 221, 240, 1)'

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '16px 32px',
  padding: '16px 16px',
  width: 'calc(100% - 64px)',
  height: `calc(${100 / 1}% - 32px)`,
  backgroundColor: '#fefeff',
  border: `5px dotted ${color}`, // rgb(209, 75, 75)',
  borderRadius: '8px'
}

class Sanitizer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: 'IDLE'
    }
    this.iconObject = this.iconObject.bind(this)
  }

  iconObject() {
    const { isOver } = this.props
    switch (this.state.status) {
      case 'DONE': return (
        <Octicon
          style={{
            fill: 'rgb(132, 255, 144)'
          }}
          type="checklist"
          width={100}
        />
      )
      case 'CONVERTING': return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Octicon
            style={{
              fill: 'rgb(0, 0, 0)'
            }}
            type="file-media"
            width={40}
          />
          <div className="DNA_cont">
            <div className="nucleobase" />
            <div className="nucleobase" />
            <div className="nucleobase" />
            <div className="nucleobase" />
            <div className="nucleobase" />
            <div className="nucleobase" />
            <div className="nucleobase" />
            <div className="nucleobase" />
          </div>
          <Octicon
            style={{
              fill: 'rgb(0, 0, 0)'
            }}
            type="file-pdf"
            width={40}
          />
        </div>
      )
      default: return (
        <Octicon
          style={(isOver) ? {
            fill: color
          } : {
            fill: 'rgba(0,0,0,0.25)'
          }}
          type="diff"
          width={100}
        />
      )
    }
  }

  render() {
    const { connectDropTarget, isOver } = this.props
    return connectDropTarget(
      <div
        style={
          Object.assign({}, style, (isOver && this.state.status !== 'CONVERTING') ? {
            borderColor: 'rgba(130, 221, 240, 1)'
          } : {
            borderColor: 'rgba(130, 221, 240, 0.25)'
          })
        }
      >
        {
          this.iconObject(isOver)
        }
      </div>
    )
  }
}

// {!isOver && !canDrop && <div dangerouslySetInnerHTML={{ __html: octicons['file-pdf'].toSVG({ width: 100 }) }} />}
// {!isOver && canDrop && <div dangerouslySetInnerHTML={{ __html: octicons['file-pdf'].toSVG({ width: 100 }) }} />}
// {isOver && <div dangerouslySetInnerHTML={{ __html: octicons['file-pdf'].toSVG({ width: 100 }) }} />}

export default DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
  item: monitor.getItem()
}))(Sanitizer)
