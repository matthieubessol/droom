import React, { Component } from 'react';

var data = {
  "tracks": [
    {
      "id":0,
      "name": "Ways (noisiv cover)",
      "artist": "Triathalon",
      "year": "2016",
      "difficulty":3,
      "bpm":98
    },
    {
      "id":1,
      "name": "Killing in the name of",
      "artist": "Rage against the machine",
      "year": "1992",
      "difficulty":2,
      "bpm":150

    },
    {
      "id":2,
      "name": "Sprite",
      "artist": "Droom Team",
      "year": "2017",
      "difficulty":2,
      "bpm":150

    },
    {
      "id":3,
      "name": "We Bros",
      "artist": "Atomic Boom",
      "year": "2013",
      "difficulty":2,
      "bpm":150

    }
  ],

  "users":[
    {
      "username":"test",
      "password":"password"
    },
    {
      "username":"droomy",
      "password":"droomyp"
    }
  ],

  "practice":[
    {
      "id":0,
      "name": "Sprite",
      "difficulty":1,
      "bpm":150,
      "nbNotes":5,

    },
    {
      "id":1,
      "name": "We Bros",
      "difficulty":2,
      "bpm":150,
      "nbNotes":6,
    },
    {
      "id":2,
      "name": "We Bros",
      "difficulty":3,
      "bpm":150,
      "nbNotes":7,
    }
  ]
}

export default class GameHandler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id:null,
    };
  }
  sendMusicId(id) {
    this.setState({
      id:id
    })
  }

  render() {
    return(
      <div className="game">
        {React.cloneElement(this.props.children, {
          sendMusicId:this.sendMusicId.bind(this),
          data:data,
          id:this.state.id
        })}
      </div>
    )
  }
}
