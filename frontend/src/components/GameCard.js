import React, { useState } from 'react';
import redcup from '../red-cup.svg';
import greycup from '../grey-cup.svg';

const GameCard = props => {
    const [imageView, setImageView] = useState(false);
    return (

        <div class="semi-rounded standard elevation-3" style={{ maxWidth: '100%', padding: '1rem', border: 'solid 1px #eee' }}>
            <div style={{ borderBottom: 'solid 1px #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ marginTop: '.75rem' }}> Table {props.number} </h2>
                <div style={{ display: 'flex' }}>
                    <button class="input semi-rounded blue" onClick={() => setImageView(prev => !prev)}>{imageView ? "Dashboard" : "Image"}</button>
                    <button class="input semi-rounded orange" onClick={() => setImageView(prev => !prev)}>Delete </button>
                </div>
            </div>
            <h3>{props.t1Name}</h3>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {[...Array(props.t1Cups)].map(c => <div style={{ flex: 1, margin: '.25rem' }}><img src={redcup} style={{ width: '100%' }} /></div>)}
                {[...Array(10 - props.t1Cups)].map(c => <div style={{ flex: 1, margin: '.25rem' }}><img src={greycup} style={{ width: '100%' }} /></div>)}
            </div>
            <h3>{props.t2Name} </h3>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {[...Array(props.t2Cups)].map(c => <div style={{ flex: 1, margin: '.25rem' }}><img src={redcup} style={{ width: '100%' }} /></div>)}
                {[...Array(10 - props.t2Cups)].map(c => <div style={{ flex: 1, margin: '.25rem' }}><img src={greycup} style={{ width: '100%' }} /></div>)}
            </div>
            <div style={{marginBottom: '1rem'}}></div>
            {imageView ? <img src={props.image} style={{ width: '100%' }} /> : (
                <>

                    <div style={{ paddingTop: '45%', width: "100%", position: 'relative', background: 'rgb(77, 173, 119)', borderRadius: '.5rem' }}>
                        {props.locations.map(l => <img src={redcup} style={{ width: '6%', position: 'absolute', left: l.x + '%', top: l.y + '%', }} />)}
                    </div>
                </>)}

        </div>
    )
};

export default GameCard;