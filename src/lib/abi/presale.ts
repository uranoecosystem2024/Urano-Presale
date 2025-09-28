export const presaleAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_usdc",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_treasury",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AccessControlBadConfirmation",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "neededRole",
                "type": "bytes32"
            }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "allowed",
                "type": "bool"
            }
        ],
        "name": "InstitutionalAccessChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bool",
                "name": "isPublic",
                "type": "bool"
            }
        ],
        "name": "InstitutionalRoundPublicChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "code",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "InviteCodeCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "KYCVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "maxTokens",
                "type": "uint256"
            }
        ],
        "name": "RoundMaxTokensChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "name": "RoundStatusChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "cliffPeriodMonths",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "vestingDurationMonths",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tgeUnlockPercentage",
                "type": "uint256"
            }
        ],
        "name": "RoundVestingParametersUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tgeTime",
                "type": "uint256"
            }
        ],
        "name": "TGETimeSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "TokensClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdcAmount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "string",
                "name": "inviteCode",
                "type": "string"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "usdcAmount",
                "type": "uint256"
            }
        ],
        "name": "TokensReserved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "VestingStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isWhitelisted",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "preAssignedTokens",
                "type": "uint256"
            }
        ],
        "name": "WhitelistUpdated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INSTITUTIONAL_MANAGER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "KYC_MANAGER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "VESTING_MANAGER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WHITELIST_MANAGER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "usdcAmount",
                "type": "uint256"
            }
        ],
        "name": "addPurchase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "users",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "preAssignedTokens",
                "type": "uint256[]"
            },
            {
                "internalType": "enum Presale.RoundType[]",
                "name": "whitelistRounds",
                "type": "uint8[]"
            }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "usdcAmount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "inviteCode",
                "type": "string"
            }
        ],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "usdcAmount",
                "type": "uint256"
            }
        ],
        "name": "calculateTokenAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "totalVestedTokens",
                "type": "uint256"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            }
        ],
        "name": "calculateVestedAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "vestedAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffEndTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "purchaseIndex",
                "type": "uint256"
            }
        ],
        "name": "claimTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimWhitelistTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCommunityRoundInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minPurchase_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTokensSold_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxTokensToSell_",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPublic_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffPeriodMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingDurationMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeUnlockPercentage_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getInstitutionalRoundInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minPurchase_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTokensSold_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxTokensToSell_",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPublic_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffPeriodMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingDurationMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeUnlockPercentage_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "code",
                "type": "string"
            }
        ],
        "name": "getInviteCodeDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "raised",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "users",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "code",
                "type": "string"
            }
        ],
        "name": "getInviteCodeOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPrivateRoundInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minPurchase_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTokensSold_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxTokensToSell_",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPublic_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffPeriodMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingDurationMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeUnlockPercentage_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSeedRoundInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minPurchase_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTokensSold_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxTokensToSell_",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPublic_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffPeriodMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingDurationMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeUnlockPercentage_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStatistics",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "kycVerified_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "whitelisted_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "buyers_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalSold_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStrategicRoundInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minPurchase_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTokensSold_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxTokensToSell_",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPublic_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffPeriodMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingDurationMonths_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeUnlockPercentage_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isWhitelisted_",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "preAssignedTokens_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimedTokens_",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "inviteCode_",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserInviteCode",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            }
        ],
        "name": "getUserPurchases",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "usdcAmounts",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "timestamps",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "claimed",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            }
        ],
        "name": "getUserVestingInfo",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "unlockTimes",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "claimed",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "claimableAmounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getWhitelistClaimable",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "claimableAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "institutionalAllowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "inviteCodeOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "inviteCodeRaised",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "inviteCodeTokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "inviteCodeUsedBy",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "inviteCodeUsers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "isInstitutionalAllowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "kycVerified",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "code",
                "type": "string"
            }
        ],
        "name": "registerInviteCode",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "users",
                "type": "address[]"
            }
        ],
        "name": "removeFromWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "callerConfirmation",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "",
                "type": "uint8"
            }
        ],
        "name": "rounds",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "tokenPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minPurchase",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRaised",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTokensSold",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxTokensToSell",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPublic",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vestingEndTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cliffPeriodMonths",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vestingDurationMonths",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tgeUnlockPercentage",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "allowed",
                "type": "bool"
            }
        ],
        "name": "setInstitutionalAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "isPublic",
                "type": "bool"
            }
        ],
        "name": "setInstitutionalRoundPublic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "users",
                "type": "address[]"
            },
            {
                "internalType": "bool[]",
                "name": "status",
                "type": "bool[]"
            }
        ],
        "name": "setKYCVerified",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "maxTokens",
                "type": "uint256"
            }
        ],
        "name": "setRoundMaxTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "name": "setRoundStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tgeTime",
                "type": "uint256"
            }
        ],
        "name": "startVesting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tgeTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalBuyers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalKYCVerified",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalRaised",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalTokensSold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalWhitelisted",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "treasury",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Presale.RoundType",
                "name": "round",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "newCliffPeriodMonths",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "newVestingDurationMonths",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "newTgeUnlockPercentage",
                "type": "uint256"
            }
        ],
        "name": "updateRoundVestingParameters",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdc",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userInviteCode",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userPurchases",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "usdcAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimedTokens",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "",
                "type": "uint8"
            }
        ],
        "name": "userTotalSpent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "vestingStarted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whitelist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isWhitelisted",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "preAssignedTokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimedTokens",
                "type": "uint256"
            },
            {
                "internalType": "enum Presale.RoundType",
                "name": "whitelistRound",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawUnsoldTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;