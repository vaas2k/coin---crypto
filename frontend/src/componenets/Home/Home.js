import './Home.css';

import { news_details } from '../../api/external';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    useEffect(() => {
        (async function getNews() {

            const responce = await news_details();

            setNews(responce);
        })();

        setNews([]);
    }, [])

    const handleCardClick = (url) => {
        window.open(url,"_blank");
    }

    return (
        <div className='contain-news'>
            {
                news.map((item => {
                    return (
                        <div className='have-news' key={item.title} onClick={ ()=> {handleCardClick(item.url)}} >
                            <img src={item.urlToImage} className='img-news' />
                            <div className='have-news-info'>
                                <h5><small>{item.date}</small></h5> 
                                <h1>{item.title}</h1>
                                <p>{item.content.slice(0,60)}</p>
                            </div>
                        </div>
                    )
                }))
            }
        </div>
    );
}


export default Home