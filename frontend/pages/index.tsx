import React, { useEffect, useState } from "react";

function index() {
  const [price, setPrice] = useState();

  useEffect(() => {
    fetch("http://localhost:5000/api/price")
    .then((response) => response.json())
    .then((data) => JSON.parse(data))
    .then((data) => {
      setPrice(data["Bitcoin"]["usd"])
    })
  }, []);

  return (
    <div>
      <h1 className="text-green-800 text-6xl font-extrabold">Bitcoin Price</h1>
      <div>
        <h2>Price: {price}</h2>
      </div>
    </div>
  );
}

export default index;