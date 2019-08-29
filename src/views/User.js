import React from 'react'
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import MoviesSlider from '../components/MoviesSlider'
import { ReactComponent as VerifiedIcon } from '../svg/verified.svg'

const heartbeat = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.2 },
  { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 }
]

const recents = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
]

class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.username,
      user: {}
    }
  }

  componentWillMount() {
    axios.get(`http://${config.hostname}:${config.port}/user/${this.state.username}`)
      .then(res => {
        if (res.data.success) {
          this.setState({user: res.data.user[0]});
        }
      });
  }

  copyProfileURL = () => {
    const { user } = this.state;
    const { language } = this.props;
    const profileURL = document.createElement('textarea');
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = translations[language].user.tooltip.copied;
    profileURL.value = `${window.location.origin}/user/${user.username}`;
    profileURL.setAttribute('readonly', '');
    profileURL.style = {display: 'none', position: 'absolute', left: '-9999px'};
    document.body.appendChild(profileURL);
    profileURL.select();
    document.execCommand('copy');
    document.body.removeChild(profileURL);
  }

  resetTooltip = () => {
    const { language } = this.props;
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = translations[language].user.tooltip.copy;
  }

  render() {
    
    const { user } = this.state;
    const { language } = this.props;

    return (
      <div className="text-center">
        {
          user ? (
            <div>
              <div style={{backgroundImage: user.cover, paddingTop: 40, paddingBottom: 50, marginTop: -20}}>
                <div className="profile-avatar center">
                  <img src={user.avatar} alt={`Avatar ${user.username}`} />
                </div>
                <div style={{marginTop: 20}}>
                  <div>{user.firstname} {user.lastname}</div>
                  <div className="tooltip">
                    <div className="username" onClick={() => this.copyProfileURL()} onMouseLeave={() => this.resetTooltip()}>@{user.username} {user.verified ? <div className="verified" style={{marginBottom: 2}}><VerifiedIcon width="15" height="15" /></div> : null}</div>
                    <span className="tooltip-text">{translations[language].user.tooltip.copy}</span>
                  </div>
                </div>
              </div>
              <h2>{translations[language].user.list.heartbeat}</h2>
              <MoviesSlider number={1} movies={heartbeat} language={language} />
              <h2>{translations[language].user.list.recents}</h2>
              <MoviesSlider number={2} movies={recents} language={language} />
            </div>
          ) : (
            <h2>{translations[language].user.notFound}</h2>
          )
        }
      </div>
    );
  }
}

export default User;
