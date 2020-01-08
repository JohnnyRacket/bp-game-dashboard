import React, { useState, useEffect } from 'react';
import logo from './red-cup.svg';
import GameCard from './components/GameCard';
import socketIOClient from "socket.io-client";
import Modal from 'react-modal';


function App() {
  const [matches, setMatches] = useState([]);
  const [tables, setTables] = useState([]);
  const [modalState, setModalState] = useState({
    id: "",
    a: {
      name: ""
    },
    b: {
      name: ""
    }
  });
  const [modalIsOpen,setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal(){
    setIsOpen(false);
  }

  useEffect(() => {
    const socket = socketIOClient(); // same origin so no need for a url here
    socket.on("gamestate_update", data => {
      console.log(data);
      const found = matches.some(m => m.id === data.id);
      if (found){
      setMatches(matches.map(m => {
        if (m.id !== data.id) {
          return m;
        } else {
          return data;
        }
      })
      );
    }else{
      setMatches([...matches, data]);
    }
    });
  }, []);

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };
  

  return (
    <div>

      <div className="elevation-1" style={{ padding: '1rem', marginBottom: '4rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
          <div style={{display: 'flex'}}><img src={logo} style={{ width: '4rem', paddingRight: '1rem' }} /><h1>Beer Pong Match Dashboard</h1></div>
          <button class="input semi-rounded blue" onClick={openModal}>{"Create Match"}</button>

        </div>
      </div>
      <div className="container">
        {matches.map((m, i) =>
          <GameCard key={m.id} t1Cups={m.a.cups} t1Name={m.a.name} t2Cups={m.b.cups} t2Name={m.b.name} image={m.image} number={i + 1} />
        )}

      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ marginTop: 0 }}>Create a Match</h2>
          <button className="input rounded " style={{ margin: 0 }} onClick={closeModal}>✖</button>
        </div>
        <form>
          <h3>Tables</h3>
          <select className="input semi-rounded">
            {tables.map(t => <option value={t.id}>Volvo</option>)}
          </select>
          <h3>Team 1</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '.3rem' }}>
            <label className="margin1 label" htmlFor="t1Name">Name:</label>
            <input className="margin1 input  semi-rounded" id="t1Name" value={modalState.a.name} onChange={e => {
              e.persist();
              setModalState(prev => ({
                ...prev,
                a: {
                  ...prev.a,
                  name: e.target.value
                }
              }))
            }
            } />
          </div>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '.3rem' }}>
            <label className="margin1 label" htmlFor="t1P1">Player 1:</label>
            <input className="margin1 input  semi-rounded" id="t1P2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '.3rem' }}>
            <label className="margin1 label" htmlFor="t1P2">Player 2:</label>
            <input className="margin1 input  semi-rounded" id="t1P2" />
          </div> */}
          <h3>Team 2</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '.3rem' }}>
            <label className="margin1 label" htmlFor="t2Name">Name:</label>
            <input className="margin1 input  semi-rounded" id="t2Name" value={modalState.b.name} onChange={e => {
              e.persist();
              setModalState(prev => ({
                ...prev,
                b: {
                  ...prev.b,
                  name: e.target.value
                }
              }))
            }} />
          </div>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '.3rem' }}>
            <label className="margin1 label" htmlFor="t2P1">Player 1:</label>
            <input className="margin1 input  semi-rounded" id="t2P2" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '.3rem' }}>
            <label className="margin1 label" htmlFor="t2P2">Player 2:</label>
            <input className="margin1 input  semi-rounded" id="t2P2" />
          </div> */}
          <button className="input green semi-rounded" style={{ marginTop: '2rem', float: 'right' }}>Create</button>
        </form>
      </Modal>

    </div>

          
  );
}

export default App;
