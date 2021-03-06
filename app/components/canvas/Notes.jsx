import React, { Component } from 'react';
import {Layer, Rect, Stage, Group} from 'react-konva';
import Note from './Note.jsx';
import update from 'react-addons-update';
import MIDI from 'MIDI.js';
import utils from "../../assets/modules/useful.js";

var player, notes = [], times = [], noteValues = [], prevTime= 0, prevCheck=true;
// App component - represents the whole app
export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeToFall:3,
      prevData:null,
      nbItem:0,
      currentNote:0,
      group:this.props.group,
      newp:0,
      notes:[],
      key:null,
      timeOfCollision: utils.pxToTime(utils.bpmToMs(this.props.velocity),75)
    };
  }

  addNewNote(data) {
    if(!data) return;
    let size = 50, padding = 25;
    var time = Date.now();
    times.push(time)
    let note = data.note, isKick=false;
    noteValues.push(note);
    notes.push(<Note
      velocity={this.props.velocity}
      newP={this.state.newp}
      key={time}
      noteIO={this.props.noteIO}
      currentNote={note}
      timeCreation={Date.now()}
      size={size}
      x={0}
      timeToFall={this.state.timeToFall}
      keyCode={this.props.keyCode}
      group={this.state.group}
      isKeyboard={this.props.isKeyboard}
      hasToAnim={true}
      failNote={this.handleDiff.bind(this)}
    />);

    this.setState({
      nbItem:++this.state.nbItem,
      currentNote:data.note
    })
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.isPlaying){
      notes = [];
      times = [];
      noteValues = [];
      prevTime = 0;
      return;
    }
    if(nextProps.data){
      if(!nextProps.shouldAnim){
        if(prevCheck == false && nextProps.shouldCheck == true){
          prevCheck = true;
          return;
        }
        let thisNote = nextProps.data;
        this.addNewNote(thisNote);
        thisNote = null;
        prevCheck = nextProps.shouldCheck;
      }
    }
    this.setState({group:nextProps.group});
    if(nextProps.group && prevTime != nextProps.timeKick){
        prevTime = nextProps.timeKick;
      if(this.props.isKeyboard)
        this.checkKey(nextProps.keyCode);
      else
        this.launchCollisions(nextProps);
    }
  }

  launchCollisions(nextProps) {
    let id = null;
    let tab = 0;
    if(!this.state.group) return;
    for (let i = 0; i < this.state.group.getChildren().length; i++) {
      if(this.state.group.getChildren()[i].getAttr("note") == nextProps.noteIO)
        id = i;
    }
    for (let i = this.refs.notesContainer.getChildren().length - 1; i >= 0; i--) {
        let tab = [nextProps.noteIO,id];
        this.checkCollision(this.refs.notesContainer.getChildren()[i],tab,i);
    }
    this.animKick(id);
  }

  animKick(id) {
    let self = this, time =50;

    if(!this.state.group || id==null)return;
    this.state.group.getChildren()[id].getChildren()[0].to({
      scaleX: 1,
      scaleY: 1,
      duration: 0
    });

    setTimeout(function() {
      if(!self.state.group)return;
      if(!self.state.group.getChildren()[id])return;
      self.state.group.getChildren()[id].getChildren()[0].to({
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 0.1
      });
    }, 5);

    setTimeout(function() {
      if(!self.state.group)return;
      if(!self.state.group.getChildren()[id])return;
      self.state.group.getChildren()[id].getChildren()[0].to({
        scaleX: 1,
        scaleY: 1,
        duration: 0.1
      });
    }, 105);
  }

  checkKey(key){
    let current = 0;
    let keyCheck = false;

    switch (key) {
      case 83:
        keyCheck = true;
        current = [46, 0];
        this.setState({key:46});
        break;
      case 68:
        keyCheck = true;
        current = [38, 1];
        this.setState({key:49});
        break;
      case 70:
        keyCheck = true;
        current = [49, 2];
        this.setState({key:38});
        break;
      case 71:
        keyCheck = true;
        current = [48, 3];
        this.setState({key:48});
        break;
      case 72:
        keyCheck = true;
        current = [36, 4];
        this.setState({key:36});
        break;
      case 74:
        keyCheck = true;
        current = [45, 5];
        this.setState({key:45});
        break;
      case 75:
        keyCheck = true;
        current = [43, 6];
        this.setState({key:43});
        break;
      case 76:
        keyCheck = true;
        current = [51, 7];
        this.setState({key:51});
        break;
      default:
        keyCheck = false;
        break;
    }

    if(keyCheck != false){
      for (var i = this.refs.notesContainer.getChildren().length - 1; i >= 0; i--) {
        this.checkCollision(this.refs.notesContainer.getChildren()[i],current,i);
      }
      this.animKick(current[1]);
    }
  }

  checkCollision(el,valNote,i) {

    let current = Date.now(),
        impactTime = times[i]+ utils.bpmToMs(this.props.velocity) - this.state.timeOfCollision;

    MIDI.setVolume(0,35);
    MIDI.noteOn(0, valNote[0], 20, 0);

    let diff = Math.abs(current - impactTime);

    if(diff < utils.pxToTime(utils.bpmToMs(this.props.velocity),70) && noteValues[i] == valNote[0]) {
        // Success.
        times.splice(i, 1);
        notes.splice(i, 1);
        noteValues.splice(i, 1);
        el.destroy();
        // this.handleDiff(diff);
        let self = this, time =50;
        this.state.group.getChildren()[valNote[1]].getChildren()[0].getChildren()[0].stroke("#ccedff");
        this.state.group.getChildren()[valNote[1]].getChildren()[0].getChildren()[0].strokeWidth(5);
        this.props.getTimingNoteSuccess(diff);
        setTimeout(function() {
          if(!self.state.group) return;
          if(!self.state.group.getChildren()[valNote[1]]) return;
          if(!self.state.group.getChildren()[valNote[1]].getChildren()[0])return;
          self.state.group.getChildren()[valNote[1]].getChildren()[0].getChildren()[0].strokeWidth(0);
        },100)
        return;
    }

    if(times[i]+(this.props.velocity/60*1000) + utils.pxToTime(this.props.velocity/60*1000,75) < current) {
        // Destroy. Failure
        times.splice(i, 1);
        notes.splice(i, 1);
        noteValues.splice(i, 1);
        el.destroy();
    }

    this.handleDiff(diff);
    return;

  }

  handleDiff(val) {
    if(!this.props.shouldCheck)return;
    if(this.props.isPlaying && notes.length>0){
      this.props.getTimingNoteSuccess(val)
    }
    else {
      notes = [];
      times = [];
      noteValues = [];
      prevTime = null;
    }
  }

  render() {
    let size = 50, padding = 25, diff = 0;
    if(!this.props.isKeyboard) {
      diff = -1;
    }

    let totalWidth = size*(8+diff)+padding*(7+diff),
        left = window.innerWidth*0.5 - totalWidth;


    return (
      <Layer>
        <Group y={size*0.5} x={-size*0.5 + left*0.5} ref="notesContainer">
          {notes}
        </Group>
      </Layer>
    );
  }
}
