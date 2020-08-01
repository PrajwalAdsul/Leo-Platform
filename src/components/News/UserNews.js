import React from "react"
import axios from 'axios';
import "./News.scss"


/*
 * Class to showcase news to users
 */
export default class DRONews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],           
            alist : null
        }
    };
    componentDidMount() {
       
        axios.get('https://leomine-backend.herokuapp.com/all_news')
            .then(response => {
                this.setState({
                    alist : response.data,
                });
                let ll = []   
                for(var i = 0; i < this.state.alist.length; i++){
                    // console.log(this.state.alist[i]);
                    let y = this.state.alist[i];
                    let a = {
                            "headline" : y.headline,
                            "city" : y.city,
                            "crime" : y.crime,
                            "url" : y.url,
                            "date" : y.date
                        }
                    
                    ll.push(a);
                }
                this.setState({
                    articles : ll
                });
            })
            .catch(function(error) {
                console.log(error);
            })
    }
     articles_fun() {
        return this.state.articles.map(
            function(data, i) {
                return <Article details = {data} key={i} />;
            }
        )
    }

    render() {
        console.log(this.state);
        return (
            <div className="app">
                <div className="container">
                      {this.articles_fun()}
                </div>
            </div>
        )
    };
}

class Article extends React.Component {
    render() {
        var details = this.props.details,
            styles = {
                backgroundColor: '#000000'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
            };

        return (
            <div className="container">
                <article className="article">
                    <h4 className="article__category" style={styles}>{details.crime}</h4>
                    <h4 className="article__category" style={styles}>{details.city}</h4>
                    <h3 className="article__title">{details.headline}</h3>
                    <a href={details.url} target = "_blank"><h4 className="article_url">{details.url}</h4></a>
                    <h4 className="article__date">{details.date.toString()}</h4>
                </article>
            </div>
        )
    }
}