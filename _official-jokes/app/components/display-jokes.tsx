import { memo } from "react";
import { Jokes } from "../types/const";
const DisplayJokes = function ({
  jokes,
  emptyMessage,
}: {
  jokes: Array<Jokes>;
  emptyMessage: string;
}) {
  return (
    <div className="h-full w-full relative  flex justify-start items-center flex-col bg-white p-4 shadow-2xl overflow-y-scroll">
      {jokes.length > 0 ? (
        jokes?.map((joke: any) => {
          return (
            <div
              key={joke?.id}
              className="border-violet-500 hover:bg-violet-100 border-solid border-y-2 w-full cursor-pointer flex justify-center items-center "
            >
              <div>
                <h2 className="text-violet-900">{joke?.content}</h2>
              </div>
            </div>
          );
        })
      ) : (
        <h2 className="text-red-900">{emptyMessage}</h2>
      )}
    </div>
  );
};

export default memo(DisplayJokes);
