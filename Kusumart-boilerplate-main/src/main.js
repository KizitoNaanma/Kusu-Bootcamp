import Web3 from "web3"
import ContractABI  from "../contract/ContractABI.abi.json"

let contract
let items = []
const ContractAddress = "0xeFA10C7a5d56bF1260d592059EcfaA7cb0CC20E4"


const connectWallet = async () => {

  if (window.ethereum) {
     web3 = new Web3(window.ethereum);
     try {
        window.ethereum.enable()
           contract = new web3.eth.Contract(ContractABI, ContractAddress)
     } catch(error) {
       console.log(`Error: ${error}.`);
     }
  }
  else {
      alert('You have to install MetaMask !');
  }
}

const getProducts = async function() {
  const _count = await contract.methods.getProductsLength().call()
  console.log(_count);
  const _items = []

  for (let i = 0; i < _count; i++) {
      let _item = new Promise(async (resolve, reject) => {
        let p = await contract.methods.readProduct(i).call()
        resolve({
          index: i,
          owner:p[0],
          name:p[1],
          image:p[2],
          description: p[3],
          location: p[4],
          price:p[5],
          sold:p[6]
        })
      })
      _items.push(_item)
    }
  items = await Promise.all(_items)
  console.log(items);
  showItems()
}

const getBalance = async function () {
  const accounts = await window.ethereum.enable();
    const account = accounts[0];
  const balance = await web3.eth.getBalance(account)
  // const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  // const balance = web3.toDecimal(bal);
  document.querySelector("#balance").textContent = balance
}

function showItems() {
  document.getElementById("main").innerHTML = ""
  items.forEach((_item) => {
    const newDiv = document.createElement("div")
    newDiv.className = "col-md-4"
    newDiv.innerHTML = itemTemplate(_item)
    document.getElementById("main").appendChild(newDiv)
  })
}

function itemTemplate(_item) {
  return `
    <div class="card mb-4">
      <img class="card-img-top" src="${_item.image}" alt="...">
      <div class="card-body text-left p-4 position-relative">

        <h2 class="card-title fs-4 fw-bold mt-2">${_item.name}</h2>
        <p class="card-text mb-4" style="min-height: 82px">
          ${_item.description}
        </p>

        <div class="d-grid gap-2">
          <a class="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" id=${
            _item.index
          }>
            Buy for ${_item.price} KUSU
          </a>
        </div>
      </div>
    </div>
  `
}

document.querySelector("#addProduct").addEventListener("click", async (e) => {
  try {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];

    const params = [
      document.getElementById("name").value,
      document.getElementById("image").value,
      document.getElementById("description").value,
      document.getElementById("location").value,
      Number(document.getElementById("price").value)
    ]

    const result = await contract.methods.addProduct(...params).send({from: account});
  } catch (error){
    console.log(error)
  }
  getProducts()
});



//
//
//
window.addEventListener("load", () => {
  connectWallet()
  // alert("Conected")
  getBalance()
  getProducts()
  showItems()
})
