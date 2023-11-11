# 区块链与数字货币——简易租赁系统

## 如何运行

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```

3. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```

4. 在`./contracts/hardhat.config.ts` 中，根据ganache配置`rpc url`和`account`

5. 在 `./contracts` 中部署合约，运行如下的命令：

    ```bash
    npx hardhat run .\scripts\deploy.ts --network ganache
    ```

    根据返回的地址配置前端需要的智能合约地址。

6. 在 `./frontend` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```

7. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm run start
    ```

## 功能实现分析

1. **功能**：铸造汽车

   **实现**：通过 `mint` 函数实现，创建一个新的车辆代币（基于ERC721标准）并分配给调用者，更新车辆信息映射。

2. **功能**：查看自己拥有的汽车列表。查看当前还没有被借用的汽车列表。

   **实现**：查看自己拥有的汽车列表通过 `getOwnedCars` 函数实现，返回一个用户所拥有的所有车辆的数组。查看当前还没有被借用的汽车列表通过 `availableCars` 函数实现，返回所有当前未被借用的车辆列表。

3. **功能**：查询一辆汽车的主人，以及该汽车当前的借用者（如果有）

   **实现**：查询一辆汽车的主人通过 `getOwner` 函数实现，返回指定车辆的所有者地址。查看该汽车当前的借用者通过 `getBorrower` 函数实现，返回指定车辆当前的借用者地址（如果当前有借用者）。

4. **功能**：选择并借用某辆还没有被借用的汽车一定时间。

   **实现**：选择并借用某辆还没有被借用的汽车一定时间，通过 `borrow` 函数实现。函数允许用户借用其他人的车辆1000s，并更新车辆的借用者信息和借用截止时间。

5. **功能**：（Bonus）使用自己发行的积分（ERC20）完成付费租赁汽车的流程

   **实现**：在 `borrow` 函数中要求支付代币（ERC20代币）作为借用费用，使用 `transferFrom` 函数。

## 项目运行截图

部署成功

![1](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/1.png)

进入页面，新建一个token4

![2](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/2.png)

token4未被借用

![3](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/3.png)

切换账户，可以查看token4的主人

![6](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/6.png)

领取一些代币，设置支出上限

![7](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/7.png)

![8](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/8.png)

借用token4

![9](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/9.png)

此时汽车的主人可以查看借用者

![10](https://github.com/0oyun/BlockChain-hw2-2023/blob/master/assets/10.png)

## 参考内容

- 课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

- ERC-4907 [参考实现](https://eips.ethereum.org/EIPS/eip-4907)
