import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  reRenderApi = () => {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updateData = data.projects.map(eachPack => ({
        id: eachPack.id,
        name: eachPack.name,
        imageUrl: eachPack.image_url,
      }))
      // console.log(updateData)
      this.setState({
        projectsList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getCategory = event => {
    this.setState(
      {
        activeCategory: event.target.value,
      },
      () => this.getProjects(),
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.reRenderApi} type="button">
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state
    return (
      <ul>
        {projectsList.map(eachProject => (
          <li key={eachProject.id}>
            <img
              className="image"
              src={eachProject.imageUrl}
              alt={eachProject.name}
            />
            <p className="heading">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state
    return (
      <div>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="app-container">
          <select
            value={activeCategory}
            onChange={this.getCategory}
            className="input-bar"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>

          {this.renderProjects()}
        </div>
      </div>
    )
  }
}
export default Home
