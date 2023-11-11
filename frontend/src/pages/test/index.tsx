import { useEffect, useState } from "react";

interface ITestProps {
    name: string;
}

function A(num:number) {
    return num+1;
}
const a = (num:number) => {
    return num+1;
}

const TestPage = ({ name }: ITestProps) => {
    
    const x = A(3);
    const y = a(4);
    console.log(x, y);
    const [num, setNum] = useState<number>(0);

    const [num2,setNum2] = useState<number>(0);
    const onIncreaseOnClick = () => {
        setNum(a => a + 1);
    }
    
    useEffect(() => {
        setNum(100);
    }, []);

    useEffect(() => {
        setNum2(num + 2);
    },[num])

    return (
        <div>
            <h1>Test Page</h1>
            <p>Hello, {name} {num} {num2}</p>
            <button onClick={onIncreaseOnClick}>Click</button>
        </div>
    );
}

export default TestPage;