import { memo } from "react";

const Pagination = function ({
  showPrevious = true,
  showNext = true,
  nextCallBack,
  prevCallBack,
}: {
  nextCallBack: Function;
  prevCallBack: Function;
  showPrevious: boolean;
  showNext: boolean;
}) {
  return (
    <div className="flex justify-between w-full relative z-50  bg-white p-10 shadow-2xl">
      {showPrevious && (
        <div className="border-2 border-blue hover:bg-blue-500 w-40 h-10 flex justify-center items-center cursor-pointer rounded-lg">
          <div className="text-blue-900" onClick={() => prevCallBack()}>
            Previous
          </div>
        </div>
      )}
      {!showPrevious && <div></div>}
      {showNext && (
        <div
          onClick={() => nextCallBack()}
          className="border-2 border-blue hover:bg-blue-500 w-40 h-10 flex justify-center items-center cursor-pointer rounded-lg"
        >
          <div className="text-blue-900">Next</div>
        </div>
      )}
      {!showNext && <div></div>}
    </div>
  );
};
export default memo(Pagination);
