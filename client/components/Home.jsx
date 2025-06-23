import React from "react"
import { Link } from "react-router-dom";
function Home(){
    return (
        <>
          <div className="">
      <h1>Welcome to AlgoNest!!</h1>
      <p>Practice. Compete. Evolve</p>
      <Link to="/signup">Sign Up</Link> 
      <Link to="/login">Log In</Link>
    </div>
        </>
    )
}

export default Home;