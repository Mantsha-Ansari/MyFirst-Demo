const BASE_URL = "https://v6.exchangerate-api.com/v6/2ecb3fe97b722bdc64d6cea6/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".input-group input");
  let amtVal = 1;
  if (amount) {
    amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }
  }
  const URL = `https://v6.exchangerate-api.com/v6/2ecb3fe97b722bdc64d6cea6/latest/${fromCurr.value.toUpperCase()}`;
  // console.log("Constructed URL:", URL);
  
  try {
    let response = await fetch(URL);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data;
    // console.log("Fetching data...");

    try {
        data = await response.json();
    } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Failed to parse JSON response");
    }

    let rate;
    try {
        rate = data.conversion_rates[toCurr.value.toUpperCase()];
    } catch (rateError) {
        console.error("Error accessing exchange rate:", rateError);
        throw new Error("Failed to access exchange rate");
    }

    let result = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${result} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
