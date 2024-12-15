import React from 'react'
import '../styles/footer.css'

function Footer() {
  return (
    <div className="def-footer">
      <footer className="d-flex flex-wrap justify-content-between align-items-center border-top">
        <p className=" nav-link">© 2024 TAMO KLONAS, Inc</p>

        <ul className="nav justify-content-end">
          <li className="nav-item"><a href="#" className="nav-link px-2 ">Tvarkaraštis</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2 ">DUK</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2 ">Privatumo politika</a></li>
        </ul>
      </footer>
    </div>
  ) 
}

export default Footer