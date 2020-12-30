import React from "react";
import firebase from "firebase";
import { auth } from "../firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

var uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: async (authResult) => {
      const userInfo = authResult.additionalUserInfo;
      if (userInfo.isNewUser && userInfo.providerId === "password") {
        try {
          await authResult.user.sendEmailVerification();
          console.log("Check your email");
        } catch (e) {
          console.log(e);
        }
      }
      return false;
    },
  },
};

function Signup() {
  const [user, setUser] = React.useState(null);

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("Successfully signout");
        setUser(null);
      })
      .catch(function () {
        console.log("Error signout");
      });
  };

  React.useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      // console.log(db);
      console.log("THE USER IS >>> ", authUser);
      if (authUser) {
        setUser(authUser);
      }
    });
  }, []);

  return (
    <div>
      {user ? (
        <div>
          Welcome back {user.displayName}
          <br />
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
    </div>
  );
}

export default Signup;
