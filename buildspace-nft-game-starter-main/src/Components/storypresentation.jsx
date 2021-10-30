
import React, { useState} from 'react'
import Tezcalegend from './Tezcalegend'
import ReactPlayer from 'react-player/youtube'
import { volumeon } from '../assets/volumeon'
import { volumeoff } from '../assets/volumeoff'
import '../App.css'



function StoryPresentation() {
  const [musicOn, setMusicOn] = useState(true)

    return (
        <div id="story">
        <button 
            className= "button-music" 
            style={{textAlign: 'left'}}
            onClick = {() => setMusicOn(!musicOn)}
            > 
                {!musicOn ? volumeon:volumeoff} 
            </button>
            <div className= "story-presentation">
            <div className='intro-video'>
                <ReactPlayer 
                    url='https://www.youtube.com/watch?v=L7a8hmoOsx0'
                    playing='true'
                    loop='true'
                    muted={musicOn}
                    controls='false'
                    width={840}
                    height={500 }
                    />
            </div>
            <div id="tezcadiv" className= "tezcaframe">
                <Tezcalegend />
            </div>   
     </div>            
        </div>
    )
}
export default StoryPresentation


    