import React from 'react'
import { Segment, Pagination, Divider } from 'semantic-ui-react'
import axios from 'axios'
import ErrorData from 'partials/ErrorData'
import LoaderDimmer from 'partials/LoaderDimmer'
import Table from './show/similar/Table'
import 'styles/artists/similar/Show.sass'

export default class Similar extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { loading: false, currentPage: 1 }
  }

  componentDidMount () {
    this._isMounted = true
    this.request = axios.CancelToken.source()

    this.setNavSections(this.params().artistName)
    this.getData()
  }

  componentDidUpdate (prevProps, prevState) {
    this.handleArtistChange(prevProps)
  }

  componentWillUnmount () {
    this._isMounted = false
    this.request.cancel()
  }

  params = () => this.props.match.params

  handleArtistChange (prevProps) {
    const { artistName } = this.params()

    const prevArtistName = prevProps.match.params.artistName
    const artistChanged = artistName !== prevArtistName

    if (artistChanged) {
      this.setNavSections(artistName)
      this.setState({ similar: null })
      this.getData()
    }
  }

  setNavSections (artistName) {
    const artistNameEncoded = encodeURIComponent(artistName)
    const artistPageLink = `#/artists/${artistNameEncoded}`
    const navSections = [
      { content: 'Artists' },
      { content: artistName, href: artistPageLink },
      { content: 'Similar', active: true }
    ]

    this.props.setNavSections(navSections)
  }

  getData = page => {
    const switchLoader = loading => {
      this._isMounted && this.setState({ ...{ loading } })
    }

    switchLoader(true)

    const url = `/lastfm/artists/${this.params().artistName}/similar`
    const params = { ...{ page } }
    const cancelToken = this.request.token
    const extra = { ...{ params, cancelToken } }

    const handleSuccess = resp => {
      const { artist } = resp.data
      const { similar } = artist

      const artistName = artist.name
      const totalPages = artist.total_pages
      const error = null

      this.setState({ ...{ similar, totalPages, error } })

      this.setNavSections(artistName)
    }

    const handleError = error => {
      const similar = null

      !axios.isCancel(error) && this.setState({ ...{ error, similar } })
    }

    const handleFinish = () => {
      window.scrollTo(0, 0)

      switchLoader(false)
    }

    axios
      .get(url, extra)
      .then(handleSuccess)
      .catch(handleError)
      .then(handleFinish)
  }

  similarTable () {
    const { similar, loading } = this.state

    const similarTableData = <Table {...{ similar }} />

    return (
      <Segment className="artistPageSegment" {...{ loading }}>
        {similarTableData}

        <Divider />

        {this.pagination()}
      </Segment>
    )
  }

  pagination () {
    const { totalPages, loading } = this.state

    const handlePageChange = (_, { activePage }) => {
      this.setState({ currentPage: activePage })
      this.getData(activePage)
    }

    const paginationProps = {
      totalPages: totalPages,
      onPageChange: handlePageChange,
      firstItem: null,
      lastItem: null,
      siblingRange: 0,
      disabled: loading
    }

    return (
      <div className="artistPagePaginationWrap">
        <Pagination {...paginationProps} />
      </div>
    )
  }

  render () {
    const { loading, similar, error } = this.state

    const similarData = similar && this.similarTable()

    const errorData = error && <ErrorData {...{ error }} />

    const loaderData = loading && <LoaderDimmer />

    const contentData = similarData || errorData || loaderData

    return <React.Fragment>{contentData}</React.Fragment>
  }
}