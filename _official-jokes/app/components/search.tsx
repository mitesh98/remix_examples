import { SearchCallBack } from "../types/const";
export default function Search({
  callBackFunction,
  label,
  placeholder,
}: {
  callBackFunction: SearchCallBack;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="w-full bg-white p-4">
      <input
        className="text-violet-950 font-extrabold"
        type="text"
        name="searchText"
        placeholder={placeholder}
        onChange={(event) => {
          callBackFunction(event.target.value);
        }}
      />
    </div>
  );
}
