import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

class Search extends Component {

    state = {
        links: [],
        filter: '',
        loading: false,
        searchText: 'Try searching url or description'
    }

    render() {
        return (
            <div>
                <form onSubmit={e=>e.preventDefault()}>
                    Search
                    <input
                        type='text'
                        onChange={e => this.setState({ filter: e.target.value })}
                    />
                    <button type="submit" onClick={() => this._executeSearch()}>OK</button>
                </form>
                {this.state.loading ?
                    <div>.....loading</div> :
                    // this.state.links.length === 0 ?
                    <React.Fragment>
                        <div>{this.state.searchText}</div>
                        {this.state.links.map((link, index) => (
                            <Link key={link.id} link={link} index={index} />
                        ))}
                    </React.Fragment>
                    }
            </div>
        )
    }

    _executeSearch = async () => {
        this.setState({ loading: true })
        const { filter } = this.state
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter },
        })
        const links = result.data.feed.links
        links.length === 0 ? this.setState({ searchText: 'Oops!! Couldn\'t find that. Please try another search.' })
            : this.setState({ searchText: '' })
        this.setState({ links, loading: false })
    }
}

export default withApollo(Search)