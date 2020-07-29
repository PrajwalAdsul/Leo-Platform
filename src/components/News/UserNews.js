import React from "react"
import Logout from '../User/Logout';
import { Link } from "react-router-dom";
import "./News.scss"

export default class UserNews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: {
                'article': {
                    "color": "FEC006",
                    "title": "Snow in Turkey Brings Travel Woes",
                    "thumbnail": "",
                    "category": "Arson",
                    "excerpt": "Heavy snowstorm in Turkey creates havoc as hundreds of villages left without power",
                    "date": new Date()
                },
                'article-1': {
                    "color": "2196F3",
                    "title": "Landslide Leaving Thousands Homeless",
                    "thumbnail": "",
                    "category": "Riot",
                    "excerpt": "An aburt landslide in the Silcon Valley has left thousands homeless and on the streets.",
                    "date": new Date()
                },
                'article-2': {
                    "color": "FE5621",
                    "title": "Hail the size of baseballs in New York",
                    "thumbnail": "",
                    "category": "Holding hostage",
                    "excerpt": "A rare and unexpected event occurred today as hail the size of snowball hits New York citizens.",
                    "date": new Date()
                },
                'article-3': {
                    "color": "673AB7",
                    "title": "Earthquake destorying San Fransisco",
                    "thumbnail": "",
                    "category": "Rape",
                    "excerpt": "",
                    "date": new Date()
                }
            }
        }
        this.renderArticle = this.renderArticle.bind(this);
    };

    renderArticle(key) {
        return (
            <div className="column">
                <Article key={key} index={key} details={this.state.articles[key]} />
            </div>
        )
    };

    render() {
        console.log(this.state);
        return (
            <div>
                <nav className='navbar navbar-expand-lg navbar-light header navbar-border'>
                    <a className="navbar-brand" href="#">
                        <img className="logo" src = {require('../Logo1.png')} />
                    </a>
                    <h1 className="navbar-text"><b>LEO PLATFORM</b></h1>
                    <div className="nav navbar-nav ml-auto">
                        <Link to="/UserNews" className='nav-item nav-link is-active'>NEWS</Link>
                        <Logout/>
                    </div>
    
                </nav>
                <div className="container">
                    {Object.keys(this.state.articles).map(this.renderArticle)}
                </div>
            </div>
        )
    };
}

class Article extends React.Component {
    render() {
        var details = this.props.details,
            styles = {
                backgroundColor: '#' + details.color
            };

        return (
            <article className="article">
                <h4 className="article__category" style={styles}>{details.category}</h4>
                <h3 className="article__title">{details.title}</h3>
                <h4 className="article__excerpt">{details.excerpt}</h4>
                <h4 className="article__date">{details.date.toString()}</h4>
            </article>
        )
    }
}