import React from 'react'
import { List } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'
import TrackContext from 'global/player/TrackContext'

export default class TracksList extends React.PureComponent {
  render () {
    const { tracks, artistName, topTrackCount } = this.props

    const trackData = track => {
      track.artist = { name: artistName }

      const trackProps = { track, topTrackCount, key: uuid() }

      return <TrackContext {...trackProps} />
    }
    const tracksData = tracks.map(trackData)

    return <List selection content={tracksData} />
  }
}
