import React, { Component } from 'react';
import {Link} from 'react-router';

export default class Track extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            "title": "Killing In The Name Of",
            "artist": "Rage Against The Machine",
            "year": 1992,
            "difficulty": 3
        };
    }

    render()
    {
        return (
            <div className="trackelement">
                <div className="trackelement__left">
                    <p className="tracktitle">{this.state.title}</p>
                    <p className="trackartist">{this.state.artist}</p>
                    <div className="trackdetails">
                        <p className="trackyear">{this.state.year} &mdash; </p>
                        <p className="trackdifficulty">&#9733;&#9733;&#9733;</p>
                    </div>
                </div>
                <div className="trackelement__right">
                    <Link to="/app"><div className="repeat"><p>REPEAT</p></div></Link>
                    <a href="#"><div className="live"><p>LIVE</p></div></a>
                </div>
            </div>
        );
    }
}
