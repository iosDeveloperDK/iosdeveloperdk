import React, { Component } from 'react'
import { calculateCurrentValue, calculateTotalValue } from '../../utils'
import { MdPlayArrow } from 'react-icons/md'
import { MdPause } from 'react-icons/md'
import './index.scss'

export class AudioPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = { isPlay: false, isLoad: false }
  }

  initProgressBar = () => {
    const player = this.refs.player

    if (player) {
      const length = player.duration
      const current_time = player.currentTime
      const totalLength = calculateTotalValue(length)

      this.refs.endTime.innerHTML = totalLength
      this.refs.startTime.innerHTML = calculateCurrentValue(current_time)

      var progressbar = this.refs.progress
      progressbar.value = player.currentTime / player.duration
      progressbar.addEventListener('click', this)

      if (player.currentTime === player.duration) {
        this.setState({ isPlay: false })
      }
    }
  }

  handleEvent(event) {
    const player = this.refs.player
    const progressbar = this.refs.progress
    const percent = event.offsetX / progressbar.offsetWidth
    player.currentTime = percent * player.duration
    progressbar.value = percent
  }

  play = () => {
    this.refs.player.play()
    this.setState({ isPlay: true })
  }

  pause = () => {
    this.refs.player.pause()
    this.setState({ isPlay: false })
  }

  render() {
    const { isPlay, isLoad } = this.state
    const { src } = this.props

    return (
      <div>
        {isLoad ? (
          <div className="player">
            <div className="player-controls">
              <div
                className="playback-button"
                onClick={() => {
                  if (isPlay) {
                    this.pause()
                  } else {
                    this.play()
                  }
                }}
              >
                {isPlay ? (
                  <MdPause className="play-btn" />
                ) : (
                  <MdPlayArrow className="play-btn" />
                )}
              </div>
              <progress
                className="seek"
                ref="progress"
                value="0"
                max="1"
              ></progress>
            </div>
            <div className="player-time">
              <small
                ref="startTime"
                className="start-time"
                style={{ float: 'left', position: 'relative', left: '20px' }}
              ></small>
              <small
                ref="endTime"
                className="end-time"
                style={{
                  float: 'right',
                  position: 'relative',
                  right: '20px'
                }}
              ></small>
            </div>
          </div>
        ) : (
          <span>Loading....</span>
        )}

        <audio
          onLoadedMetadata={() => {
            this.setState({ isLoad: true })
          }}
          onTimeUpdate={() => this.initProgressBar()}
          onCanPlay={() => {
            this.initProgressBar()
          }}
          className="player"
          ref="player"
          style={{ opacity: 0 }}
        >
          <source src={src} type="audio/mpeg" />
        </audio>
      </div>
    )
  }
}

export default AudioPlayer
