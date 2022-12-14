// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CharacterCollector is
    ERC721URIStorage,
    VRFV2WrapperConsumerBase,
    ConfirmedOwner
{
    // using strings library to associate all methods within it to uint256
    using Strings for uint256;

    // used to store and handle token IDs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // EVENTS
    event RequestSent(uint256 tokenId, uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    event WeHaveAWinner(uint256 tokenId, address owner, string characterName);

    // GAME MAPPINGS

    mapping(uint256 => uint256) public tokenIdToLevels;
    mapping(uint256 => string) public tokenIdToName;
    mapping(address => bool) public addressToHasMinted;
    mapping(address => uint256) public addressToTokenId;
    mapping(uint256 => uint256) public tokenIdToLastRequestId;

    uint256 targetScore = 75;

    // Chainlink VRF Configuration for Polygon Mumbai

    // LINK fee
    uint256 fee = 0.0001 * 10**18;
    bytes32 keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address wrapperAddress = 0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693;
    // The limit for how much gas to use for the callback request to your contract’s fulfillRandomWords() function.
    uint32 callbackGasLimit = 100000;

    // Confirmations required before randomness can be provided
    uint16 requestConfirmations = 3;

    // Number of random units
    uint32 numWords = 1;

    // Struct and mapping to hold the ramdom numbers
    struct RequestStatus {
        address tokenOwner;
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    constructor()
        ERC721("Character Collector", "CC")
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    // generates SVG image containing the character name and level
    function generateCharacter(uint256 tokenId) public returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            getName(tokenId),
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Levels: ",
            getLevels(),
            "</text>",
            "</svg>"
        );
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    // function to get the token id minted by a particular address
    function getTokenId() public view returns (uint256) {
        return addressToTokenId[msg.sender];
    }

    // returns current level of a token
    function getLevels() public view returns (string memory) {
        uint256 tokenId = getTokenId();
        uint256 levels = tokenIdToLevels[tokenId];
        return levels.toString();
    }

    // returns name of a token
    function getName(uint256 tokenId) public view returns (string memory) {
        string memory name = tokenIdToName[tokenId];
        return name;
    }

    // function to get the last VRF requestId of a particular token
    function getLastRequestId() public view returns (uint256) {
        uint256 tokenId = getTokenId();
        return tokenIdToLastRequestId[tokenId];
    }

    // returns token URI of NFT
    function getTokenURI(uint256 tokenId) public returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Character Collector #',
            tokenId.toString(),
            '",',
            '"description": "Collect and level characters",',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    // function to mint a token
    function mint(string memory name) public {
        require(
            addressToHasMinted[msg.sender] == false,
            "Only one NFT per address"
        );
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        addressToHasMinted[msg.sender] = true;
        tokenIdToLevels[newItemId] = 0;
        tokenIdToName[newItemId] = name;
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    // function to request the random number from Chainlink VRF
    function requestRandomWords(uint256 tokenId)
        external
        returns (uint256 requestId)
    {
        require(addressToHasMinted[msg.sender] == true);
        // uint256 tokenId = getTokenId();
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            tokenOwner: msg.sender,
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        tokenIdToLastRequestId[tokenId] = requestId;
        emit RequestSent(tokenId, requestId, numWords);
        return requestId;
    }

    // stores and saves the random number alongside the request ID. This is an automatic callback function, called by the VRF
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    // gets the ramdom number that has been issued by the VRF and applies a range of 1 - 10 to it
    function getRandomLevelUp(uint256 tokenId) external {
        // uint256 tokenId = getTokenId();
        uint256 _requestId = tokenIdToLastRequestId[tokenId];
        require(_exists(tokenId), "Please use an existing token");
        require(
            ownerOf(tokenId) == msg.sender,
            "You must own this token to train it"
        );
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        uint256 levelUp = request.randomWords[0];
        uint256 currentLevel = tokenIdToLevels[tokenId];
        uint256 newLevelUp = (levelUp % 10) + 1;

        if (currentLevel + newLevelUp < 75) {
            tokenIdToLevels[tokenId] = currentLevel + newLevelUp;
            _setTokenURI(tokenId, getTokenURI(tokenId));
        } else if (currentLevel + newLevelUp >= targetScore) {
            emit WeHaveAWinner(tokenId, msg.sender, getName(tokenId));
            tokenIdToLevels[tokenId] = 0;
        }
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
