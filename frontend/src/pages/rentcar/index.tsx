import { Button, Image } from "antd";
import { Header } from "../../asset";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  BorrowYourCarAddress,
  BorrowYourCarContract,
  CarTokenContract,
  web3,
} from "../../utils/contracts";
import "./index.css";

const GanacheTestChainId = "0x539"; // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = "Ganache Test Chain";
const GanacheTestChainRpcUrl = "http://127.0.0.1:7545";

const BorrowYourCarPage = () => {
  // account: 账户 公私
  const [account, setAccount] = useState("");

  const [ownedCars, setOwnedCars] = useState<any[]>([]);

  const [unborrowedCars, setUnborrowedCars] = useState<any[]>([]);

  const [ownerMap, setOwnerMap] = useState<Record<string, any>>({});

  const [borrowerMap, setBorrowerMap] = useState<Record<string, any>>({});

  const [balance, setBalance] = useState(0);

  // const [carId, setCarId] = useState("");

  useEffect(() => {
    // 初始化检查用户是否已经连接钱包
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    const initCheckAccounts = async () => {
      // @ts-ignore
      const { ethereum } = window;
      if (Boolean(ethereum && ethereum.isMetaMask)) {
        // 尝试获取连接的用户账户
        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length) {
          setAccount(accounts[0]);
        }
      }
    };

    initCheckAccounts();
  }, []);

  const onClickConnectWallet = async () => {
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    // @ts-ignore
    const { ethereum } = window;
    if (!Boolean(ethereum && ethereum.isMetaMask)) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
      if (ethereum.chainId !== GanacheTestChainId) {
        const chain = {
          chainId: GanacheTestChainId, // TODO Chain-ID
          chainName: GanacheTestChainName, // TODO Chain-Name
          rpcUrls: [GanacheTestChainRpcUrl], // TODO RPC-URL
        };

        try {
          // 尝试切换到本地网络
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chain.chainId }],
          });
        } catch (switchError: any) {
          // 如果本地网络没有添加到Metamask中，添加该网络
          if (switchError.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chain],
            });
          }
        }
      }

      // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
      await ethereum.request({ method: "eth_requestAccounts" });
      // 获取小狐狸拿到的授权用户列表
      const accounts = await ethereum.request({ method: "eth_accounts" });
      // 如果用户存在，展示其account，否则显示错误信息
      setAccount(accounts[0] || "");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getOwnedCars = async () => {
    if (BorrowYourCarContract && account) {
      console.log(account);
      const x = await BorrowYourCarContract.methods
        .getOwnedCars(account)
        .call();
      console.log("getOwnedCars", x);
      setOwnedCars(x);
    } else {
      alert("Contract not exists.");
    }
  };

  const availableCars = async () => {
    if (BorrowYourCarContract && account) {
      console.log(account);
      await getOwnedCars();
      const x = await BorrowYourCarContract.methods.availableCars().call();
      console.log("availableCars", x);
      setUnborrowedCars(x);
    } else {
      alert("Contract not exists.");
    }
  };

  const tokenBalance = async () => {
    if (CarTokenContract && account) {
      const x = await CarTokenContract.methods.balanceOf(account).call();
      setBalance(Number(x.toString()));
    }
  };

  const refresh = async () => {
    availableCars();
    getOwnedCars();
    tokenBalance();
  };

  useEffect(() => {
    if (account) refresh();
  }, [account]);

  const newCar = async () => {
    if (BorrowYourCarContract && account) {
      console.log(account);
      // 这是写函数，要改合约状态了，得发交易
      const x = await BorrowYourCarContract.methods
        .mint()
        .send({ from: account });
      console.log("newCar", x);
      // 刷新
      refresh();
    } else {
      alert("Contract not exists.");
    }
  };

  const borrowCar = async (carId: any) => {
    if (BorrowYourCarContract && account) {
      const x = await BorrowYourCarContract.methods
        .borrow(carId, 10000)
        .send({ from: account });

      refresh();
    } else {
      alert("Contract not exists.");
    }
  };
  const showBorrower = async (carId: any) => {
    if (BorrowYourCarContract && account) {
      try {
        const x = await BorrowYourCarContract.methods.getBorrower(carId).call();
        setBorrowerMap({ ...borrowerMap, [carId]: x });
        console.log(x);
      } catch (e) {
        setBorrowerMap({ ...borrowerMap, [carId]: "not borrowed" });
      }
    } else {
      alert("Contract not exists.");
    }
  };
  const showOwner = async (carId: any) => {
    if (BorrowYourCarContract && account) {
      const x = await BorrowYourCarContract.methods.getOwner(carId).call();
      setOwnerMap({ ...ownerMap, [carId]: x });
      console.log(x);
    } else {
      alert("Contract not exists.");
    }
  };

  const getCarToken = async () => {
    if (CarTokenContract && account) {
      const x = await CarTokenContract.methods.mint().send({ from: account });
      console.log(x);
      refresh();
    } else {
      alert("Contract not exists.");
    }
  };
  const approve = async () => {
    if (CarTokenContract && account) {
      const x = await CarTokenContract.methods
        .approve(BorrowYourCarAddress, 10000)
        .send({ from: account });
      console.log(x);
      refresh();
    } else {
      alert("Contract not exists.");
    }
  };

  return (
    <div>
      <h1>Borrow Your Car Page</h1>
      {account ? (
        <div>{`Your Account: ${account}`}</div>
      ) : (
        <button onClick={onClickConnectWallet}>Connect Wallet</button>
      )}

      <div>
        <button onClick={getOwnedCars}>查看自己的汽车列表</button>
        <button onClick={availableCars}>查看未被借用的汽车列表</button>
        <button onClick={newCar}>新建汽车</button>
      </div>

      <div>
        <button onClick={tokenBalance}>查看代币余额</button>
        <button onClick={getCarToken}>领取代币</button>
        <button onClick={approve}>approve</button>
      </div>
      <div>拥有代币数量：{balance}</div>

      <div>拥有汽车列表</div>
      {ownedCars.map((carId) => {
        return (
          <div
            style={{ width: 100, height: "auto", margin: "0 auto" }}
            key={carId}
          >
            <img
              src={`https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${carId}.png`}
              alt={carId}
              width={80}
              height={80}
            />
            <div>{`TokenId: ${carId}`}</div>
            <button onClick={() => showBorrower(carId)}>借用者</button>
            {borrowerMap[carId] && <div>{`借用者: ${borrowerMap[carId]}`}</div>}
          </div>
        );
      })}
      <div>未被借用的汽车列表</div>
      {unborrowedCars
        .filter((carId: any) => !ownedCars.includes(carId))
        .map((carId) => {
          return (
            <div
              style={{ width: 100, height: "auto", margin: "0 auto" }}
              key={carId}
            >
              <img
                src={`https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${carId}.png`}
                alt={carId}
                width={80}
                height={80}
              />
              <div>{`TokenId: ${carId}`}</div>
              <button onClick={() => showOwner(carId)}>主人</button>
              {ownerMap[carId] && <div>{`主人: ${ownerMap[carId]}`}</div>}
              <button onClick={() => borrowCar(carId)}>借用</button>
            </div>
          );
        })}
    </div>
  );
};

export default BorrowYourCarPage;
