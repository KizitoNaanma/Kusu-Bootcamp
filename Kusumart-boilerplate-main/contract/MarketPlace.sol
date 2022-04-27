// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}
contract Marketplace {

    uint productLength = 0;
    address TokenAddress = 0xccAC8bE8091EE5E9eD8565Fb951A74E71A7775DC;

    struct Product {
        address payable owner;
        string name;
        string image;
        string description;
        string location;
        uint price;
        uint sold;
    }

    mapping (uint => Product) public products;

    function addProduct(
                    string memory _name,
                    string memory _image,
                    string memory _description,
                    string memory _location,
                    uint _price
                ) public {

                uint _sold = 0;
                products[productLength] = Product (
                    payable(msg.sender),
                    _name,
                    _image,
                    _description,
                    _location,
                    _price,
                    _sold
                );

                productLength++;
    }

    function readProduct (uint _index) public view returns(
        address,
        string memory,
        string memory,
        string memory,
        string memory,
        uint,
        uint
    ) {
        return (
            products[_index].owner,
            products[_index].name,
            products[_index].image,
            products[_index].description,
            products[_index].location,
            products[_index].price,
            products[_index].sold
        );
    }

    function buyProduct(uint _index) public payable  {
        require(
          IERC20Token(TokenAddress).transferFrom(
            msg.sender,
            products[_index].owner,
            products[_index].price
          ),
          "Transfer failed."
        );
        products[_index].sold++;
    }

    function getProductsLength() public view returns (uint) {
        return (productLength);
    }

}
