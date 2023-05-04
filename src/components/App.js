import React from 'react';
import '../index.css';
import Header from "./Header.js"
import Main from "./Main.js"
import Footer from "./Footer.js"
import PopupWithForm from "./PopupWithForm.js"
import ImagePopup from "./ImagePopup.js"
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({link: '', name: ''});

  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  
  React.useEffect(() => {
    api.getUserInfo() 
      .then((userData) => {
      setCurrentUser(userData);
    })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
    
    api.getInitialCards() 
      .then((cards) => {
        setCards(cards)
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
  }, [])

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setSelectedCard({link: '', name: ''});
  }

  function handleUpdateUser(user) {
    api.editUserInfo(user)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
  }

  function handleUpdateAvatar(avatar) {
    api.editAvatar(avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
  }

  function handleAddPlaceSubmit(newCard) {
    api.addNewCards(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((prevState) => prevState.filter((c) => c._id !== card._id))
      })
        .catch((error) => {
          console.log(`Ошибка: ${error}`);
        })
  }

  return (
    <CurrentUserContext.Provider value = { currentUser }>
      <div className="page">
        <Header/>
        <Main 
          onEditProfile={ handleEditProfileClick }
          onEditAvatar={ handleEditAvatarClick }
          onAddPlace={ handleAddPlaceClick }
          onCardClick={ handleCardClick }
          onCardLike={ handleCardLike }
          onCardDelete={ handleCardDelete }
          cards={ cards }
        />
        <Footer/>
        <EditProfilePopup
          isOpen={ isEditProfilePopupOpen } 
          onClose={ closeAllPopups }
          onUpdateUser={ handleUpdateUser }
        />

        <AddPlacePopup
          isOpen={ isAddPlacePopupOpen } 
          onClose={ closeAllPopups }
          onAddPlace={ handleAddPlaceSubmit } 
        />

        <EditAvatarPopup
          isOpen={ isEditAvatarPopupOpen } 
          onClose={ closeAllPopups }
          onUpdateAvatar={ handleUpdateAvatar } 
        />

        <PopupWithForm
          popupName="delete-card"
          titleName="delete-card"
          title="Вы уверены?"
          formName="deleteCardForm"
          button="delete-card"
          buttonText="Да"
        />

        <ImagePopup
          card={ selectedCard }
          onClose={ closeAllPopups }
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;