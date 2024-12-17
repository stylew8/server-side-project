import React from "react";

export const requestAuth = async (route) =>{
    const url = `https://localhost:7097` + route;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(`Request failed: ${response.status}`);
    }
    
    var result = await response.json();

    console.log(result);
    return result;
};

export const requestAuthPost = async (route, body) => {
  const url = `https://localhost:7097${route}`;
  
  const response = await fetch(url, {
    method: "POST", // Используем POST вместо GET
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json", // Указываем Content-Type для передачи JSON
    },
    body: JSON.stringify(body), // Передаем тело запроса в формате JSON
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error details:", errorText);
    throw new Error(`Request failed: ${response.status}`);
  }

  const result = await response.json();
  console.log(result); // Логируем результат
  return result;
};
