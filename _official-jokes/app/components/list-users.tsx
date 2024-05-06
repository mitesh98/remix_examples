import { memo } from "react";
import { User } from "../types/const";
const listUsers = function ({
  users,
  selectCallback,
  children,
}: {
  users: Array<User>;
  selectCallback: Function;
  children?: React.ReactNode;
}) {
  return (
    <div className="h-100 w-full relative z-50 flex justify-center items-center flex-col bg-purple-100 p-4 shadow-2xl overflow-y-scroll">
      {users?.map((user: any) => {
        return (
          <div
            key={user?.id}
            className="h-10 border-violet-500 hover:bg-purple-400 border-solid border-y-2 w-full cursor-pointer flex justify-center items-center "
            onClick={() => selectCallback([user])}
          >
            <div>
              <h1 className="text-violet-900">{user?.username}</h1>
            </div>
          </div>
        );
      })}
      {children}
    </div>
  );
};

export default memo(listUsers);
