# 🚀 Flow-Fund: Decentralized Crowdfunding Platform

<div align="center">
  
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3C?style=for-the-badge&logo=Ethereum&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Wagmi](https://img.shields.io/badge/Wagmi-FF6B6B?style=for-the-badge&logo=wagmi&logoColor=white)
![Viem](https://img.shields.io/badge/Viem-4A90E2?style=for-the-badge&logo=viem&logoColor=white)

</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 📝 [Smart Contract Documentation](#smart-contract-documentation)
6. 🔗 [Links](#links)
7. 🚀 [More](#more)

## 🤖 Introduction

Flow-Fund is a **decentralized crowdfunding platform** built on Ethereum that enables users to create and fund campaigns in a transparent and secure manner. The platform leverages smart contracts to ensure trustless execution of funding goals and automatic distribution of funds.

The system provides a robust web3 interface that allows users to:

- Create and manage crowdfunding campaigns
- Fund campaigns using cryptocurrency
- Track campaign progress and funding status
- Withdraw funds when goals are met
- View campaign analytics and statistics
- Admin verification system for campaign approval

## ⚙️ Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Smart Contracts**: Solidity with Hardhat
- **Web3 Integration**: Wagmi & Viem
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **State Management**: React Hooks
- **Authentication**: Web3 Wallet Integration

## 🔋 Features

👉 **Smart Contract Integration**: Secure and transparent campaign management

👉 **Web3 Authentication**: Seamless wallet connection and transaction handling

👉 **Admin Verification**: Secure campaign approval system to prevent spam and ensure quality

👉 **Real-time Updates**: Live campaign status and funding progress

👉 **Responsive Design**: Beautiful UI that works on all devices

👉 **Type Safety**: Full TypeScript support for better development experience

👉 **Gas Optimization**: Efficient smart contract design for cost-effective transactions

👉 **Campaign Analytics**: Detailed insights into campaign performance

## 🤸 Quick Start

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) or any Web3 wallet

**Cloning the Repository**

```bash
git clone https://github.com/0xprathamesh/Flow-Fund.git
cd Flow-Fund
```

**Installation**

Install the project dependencies:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_NETWORK_ID=your_network_id
```

**Running the Project**

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📝 Smart Contract Documentation

### Campaign Creation

```solidity
function createCampaign(
    string memory _title,
    string memory _description,
    uint256 _targetAmount,
    uint256 _deadline
) public returns (uint256)
```

### Admin Verification

```solidity
function verifyCampaign(uint256 _campaignId) public onlyAdmin
```

### Campaign Funding

```solidity
function fundCampaign(uint256 _campaignId) public payable
```

### Campaign Withdrawal

```solidity
function withdrawFunds(uint256 _campaignId) public
```

## 🔗 Links

- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Wagmi Documentation**: [https://wagmi.sh/docs](https://wagmi.sh/docs)
- **Solidity Documentation**: [https://docs.soliditylang.org](https://docs.soliditylang.org)
- **TailwindCSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🚀 More

**Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

**License**

This project is licensed under the MIT License - see the LICENSE file for details.

**Support**

If you need help or have questions, please open an issue in the repository.

## 👨‍💻 Author

**Prathamesh Patil** - [GitHub](https://github.com/0xprathamesh)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Prathamesh Patil</sub>
</div>
