# MTG Social
* [Deployed MTG Social](https://socialist-loonie-29332.herokuapp.com/)
* 
## Project

* This is a project utilizing MERN stack technology,
* Full Stack Discussion app for Magic the Gathering Players.
* Post game requests, deck questions, card discussion and more.

![Home](https://github.com/rjhelm/mtg-social/blob/main/assets/homepage.PNG?raw=true)
![Login](https://github.com/rjhelm/mtg-social/blob/main/assets/login.PNG?raw=true)
![Dark Mode](https://github.com/rjhelm/mtg-social/blob/main/assets/dark-mode.PNG?raw=true)
![Logged In](https://github.com/rjhelm/mtg-social/blob/main/assets/logged-in.PNG?raw=true)

## Table of contents

> * [mtg-social](#mtg-social)
>   * [Project](#project)
>   * [Table of contents](#table-of-contents)
>   * [About](#about)
>     * [Features](#features)
>     * [Content](#content)
>     * [Deploy (how to install build product)](#deploy-how-to-install-build-product)
>   * [Resources (Documentation and other links)](#resources-documentation-and-other-links)
>   * [Contributing / Reporting issues](#contributing--reporting-issues)
>   * [License](#license)

### About

Project created after seeing several programs and sites creating a paywall to use the resources for finding games with active players. I wanted to create an open discussion application that would allow users to find games with other players, discuss the decks, cards, and sites they use to play.

Looking at other websites and how they structured the databse, user authentication, and what I should include gave me the inspiration for alot of the features I implemented in this project. A big part of finding a game with other players is making sure that everyone is playing within a specific power level so it is fun for everyone involved. Channels were what I looked at first but decided on specific tags for power level so users didn't have to join specific channels but instead could search for tags at the power level they wanted to play. 

### Features

The website gives users the ability to create posts, they are able to tag the posts with what they are posting about. This allows other users to find games, discussions, questions, and once in the post comment from there. 
This requires user authentication for login, signup, etc. 
Search functions are implemented to so you can be as broad or specific as needed to find what posts you want to see at the time.
More features to come for sure as I would love to expand on this in so many ways. 

### Content

* MERN Stack
* MongoDB with mongoose
* GraphQL typeDefs and Resolvers
* React Front End
* Express Server wih Apollo for GraphQL
* Material UI for icons and styles
* JWT for authencticating users
* bcrpyt for password hashing
* .env to store sensitive data
* faker used to seed fake data in development
* heroku for deployment

### Build

    npm run build

### Deploy (how to install build product)

git push heroku (master/main)

* This will run the deployment to heroku by setting up a node engine for the backend before cd into client for the React front end.

## Resources (Documentation and other links)

see github repository [rjhelm](https://github.com/rjhelm/mtg-social)

## Contributing / Reporting issues

* [Link to project issues](https://github.com/rjhelm/mtg-social/issues)

## License

Open Source
