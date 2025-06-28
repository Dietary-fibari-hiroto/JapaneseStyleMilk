import { useState } from "react";
import { Link } from "react-router-dom";
import testImages from "../assets/images/test/testImages";

import { routeList, authPathList, developPathList } from "../AppRoutes";

const testAccount = {
  name: "テスト",
  email: "test@test.com",
  auth: false,
  explain: "auth無しのアカウント。ほぼ何もできない",
};
const opAccount = {
  name: "op",
  email: "op@op.op",
  auth: true,
  explain: "開発者用アカウント",
};

const DeveloperPage = () => {
  const [choiceState, setChoiseState] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [account, setAccount] = useState(false);

  const choiceChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setChoiseState((prev) => !prev);
  };

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDialog((prev) => !prev);
  };
  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <div className="w-[100vw] min-h-screen bg-gradient-to-b from-[#1F1340] to-[#25232B]">
      <section
        className="relative h-[300px] w-full"
        style={{
          backgroundImage: `url(${testImages.IMG_7009_Enhanced_NR})`,
          backgroundPosition: `center`,
          backgroundSize: `cover`,
          backgroundRepeat: `norepeat`,
        }}
      >
        <p className="text-[50px] underline text-white absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
          Developer Page
        </p>
        <p className="text-[50px] text-white absolute bottom-0 right-0">
          和風牛乳
        </p>
      </section>
      <section className="w-full">
        <div className="flex items-center justify-between m-[50px]">
          {/**選択部分 */}
          <div className="flex items-center space-x-[10px]">
            <button
              onClick={choiceChange}
              className={`
            ${
              choiceState ? "bg-white" : "bg-[#aaaaaa]"
            } w-[150px] h-[50px] rounded-[10px] flex justify-center items-center`}
            >
              <img src={testImages.choiceBar} />
            </button>
            <button
              onClick={choiceChange}
              className={`
            ${
              !choiceState ? "bg-white" : "bg-[#aaaaaa]"
            } w-[150px] h-[50px] rounded-[10px] flex justify-center items-center`}
            >
              <img src={testImages.choiceWrap} />
            </button>
          </div>
          <div className="flex items-center space-x-[10px]">
            <button
              onClick={handleOpen}
              className="bg-white text-black w-[300px] h-[50px] rounded-[10px] text-[20px]"
            >
              Developer Login
            </button>
            <p className="text-white">LoginState:</p>
          </div>
        </div>
      </section>
      {!choiceState ? (
        <section className="w-full flex flex-col items-center justify-center text-[25px] space-y-[30px]">
          <div className=" border-b w-[500px] flex justify-start text-white space-x-[100px] pl-[10px]">
            <p>Path</p>
            <p>Name</p>
          </div>
          {developPathList.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className="rounded-[10px] border-b w-[500px] flex justify-start items-center text-black bg-white space-x-[100px] pl-[10px] py-[10px] hover:scale-105 transition-transform duration-300"
            >
              <p className="text-[20px]">{route.path}</p>
              <p className="text-[15px]">{route.name}</p>
            </Link>
          ))}
          {authPathList.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className="rounded-[10px] border-b w-[500px] flex justify-start items-center text-black bg-white space-x-[100px] pl-[10px] py-[10px] hover:scale-105 transition-transform duration-300"
            >
              <p className="text-[20px]">{route.path}</p>
              <p className="text-[15px]">{route.name}</p>
            </Link>
          ))}{" "}
          {routeList.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className="rounded-[10px] border-b w-[500px] flex justify-start items-center text-black bg-white space-x-[100px] pl-[10px] py-[10px] hover:scale-105 transition-transform duration-300"
            >
              <p className="text-[20px]">{route.path}</p>
              <p className="text-[15px]">{route.name}</p>
            </Link>
          ))}
        </section>
      ) : (
        <div className="flex flex-wrap justify-start gap-12 p-[100px] mx-[100px]">
          {routeList.map((route, index) => (
            <Link
              to={route.path}
              key={index}
              className="size-[250px] bg-white shadow rounded flex flex-col justify-center items-center text-black hover:scale-105 transition-transform duration-300"
            >
              <p className="text-[40px]">{route.path}</p>
              <p className="flex-shrink-0">{route.name}</p>
            </Link>
          ))}
        </div>
      )}

      {openDialog ? (
        <div className="fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-full h-screen">
          <button
            onClick={handleOpen}
            className="absolute z-[1] bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-black opacity-[50%] w-full h-screen"
          />
          <div className="space-y-[30px] absolute z-[3] bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-[10px] bg-white flex flex-col items-center justify-center">
            <button onClick={handleOpen}>
              <img
                className="absolute size-[50px] m-[20px] right-0 top-0"
                src={testImages.cancel}
              />
            </button>
            <p className="text-[30px] ">DeveloperLogin</p>
            <div className="flex space-x-[10px]">
              <button
                onClick={() => {
                  setAccount(false);
                }}
                className="bg-black text-white w-[200px] h-[50px] rounded-[10px] text-[20px]"
              >
                testAccount
              </button>
              <button
                onClick={() => {
                  setAccount(true);
                }}
                className="bg-black text-white w-[200px] h-[50px] rounded-[10px] text-[20px]"
              >
                operationAccount
              </button>
            </div>

            <div className="text-[20px] w-[300px] h-[150px]">
              <p>UserName:{!account ? testAccount.name : opAccount.name}</p>
              <p>Email:{!account ? testAccount.email : opAccount.email}</p>
              <p>Auth:{`${!account ? testAccount.auth : opAccount.auth}`}</p>
              <p>
                explain:{!account ? testAccount.explain : opAccount.explain}
              </p>{" "}
            </div>
            <button
              onClick={handleLogin}
              className="bg-[#cccccc] text-black w-[200px] h-[50px] rounded-[10px] text-[20px]"
            >
              Under preparation...
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default DeveloperPage;
