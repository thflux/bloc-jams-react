import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
	constructor(props) {
		super(props);

		const album = albumData.find( album => {
			return album.slug === this.props.match.params.slug
		});

		this.state = {
			album: album,
			currentSong: album.songs[0],
			currentTime: 0,
			duration: album.songs[0].duration,
			currentVolume: 0,
			volume: 0.5,
			isPlaying: false
		};

		this.audioElement = document.createElement('audio');
		this.audioElement.src = album.songs[0].audioSrc;
		this.audioElement.volume = 0.5;
	}

	play() {
		this.audioElement.play();
		this.setState({ isPlaying: true });
	}

	pause() {
		this.audioElement.pause();
		this.setState({ isPlaying: false });
	}

	componentDidMount() {
		this.eventListeners = {
			timeupdate: e => {
				this.setState({ currentTime: this.audioElement.currentTime });
				},
			durationchange: e => {
				this.setState({ duration: this.audioElement.duration });
				},
			volumeupdate: e => {
				this.setState({ currentVolume: this.audioElement.currentVolume});
							},
			lengthchange: e => {
				this.setState({ length: this.audioElement.length});
				}
			};
			this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
			this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
			this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
			this.audioElement.addEventListener('lengthchange', this.eventListeners.lengthchange);

	}
	
	componentWillUnmount() {
		this.audioElement.src = null;
		this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
		this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
		this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
		this.audioElement.addEventListener('lengthchange', this.eventListeners.lengthchange);
		}
	
	
	
	setSong(song) {
		this.audioElement.src = song.audioSrc;
		this.setState({ currentSong: song });
	}

	handleSongClick(song) {
		const isSameSong = this.state.currentSong === song;
		if (this.state.isPlaying && isSameSong) {
			this.pause();
		} else {
			if (!isSameSong) { this.setSong(song); }
			this.play();
		}
	}
	
	
	handleTimeChange(e) {
		const newTime = this.audioElement.duration * e.target.value;
		this.audioElement.currentTime = newTime;
		this.setState({ currentTime: newTime });
	}
	
	handleVolumeChange(e){
		const newVolume = e.target.value;
		this.audioElement.volume = newVolume;
		this.setState({ currentVolume: newVolume });
	}	

	handlePrevClick() {
		const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
		const newIndex = Math.max(0, currentIndex - 1);
		const newSong = this.state.album.songs[newIndex];
			this.setSong(newSong);
			this.play();
	}

	handleNextClick() {
			const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
			const newIndex = currentIndex + 1;
			if (newIndex < this.state.album.songs.length){
				const newSong = this.state.album.songs[newIndex];
				this.setSong(newSong);
				this.play(newSong);
			} else {
				console.log('Index out of range');
			}
		}


	displayIcon(song, index) {
		if(this.state.isPlaying !== true && this.state.hoveredSong === index ) {
				return <span className="ion-md-play"></span>
		} else if (this.state.isPlaying === true && this.state.currentSong === song) {
				return <span className="ion-md-pause"></span>
		} else if (this.state.isPlaying !== true && this.state.currentSong === song && this.state.hoveredSong === index) {
				return <span className="ion-md-play"></span>
		}
		return index + 1
	}
	
	formatTime(time) {
		if (time <= 0) {
			return '-:--';
		}

		let minutes = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);

		let secondsString = seconds;

		if (seconds < 10) {
			secondsString = '0' + seconds;
		}

		return `${minutes}:${secondsString}`;
	}


	hoverOn(index) {
		this.setState({ hoveredSong: index });
		console.log('hovered');

	};

	hoverOff() {
		this.setState({ hoveredSong: false })
	};

	render() {
		return (
			<section className="album">
			<section id="album-info">
			<img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
			<div className="album-details">
			<h1 id="album-title">{this.state.album.title}</h1>
			<h2 className="artist">{this.state.album.artist}</h2>
			<div id="release-info">{this.state.album.releaseInfo}</div>
			</div>
			</section>
			<table id="song-list">

			<colgroup>
				<col id="song-number-column" />
				<col id="song-title-column" />
				<col id="song-duration-column" />
			</colgroup>

			<tbody>
			{this.state.album.songs.map((song, index) =>
				<tr className = "song"
					key = {index}
						onClick = {() => this.handleSongClick(song)}
							onMouseEnter = {() => this.hoverOn(index)}
								onMouseLeave = {() => this.hoverOff()}>

				<td key='number'   > {this.displayIcon(song, index)} </td>
				<td key='title'    > {song.title} </td>
				<td>{this.formatTime(song.duration)}</td>
				

				</tr>
			)}
			</tbody>
			</table>
			<PlayerBar
				isPlaying={this.state.isPlaying}
				currentSong={this.state.currentSong}
				currentTime={this.state.currentTime}
				duration={this.state.duration}
				handleSongClick={ () => this.handleSongClick(this.state.currentSong)}
				handlePrevClick={ () => this.handlePrevClick()}
				handleNextClick={ () => this.handleNextClick()}
				handleTimeChange={ (e) => this.handleTimeChange(e)}
				handleVolumeChange={ (e) => this.handleVolumeChange(e)}
				formatTime={ () => this.formatTime(this.state.currentTime)}
				formatDuration={ () => this.formatTime(this.state.duration)}
				/>
			</section>
		);
	}
}

export default Album;
