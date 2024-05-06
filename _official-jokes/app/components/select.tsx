import { memo } from "react";
import { User } from "../types/const";
function Select({ user, onClick }: { user: Array<User>; onClick: any }) {
  const userText = user.length > 0 ? user[0]?.username : "Select User";
  return (
    <div className="cursor-pointer p-2" onClick={() => onClick()}>
      <div className="h-10 border-2 border-solid border-violet-900 flex justify-center items-center">
        <div className="font-extrabold">{userText}</div>

        <div className="ml-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="#000000"
            height="16px"
            width="16px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 407.437 407.437"
            xmlSpace="preserve"
          >
            <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 " />
          </svg>
        </div>
      </div>
    </div>
  );
}
export default memo(Select);
