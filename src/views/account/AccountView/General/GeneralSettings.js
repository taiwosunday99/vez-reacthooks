import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

import {
  List,
  ListItem,
  ListSubheader,
  // ListItemText,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles(() => ({
  root: {}
}));

const GeneralSettings = ({ className, user, accessToken, ...rest }) => {
  const classes = useStyles();
  const { logout } = useAuth();

    const [signoutTime, setSignoutTime] = useState(60000);
    const [warningTime, setWarningTime] = useState(30000);
    let warnTimeout;
    let logoutTimeout;
    
    const warn = () => {
      return (
        alert('User will be logged out if the page remains idle!')
        // <div style2={style2}>
        //   <h1>Warning......continue idleness wil logout the user!</h1>
        // </div>
      )
  };
 



    useEffect(() => {

    const setTimeouts = () => {
        warnTimeout = setTimeout(warn, warningTime);
        logoutTimeout = setTimeout(logout, signoutTime);
    };

    const clearTimeouts = () => {
        if (warnTimeout) clearTimeout(warnTimeout);
        if (logoutTimeout) clearTimeout(logoutTimeout);
    };
        const events = [
            'load',
            'mousemove',
            'mousedown',
            'click',
            'scroll',
            'keypress'
        ];

        const resetTimeout = () => {
            clearTimeouts();
            setTimeouts();
        };

        for (let i in events) {
            window.addEventListener(events[i], resetTimeout);
        }

        setTimeouts();
        return () => {
            for(let i in events){
                window.removeEventListener(events[i], resetTimeout);
                clearTimeouts();
            }
        }
    },[]);



// useEffect(() => {
//   const inActivityTime =  () => {
//     let time;
//     window.onload = resetTimer;
// // DOM Events
//     document.onmousemove = resetTimer;
//     document.onkeypress = resetTimer;
//     function resetTimer() {
//         clearTimeout(time);
//         time = setTimeout(logout, 60000)
//     }
// };
// inActivityTime();
     
// },[])



  const style = {
    width: '60%',
    height: '100%',
    margin: '16px',
    // border: "1px solid #eee",
    // "box-shadow": "0 2px 3px #ccc",
    color: 'white',
    'text-align': 'center',
    backgroundColor: 'DeepSkyBlue'
  };

  const style2 = {
    width: "50%",
    height: "50%",
    margin: "16px",
    color: "red",
    "font-size": "4em",
    "text-align": "center",
    backgroundColor: "white"
  }
  return (
    <List style={style}>
      <h1 className="center"> User Profile</h1>
      <li>
        <ul>
          <ListSubheader>ORGID:{user.orgId}</ListSubheader>
          <ListItem className="magenta">
            <span className="navy">FullName:</span>
            {user.userLastName + ' ' + user.userFirstName}
          </ListItem>
          <ListItem className="magenta">
            <span className="navy">Mobile:</span>
            {user.userPhoneNumber}
          </ListItem>
          <ListItem className="magenta">
            <span className="navy">Account-Balance:</span>
            {user.currency3Letters} {user.userAccountBalance}
          </ListItem>
          <ListItem className="magenta">
            <span className="navy">Global Identity No:</span>
            {user.userGlobalId}
          </ListItem>
        </ul>
      </li>
      <div className="App">
      <header className="App-header">
      {warn}
      </header>
    </div>
    </List>
   

    //    <Grid style={style}>

    // <h1 className='center'>Viewing User Profile</h1>

    //   <Card style2={style2}>
    //   <div className="center">
    //     <h5 className="black">
    //       FullName: {user.userLastName} {user.userFirstName}
    //     </h5>
    //   </div>
    //   <div className="center">
    //     <h5 className="black">
    //       Phone: {user.userPhoneNumber}
    //     </h5>
    //   </div>
    //   <div className="center">
    //     <h5 className="black">
    //       AccountBalance: {user.currency3Letters} {user.userAccountBalance}
    //     </h5>
    //   </div>

    // </Card>

    // <Card style2={style2}>
    //   <div className="center">
    //     <h5 className="black">
    //       Global Identity No: {user.userGlobalId}
    //     </h5>
    //   </div>
    //   <div className="center">
    //     <h5 className="black">
    //       Transaction ID: {user.transactionId}
    //     </h5>
    //   </div>

    // </Card>
    // </Grid>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default GeneralSettings;
