import React from 'react'
import { Segment, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios'
import ErrorData from 'partials/ErrorData'
import LeftColumn from './columns/Left'
import RightColumn from './columns/Right'
import 'styles/artists/albums/Show.sass'

export default class Show extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  componentDidMount () {
    this._isMounted = true
    this.request = axios.CancelToken.source()

    const { artistName, albumTitle } = this.params()

    this.setNavSections(artistName, albumTitle)
    this.getInfo()
  }

  componentDidUpdate (prevProps, prevState) {
    const { artistName, albumTitle } = this.params()

    const prevParams = prevProps.match.params

    const artistNameChanged = artistName !== prevParams.artistName
    const albumTitleChanged = albumTitle !== prevParams.albumTitle
    const albumChanged = artistNameChanged || albumTitleChanged

    if (albumChanged) {
      this.setNavSections(artistName, albumTitle)
      this.getInfo()
    }
  }

  componentWillUnmount () {
    this._isMounted = false
    this.request.cancel()
  }

  params = () => this.props.match.params

  getInfo () {
    const switchLoader = loading => {
      this._isMounted && this.setState({ ...{ loading } })
    }

    switchLoader(true)

    const { artistName, albumTitle } = this.params()

    const url = `/lastfm/artists/${artistName}/albums/${albumTitle}`
    const cancelToken = this.request.token
    const extra = { ...{ cancelToken } }

    const handleSuccess = resp => {
      const { album } = resp.data

      this.setState({ ...{ album } })
      this.setNavSections(album.artist, album.title)
    }

    const handleError = error => {
      !axios.isCancel(error) && this.setState({ ...{ error } })
    }

    const handleFinish = () => switchLoader(false)

    axios
      .get(url, extra)
      .then(handleSuccess)
      .catch(handleError)
      .then(handleFinish)
  }

  setNavSections (artistName, albumTitle) {
    const artistNameEncoded = encodeURIComponent(artistName)

    const artistPageLink = `#/artists/${artistNameEncoded}`
    const albumsPageLink = `#/artists/${artistNameEncoded}/albums`

    const navSections = [
      { content: 'Artists' },
      { content: artistName, href: artistPageLink },
      { content: 'Albums', href: albumsPageLink },
      { content: albumTitle, active: true }
    ]

    this.props.setNavSections(navSections)
  }

  albumData () {
    const { album } = this.state

    return (
      <Segment className="albumPage">
        <LeftColumn {...{ album }} />
        <RightColumn {...{ album }} />
      </Segment>
    )
  }

  render () {
    const { loading, album, error } = this.state

    const loaderData = loading && (
      <Dimmer active inverted className="fixed" content={<Loader inverted />} />
    )

    const albumData = album && this.albumData()

    const errorData = error && <ErrorData {...{ error }} />

    const content = loaderData || albumData || errorData

    return <React.Fragment>{content}</React.Fragment>
  }
}
